import { Link } from "@tanstack/react-router";
import { Check, ChevronRight } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";
import { haptic } from "@/lib/haptic";
import {
  resolveMenuVisual,
  TONE_CHIP,
  TONE_CHIP_ACTIVE,
  TONE_CARD_ACTIVE,
  TONE_CONFIRM,
} from "@/lib/menu-visuals";

interface MenuActionLinkProps {
  label: string;
  to: string;
  params?: Record<string, string>;
  icon?: ReactNode;
  badge?: string;
  layout: "stack" | "grid";
}

export function MenuActionLink({
  label,
  to,
  params,
  icon,
  badge,
  layout,
}: MenuActionLinkProps) {
  const v = resolveMenuVisual(to, params?.id);
  const Icon = v.Icon;
  const [confirming, setConfirming] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const trigger = () => {
    haptic([14, 30, 14]);
    setConfirming(false);
    // restart the animation even on rapid repeat taps
    requestAnimationFrame(() => setConfirming(true));
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setConfirming(false), 700);
  };

  const overlay = confirming && (
    <span className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
      <span className={`absolute size-14 rounded-full animate-confirm-ring ${TONE_CONFIRM[v.tone]}`} />
      <span
        className={`flex size-14 items-center justify-center rounded-full text-background shadow-lg animate-confirm-pop ${TONE_CONFIRM[v.tone]}`}
      >
        <Check size={32} strokeWidth={3.5} className="text-background" />
      </span>
    </span>
  );

  if (layout === "stack") {
    return (
      <Link
        to={to}
        params={params}
        onPointerDown={trigger}
        className={`group relative flex select-none items-center justify-between overflow-hidden rounded-xl border border-border bg-card px-4 py-4 text-base font-bold shadow-sm shadow-[var(--shadow-color)] transition-transform duration-100 active:scale-[0.98] ${TONE_CARD_ACTIVE[v.tone]}`}
      >
        {overlay}
        <span className="flex items-center gap-3">
          <span
            className={`flex size-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-100 group-active:scale-110 ${TONE_CHIP[v.tone]} ${TONE_CHIP_ACTIVE[v.tone]}`}
          >
            {icon ?? <Icon size={24} strokeWidth={2.4} />}
          </span>
          {label}
        </span>
        <span className="flex items-center gap-2">
          {badge && (
            <span className="rounded bg-secondary px-2 py-0.5 text-xs font-bold text-secondary-foreground">
              {badge}
            </span>
          )}
          <ChevronRight size={20} className="text-muted-foreground" />
        </span>
      </Link>
    );
  }

  return (
    <Link
      to={to}
      params={params}
      onPointerDown={trigger}
      className={`group relative flex min-h-[92px] select-none flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border border-border bg-card px-2 py-3 text-center text-sm font-bold leading-tight shadow-sm shadow-[var(--shadow-color)] transition-transform duration-100 active:scale-[0.96] ${TONE_CARD_ACTIVE[v.tone]}`}
    >
      {overlay}
      <span
        className={`flex size-12 items-center justify-center rounded-xl transition-transform duration-100 group-active:scale-110 ${TONE_CHIP[v.tone]} ${TONE_CHIP_ACTIVE[v.tone]}`}
      >
        {icon ?? <Icon size={26} strokeWidth={2.4} />}
      </span>
      {label}
    </Link>
  );
}
