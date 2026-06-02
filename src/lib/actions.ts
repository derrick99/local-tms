export type TabKey = "delivery" | "reverse" | "inbound" | "station";

export type RequiredField =
  | "none"
  | "address"
  | "date"
  | "reason"
  | "size"
  | "forwarder";

export interface ActionConfig {
  id: string;
  title: string;
  tab: TabKey;
  required: RequiredField;
  targetStatus: string;
  restricted?: boolean;
}

export const RECIPIENT_OPTIONS = [
  "本人",
  "同事-親友",
  "鄰居",
  "管理員",
  "櫃檯",
  "收發室",
  "其他",
];

export const BOX_SIZES = ["S60", "S90", "S120", "S150", "S180", "S210", "S240"];

export const EXCEPTION_REASONS = [
  "包裝破損",
  "貨件遺失",
  "客戶要求退回",
  "重複貨件",
  "系統資料異常",
  "其他",
];

export const RETURN_REASONS = [
  "拒收",
  "客服通知退回",
  "到站異常",
  "貨物事故",
  "其他廠商",
  "非配送區域",
  "超過七日",
  "逆物流轉回",
  "入店異常",
  "其他",
];

export const FORWARDERS = ["UBER", "宅配通", "全球物流"];

const list: ActionConfig[] = [
  // 配送
  { id: "pickup-out", title: "取件配送", tab: "delivery", required: "none", targetStatus: "持出" },
  { id: "not-home", title: "不在家", tab: "delivery", required: "none", targetStatus: "不在家" },
  { id: "reschedule", title: "另約日期", tab: "delivery", required: "date", targetStatus: "另約日期" },
  { id: "no-contact", title: "聯絡不上", tab: "delivery", required: "none", targetStatus: "聯絡不上" },
  { id: "company-closed", title: "公司休息", tab: "delivery", required: "none", targetStatus: "公司休息" },
  { id: "rejected", title: "拒收/客退", tab: "delivery", required: "none", targetStatus: "拒收" },
  { id: "self-pickup", title: "到所自取", tab: "delivery", required: "none", targetStatus: "到所自取" },
  { id: "readdress", title: "改址", tab: "delivery", required: "address", targetStatus: "改址" },
  { id: "damaged", title: "損壞", tab: "delivery", required: "none", targetStatus: "損壞" },
  { id: "addr-unknown", title: "地址不明", tab: "delivery", required: "none", targetStatus: "地址不明" },
  { id: "other-exception", title: "其他異常", tab: "delivery", required: "reason", targetStatus: "其他異常" },

  // 逆物流
  { id: "rv-reserve", title: "預約取件", tab: "reverse", required: "none", targetStatus: "預約取件" },
  { id: "rv-collect", title: "集貨", tab: "reverse", required: "size", targetStatus: "集貨中" },
  { id: "rv-reschedule", title: "另約時間", tab: "reverse", required: "date", targetStatus: "另約時間" },
  { id: "rv-readdress", title: "改址取件", tab: "reverse", required: "address", targetStatus: "改址取件" },
  { id: "rv-pickup-done", title: "取件完成", tab: "reverse", required: "none", targetStatus: "取件完成" },
  { id: "rv-pickup-fail", title: "取件失敗", tab: "reverse", required: "reason", targetStatus: "取件失敗" },
  { id: "rv-cancel", title: "取消預約", tab: "reverse", required: "none", targetStatus: "取消" },

  // 站所
  { id: "st-forward", title: "轉寄物流商", tab: "station", required: "forwarder", targetStatus: "轉寄物流商" },
  { id: "st-arrived", title: "貨到站所", tab: "station", required: "none", targetStatus: "貨到站所" },
  { id: "st-lost", title: "遺失", tab: "station", required: "reason", targetStatus: "遺失" },
  { id: "st-arrive-exception", title: "到站異常", tab: "station", required: "reason", targetStatus: "到站異常" },
  { id: "st-wrong-station", title: "送錯站", tab: "station", required: "none", targetStatus: "送錯站" },
  { id: "st-out-of-area", title: "非配送區域", tab: "station", required: "none", targetStatus: "非配送區域" },
  { id: "st-depart", title: "貨出站所", tab: "station", required: "none", targetStatus: "貨出站所" },

  // 取件驗收
  { id: "ib-delay", title: "延遲到站", tab: "inbound", required: "reason", targetStatus: "延遲到站" },
  { id: "ib-return-deliver", title: "退貨配送", tab: "inbound", required: "none", targetStatus: "退貨配送" },
  { id: "ib-return-done", title: "退貨配完", tab: "inbound", required: "none", targetStatus: "退貨配完" },
];

export const ACTIONS: Record<string, ActionConfig> = Object.fromEntries(
  list.map((a) => [a.id, a]),
);

export const RESTRICTED_ACTION: ActionConfig = {
  id: "return-depot",
  title: "轉回運務所",
  tab: "station",
  required: "reason",
  targetStatus: "轉回運務所",
  restricted: true,
};

export interface ScanResult {
  id: string;
  ok: boolean;
  trackingNo: string;
  message: string;
  time: string;
  pending?: boolean;
}

// Deterministic mock evaluation of a scanned tracking number.
export function evaluateScan(
  trackingNo: string,
  action: ActionConfig,
  online: boolean,
): ScanResult {
  const time = new Date().toLocaleTimeString("zh-TW", { hour12: false });
  const base = { id: `r${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, trackingNo, time };

  if (!online) {
    return { ...base, ok: true, pending: true, message: `已暫存，待上傳（${action.targetStatus}）` };
  }
  // numbers ending in 0 simulate an already-closed shipment
  if (/0$/.test(trackingNo)) {
    return { ...base, ok: false, message: "已是結案貨態:配完" };
  }
  // numbers ending in 9 simulate a not-found error
  if (/9$/.test(trackingNo)) {
    return { ...base, ok: false, message: "查無此單號，請確認後重掃" };
  }
  return { ...base, ok: true, message: `已更新貨態:${action.targetStatus}` };
}
