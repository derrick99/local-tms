import type { ReactNode } from "react";
import type { TabKey } from "@/lib/actions";
import { MenuActionLink } from "./MenuActionLink";
import { Screen } from "./Screen";

export interface MenuItem {
  label: string;
  to: string;
  params?: Record<string, string>;
  icon?: ReactNode;
  badge?: string;
}
export interface MenuGroup {
  title?: string;
  layout: "stack" | "grid";
  items: MenuItem[];
}

export function ActionMenuScreen({
  title,
  activeTab,
  groups,
}: {
  title: string;
  activeTab: TabKey;
  groups: MenuGroup[];
}) {
  return (
    <Screen title={title} activeTab={activeTab} showBack={false}>
      <div className="flex flex-col gap-6">
        {groups.map((g, i) => (
          <section key={i} className="flex flex-col gap-3">
            {g.title && (
              <div className="flex items-center gap-3">
                <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  {g.title}
                </h2>
                <span className="h-px flex-1 bg-border" />
              </div>
            )}

            {g.layout === "stack" ? (
              <div className="flex flex-col gap-2.5">
                {g.items.map((it) => (
                  <MenuActionLink
                    key={it.label}
                    label={it.label}
                    to={it.to}
                    params={it.params}
                    icon={it.icon}
                    badge={it.badge}
                    layout="stack"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2.5">
                {g.items.map((it) => (
                  <MenuActionLink
                    key={it.label}
                    label={it.label}
                    to={it.to}
                    params={it.params}
                    icon={it.icon}
                    layout="grid"
                  />
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </Screen>
  );
}
