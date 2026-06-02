import { createFileRoute } from "@tanstack/react-router";
import { Screen } from "@/components/app/Screen";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/cod")({
  head: () => ({ meta: [{ title: "代收明細 — 派派通" }] }),
  component: Cod,
});

function Cod() {
  const orders = useStore((s) => s.orders.filter((o) => o.cod));
  const total = orders.reduce((s, o) => s + (o.cod ?? 0), 0);
  return (
    <Screen title="代收明細" activeTab="delivery">
      <div className="flex flex-col gap-4">
        <div className="rounded-xl bg-primary/15 p-4 ring-1 ring-primary/30">
          <p className="text-sm font-bold text-muted-foreground">代收總額</p>
          <p className="text-3xl font-extrabold text-primary">${total.toLocaleString()}</p>
        </div>
        {orders.map((o) => (
          <div key={o.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
            <div>
              <p className="font-mono font-bold">{o.id}</p>
              <p className="text-sm text-muted-foreground">{o.recipient}</p>
            </div>
            <span className="text-lg font-extrabold text-primary">${o.cod?.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </Screen>
  );
}
