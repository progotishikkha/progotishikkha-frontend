"use client";

import { Bell } from "lucide-react";
import { NotificationRow } from "@/components/dashboard/NotificationRow";
import { EmptyState, CardSkeleton } from "@/components/dashboard/States";
import { Button } from "@/components/ui/Button";
import { useNotifications } from "@/contexts/NotificationContext";

/**
 * Shared body for the student and tutor notification pages (previously two
 * near-identical copies, each hardcoded to the same mock array). Now backed
 * by the shared NotificationContext — real data on load, live updates via
 * the socket connection, real mark-as-read calls to the backend.
 */
export function NotificationList() {
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead, deleteNotification } =
    useNotifications();

  if (isLoading && notifications.length === 0) return <CardSkeleton count={3} />;

  if (notifications.length === 0) {
    return <EmptyState icon={Bell} title="No notifications" description="You're all caught up." />;
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between px-3 py-2">
        <p className="text-sm text-slate-500 dark:text-slate-400">{unreadCount} unread</p>
        <Button variant="ghost" size="sm" onClick={markAllAsRead}>
          Mark all as read
        </Button>
      </div>
      <div className="space-y-1">
        {notifications.map((item) => (
          <NotificationRow
            key={item.id}
            item={item}
            onClick={() => markAsRead(item.id)}
            onDelete={() => deleteNotification(item.id)}
          />
        ))}
      </div>
    </div>
  );
}
