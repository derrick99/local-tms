import { createFileRoute } from "@tanstack/react-router";
import type { ReactElement } from "react";
import { Check, CloudOff, Loader2, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";
import { Screen } from "@/components/app/Screen";
import { PrimaryButton } from "@/components/app/PrimaryButton";
import { store, useStore, pendingCount, type PendingStatus } from "@/lib/store";

export const Route = createFileRoute("/pending")({
  head: () => ({
    meta: [
      { title: "暫存列表 — 派派通" },
      { name: "description", content: "離線暫存的貨態更新，待網路恢復後上傳。" },
    ],
  }),
  component: Pending,
});

const STATUS_META: Record<
  PendingStatus,
  { label: string; wrap: string; chip: string; icon: ReactElement }
> = {
  pending: {
    label: "待上傳",
    wrap: "bg-warning/10 ring-warning/30",
    chip: "bg-warning text-warning-foreground",
    icon: <CloudOff size={13} strokeWidth={2.6} />,
  },
  uploading: {
    label: "上傳中",
    wrap: "bg-primary/10 ring-primary/30",
    chip: "bg-primary text-primary-foreground",
    icon: <Loader2 size={13} className="animate-spin" />,
  },
  success: {
    label: "已上傳",
    wrap: "bg-success/10 ring-success/30",
    chip: "bg-success text-success-foreground",
    icon: <Check size={13} strokeWidth={3} />,
  },
  failed: {
    label: "失敗",
    wrap: "bg-destructive/10 ring-destructive/30",
    chip: "bg-destructive text-destructive-foreground",
    icon: <X size={13} strokeWidth={3} />,
  },
};

function Pending() {
  const pending = useStore((s) => s.pending);
  const remaining = useStore(() => pendingCount());

  return (
    <Screen
      title="暫存列表"
      hideTabBar
      footer={
        <PrimaryButton
          onClick={() => {
            if (remaining === 0) return toast.error("沒有待上傳的項目");
            store.uploadAllPending();
            toast.success("已全部上傳完成");
          }}
          disabled={remaining === 0}
        >
          <UploadCloud size={20} />
          全部上傳（{remaining}）
        </PrimaryButton>
      }
    >
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-bold text-muted-foreground">
          待上傳 <span className="text-foreground">{remaining}</span> 筆 / 共 {pending.length} 筆
        </p>
        <button
          onClick={() => store.clearSuccessPending()}
          className="rounded-lg border border-border px-3 py-1.5 text-sm font-bold"
        >
          清除已上傳
        </button>
      </div>

      {pending.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card/40 px-4 py-12 text-center text-sm font-medium text-muted-foreground">
          目前沒有暫存資料
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {pending.map((p) => {
            const m = STATUS_META[p.status];
            return (
              <div key={p.id} className={`flex gap-3 rounded-xl p-3.5 ring-1 ${m.wrap}`}>
                <div className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full ${m.chip}`}>
                  {m.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-base font-bold">{p.trackingNo}</span>
                    <span className={`shrink-0 rounded px-2 py-0.5 text-[11px] font-bold ${m.chip}`}>
                      {m.label}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm font-medium text-foreground/80">
                    {p.action}
                    {p.retries > 0 && (
                      <span className="ml-2 text-destructive">重試 {p.retries} 次</span>
                    )}
                  </p>
                  <time className="mt-0.5 block font-mono text-xs text-muted-foreground">{p.time}</time>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Screen>
  );
}
