import { useState, useCallback, useEffect, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { Profile } from "../types";
import { useRoomMessages } from "./use-room-messages";
import { useRoomPresence } from "./use-room-presence";
import { usePrivateMessages } from "./use-private-messages";
import { profileService } from "../services/profile-service";

const PROFILE_STORAGE_KEY = "random-chat-profile";

export function useRooms(guestId: string) {
  const router = useRouter();
  const params = useParams();
  
  const roomIdFromUrl = params?.roomId as string | undefined;
  const peerIdFromUrl = params?.peerId as string | undefined;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [currentRoomName, setCurrentRoomName] = useState<string>("");
  const [selectedPeer, setSelectedPeer] = useState<Profile | null>(null);
  const [pendingRoom, setPendingRoom] = useState<{ id: string; name: string } | null>(null);

  // Load saved profile on mount
  useEffect(() => {
    if (!guestId) return;
    try {
      const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Omit<Profile, "guest_id">;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setProfile({ guest_id: guestId, ...parsed });
      }
    } catch {
      /* ignore */
    }
  }, [guestId]);

  const { 
    messages: roomMessages, 
    messageText: roomMessageText, 
    setMessageText: setRoomMessageText, 
    sendMessage: sendRoomMsg, 
    sendAudioMessage: sendRoomAudio,
    notice: roomNotice 
  } = useRoomMessages(roomIdFromUrl ?? null, guestId);

  const { onlineUsers } = useRoomPresence(roomIdFromUrl ?? null, profile);

  const { 
    messages: privateMessages, 
    messageText: privateMessageText, 
    setMessageText: setPrivateMessageText, 
    sendMessage: sendPrivateMsg, 
    sendAudioMessage: sendPrivateAudio,
    peerProfile 
  } = usePrivateMessages(guestId, peerIdFromUrl ?? selectedPeer?.guest_id ?? null);

  const saveProfile = useCallback(
    async (data: Omit<Profile, "guest_id">) => {
      const fullProfile: Profile = { guest_id: guestId, ...data };

      // Upsert via service
      const saved = await profileService.upsertProfile(fullProfile);
      
      if (saved) {
        // Save locally
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(data));
        setProfile(saved);
      }

      return saved;
    },
    [guestId]
  );

  const enterRoom = useCallback(
    async (roomId: string, roomName: string) => {
      if (!profile) {
        setPendingRoom({ id: roomId, name: roomName });
        return;
      }
      setCurrentRoomName(roomName);
      router.push(`/rooms/${roomId}`);
    },
    [profile, router]
  );

  const handleJoinWithProfile = useCallback(
    async (data: Omit<Profile, "guest_id">) => {
      const fullProfile = await saveProfile(data);
      if (!fullProfile) return;

      if (pendingRoom) {
        setCurrentRoomName(pendingRoom.name);
        const targetRoom = pendingRoom.id;
        setPendingRoom(null);
        router.push(`/rooms/${targetRoom}`);
      }
    },
    [saveProfile, pendingRoom, router]
  );

  const leaveRoom = useCallback(() => {
    setCurrentRoomName("");
    setPendingRoom(null);
    router.push("/rooms");
  }, [router]);

  const openPrivateChat = useCallback((peer: Profile) => {
    setSelectedPeer(peer);
    if (roomIdFromUrl) {
      router.push(`/rooms/${roomIdFromUrl}/private/${peer.guest_id}`);
    } else {
      router.push(`/private/${peer.guest_id}`);
    }
  }, [roomIdFromUrl, router]);

  const closePrivateChat = useCallback(() => {
    setSelectedPeer(null);
    if (roomIdFromUrl) {
      router.push(`/rooms/${roomIdFromUrl}`);
    } else {
      router.push("/rooms");
    }
  }, [roomIdFromUrl, router]);

  // Send room message (form handler)
  const handleSendRoomMessage = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      sendRoomMsg(roomMessageText);
    },
    [sendRoomMsg, roomMessageText]
  );

  // Send private message (form handler)
  const handleSendPrivateMessage = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      sendPrivateMsg(privateMessageText);
    },
    [sendPrivateMsg, privateMessageText]
  );

  return {
    profile,
    pendingRoom,
    currentRoomId: roomIdFromUrl,
    currentRoomName,
    selectedPeer: peerProfile ?? selectedPeer,
    onlineUsers,
    roomMessages,
    roomMessageText,
    roomNotice,
    setRoomMessageText,
    sendRoomAudio,
    privateMessages,
    privateMessageText,
    setPrivateMessageText,
    sendPrivateAudio,
    enterRoom,
    handleJoinWithProfile,
    leaveRoom,
    openPrivateChat,
    closePrivateChat,
    handleSendRoomMessage,
    handleSendPrivateMessage,
  };
}
