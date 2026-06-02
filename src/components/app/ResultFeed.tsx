import { Check, X, CloudOff } from "lucide-react";
import type { ScanResult } from "@/lib/actions";

export function ResultFeed({ results }: { results: ScanResult[] }) {
  if (results.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/40 px-4 py-10 text-center">
        <p className="text-sm font-medium text-muted-foreground">
          掃描或輸入貨號後送出，結果會顯示在這裡
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {results.map((r) => (
        <ResultBubble key={r.id} r={r} />
      ))}
    </div>
  );
}

function ResultBubble({ r }: { r: ScanResult }) {
  const tone = r.pending
    ? {
        wrap: "bg-warning/10 ring-warning/30",
        chip: "bg-warning text-warning-foreground",
        label: "已暫存",
        icon: <CloudOff size={14} strokeWidth={2.6} />,
        accent: "text-warning",
      }
    : r.ok
      ? {
          wrap: "bg-success/10 ring-success/30",
          chip: "bg-success text-success-foreground",
          label: "成功",
          icon: <Check size={14} strokeWidth={3} />,
          accent: "text-success",
        }
      : {
          wrap: "bg-destructive/10 ring-destructive/30",
          chip: "bg-destructive text-destructive-foreground",
          label: "錯誤",
          icon: <X size={14} strokeWidth={3} />,
          accent: "text-destructive",
        };

  return (
    <div
      className={`animate-log-in flex gap-3 rounded-xl p-3.5 ring-1 ${tone.wrap}`}
    >
      <div
        className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full ${tone.chip}`}
      >
        {tone.icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <span className={`text-sm font-bold ${tone.accent}`}>
            [{tone.label}] <span className="font-mono">{r.trackingNo}</span>
          </span>
          <time className="shrink-0 font-mono text-xs font-medium text-muted-foreground">
            {r.time}
          </time>
        </div>
        <p className="mt-0.5 text-sm font-medium text-foreground/90">{r.message}</p>
      </div>
    </div>
  );
}
