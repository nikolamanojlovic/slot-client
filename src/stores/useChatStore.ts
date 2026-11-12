import { create } from "zustand";

// The chat currently on screen, so realtime updates know not to count it as unread
interface ChatState {
  focusedThreadId: string | null;
  setFocusedThreadId: (threadId: string | null) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  focusedThreadId: null,

  setFocusedThreadId: (focusedThreadId) => set({ focusedThreadId }),
}));
