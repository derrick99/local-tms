import type { ReactNode } from "react";
import type { TabKey } from "@/lib/actions";
import { AppHeader } from "./AppHeader";
import { TabBar } from "./TabBar";
import { FloatingBack } from "./FloatingBack";

export function Screen({
  title,
  activeTab,
  showBack = true,
  footer,
  hideTabBar = false,
  children,
}: {
  title: string;
  activeTab?: TabKey;
  showBack?: boolean;
  footer?: ReactNode;
  hideTabBar?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <AppHeader title={title} showBack={showBack} />

      <main className="flex-1 overflow-y-auto px-4 pb-6 pt-5">{children}</main>

      <div className="sticky bottom-0 z-10 border-t border-border bg-surface">
        {footer && <div className="px-4 py-3">{footer}</div>}
        {!hideTabBar && <TabBar active={activeTab ?? "delivery"} />}
      </div>

      {!hideTabBar && <FloatingBack />}
    </div>
  );
}
