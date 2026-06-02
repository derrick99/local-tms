import { useSyncExternalStore } from "react";

// ---------- Types ----------
export type ShipmentStatus =
  | "未配送"
  | "配送中"
  | "配完"
  | "異常"
  | "改址"
  | "集貨中"
  | "退貨";

export interface Order {
  id: string;
  recipient: string;
  address: string;
  phone1: string;
  phone2?: string;
  cod?: number;
  refNo: string;
  note?: string;
  status: ShipmentStatus;
  tab: "delivery" | "reverse" | "return";
  isExpress?: boolean; // 超速配
}

export type PendingStatus = "pending" | "uploading" | "success" | "failed";
export interface PendingItem {
  id: string;
  trackingNo: string;
  action: string;
  status: PendingStatus;
  retries: number;
  time: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  date: string;
  read: boolean;
}

export interface MessageItem {
  id: string;
  from: "station" | "me";
  text: string;
  time: string;
}

export interface SavedLocation {
  id: string;
  name: string;
}

export type Theme = "dark" | "light";

interface State {
  account: string | null;
  online: boolean;
  floatingEnabled: boolean;
  theme: Theme;
  contractClient: string;
  orders: Order[];
  pending: PendingItem[];
  notifications: NotificationItem[];
  messages: MessageItem[];
  savedLocations: SavedLocation[];
}

// ---------- Seed ----------
function seedOrders(): Order[] {
  return [
    { id: "12345", recipient: "王小姐", address: "台北市大安區敦化南路二段 76 號", phone1: "0912-345-678", phone2: "02-2701-1234", cod: 1280, refNo: "RF-88012", note: "請於下午配送", status: "未配送", tab: "delivery" },
    { id: "12346", recipient: "陳先生", address: "台北市信義區信義路五段 7 號 33 樓", phone1: "0922-111-222", refNo: "RF-88013", status: "未配送", tab: "delivery" },
    { id: "12347", recipient: "林小姐", address: "台北市中山區南京東路三段 219 號", phone1: "0933-444-555", refNo: "RF-88014", status: "未配送", tab: "delivery", isExpress: true },
    { id: "12348", recipient: "張先生", address: "新北市板橋區文化路一段 100 號", phone1: "0955-666-777", cod: 560, refNo: "RF-88015", status: "異常", tab: "delivery" },
    { id: "12349", recipient: "黃太太", address: "台北市松山區八德路四段 692 號", phone1: "0966-888-999", refNo: "RF-88016", status: "配完", tab: "delivery" },
    { id: "22001", recipient: "逗寶國際", address: "桃園市龜山區復興一路 8 號", phone1: "03-327-1000", cod: 3200, refNo: "RF-90001", status: "未配送", tab: "reverse" },
    { id: "22002", recipient: "禾聯碩", address: "新竹市東區光復路二段 101 號", phone1: "03-571-2000", refNo: "RF-90002", status: "未配送", tab: "reverse" },
    { id: "33001", recipient: "客服退回", address: "台中市西屯區台灣大道三段 99 號", phone1: "04-2326-1000", refNo: "RF-95001", status: "退貨", tab: "return" },
  ];
}

let state: State = {
  account: null,
  online: true,
  floatingEnabled: true,
  theme: "light",
  contractClient: "A001 逗寶",
  orders: seedOrders(),
  pending: [
    { id: "p1", trackingNo: "12346", action: "配送中", status: "uploading", retries: 0, time: "14:05:12" },
    { id: "p2", trackingNo: "12347", action: "其他異常", status: "failed", retries: 2, time: "14:02:44" },
    { id: "p3", trackingNo: "12349", action: "配完", status: "success", retries: 0, time: "13:58:01" },
  ],
  notifications: [
    { id: "n1", title: "派工調整", body: "今日新增 5 件配送，請至配送列表確認最新路線。", date: "2026-06-01 09:12", read: false },
    { id: "n2", title: "颱風停送公告", body: "受颱風影響，宜蘭地區今日暫停配送，貨件將順延。", date: "2026-06-01 08:30", read: false },
    { id: "n3", title: "系統維護通知", body: "今晚 23:00–24:00 系統維護，請提前完成上傳。", date: "2026-05-31 18:00", read: true },
  ],
  messages: [
    { id: "m1", from: "station", text: "請回報今日剩餘件數，謝謝。", time: "13:40" },
    { id: "m2", from: "me", text: "已收到，剩 32 件。", time: "13:42" },
  ],
  savedLocations: [
    { id: "l1", name: "公司倉庫" },
    { id: "l2", name: "中山分店" },
  ],
};

// ---------- Store plumbing ----------
const listeners = new Set<() => void>();
function emit() {
  state = { ...state };
  listeners.forEach((l) => l());
}
function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}
function getSnapshot() {
  return state;
}

export function useStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(state),
    () => selector(state),
  );
}

function now() {
  return new Date().toLocaleTimeString("zh-TW", { hour12: false });
}

// ---------- Actions ----------
export const store = {
  get: () => state,
  login(account: string) {
    state.account = account || "王小明";
    emit();
  },
  logout() {
    state.account = null;
    emit();
  },
  setOnline(v: boolean) {
    state.online = v;
    emit();
  },
  toggleFloating() {
    state.floatingEnabled = !state.floatingEnabled;
    emit();
  },
  setTheme(theme: Theme) {
    state.theme = theme;
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("light", theme === "light");
    }
    emit();
  },
  toggleTheme() {
    this.setTheme(state.theme === "light" ? "dark" : "light");
  },
  setContractClient(name: string) {
    state.contractClient = name;
    emit();
  },
  addPending(trackingNo: string, action: string) {
    state.pending = [
      { id: `p${Date.now()}`, trackingNo, action, status: "pending", retries: 0, time: now() },
      ...state.pending,
    ];
    emit();
  },
  uploadAllPending() {
    state.pending = state.pending.map((p) =>
      p.status === "pending" || p.status === "failed"
        ? { ...p, status: "success" as PendingStatus }
        : p,
    );
    emit();
  },
  clearAllPending() {
    state.pending = [];
    emit();
  },
  clearSuccessPending() {
    state.pending = state.pending.filter((p) => p.status !== "success");
    emit();
  },
  markNotificationRead(id: string) {
    state.notifications = state.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n,
    );
    emit();
  },
  markAllNotificationsRead() {
    state.notifications = state.notifications.map((n) => ({ ...n, read: true }));
    emit();
  },
  sendMessage(text: string) {
    state.messages = [
      ...state.messages,
      { id: `m${Date.now()}`, from: "me", text, time: now().slice(0, 5) },
    ];
    emit();
  },
  addSavedLocation(name: string) {
    state.savedLocations = [...state.savedLocations, { id: `l${Date.now()}`, name }];
    emit();
  },
  removeSavedLocation(id: string) {
    state.savedLocations = state.savedLocations.filter((l) => l.id !== id);
    emit();
  },
  completeOrder(id: string) {
    state.orders = state.orders.map((o) =>
      o.id === id ? { ...o, status: "配完" as ShipmentStatus } : o,
    );
    emit();
  },
};

export function unreadCount() {
  return state.notifications.filter((n) => !n.read).length;
}
export function pendingCount() {
  return state.pending.filter((p) => p.status !== "success").length;
}
