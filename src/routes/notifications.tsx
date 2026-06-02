import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, CheckCheck, MessageSquare } from "lucide-react";
import { Screen } from "@/components/app/Screen";
import { store, useStore, unreadCount } from "@/lib/store";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "通知中心 — 派派通" },
      { name: "description", content: "派工調整、停送公告與系統維護通知。" },
    ],
  }),
  component: Notifications,
});

function Notifications() {
  const notifications = useStore((s) => s.notifications);
  const unread = useStore(() => unreadCount());

  return (
    <Screen
      title="通知中心"
      hideTabBar
      footer={
        <Link
          to="/messages"
          className="flex h-14 w-full items-center justify-center gap-2 rounded-xl border border-border bg-card text-base font-bold active:bg-accent"
        >
          <MessageSquare size={18} />
          前往訊息紀錄
        </Link>
      }
    >
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-bold text-muted-foreground">
          未讀 <span className="text-foreground">{unread}</span> 則
        </p>
        <button
          onClick={() => store.markAllNotificationsRead()}
          disabled={unread === 0}
          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-bold disabled:opacity-40"
        >
          <CheckCheck size={16} />
          全部已讀
        </button>
      </div>

      <div className="flex flex-col gap-2.5">
        {notifications.map((n) => (
          <button
            key={n.id}
            onClick={() => store.markNotificationRead(n.id)}
            className={`flex gap-3 rounded-xl border p-4 text-left transition-colors ${
              n.read ? "border-border bg-card/40" : "border-primary/40 bg-primary/5"
            }`}
          >
            <div
              className={`mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg ${
                n.read ? "bg-secondary text-muted-foreground" : "bg-primary text-primary-foreground"
              }`}
            >
              <Bell size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                {!n.read && <span className="size-2 shrink-0 rounded-full bg-primary" />}
                <h2 className="truncate font-bold">{n.title}</h2>
              </div>
              <p className="mt-1 text-sm font-medium text-foreground/80">{n.body}</p>
              <time className="mt-1.5 block font-mono text-xs text-muted-foreground">{n.date}</time>
            </div>
          </button>
        ))}
      </div>
    </Screen>
  );
}
