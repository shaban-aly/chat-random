"use client";

import { useRandomChat } from "@/features/random-chat/use-random-chat";
import { useRooms } from "@/features/random-chat/hooks/use-rooms";
import { RoomsDirectoryScreen } from "@/features/random-chat/screens/rooms-directory-screen";
import { JoinRoomModal } from "@/features/random-chat/screens/join-room-modal";

export default function RoomsPage() {
  const { guestId } = useRandomChat();
  const rooms = useRooms(guestId);

  return (
    <>
      <RoomsDirectoryScreen onSelectRoom={rooms.enterRoom} />
      
      {rooms.pendingRoom && (
        <JoinRoomModal
          roomName={rooms.pendingRoom.name}
          onJoin={rooms.handleJoinWithProfile}
          onClose={() => rooms.leaveRoom()}
        />
      )}
    </>
  );
}
