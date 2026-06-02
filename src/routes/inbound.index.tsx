import { createFileRoute } from "@tanstack/react-router";
import { ActionMenuScreen } from "@/components/app/ActionMenuScreen";

export const Route = createFileRoute("/inbound/")({
  head: () => ({
    meta: [
      { title: "取件驗收 — 飛翔系統" },
      { name: "description", content: "取件驗收：集貨作業、分貨作業、退貨配送與相關列表。" },
    ],
  }),
  component: () => (
    <ActionMenuScreen
      title="取件驗收"
      activeTab="inbound"
      groups={[
        {
          layout: "stack",
          items: [
            { label: "集貨作業", to: "/inbound/collect" },
            { label: "分貨作業", to: "/inbound/sort" },
          ],
        },
        {
          title: "貨態更新",
          layout: "grid",
          items: [
            { label: "延遲到站", to: "/action/$id", params: { id: "ib-delay" } },
            { label: "退貨配送", to: "/action/$id", params: { id: "ib-return-deliver" } },
            { label: "退貨配完", to: "/action/$id", params: { id: "ib-return-done" } },
          ],
        },
        {
          layout: "stack",
          items: [
            { label: "集貨列表", to: "/list/$kind", params: { kind: "reverse" } },
            { label: "退貨列表", to: "/list/$kind", params: { kind: "return" } },
          ],
        },
      ]}
    />
  ),
});
