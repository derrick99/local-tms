import { createFileRoute } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Screen } from "@/components/app/Screen";
import { ScanInput } from "@/components/app/ScanInput";
import { ResultFeed } from "@/components/app/ResultFeed";
import { PrimaryButton } from "@/components/app/PrimaryButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RETURN_REASONS,
  RESTRICTED_ACTION,
  evaluateScan,
  type ScanResult,
} from "@/lib/actions";
import { store, useStore } from "@/lib/store";

export const Route = createFileRoute("/station/return-depot")({
  head: () => ({
    meta: [
      { title: "轉回運務所 — 派派通" },
      { name: "description", content: "受權限管控的轉回運務所貨態更新作業。" },
    ],
  }),
  component: ReturnDepot,
});

function ReturnDepot() {
  const online = useStore((s) => s.online);
  const [trackingNo, setTrackingNo] = useState("");
  const [reason, setReason] = useState("");
  const [results, setResults] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState(false);

  const canSubmit = trackingNo.trim().length > 0 && reason.length > 0;

  function submit() {
    if (!trackingNo.trim()) return toast.error("請先掃描或輸入貨號");
    if (!reason) return toast.error("請選擇轉回原因");
    setLoading(true);
    setTimeout(() => {
      const res = evaluateScan(trackingNo.trim(), RESTRICTED_ACTION, online);
      if (res.pending) store.addPending(res.trackingNo, RESTRICTED_ACTION.targetStatus);
      if (res.ok && !res.pending) toast.success(`${res.trackingNo} ${res.message}`);
      else if (!res.ok) toast.error(`${res.trackingNo} ${res.message}`);
      setResults((p) => [res, ...p]);
      setTrackingNo("");
      setLoading(false);
    }, 350);
  }

  return (
    <Screen
      title="轉回運務所"
      activeTab="station"
      footer={
        <PrimaryButton tone="destructive" onClick={submit} loading={loading} disabled={!canSubmit}>
          送 出（轉回）
        </PrimaryButton>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-start gap-3 rounded-xl bg-destructive/10 p-4 ring-1 ring-destructive/30">
          <ShieldAlert size={20} className="mt-0.5 shrink-0 text-destructive" />
          <p className="text-sm font-medium text-destructive">
            此為權限管控作業，所有轉回紀錄將回報運務所稽核，請確認後再送出。
          </p>
        </div>

        <ScanInput value={trackingNo} onChange={setTrackingNo} autoFocus />

        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            轉回原因 <span className="text-destructive">*</span>
          </label>
          <Select value={reason} onValueChange={setReason}>
            <SelectTrigger className="!h-14 rounded-xl border-border bg-card px-4 text-base">
              <SelectValue placeholder="選擇轉回原因" />
            </SelectTrigger>
            <SelectContent>
              {RETURN_REASONS.map((r) => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <section className="flex flex-col gap-3 pt-1">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              掃描結果紀錄
            </h2>
            <span className="rounded bg-secondary px-2 py-0.5 text-[11px] font-bold text-secondary-foreground">
              共 {results.length} 筆
            </span>
          </div>
          <ResultFeed results={results} />
        </section>
      </div>
    </Screen>
  );
}
