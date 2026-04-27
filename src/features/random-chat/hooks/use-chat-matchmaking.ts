import { useCallback, useRef } from "react";
import { ChatStatus } from "../types";
import { chatService } from "../services/chat-service";
import { blockService } from "../services/block-service";

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
        const details = await chatService.getConversationDetails(match.conversation_id);
        const peerId = details?.guest_a === guestId ? details?.guest_b : details?.guest_a;
        
        if (peerId && blockService.isBlocked(peerId)) {
          // If the matched user is blocked, end this conversation and keep searching
          await chatService.endConversation(match.conversation_id);
          // Set ourselves back to waiting
          await chatService.addToWaitingQueue(guestId).catch(() => {});
          return; // Skip the rest, we are still polling
        }

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
