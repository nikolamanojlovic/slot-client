import api from "../lib/axios";

export type ThreadType = "CONVERSATION";

// Who sent it; SYSTEM messages have no senderExternalId
export type SenderType = "USER" | "SYSTEM";

// Where a booking is in its flow, as the chat shows it (data.status); the
// newest card is current. Not BookingState: REQUESTED is PENDING there, and
// RESCHEDULED is still CONFIRMED
export type BookingFlowState =
  | "REQUESTED"
  | "CONFIRMED"
  | "DECLINED"
  | "CANCELLED"
  | "RESCHEDULED";

// Snapshot of the booking when the message was created, not its live state
export interface BookingData {
  status: BookingFlowState;
  // Null on bookings made before the name was stored
  expertiseName: string | null;
  date: string; // yyyy-MM-dd
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  // On DECLINED (optional), CANCELLED (required) and RESCHEDULED (optional)
  reason?: string | null;
  // Only on RESCHEDULED: the time it was moved from
  previousDate?: string | null;
  previousStartTime?: string | null;
  previousEndTime?: string | null;
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
  // Only from getBookingThreads, where each row is one booking (a conversation
  // can appear once per booking): that booking's newest card
  message?: Message | null;
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

// Conversations with a booking in one of these flow states, e.g.
// ["REQUESTED"] = requests waiting for the professional's answer,
// ["CONFIRMED", "RESCHEDULED"] = upcoming. None = any booking. Both roles.
export const getBookingThreads = async (
  state?: BookingFlowState[],
  page = 0,
  size = 10,
): Promise<Page<MessageThreadResponse>> => {
  const { data } = await api.get<Page<MessageThreadResponse>>("/threads/bookings", {
    // Comma-joined: Spring doesn't bind axios' default state[]=… form
    params: { state: state?.join(","), page, size },
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
