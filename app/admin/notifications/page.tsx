"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { Textarea, Select } from "@/components/ui/FormControls";
import { Button } from "@/components/ui/Button";
import { NotificationRow } from "@/components/dashboard/NotificationRow";
import { EmptyState } from "@/components/dashboard/States";
import { useNotifications } from "@/contexts/NotificationContext";
import { adminService, BroadcastNotificationInput } from "@/services/adminService";
import { getErrorMessage } from "@/lib/errorMessage";
import { Bell } from "lucide-react";

export default function AdminNotificationsPage() {
  const [audience, setAudience] = useState<BroadcastNotificationInput["audience"]>("all");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  // The admin's own notification feed — same live context every other
  // dashboard uses, so an admin sees the broadcast they just sent land here
  // in real time too.
  const { notifications, markAsRead, deleteNotification } = useNotifications();

  const sendBroadcast = async () => {
    if (!message.trim()) {
      toast.error("Write a message before sending");
      return;
    }
    setSending(true);
    try {
      const { recipientCount } = await adminService.broadcastNotification({ audience, message });
      toast.success(`Notification sent to ${recipientCount} user(s)`);
      setMessage("");
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't send the notification. Please try again."));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="font-display text-base font-semibold text-brand-navy dark:text-white">
          Send a broadcast notification
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Delivered instantly via Socket.io to everyone currently online, and
          stored for anyone offline to see when they log in.
        </p>
        <div className="mt-5 space-y-4">
          <Select
            label="Audience"
            value={audience}
            onChange={(e) => setAudience(e.target.value as BroadcastNotificationInput["audience"])}
          >
            <option value="all">All users</option>
            <option value="students">Students only</option>
            <option value="tutors">Tutors only</option>
          </Select>
          <Textarea
            label="Message"
            rows={4}
            placeholder="e.g. Scheduled maintenance tonight from 11 PM to midnight."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button onClick={sendBroadcast} isLoading={sending}>
            <Send className="h-4 w-4" />
            Send notification
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="px-4 pt-4 font-display text-base font-semibold text-brand-navy dark:text-white">
          Recent platform notifications
        </h2>
        <div className="mt-3 space-y-1">
          {notifications.length === 0 ? (
            <EmptyState icon={Bell} title="No notifications yet" description="Broadcasts you send will show up here." />
          ) : (
            notifications.map((item) => (
              <NotificationRow
                key={item.id}
                item={item}
                onClick={() => markAsRead(item.id)}
                onDelete={() => deleteNotification(item.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
