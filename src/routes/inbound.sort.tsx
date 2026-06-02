import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Screen } from "@/components/app/Screen";
import { ScanInput } from "@/components/app/ScanInput";
import { PrimaryButton } from "@/components/app/PrimaryButton";
import { ResultFeed } from "@/components/app/ResultFeed";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { evaluateScan, ACTIONS, type ScanResult } from "@/lib/actions";
import { useStore } from "@/lib/store";

const AREAS = ["A 區 — 市區早班", "B 區 — 市區午班", "C 區 — 郊區", "D 區 — 轉運", "暫置區"];

export const Route = createFileRoute("/inbound/sort")({
  head: () => ({
    meta: [
      { title: "分貨作業 — 飛翔系統" },
      { name: "description", content: "掃描貨號並分派至配送區域。" },
    ],
  }),
  component: Sort,
});

function Sort() {
  const online = useStore((s) => s.online);
  const [area, setArea] = useState(AREAS[0]);
  const [trackingNo, setTrackingNo] = useState("");
  const [results, setResults] = useState<ScanResult[]>([]);

  function submit() {
    if (!trackingNo.trim()) return toast.error("請掃描或輸入貨號");
    const res = evaluateScan(
      trackingNo.trim(),
      { ...ACTIONS["st-arrived"], targetStatus: `分貨 ${area}` },
      online,
    );
    if (res.ok && !res.pending) toast.success(`${res.trackingNo} 已分派至 ${area}`);
    else if (!res.ok) toast.error(`${res.trackingNo} ${res.message}`);
    setResults((p) => [res, ...p]);
    setTrackingNo("");
  }

  const okCount = results.filter((r) => r.ok).length;

  return (
    <Screen
      title="分貨作業"
      activeTab="inbound"
      footer={<PrimaryButton onClick={submit}>送出（分貨）</PrimaryButton>}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            分派區域
          </label>
          <Select value={area} onValueChange={setArea}>
            <SelectTrigger className="!h-14 rounded-xl border-border bg-card px-4 text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AREAS.map((a) => (
                <SelectItem key={a} value={a}>{a}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <ScanInput value={trackingNo} onChange={setTrackingNo} autoFocus />

        <section className="flex flex-col gap-3 pt-1">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              本區已分貨
            </h2>
            <span className="rounded bg-success px-2 py-0.5 text-[11px] font-bold text-success-foreground">
              成功 {okCount} 筆
            </span>
          </div>
          <ResultFeed results={results} />
        </section>
      </div>
    </Screen>
  );
}
