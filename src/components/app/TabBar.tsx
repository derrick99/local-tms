import { Link, useRouterState } from "@tanstack/react-router";
import { Truck, RefreshCw, ClipboardCheck, Building2 } from "lucide-react";
import type { TabKey } from "@/lib/actions";
import { haptic } from "@/lib/haptic";

const TABS: {
  key: TabKey;
  label: string;
  to: string;
  params?: Record<string, string>;
  match: string;
  icon: typeof Truck;
}[] = [
  { key: "delivery", label: "配送", to: "/list/$kind", params: { kind: "delivery" }, match: "/list/delivery", icon: Truck },
  { key: "reverse", label: "逆物流", to: "/reverse", match: "/reverse", icon: RefreshCw },
  { key: "inbound", label: "取件驗收", to: "/inbound", match: "/inbound", icon: ClipboardCheck },
  { key: "station", label: "站所", to: "/station", match: "/station", icon: Building2 },
];

export function TabBar({ active }: { active: TabKey }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="grid grid-cols-4 border-t border-border bg-surface">
      {TABS.map((t) => {
        const isActive = active ? t.key === active : pathname.startsWith(t.match);
        const Icon = t.icon;
        return (
          <Link
            key={t.key}
            to={t.to}
            params={t.params}
            onPointerDown={() => haptic(8)}
            className="flex flex-col items-center justify-center gap-1 py-2.5 active:bg-accent/40"
          >
            <Icon
              className={isActive ? "text-primary" : "text-muted-foreground"}
              size={22}
              strokeWidth={isActive ? 2.6 : 2}
            />
            <span
              className={
                "text-[11px] font-bold " +
                (isActive ? "text-primary" : "text-muted-foreground")
              }
            >
              {t.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
