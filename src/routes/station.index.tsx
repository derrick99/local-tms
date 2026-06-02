import { createFileRoute } from "@tanstack/react-router";
import { ActionMenuScreen } from "@/components/app/ActionMenuScreen";

export const Route = createFileRoute("/station/")({
  head: () => ({
    meta: [
      { title: "站所作業 — 派派通" },
      { name: "description", content: "站所作業：轉寄物流商、貨到站所、到站異常與轉回運務所。" },
    ],
  }),
  component: () => (
    <ActionMenuScreen
      title="站所作業"
      activeTab="station"
      groups={[
        {
          layout: "stack",
          items: [{ label: "轉寄物流商", to: "/action/$id", params: { id: "st-forward" } }],
        },
        {
          title: "貨態更新",
          layout: "grid",
          items: [
            { label: "貨到站所", to: "/action/$id", params: { id: "st-arrived" } },
            { label: "遺失", to: "/action/$id", params: { id: "st-lost" } },
            { label: "到站異常", to: "/action/$id", params: { id: "st-arrive-exception" } },
            { label: "送錯站", to: "/action/$id", params: { id: "st-wrong-station" } },
            { label: "非配送區域", to: "/action/$id", params: { id: "st-out-of-area" } },
            { label: "貨出站所", to: "/action/$id", params: { id: "st-depart" } },
          ],
        },
        {
          layout: "stack",
          items: [{ label: "轉回運務所", to: "/station/return-depot" }],
        },
      ]}
    />
  ),
});
