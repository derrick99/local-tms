import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, PackageCheck } from "lucide-react";
import { store } from "@/lib/store";
import { PrimaryButton } from "@/components/app/PrimaryButton";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "登入 — 派派通" },
      { name: "description", content: "登入派派通物流士配送作業 APP。" },
    ],
  }),
  component: Login,
});

function Login() {
  const router = useRouter();
  const [account, setAccount] = useState("王小明");
  const [pw, setPw] = useState("123456");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function login() {
    if (!account.trim() || !pw.trim()) {
      setError("請輸入帳號與密碼");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      store.login(account.trim());
      setLoading(false);
      router.navigate({ to: "/list/$kind", params: { kind: "delivery" } });
    }, 500);
  }

  return (
    <div className="flex min-h-dvh flex-col justify-center px-7 py-12">
      <div className="mb-10 flex flex-col items-center gap-3">
        <div className="grid size-16 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
          <PackageCheck size={34} strokeWidth={2.4} />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-extrabold tracking-tight">派派通 TMS</h1>
          <p className="text-sm font-medium text-muted-foreground">配送作業</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-muted-foreground">帳號</label>
          <input
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            className="h-14 rounded-xl border border-border bg-card px-4 text-lg font-medium outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-muted-foreground">密碼</label>
          <div className="flex h-14 items-center rounded-xl border border-border bg-card px-4 focus-within:ring-2 focus-within:ring-ring">
            <input
              type={show ? "text" : "password"}
              value={pw}
              onChange={(e) => setPw(e.target.value)}
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

        {error && <p className="text-sm font-medium text-destructive">{error}</p>}

        <PrimaryButton onClick={login} loading={loading} className="mt-2">
          登 入
        </PrimaryButton>
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground/60">
        GPC-2.4.1-build.20260526
      </p>
    </div>
  );
}
