import { useCallback, useRef } from "react";
import { ChatStatus } from "../types";
import { chatService } from "../services/chat-service";

const pollIntervalMs = 2200;

export function useChatMatchmaking(
  guestId: string,
  setStatus: (status: ChatStatus) => void,
  setConversationId: (id: string | null) => void,
  setNotice: (notice: string) => void,
  loadMessages: (id: string) => Promise<void>
) {
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const findMatch = useCallback(async () => {
    if (!guestId) return;

    try {
      const match = await chatService.startRandomChat(guestId);

      if (match?.conversation_id) {
        stopPolling();
        setConversationId(match.conversation_id);
        setStatus("chatting");
        setNotice("");
        await loadMessages(match.conversation_id);
      }
    } catch {
      stopPolling();
      setStatus("idle");
      setNotice("لم أستطع بدء البحث. تأكد من تشغيل SQL الخاص بقاعدة البيانات.");
    }
  }, [guestId, loadMessages, setConversationId, setNotice, setStatus, stopPolling]);

  const startSearch = useCallback(async () => {
    if (!guestId) return;

    stopPolling();
    setNotice("");
    setConversationId(null);
    setStatus("searching");

    await findMatch();
    pollRef.current = setInterval(findMatch, pollIntervalMs);
  }, [findMatch, guestId, setConversationId, setNotice, setStatus, stopPolling]);

  const cancelSearch = useCallback(async () => {
    stopPolling();
    setStatus("idle");
    setNotice("تم إلغاء البحث.");

    if (!guestId) return;

    try {
      await chatService.updateQueueStatus(guestId, "cancelled");
    } catch {
      // Ignore errors on cancel
    }
  }, [guestId, setNotice, setStatus, stopPolling]);

  return {
    startSearch,
    cancelSearch,
    stopPolling,
  };
}
