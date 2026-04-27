"use client";

import { useState, useEffect } from "react";

const SETTINGS_KEY = "random-chat-settings";

interface Settings {
  notifications: boolean;
  sounds: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  notifications: true,
  sounds: true,
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSettings(JSON.parse(saved));
      } catch {
        /* ignore */
      }
    }
  }, []);

  const updateSettings = (updates: Partial<Settings>) => {
    const next = { ...settings, ...updates };
    setSettings(next);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  };

  const toggleNotifications = () => updateSettings({ notifications: !settings.notifications });
  const toggleSounds = () => updateSettings({ sounds: !settings.sounds });

  return {
    ...settings,
    toggleNotifications,
    toggleSounds,
    updateSettings,
  };
}
