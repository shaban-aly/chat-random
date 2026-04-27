"use client";

class NotificationService {
  async requestPermission() {
    if (!("Notification" in window)) return false;
    
    if (Notification.permission === "granted") return true;
    
    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }
    
    return false;
  }

  show(title: string, body: string, icon = "/icons/icon-192x192.png") {
    if (!("Notification" in window) || Notification.permission !== "granted") return;

    // Respect user settings
    try {
      const saved = localStorage.getItem("random-chat-settings");
      if (saved) {
        const settings = JSON.parse(saved);
        if (settings.notifications === false) return;
      }
    } catch { /* ignore */ }

    try {
      const notification = new Notification(title, {
        body,
        icon,
        badge: "/icons/icon-72x72.png",
        dir: "rtl",
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
      
      // Auto close after 5 seconds
      setTimeout(() => notification.close(), 5000);
    } catch (e) {
      console.error("Failed to show notification", e);
    }
  }
}

export const notificationService = new NotificationService();
