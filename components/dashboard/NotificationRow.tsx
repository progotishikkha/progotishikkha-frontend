import { Bell, UserCheck, XCircle, Star, Info, Sparkles, Trash2 } from "lucide-react";
import { NotificationItem } from "@/types";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<NotificationItem["type"], typeof Bell> = {
  new_application: Bell,
  tutor_hired: UserCheck,
  tutor_rejected: XCircle,
  new_review: Star,
  new_match: Sparkles,
  system: Info,
};

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function NotificationRow({
  item,
  onClick,
  onDelete,
}: {
  item: NotificationItem;
  onClick: () => void;
  onDelete: () => void;
}) {
  const Icon = ICON_MAP[item.type];

  return (
    <div
      className={cn(
        "group flex w-full items-start gap-3.5 rounded-xl px-4 py-3.5 text-left transition-colors",
        item.isRead ? "hover:bg-slate-50 dark:hover:bg-white/5" : "bg-brand-blue/5 hover:bg-brand-blue/10"
      )}
    >
      <button
        onClick={onClick}
        className="flex flex-1 items-start gap-3.5 text-left"
        aria-label={item.isRead ? item.message : `Unread: ${item.message}`}
      >
        <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-slate-700 dark:text-slate-200">{item.message}</p>
          <p className="mt-1 text-xs text-slate-400">{timeAgo(item.createdAt)}</p>
        </div>
        {!item.isRead && <span className="mt-1.5 h-2 w-2 flex-none rounded-full bg-brand-gold" />}
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        aria-label="Delete notification"
        title="Delete notification"
        className="flex h-11 w-11 flex-none items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 focus-visible:opacity-100 dark:hover:bg-red-500/10 sm:opacity-0 sm:group-hover:opacity-100"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
