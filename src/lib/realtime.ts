import api from "./axios";
import { getSession } from "../api/auth";
import type { Message } from "../api/messages";

export type RealtimeFrame =
  | { type: "message.created"; threadId: string; message: Message }
  // Sent only to my other devices when I read a conversation elsewhere
  | { type: "thread.read"; threadId: string }
  | { type: "reconnected" };

type Listener = (frame: RealtimeFrame) => void;

const PING_INTERVAL_MS = 25_000;
const INITIAL_RETRY_MS = 1_000;
const MAX_RETRY_MS = 30_000;
const TOKEN_EXPIRED_CODE = 1008;

const listeners = new Set<Listener>();

let socket: WebSocket | null = null;
let connecting = false;
let shouldReconnect = false;
let hasConnected = false;
let retryDelay = INITIAL_RETRY_MS;
let pingTimer: ReturnType<typeof setInterval> | null = null;
let retryTimer: ReturnType<typeof setTimeout> | null = null;

// Same host as the REST API (http→ws, https→wss); the token goes in the query
// because React Native's WebSocket cannot set an Authorization header.
const buildUrl = (token: string): string => {
  const origin = (api.defaults.baseURL ?? "")
    .replace(/^http/, "ws")
    .match(/^wss?:\/\/[^/]+/)?.[0];
  return `${origin}/api/v1/ws?token=${encodeURIComponent(token)}`;
};

const emit = (frame: RealtimeFrame) => {
  listeners.forEach((listener) => listener(frame));
};

const clearPing = () => {
  if (pingTimer) clearInterval(pingTimer);
  pingTimer = null;
};

const clearRetry = () => {
  if (retryTimer) clearTimeout(retryTimer);
  retryTimer = null;
};

const scheduleRetry = () => {
  clearRetry();
  retryTimer = setTimeout(connect, retryDelay);
  retryDelay = Math.min(retryDelay * 2, MAX_RETRY_MS);
};

const isActive = () =>
  socket?.readyState === WebSocket.CONNECTING ||
  socket?.readyState === WebSocket.OPEN;

export const connect = async (): Promise<void> => {
  shouldReconnect = true;
  if (connecting || isActive()) return;

  clearRetry();
  connecting = true;
  let token: string | undefined;
  try {
    // getSession refreshes an expired access token
    const { session } = await getSession();
    token = session?.access_token;
  } catch {
    connecting = false;
    if (shouldReconnect) scheduleRetry();
    return;
  }
  connecting = false;

  // disconnect() was called while waiting, or the user is signed out
  if (!shouldReconnect || !token) return;

  const ws = new WebSocket(buildUrl(token));
  socket = ws;

  ws.onopen = () => {
    retryDelay = INITIAL_RETRY_MS;
    pingTimer = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) ws.send("ping");
    }, PING_INTERVAL_MS);
    if (hasConnected) emit({ type: "reconnected" });
    hasConnected = true;
  };

  ws.onmessage = (event) => {
    if (event.data === "pong") return;
    try {
      const frame = JSON.parse(event.data) as RealtimeFrame;
      if (frame.type === "message.created" || frame.type === "thread.read") {
        emit(frame);
      }
    } catch {
      // ignore malformed frames
    }
  };

  ws.onclose = (event) => {
    if (socket !== ws) return;
    socket = null;
    clearPing();
    if (!shouldReconnect) return;
    // Expired token: retry right away, connect() fetches a fresh one
    if (event.code === TOKEN_EXPIRED_CODE) retryDelay = INITIAL_RETRY_MS;
    scheduleRetry();
  };
};

export const disconnect = (): void => {
  shouldReconnect = false;
  clearRetry();
  clearPing();
  const ws = socket;
  socket = null;
  ws?.close();
};

export const reconnect = (): void => {
  disconnect();
  connect();
};

export const subscribe = (listener: Listener): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
