import { createFileRoute } from "@tanstack/react-router";
import { ActionMenuScreen } from "@/components/app/ActionMenuScreen";

export const Route = createFileRoute("/reverse")({
  head: () => ({
    meta: [
      { title: "逆物流 — 派派通" },
      { name: "description", content: "逆物流作業：預約取件、集貨、改址取件與逆物流列表。" },
    ],
  }),
  component: () => (
    <ActionMenuScreen
      title="逆物流"
      activeTab="reverse"
      groups={[
        {
          title: "取件作業",
          layout: "grid",
          items: [
            { label: "預約取件", to: "/action/$id", params: { id: "rv-reserve" } },
            { label: "集貨", to: "/action/$id", params: { id: "rv-collect" } },
            { label: "另約時間", to: "/action/$id", params: { id: "rv-reschedule" } },
            { label: "改址取件", to: "/action/$id", params: { id: "rv-readdress" } },
            { label: "取件完成", to: "/action/$id", params: { id: "rv-pickup-done" } },
            { label: "取件失敗", to: "/action/$id", params: { id: "rv-pickup-fail" } },
            { label: "取消預約", to: "/action/$id", params: { id: "rv-cancel" } },
          ],
        },
        {
          layout: "stack",
          items: [{ label: "逆物流列表", to: "/list/$kind", params: { kind: "reverse" } }],
        },
      ]}
    />
  ),
});
