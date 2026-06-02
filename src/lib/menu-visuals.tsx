import {
  AlertTriangle,
  Ban,
  Banknote,
  Boxes,
  Building2,
  CalendarClock,
  CalendarPlus,
  CalendarX,
  CheckCircle2,
  Clock,
  DoorClosed,
  Layers,
  ListChecks,
  MapPinned,
  MapPinOff,
  PackageCheck,
  PackageOpen,
  PackageSearch,
  PackageX,
  PhoneOff,
  Send,
  Split,
  Store,
  Truck,
  Undo2,
  XCircle,
  type LucideIcon,
} from "lucide-react";

export type MenuTone = "neutral" | "primary" | "success" | "warning" | "danger";

export interface MenuVisual {
  Icon: LucideIcon;
  tone: MenuTone;
}

// Color classes per tone: tinted chip background + icon color (resting state).
export const TONE_CHIP: Record<MenuTone, string> = {
  neutral: "bg-muted text-muted-foreground",
  primary: "bg-primary/15 text-primary",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-destructive/15 text-destructive",
};

// Pressed state: chip flips to a solid saturated fill so the icon "lights up"
// — instant, glanceable confirmation without reading the label.
export const TONE_CHIP_ACTIVE: Record<MenuTone, string> = {
  neutral: "group-active:bg-foreground group-active:text-background",
  primary: "group-active:bg-primary group-active:text-primary-foreground",
  success: "group-active:bg-success group-active:text-success-foreground",
  warning: "group-active:bg-warning group-active:text-warning-foreground",
  danger: "group-active:bg-destructive group-active:text-destructive-foreground",
};

// Pressed state for the whole card: tinted background + matching border ring.
export const TONE_CARD_ACTIVE: Record<MenuTone, string> = {
  neutral: "group-active:border-foreground/40 group-active:bg-muted",
  primary: "group-active:border-primary group-active:bg-primary/10",
  success: "group-active:border-success group-active:bg-success/10",
  warning: "group-active:border-warning group-active:bg-warning/10",
  danger: "group-active:border-destructive group-active:bg-destructive/10",
};

// Solid fill for the tap-confirmation checkmark burst overlay.
export const TONE_CONFIRM: Record<MenuTone, string> = {
  neutral: "bg-foreground",
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-destructive",
};


// Keyed by action id (params.id).
const BY_ID: Record<string, MenuVisual> = {
  // 配送
  "pickup-out": { Icon: Truck, tone: "primary" },
  "not-home": { Icon: DoorClosed, tone: "warning" },
  reschedule: { Icon: CalendarClock, tone: "warning" },
  "no-contact": { Icon: PhoneOff, tone: "warning" },
  "company-closed": { Icon: Building2, tone: "warning" },
  rejected: { Icon: Undo2, tone: "danger" },
  "self-pickup": { Icon: Store, tone: "neutral" },
  readdress: { Icon: MapPinned, tone: "warning" },
  damaged: { Icon: PackageX, tone: "danger" },
  "addr-unknown": { Icon: MapPinOff, tone: "danger" },
  "other-exception": { Icon: AlertTriangle, tone: "danger" },
  // 逆物流
  "rv-reserve": { Icon: CalendarPlus, tone: "primary" },
  "rv-collect": { Icon: Boxes, tone: "primary" },
  "rv-reschedule": { Icon: CalendarClock, tone: "warning" },
  "rv-readdress": { Icon: MapPinned, tone: "warning" },
  "rv-pickup-done": { Icon: CheckCircle2, tone: "success" },
  "rv-pickup-fail": { Icon: XCircle, tone: "danger" },
  "rv-cancel": { Icon: CalendarX, tone: "danger" },
  // 站所
  "st-forward": { Icon: Send, tone: "primary" },
  "st-arrived": { Icon: PackageCheck, tone: "success" },
  "st-lost": { Icon: PackageSearch, tone: "danger" },
  "st-arrive-exception": { Icon: AlertTriangle, tone: "danger" },
  "st-wrong-station": { Icon: MapPinOff, tone: "danger" },
  "st-out-of-area": { Icon: Ban, tone: "danger" },
  "st-depart": { Icon: PackageOpen, tone: "primary" },
  // 取件驗收
  "ib-delay": { Icon: Clock, tone: "warning" },
  "ib-return-deliver": { Icon: Undo2, tone: "warning" },
  "ib-return-done": { Icon: CheckCircle2, tone: "success" },
};

// Keyed by route path (item.to) for non-action menu entries.
const BY_ROUTE: Record<string, MenuVisual> = {
  "/delivery/complete": { Icon: CheckCircle2, tone: "success" },
  "/delivery/merge": { Icon: Layers, tone: "primary" },
  "/cod": { Icon: Banknote, tone: "neutral" },
  "/inbound/collect": { Icon: Boxes, tone: "primary" },
  "/inbound/sort": { Icon: Split, tone: "primary" },
  "/station/return-depot": { Icon: Undo2, tone: "danger" },
  "/list/$kind": { Icon: ListChecks, tone: "neutral" },
};

export function resolveMenuVisual(to: string, id?: string): MenuVisual {
  if (id && BY_ID[id]) return BY_ID[id];
  if (BY_ROUTE[to]) return BY_ROUTE[to];
  return { Icon: PackageCheck, tone: "neutral" };
}
