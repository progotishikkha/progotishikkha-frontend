"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/hooks/useSocket";
import { notificationService } from "@/services/notificationService";
import { getErrorMessage } from "@/lib/errorMessage";
import { NotificationItem } from "@/types";

interface NotificationContextValue {
  notifications: NotificationItem[];
  unreadCount: number;
  isLoading: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

/**
 * Central, app-wide notification state. Previously the notification pages
 * (student/tutor/admin) each rendered a static mock array and the
 * `useSocket` hook that could have made this live was never used anywhere —
 * so nothing updated in real time no matter what happened on the backend
 * (which was already correctly emitting a `"notification"` socket event on
 * new applications, hires, rejections, and reviews).
 *
 * This provider fetches the real list once a user is logged in, subscribes
 * to the live socket event, and keeps a single source of truth that the
 * dashboard bell badge and the notification pages both read from.
 */
export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      return;
    }
    setIsLoading(true);
    try {
      const data = await notificationService.list();
      setNotifications(data);
    } catch (err) {
      // Don't toast on a background refresh failure — the notification bell
      // isn't the primary task on any page, just log it.
      // eslint-disable-next-line no-console
      console.error("Failed to load notifications:", getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleLiveNotification = useCallback((payload: unknown) => {
    const item = payload as NotificationItem;
    setNotifications((prev) => {
      if (prev.some((n) => n.id === item.id)) return prev; // avoid dupes on reconnect
      return [item, ...prev];
    });
    toast.message(item.message);
  }, []);

  useSocket(handleLiveNotification, !!user);

  const markAsRead = useCallback(async (id: string) => {
    // Optimistic update so the UI feels instant; the read state is what it
    // is regardless, so there's little downside if the request fails.
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    try {
      await notificationService.markAsRead(id);
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't mark this as read."));
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await notificationService.markAllAsRead();
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't mark all as read."));
    }
  }, []);

  const deleteNotification = useCallback(async (id: string) => {
    // Optimistic removal — undoing a delete the server rejects is rare
    // enough (and low-stakes enough) that a re-fetch on failure is simpler
    // and more honest than trying to splice the item back into place.
    const previous = notifications;
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    try {
      await notificationService.remove(id);
    } catch (err) {
      setNotifications(previous);
      toast.error(getErrorMessage(err, "Couldn't delete this notification."));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications]);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.isRead).length, [notifications]);

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, isLoading, markAsRead, markAllAsRead, deleteNotification, refresh }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within a NotificationProvider");
  return ctx;
}
