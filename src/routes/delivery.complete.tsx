import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Camera, Check } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RECIPIENT_OPTIONS } from "@/lib/actions";

export const Route = createFileRoute("/delivery/complete")({
  head: () => ({ meta: [{ title: "配送完成 — 派派通" }] }),
  component: Complete,
});

function Complete() {
  const router = useRouter();
  const [step, setStep] = useState<"scan" | "sign" | "photo">("scan");
  const [trackingNo, setTrackingNo] = useState("");
  const [cod, setCod] = useState<number | null>(null);
  const [recipient, setRecipient] = useState("本人");
  const [signed, setSigned] = useState(false);
  const [photos, setPhotos] = useState(0);
  const [received, setReceived] = useState("");

  function checkAndProceed() {
    if (!trackingNo.trim()) return toast.error("請先掃描貨號");
    // mock: numbers ending in 0 are already closed
    if (/0$/.test(trackingNo)) return toast.error("持出時間不為同日，無法更新貨態為配完");
    // mock COD branch: numbers ending in 8 carry cash on delivery
    if (/8$/.test(trackingNo)) {
      setCod(1280);
      return;
    }
    setStep("sign");
  }

  function confirmCod() {
    if (received !== String(cod)) {
      toast.error("實收金額與代收金額不符，請重新確認");
      return;
    }
    setCod(null);
    setReceived("");
    setStep("sign");
  }

  return (
    <Screen
      title={step === "scan" ? "配送完成" : step === "sign" ? "簽名板" : "拍照"}
      activeTab="delivery"
      hideTabBar={step !== "scan"}
      footer={
        step === "scan" ? (
          <PrimaryButton tone="success" onClick={checkAndProceed}>
            送 出
          </PrimaryButton>
        ) : step === "sign" ? (
          <PrimaryButton tone="success" disabled={!signed} onClick={() => setStep("photo")}>
            確定送出
          </PrimaryButton>
        ) : (
          <PrimaryButton
            tone="success"
            onClick={() => {
              toast.success(`${trackingNo} 已更新貨態:配完`);
              router.navigate({ to: "/delivery" });
            }}
          >
            <Check size={20} /> 完成結案
          </PrimaryButton>
        )
      }
    >
      {step === "scan" && (
        <div className="flex flex-col gap-5">
          <ScanInput value={trackingNo} onChange={setTrackingNo} autoFocus />
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
          <p className="rounded-xl border border-border bg-card/50 p-3 text-sm text-muted-foreground">
            提示：配送完成為不可逆的結案動作，送出前請確認貨號與帳號正確。
          </p>
        </div>
      )}

      {step === "sign" && (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-muted-foreground">
            貨號 <span className="font-mono font-bold text-foreground">{trackingNo}</span>　收件人：{recipient}
          </p>
          <SignaturePad onChange={setSigned} />
        </div>
      )}

      {step === "photo" && (
        <div className="flex flex-col gap-4">
          <div className="grid h-56 place-items-center rounded-xl border border-dashed border-border bg-card text-muted-foreground">
            <Camera size={48} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold">已拍 {photos}/10</span>
            <button
              onClick={() => setPhotos((p) => Math.min(10, p + 1))}
              disabled={photos >= 10}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground disabled:opacity-40"
            >
              {photos >= 10 ? "已達上限" : "拍攝"}
            </button>
          </div>
        </div>
      )}

      <Dialog open={cod !== null} onOpenChange={(o) => !o && setCod(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>代收貨款</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              應收金額：<span className="text-2xl font-extrabold text-foreground">$ {cod?.toLocaleString()}</span>
            </p>
            <label className="text-sm font-bold text-muted-foreground">實收金額</label>
            <input
              inputMode="numeric"
              value={received}
              onChange={(e) => setReceived(e.target.value)}
              placeholder="$"
              className="h-14 rounded-xl border border-border bg-card px-4 text-2xl font-bold outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <DialogFooter className="flex-row gap-2">
            <button
              onClick={() => {
                setCod(null);
                toast("已取消配送完成");
              }}
              className="flex-1 rounded-xl border border-border py-3 font-bold"
            >
              取消
            </button>
            <button
              onClick={confirmCod}
              className="flex-1 rounded-xl bg-success py-3 font-bold text-success-foreground"
            >
              確認收款
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Screen>
  );
}
