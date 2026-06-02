import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Check, X } from "lucide-react";
import { Screen } from "@/components/app/Screen";
import { ScanInput } from "@/components/app/ScanInput";
import { PrimaryButton } from "@/components/app/PrimaryButton";
import { SignaturePad } from "@/components/app/SignaturePad";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RECIPIENT_OPTIONS } from "@/lib/actions";

export const Route = createFileRoute("/delivery/merge")({
  head: () => ({ meta: [{ title: "多件合併簽收 — 飛翔系統" }] }),
  component: Merge,
});

function Merge() {
  const router = useRouter();
  const [trackingNo, setTrackingNo] = useState("");
  const [items, setItems] = useState<string[]>(["12345", "12346", "12347"]);
  const [recipient, setRecipient] = useState("本人");
  const [signing, setSigning] = useState(false);
  const [signed, setSigned] = useState(false);
  const [blocked, setBlocked] = useState<string | null>(null);

  function add() {
    const n = trackingNo.trim();
    if (!n) return;
    // mock: numbers ending in 1 are COD shipments and cannot be merged
    if (/1$/.test(n)) {
      setBlocked(n);
    } else if (!items.includes(n)) {
      setItems((p) => [...p, n]);
      toast.success(`${n} 加入成功`);
    }
    setTrackingNo("");
  }

  return (
    <Screen
      title="多件合併簽收"
      activeTab="delivery"
      hideTabBar={signing}
      footer={
        signing ? (
          <PrimaryButton
            tone="success"
            disabled={!signed}
            onClick={() => {
              toast.success(`${items.length} 件已全部配完`);
              router.navigate({ to: "/delivery" });
            }}
          >
            全部配完
          </PrimaryButton>
        ) : (
          <PrimaryButton disabled={items.length === 0} onClick={() => setSigning(true)}>
            完 成（{items.length} 件）
          </PrimaryButton>
        )
      }
    >
      {signing ? (
        <SignaturePad onChange={setSigned} />
      ) : (
        <div className="flex flex-col gap-5">
          <ScanInput value={trackingNo} onChange={setTrackingNo} onScan={add} autoFocus />
          <button onClick={add} className="rounded-lg border border-border py-2 text-sm font-bold active:bg-accent">
            手動加入
          </button>

          <div className="flex flex-col gap-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              已加入（{items.length}）
            </h2>
            {items.map((n) => (
              <div key={n} className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3">
                <Check size={18} className="text-success" />
                <span className="font-mono font-bold">{n}</span>
              </div>
            ))}
            {blocked && (
              <div className="flex items-center gap-2 rounded-xl bg-destructive/10 px-4 py-3 ring-1 ring-destructive/30">
                <X size={18} className="text-destructive" />
                <span className="text-sm font-bold text-destructive">
                  <span className="font-mono">{blocked}</span> 為代收貨件，不可合併
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              收件人
            </label>
            <Select value={recipient} onValueChange={setRecipient}>
              <SelectTrigger className="!h-14 rounded-xl border-border bg-card px-4 text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RECIPIENT_OPTIONS.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </Screen>
  );
}
