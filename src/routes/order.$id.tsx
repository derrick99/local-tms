import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Phone, MapPin } from "lucide-react";
import { Screen } from "@/components/app/Screen";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/order/$id")({
  head: () => ({ meta: [{ title: "訂單明細 — 飛翔系統" }] }),
  component: OrderDetail,
  notFoundComponent: () => (
    <div className="grid min-h-dvh place-items-center text-muted-foreground">查無單號</div>
  ),
});

function OrderDetail() {
  const { id } = Route.useParams();
  const order = useStore((s) => s.orders.find((o) => o.id === id));
  if (!order) throw notFound();

  return (
    <Screen title="訂單明細" activeTab={order.tab === "reverse" ? "reverse" : "delivery"}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xl font-extrabold">{order.id}</span>
          <span className="rounded-lg bg-secondary px-3 py-1 text-sm font-bold">{order.status}</span>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">收件人</p>
          <p className="text-lg font-bold">{order.recipient}</p>
        </div>

        <a
          href={`tel:${order.phone1}`}
          className="flex items-center justify-between rounded-xl border border-border bg-card p-4"
        >
          <span className="flex items-center gap-3 font-mono font-bold">
            <Phone size={20} className="text-primary" /> {order.phone1}
          </span>
          <span className="rounded-lg bg-primary px-3 py-1.5 text-sm font-bold text-primary-foreground">撥號</span>
        </a>

        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(order.address)}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between rounded-xl border border-border bg-card p-4"
        >
          <span className="flex items-center gap-3 font-medium">
            <MapPin size={20} className="text-primary shrink-0" /> {order.address}
          </span>
          <span className="ml-2 shrink-0 rounded-lg bg-secondary px-3 py-1.5 text-sm font-bold">地圖</span>
        </a>

        {order.cod ? (
          <div className="rounded-xl bg-primary/15 p-4 ring-1 ring-primary/30">
            <span className="text-sm font-bold text-muted-foreground">代收金額　</span>
            <span className="text-xl font-extrabold text-primary">${order.cod.toLocaleString()}</span>
          </div>
        ) : null}

        {order.note && (
          <p className="rounded-xl border border-border bg-card p-4 text-sm">備註：{order.note}</p>
        )}

        <div className="flex items-center gap-3 pt-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">可執行動作</h2>
          <span className="h-px flex-1 bg-border" />
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <Link to="/delivery" className="rounded-xl border border-border bg-card py-3 text-center font-bold active:bg-accent">
            配送異常
          </Link>
          <Link to="/delivery/complete" className="rounded-xl bg-success py-3 text-center font-bold text-success-foreground">
            配送完成
          </Link>
        </div>
      </div>
    </Screen>
  );
}
