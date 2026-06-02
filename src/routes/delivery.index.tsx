import { createFileRoute } from "@tanstack/react-router";
import { ActionMenuScreen } from "@/components/app/ActionMenuScreen";

export const Route = createFileRoute("/delivery/")({
  head: () => ({
    meta: [
      { title: "配送 — 飛翔系統" },
      { name: "description", content: "配送作業：取件配送、配送完成、多件合併簽收與配送異常處理。" },
    ],
  }),
  component: () => (
    <ActionMenuScreen
      title="配送"
      activeTab="delivery"
      groups={[
        { layout: "stack", items: [{ label: "取件配送（持出）", to: "/action/$id", params: { id: "pickup-out" } }] },
        {
          layout: "stack",
          items: [
            { label: "配送完成", to: "/delivery/complete" },
            { label: "多件合併簽收", to: "/delivery/merge" },
          ],
        },
        {
          title: "配送異常",
          layout: "grid",
          items: [
            { label: "不在家", to: "/action/$id", params: { id: "not-home" } },
            { label: "另約日期", to: "/action/$id", params: { id: "reschedule" } },
            { label: "聯絡不上", to: "/action/$id", params: { id: "no-contact" } },
            { label: "公司休息", to: "/action/$id", params: { id: "company-closed" } },
            { label: "拒收/客退", to: "/action/$id", params: { id: "rejected" } },
            { label: "到所自取", to: "/action/$id", params: { id: "self-pickup" } },
            { label: "改址", to: "/action/$id", params: { id: "readdress" } },
            { label: "損壞", to: "/action/$id", params: { id: "damaged" } },
            { label: "地址不明", to: "/action/$id", params: { id: "addr-unknown" } },
            { label: "其他異常", to: "/action/$id", params: { id: "other-exception" } },
          ],
        },
        {
          layout: "stack",
          items: [
            { label: "配送列表", to: "/list/$kind", params: { kind: "delivery" } },
            { label: "代收明細", to: "/cod" },
          ],
        },
      ]}
    />
  ),
});
