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
import { BOX_SIZES, evaluateScan, ACTIONS, type ScanResult } from "@/lib/actions";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/inbound/collect")({
  head: () => ({ meta: [{ title: "集貨作業 — 飛翔系統" }] }),
  component: Collect,
});

function Collect() {
  const client = useStore((s) => s.contractClient);
  const online = useStore((s) => s.online);
  const [size, setSize] = useState("S60");
  const [box, setBox] = useState("");
  const [trackingNo, setTrackingNo] = useState("");
  const [results, setResults] = useState<ScanResult[]>([]);

  function submit() {
    if (!box.trim()) return toast.error("請先刷讀箱號");
    if (!trackingNo.trim()) return toast.error("請掃描貨號");
    // mock: numbers ending in 5 mismatch contract client
    if (/5$/.test(trackingNo)) {
      setResults((p) => [
        { id: `r${Date.now()}`, ok: false, trackingNo, time: new Date().toLocaleTimeString("zh-TW", { hour12: false }), message: "不相配的契約客戶代號與貨單" },
        ...p,
      ]);
      setTrackingNo("");
      return;
    }
    const res = evaluateScan(trackingNo, { ...ACTIONS["rv-collect"], targetStatus: "集貨中" }, online);
    setResults((p) => [res, ...p]);
    setTrackingNo("");
  }

  return (
    <Screen
      title="集貨作業"
      activeTab="inbound"
      footer={<PrimaryButton onClick={submit}>送出（集貨）</PrimaryButton>}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
          <div>
            <p className="text-xs font-bold text-muted-foreground">契約客戶</p>
            <p className="font-bold">{client}</p>
          </div>
          <button className="rounded-lg border border-border px-3 py-1.5 text-sm font-bold">變更</button>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">尺寸</label>
          <Select value={size} onValueChange={setSize}>
            <SelectTrigger className="!h-14 rounded-xl border-border bg-card px-4 text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BOX_SIZES.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            刷讀箱號 <span className="text-destructive">*</span>
          </label>
          <input
            value={box}
            onChange={(e) => setBox(e.target.value)}
            placeholder="刷讀或輸入箱號"
            className="h-14 rounded-xl border border-border bg-card px-4 font-mono text-base outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <ScanInput value={trackingNo} onChange={setTrackingNo} />
        <ResultFeed results={results} />
      </div>
    </Screen>
  );
}
