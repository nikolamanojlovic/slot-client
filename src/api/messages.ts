import api from "../lib/axios";

export type ThreadType = "CONVERSATION";

// Who sent it; SYSTEM messages have no senderExternalId
export type SenderType = "USER" | "SYSTEM";

// Will grow (RESCHEDULED, CANCELLED, …)
export type BookingStatus = "REQUESTED" | "CONFIRMED" | "DECLINED";

// Snapshot of the booking when the message was created, not its live state
export interface BookingData {
  status: BookingStatus;
  // Null on bookings made before the name was stored
  expertiseName: string | null;
  date: string; // yyyy-MM-dd
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  // Only on DECLINED, and optional there
  reason?: string | null;
}

interface MessageBase {
  id: string;
  senderType: SenderType;
  // Always present; plain-text fallback (inbox preview, unknown types)
  content: string;
  senderExternalId: string | null;
  bookingId: string | null;
  createdAt: string;
}

// `type` decides the shape of `data`. The server may add types this client
// doesn't know yet, so rendering must fall back to `content`.
export type Message =
  | (MessageBase & { type: "TEXT"; data: null })
  | (MessageBase & { type: "BOOKING"; data: BookingData | null });

export type MessageType = Message["type"];

export type LastMessage = Message;

// Names are null when the user service is unavailable
export interface Participant {
  externalId: string;
  firstName: string | null;
  lastName: string | null;
}

export interface MessageThreadResponse {
  id: string;
  type: ThreadType;
  createdAt: string;
  lastMessage: LastMessage | null;
  otherParticipant: Participant;
  unreadCount: number;
}

export interface UnreadCountResponse {
  unreadMessages: number;
  // Conversations with at least one unread message; shown on the inbox badge
  unreadThreads: number;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export const getThreads = async (
  type?: ThreadType,
  page = 0,
  size = 10,
): Promise<Page<MessageThreadResponse>> => {
  const { data } = await api.get<Page<MessageThreadResponse>>("/threads", {
    params: { type, page, size },
  });
  return data;
};

// Returns the existing conversation with this professional, or creates one
export const startConversation = async (
  professionalExternalId: string,
): Promise<MessageThreadResponse> => {
  const { data } = await api.post<MessageThreadResponse>("/threads", {
    professionalExternalId,
  });
  return data;
};

export const getUnreadCount = async (): Promise<UnreadCountResponse> => {
  const { data } = await api.get<UnreadCountResponse>("/threads/unread-count");
  return data;
};

export const markThreadRead = async (threadId: string): Promise<void> => {
  await api.post(`/threads/${threadId}/read`);
};

export const getThread = async (
  threadId: string,
): Promise<MessageThreadResponse> => {
  const { data } = await api.get<MessageThreadResponse>(
    `/threads/${threadId}`,
  );
  return data;
};

export const getMessages = async (
  threadId: string,
  page = 0,
  size = 10,
): Promise<Page<Message>> => {
  const { data } = await api.get<Page<Message>>(
    `/threads/${threadId}/messages`,
    { params: { page, size } },
  );
  return data;
};

// Catch-up after reconnect: `after` is the createdAt of the newest message
// already held. Returns oldest first, at most 200.
export const getMessagesSince = async (
  threadId: string,
  after: string,
): Promise<Message[]> => {
  const { data } = await api.get<Message[]>(
    `/threads/${threadId}/messages/since`,
    { params: { after } },
  );
  return data;
};

export const sendMessage = async (
  threadId: string,
  content: string,
): Promise<Message> => {
  const { data } = await api.post<Message>(`/threads/${threadId}/messages`, {
    content,
  });
  return data;
};
