export type ChatStatus = "idle" | "searching" | "chatting" | "ended" | "conversations";

export type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  message_type: "text" | "audio" | "system";
  media_url?: string;
  created_at: string;
};

export type Conversation = {
  id: string;
  guest_a: string;
  guest_b: string;
  status: "active" | "ended";
  created_at: string;
  ended_at: string | null;
};

export type Profile = {
  guest_id: string;
  name: string;
  age: number;
  gender: "male" | "female";
};

export type RoomMessage = {
  id: string;
  room_id: string;
  sender_id: string;
  body: string;
  message_type: "text" | "audio" | "system";
  media_url?: string;
  created_at: string;
  // This is a joined field we will fetch alongside the message
  profiles?: Profile;
};

export type PrivateMessage = {
  id: string;
  sender_id: string;
  receiver_id: string;
  body: string;
  message_type: "text" | "audio" | "system";
  media_url?: string;
  created_at: string;
  read: boolean;
  is_read: boolean;
};

export interface PrivateConversation {
  peerId: string;
  lastMessage: PrivateMessage;
  unreadCount: number;
  peer?: Profile;
}
