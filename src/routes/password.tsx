import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Screen } from "@/components/app/Screen";
import { PrimaryButton } from "@/components/app/PrimaryButton";

export const Route = createFileRoute("/password")({
  head: () => ({
    meta: [
      { title: "變更密碼 — 派派通" },
      { name: "description", content: "變更物流士登入密碼。" },
    ],
  }),
  component: Password,
});

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-bold text-muted-foreground">{label}</label>
      <div className="flex h-14 items-center rounded-xl border border-border bg-card px-4 focus-within:ring-2 focus-within:ring-ring">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-lg font-medium outline-none"
        />
        <button
          type="button"
          aria-label={show ? "隱藏密碼" : "顯示密碼"}
          onClick={() => setShow((s) => !s)}
          className="text-muted-foreground"
        >
          {show ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    </div>
  );
}

function Password() {
  const router = useRouter();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  function submit() {
    if (!current || !next || !confirm) return toast.error("請填寫所有欄位");
    if (next.length < 6) return toast.error("新密碼至少需 6 碼");
    if (next !== confirm) return toast.error("兩次輸入的新密碼不一致");
    if (next === current) return toast.error("新密碼不可與目前密碼相同");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("密碼已變更");
      router.history.back();
    }, 600);
  }

  return (
    <Screen
      title="變更密碼"
      hideTabBar
      footer={
        <PrimaryButton onClick={submit} loading={loading}>
          確認變更
        </PrimaryButton>
      }
    >
      <div className="flex flex-col gap-4">
        <Field label="目前密碼" value={current} onChange={setCurrent} />
        <Field label="新密碼（至少 6 碼）" value={next} onChange={setNext} />
        <Field label="確認新密碼" value={confirm} onChange={setConfirm} />
        <p className="text-xs font-medium text-muted-foreground">
          密碼變更後，下次登入請使用新密碼。
        </p>
      </div>
    </Screen>
  );
}
