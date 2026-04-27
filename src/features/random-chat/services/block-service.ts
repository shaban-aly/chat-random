const BLOCKED_USERS_KEY = "random-chat-blocked-users";

export const blockService = {
  getBlockedUsers(): string[] {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(BLOCKED_USERS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  blockUser(guestId: string) {
    if (typeof window === "undefined") return;
    const blocked = this.getBlockedUsers();
    if (!blocked.includes(guestId)) {
      blocked.push(guestId);
      localStorage.setItem(BLOCKED_USERS_KEY, JSON.stringify(blocked));
    }
  },

  unblockUser(guestId: string) {
    if (typeof window === "undefined") return;
    let blocked = this.getBlockedUsers();
    blocked = blocked.filter((id) => id !== guestId);
    localStorage.setItem(BLOCKED_USERS_KEY, JSON.stringify(blocked));
  },

  isBlocked(guestId: string): boolean {
    const blocked = this.getBlockedUsers();
    return blocked.includes(guestId);
  },
};
