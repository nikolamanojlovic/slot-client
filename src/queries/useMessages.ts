import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  type InfiniteData,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ErrorResponse } from "../types/common/error.interface";
import { queryClient } from "../lib/query";
import {
  getMessages,
  getThread,
  getUnreadCount,
  markThreadRead,
  sendMessage,
  startConversation,
  type Message,
  type MessageThreadResponse,
  type Page,
} from "../api/messages";

const PAGE_SIZE = 30;

// Shared by the send mutation and the realtime socket: the sender gets its own
// message from both, so it is deduplicated by id.
export const addMessageToCache = (threadId: string, message: Message) => {
  queryClient.setQueryData<InfiniteData<Page<Message>, number>>(
    ["messages", threadId],
    (data) => {
      if (!data?.pages.length) return data;
      if (data.pages.some((p) => p.content.some((m) => m.id === message.id))) {
        return data;
      }
      const [first, ...rest] = data.pages;
      return {
        ...data,
        pages: [{ ...first, content: [message, ...first.content] }, ...rest],
      };
    },
  );

  const threads = queryClient.getQueryData<Page<MessageThreadResponse>>([
    "threads",
  ]);
  const thread = threads?.content.find((t) => t.id === threadId);
  if (!threads || !thread) {
    queryClient.invalidateQueries({ queryKey: ["threads"] });
    return;
  }
  queryClient.setQueryData<Page<MessageThreadResponse>>(["threads"], {
    ...threads,
    content: [
      { ...thread, lastMessage: message },
      ...threads.content.filter((t) => t.id !== threadId),
    ],
  });
};

export const setThreadUnreadCount = (
  threadId: string,
  update: (count: number) => number,
) => {
  queryClient.setQueryData<Page<MessageThreadResponse>>(["threads"], (page) =>
    page
      ? {
          ...page,
          content: page.content.map((t) =>
            t.id === threadId ? { ...t, unreadCount: update(t.unreadCount) } : t,
          ),
        }
      : page,
  );
};

export const useUnreadCount = (enabled: boolean) =>
  useQuery({
    queryKey: ["unread-count"],
    queryFn: getUnreadCount,
    enabled,
  });

export const useMarkThreadRead = (threadId: string) =>
  useMutation({
    mutationFn: () => markThreadRead(threadId),
    onSuccess: () => {
      setThreadUnreadCount(threadId, () => 0);
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
    },
  });

// Reuses the inbox entry when present; opening a chat directly (e.g. from a
// notification) fetches the thread instead.
export const useThread = (threadId: string) => {
  const cached = queryClient
    .getQueryData<Page<MessageThreadResponse>>(["threads"])
    ?.content.find((t) => t.id === threadId);

  const { data } = useQuery({
    queryKey: ["thread", threadId],
    queryFn: () => getThread(threadId),
    enabled: !cached,
  });

  return cached ?? data;
};

export const useThreadMessages = (threadId: string) =>
  useInfiniteQuery({
    queryKey: ["messages", threadId],
    queryFn: ({ pageParam }) => getMessages(threadId, pageParam, PAGE_SIZE),
    initialPageParam: 0,
    getNextPageParam: (last) =>
      last.number + 1 < last.totalPages ? last.number + 1 : undefined,
  });

export const useStartConversation = () =>
  useMutation<MessageThreadResponse, AxiosError<ErrorResponse>, string>({
    mutationFn: startConversation,
    onSuccess: (thread) => {
      queryClient.setQueryData(["thread", thread.id], thread);
      // The conversation may be new, or missing from a stale inbox
      queryClient.invalidateQueries({ queryKey: ["threads"] });
    },
  });

export const useSendMessage = (threadId: string) =>
  useMutation<Message, AxiosError<ErrorResponse>, string>({
    mutationFn: (content) => sendMessage(threadId, content),
    onSuccess: (message) => addMessageToCache(threadId, message),
  });
