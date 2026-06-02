import { useRef, useState } from "react";
import { Check, X, Clock } from "lucide-react";
import { toast } from "sonner";
import type { ActionConfig, ScanResult } from "@/lib/actions";
import { evaluateScan } from "@/lib/actions";
import { store, useStore } from "@/lib/store";
import { haptic } from "@/lib/haptic";
import { Screen } from "./Screen";
import { ScanInput } from "./ScanInput";
import { ResultFeed } from "./ResultFeed";
import { PrimaryButton } from "./PrimaryButton";
import {
  RequiredFieldInput,
  requiredDefault,
  requiredFilled,
} from "./RequiredFieldInput";

type ConfirmKind = "success" | "danger" | "warning";

const CONFIRM_STYLE: Record<ConfirmKind, string> = {
  success: "bg-success text-success-foreground",
  danger: "bg-destructive text-destructive-foreground",
  warning: "bg-warning text-warning-foreground",
};


export function ScanUpdateScreen({ action }: { action: ActionConfig }) {
  const online = useStore((s) => s.online);
  const [trackingNo, setTrackingNo] = useState("");
  const [required, setRequired] = useState(() => requiredDefault(action.required));
  const [results, setResults] = useState<ScanResult[]>([]);


  const [confirm, setConfirm] = useState<{ kind: ConfirmKind; key: number } | null>(
    null,
  );
  const confirmTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const canSubmit =
    trackingNo.trim().length > 0 && requiredFilled(action.required, required);

  function flashConfirm(kind: ConfirmKind) {
    if (confirmTimer.current) clearTimeout(confirmTimer.current);
    setConfirm({ kind, key: Date.now() });
    confirmTimer.current = setTimeout(() => setConfirm(null), 700);
  }

  function submit() {
    if (!trackingNo.trim()) {
      toast.error("請先掃描或輸入貨號");
      return;
    }
    if (!requiredFilled(action.required, required)) {
      toast.error("尚有重要資料未填寫！");
      return;
    }
    const res = evaluateScan(trackingNo.trim(), action, online);
    if (res.pending) {
      store.addPending(res.trackingNo, action.targetStatus);
      toast.warning("已暫存，待網路恢復後自動上傳");
      haptic([14, 30, 14]);
      flashConfirm("warning");
    } else if (res.ok) {
      toast.success(`${res.trackingNo} ${res.message}`);
      haptic([14, 30, 14]);
      flashConfirm("success");
    } else {
      toast.error(`${res.trackingNo} ${res.message}`);
      haptic([30, 40, 30]);
      flashConfirm("danger");
    }
    setResults((prev) => [res, ...prev]);
    setTrackingNo("");
  }

  const ConfirmIcon =
    confirm?.kind === "danger" ? X : confirm?.kind === "warning" ? Clock : Check;

  return (
    <Screen
      title={action.title}
      activeTab={action.tab}
      footer={
        <PrimaryButton onClick={submit} disabled={!canSubmit}>
          送 出
        </PrimaryButton>
      }
    >
      {confirm && (
        <div
          key={confirm.key}
          className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
        >
          <span
            className={`absolute size-28 rounded-full animate-confirm-ring ${CONFIRM_STYLE[confirm.kind]}`}
          />
          <span
            className={`flex size-28 items-center justify-center rounded-full shadow-xl animate-confirm-pop ${CONFIRM_STYLE[confirm.kind]}`}
          >
            <ConfirmIcon size={64} strokeWidth={3.5} />
          </span>
        </div>
      )}

      <div className="flex flex-col gap-5">
        <ScanInput value={trackingNo} onChange={setTrackingNo} autoFocus />

        {action.required !== "none" && (
          <RequiredFieldInput
            kind={action.required}
            value={required}
            onChange={setRequired}
          />
        )}

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
