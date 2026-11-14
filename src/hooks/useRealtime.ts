import { useEffect } from "react";
import { AppState } from "react-native";
import { supabase } from "../lib/supabase";
import { queryClient } from "../lib/query";
import {
  connect,
  disconnect,
  reconnect,
  subscribe,
  type RealtimeFrame,
} from "../lib/realtime";
import {
  addMessageToCache,
  setThreadUnreadCount,
} from "../queries/useMessages";
import { useUserStore } from "../stores/useUserStore";
import { useChatStore } from "../stores/useChatStore";

const handleFrame = (frame: RealtimeFrame) => {
  switch (frame.type) {
    case "message.created": {
      addMessageToCache(frame.threadId, frame.message);
      // A booking card changes what the Requests and Other tabs list
      if (frame.message.type === "BOOKING") {
        queryClient.invalidateQueries({ queryKey: ["threads", "requests"] });
        queryClient.invalidateQueries({ queryKey: ["threads", "other"] });
        queryClient.invalidateQueries({ queryKey: ["bookings"] });
      }
      const isMine =
        frame.message.senderExternalId ===
        useUserStore.getState().user?.externalId;
      // The open chat marks itself read instead
      const isFocused =
        useChatStore.getState().focusedThreadId === frame.threadId;
      if (!isMine && !isFocused) {
        setThreadUnreadCount(frame.threadId, (count) => count + 1);
        queryClient.invalidateQueries({ queryKey: ["unread-count"] });
      }
      break;
    }
    case "thread.read":
      setThreadUnreadCount(frame.threadId, () => 0);
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
      break;
    case "reconnected":
      queryClient.invalidateQueries({ queryKey: ["threads"] });
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      break;
  }
};

export const useRealtime = () => {
  useEffect(() => {
    const unsubscribe = subscribe(handleFrame);

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        switch (event) {
          case "INITIAL_SESSION":
          case "SIGNED_IN":
            if (session && AppState.currentState === "active") connect();
            break;
          case "TOKEN_REFRESHED":
            if (AppState.currentState === "active") reconnect();
            break;
          case "SIGNED_OUT":
            disconnect();
            break;
          default:
            break;
        }
      },
    );

    // Mobile OSes kill background sockets; reconnecting emits "reconnected" for catch-up
    const appState = AppState.addEventListener("change", (state) => {
      if (state === "active") connect();
      else disconnect();
    });

    return () => {
      unsubscribe();
      listener.subscription.unsubscribe();
      appState.remove();
      disconnect();
    };
  }, []);
};
