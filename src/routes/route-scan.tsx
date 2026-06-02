import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ListChecks, MapPin, Trash2 } from "lucide-react";
import { Screen } from "@/components/app/Screen";
import { ScanInput } from "@/components/app/ScanInput";

export const Route = createFileRoute("/route-scan")({
  head: () => ({
    meta: [
      { title: "路線掃碼 — 飛翔系統" },
      { name: "description", content: "依配送順序連續掃碼建立今日路線。" },
    ],
  }),
  component: RouteScan,
});

interface Stop {
  id: string;
  no: string;
  time: string;
}

function RouteScan() {
  const [trackingNo, setTrackingNo] = useState("");
  const [stops, setStops] = useState<Stop[]>([]);

  function add() {
    const n = trackingNo.trim();
    if (!n) return;
    if (stops.some((s) => s.no === n)) {
      toast.error(`${n} 已在路線中`);
      setTrackingNo("");
      return;
    }
    setStops((p) => [
      ...p,
      { id: `s${Date.now()}`, no: n, time: new Date().toLocaleTimeString("zh-TW", { hour12: false }) },
    ]);
    setTrackingNo("");
  }

  return (
    <Screen
      title="路線掃碼"
      hideTabBar
      footer={
        <button
          onClick={() => {
            if (stops.length === 0) return toast.error("尚未掃描任何貨件");
            toast.success(`已建立 ${stops.length} 站路線`);
          }}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary text-lg font-extrabold tracking-wide text-primary-foreground active:scale-[0.98]"
        >
          <ListChecks size={20} />
          建立路線（{stops.length} 站）
        </button>
      }
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm font-medium text-muted-foreground">
          依實際配送順序連續掃碼，系統將自動建立今日路線清單。
        </p>
        <ScanInput value={trackingNo} onChange={setTrackingNo} onScan={add} autoFocus />
        <button
          onClick={add}
          className="rounded-lg border border-border py-2 text-sm font-bold active:bg-accent"
        >
          手動加入
        </button>

        <div className="flex items-center justify-between border-b border-border pb-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            路線順序（{stops.length}）
          </h2>
          {stops.length > 0 && (
            <button
              onClick={() => setStops([])}
              className="flex items-center gap-1 text-xs font-bold text-destructive"
            >
              <Trash2 size={14} />
              清空
            </button>
          )}
        </div>

        {stops.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card/40 px-4 py-10 text-center text-sm font-medium text-muted-foreground">
            掃描貨號後，站點會依序顯示在這裡
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {stops.map((s, i) => (
              <div
                key={s.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3"
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-sm font-extrabold text-primary-foreground">
                  {i + 1}
                </span>
                <MapPin size={18} className="shrink-0 text-muted-foreground" />
                <span className="flex-1 font-mono text-base font-bold">{s.no}</span>
                <time className="font-mono text-xs text-muted-foreground">{s.time}</time>
              </div>
            ))}
          </div>
        )}
      </div>
    </Screen>
  );
}
