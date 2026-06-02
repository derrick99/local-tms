import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ChevronRight, Search, Route as RouteIcon, LayoutGrid } from "lucide-react";
import { Screen } from "@/components/app/Screen";
import { useStore, store, type Order } from "@/lib/store";
import type { TabKey } from "@/lib/actions";

export const Route = createFileRoute("/list/$kind")({
  head: () => ({ meta: [{ title: "貨件列表 — 飛翔系統" }] }),
  component: ListScreen,
});

const KIND_META: Record<string, { title: string; tab: TabKey; tabs: string[] }> = {
  delivery: { title: "配送列表", tab: "delivery", tabs: ["未配送", "異常", "配結"] },
  reverse: { title: "逆物流列表", tab: "reverse", tabs: ["待取件", "集貨", "完成"] },
  return: { title: "退貨列表", tab: "inbound", tabs: ["退貨持出", "退貨配完"] },
};

function ListScreen() {
  const { kind } = Route.useParams();
  const meta = KIND_META[kind] ?? KIND_META.delivery;
  const orders = useStore((s) => s.orders);
  const [tab, setTab] = useState(0);
  const [q, setQ] = useState("");

  const tabKey = kind === "return" ? "return" : kind === "reverse" ? "reverse" : "delivery";
  const rows = useMemo(
    () => orders.filter((o) => o.tab === tabKey && (q ? o.id.includes(q) || o.refNo.includes(q) : true)),
    [orders, tabKey, q],
  );
  const counts = meta.tabs.map((_, i) => (i === 0 ? rows.filter((o) => o.status !== "配完").length : i === meta.tabs.length - 1 ? rows.filter((o) => o.status === "配完").length : rows.filter((o) => o.status === "異常").length));

  return (
    <Screen title={meta.title} activeTab={meta.tab}>
      <div className="flex flex-col gap-4">
        <div className="flex gap-2 text-sm font-bold text-muted-foreground">
          <span>持出 {orders.filter((o) => o.tab === tabKey).length}</span>
          <span>·</span>
          <span>配完 {orders.filter((o) => o.tab === tabKey && o.status === "配完").length}</span>
        </div>

        <div className="flex gap-2">
          {meta.tabs.map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(i)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-bold ${
                tab === i ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"
              }`}
            >
              {t}
              <span className="rounded bg-black/20 px-1.5 text-xs">{counts[i]}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3">
          <Search size={18} className="text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="訂單編號 / 參考單號"
            className="h-12 flex-1 bg-transparent text-sm outline-none"
          />
        </div>

        <div className="flex gap-2">
          {kind === "delivery" && (
            <Link
              to="/delivery"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border py-3 font-bold active:bg-accent"
            >
              <LayoutGrid size={18} /> 配送作業
            </Link>
          )}
          <Link
            to="/route-sort"
            disabled={rows.length < 2}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl border border-border py-3 font-bold ${
              rows.length < 2 ? "pointer-events-none opacity-40" : "active:bg-accent"
            }`}
          >
            <RouteIcon size={18} /> 自動路順
          </Link>
        </div>

        <div className="flex flex-col gap-2.5">
          {rows.length === 0 && (
            <p className="py-10 text-center text-sm text-muted-foreground">目前無資料</p>
          )}
          {rows.map((o) => (
            <OrderRow key={o.id} o={o} />
          ))}
        </div>
      </div>
    </Screen>
  );
}

function OrderRow({ o }: { o: Order }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3.5">
      <Link to="/order/$id" params={{ id: o.id }} className="flex items-start justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-base font-bold">{o.id}</span>
            <span className="text-sm font-medium">{o.recipient}</span>
            {o.isExpress && (
              <span className="rounded bg-primary/20 px-1.5 text-[10px] font-bold text-primary">超速配</span>
            )}
          </div>
          <p className="mt-0.5 truncate text-sm text-muted-foreground">{o.address}</p>
        </div>
        <ChevronRight size={18} className="mt-1 shrink-0 text-muted-foreground" />
      </Link>
      <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
        {o.cod ? (
          <span className="text-sm font-bold text-primary">代收 ${o.cod.toLocaleString()}</span>
        ) : (
          <span className="text-sm text-muted-foreground">無代收</span>
        )}
        {o.status !== "配完" && !o.isExpress && (
          <button
            onClick={() => {
              store.completeOrder(o.id);
              toast.success(`${o.id} 已配結`);
            }}
            className="rounded-lg bg-success px-3 py-1.5 text-sm font-bold text-success-foreground"
          >
            配結
          </button>
        )}
        {o.status === "配完" && <span className="text-sm font-bold text-success">已配完</span>}
      </div>
    </div>
  );
}
