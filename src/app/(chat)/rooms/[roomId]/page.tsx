"use client";

import { useRandomChat } from "@/features/random-chat/use-random-chat";
import { useRooms } from "@/features/random-chat/hooks/use-rooms";
import { RoomScreen } from "@/features/random-chat/screens/room-screen";
import { ALL_ROOMS } from "@/features/random-chat/constants";
import { useParams } from "next/navigation";

import { JoinRoomModal } from "@/features/random-chat/screens/join-room-modal";

export default function RoomChatPage() {
  const params = useParams();
  const roomId = params?.roomId as string;
  const { guestId } = useRandomChat();
  const rooms = useRooms(guestId);

  const roomInfo = ALL_ROOMS.find(r => r.id === roomId);
  const roomName = rooms.currentRoomName || roomInfo?.name || "غرفة دردشة";

  return (
    <>
      <RoomScreen
        roomId={roomId}
        roomName={roomName}
        guestId={guestId}
        messages={rooms.roomMessages}
        onlineUsers={rooms.onlineUsers}
        messageText={rooms.roomMessageText}
        notice={rooms.roomNotice}
        onMessageChange={rooms.setRoomMessageText}
        onSendMessage={rooms.handleSendRoomMessage}
        onSendAudio={rooms.sendRoomAudio}
        onLeaveRoom={rooms.leaveRoom}
        onPrivateChat={rooms.openPrivateChat}
        typingUsers={rooms.roomTypingUsers}
        onLoadMore={rooms.loadRoomMore}
        hasMore={rooms.roomHasMore}
      />

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
