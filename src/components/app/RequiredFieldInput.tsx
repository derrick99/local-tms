import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RequiredField as RF } from "@/lib/actions";
import { BOX_SIZES, EXCEPTION_REASONS, FORWARDERS } from "@/lib/actions";

function tomorrow() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export const requiredDefault = (kind: RF): string =>
  kind === "date" ? tomorrow() : kind === "size" ? "S60" : "";

export function RequiredFieldInput({
  kind,
  value,
  onChange,
}: {
  kind: RF;
  value: string;
  onChange: (v: string) => void;
}) {
  if (kind === "none") return null;

  const labelMap: Record<Exclude<RF, "none">, string> = {
    address: "新配送地址",
    date: "另約日期",
    reason: "異常原因",
    size: "集貨尺寸",
    forwarder: "轉寄物流商",
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
        {labelMap[kind]} <span className="text-destructive">*</span>
      </label>

      {kind === "address" && (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="輸入完整新地址"
          className="min-h-14 rounded-xl border border-border bg-card px-4 text-base font-medium outline-none focus:ring-2 focus:ring-ring"
        />
      )}

      {kind === "date" && (
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-14 rounded-xl border border-border bg-card px-4 text-base font-medium outline-none focus:ring-2 focus:ring-ring"
        />
      )}

      {kind === "reason" && (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="!h-14 rounded-xl border-border bg-card px-4 text-base">
            <SelectValue placeholder="請選擇原因" />
          </SelectTrigger>
          <SelectContent>
            {EXCEPTION_REASONS.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {kind === "size" && (
        <Select value={value || "S60"} onValueChange={onChange}>
          <SelectTrigger className="!h-14 rounded-xl border-border bg-card px-4 text-base">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {BOX_SIZES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {kind === "forwarder" && (
        <div className="grid grid-cols-2 gap-2">
          <Select
            value={value.split("|")[0] || ""}
            onValueChange={(v) => onChange(`${v}|${value.split("|")[1] || ""}`)}
          >
            <SelectTrigger className="!h-14 rounded-xl border-border bg-card text-base">
              <SelectValue placeholder="正/逆向" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="正向">正向</SelectItem>
              <SelectItem value="逆向">逆向</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={value.split("|")[1] || ""}
            onValueChange={(v) => onChange(`${value.split("|")[0] || ""}|${v}`)}
          >
            <SelectTrigger className="!h-14 rounded-xl border-border bg-card text-base">
              <SelectValue placeholder="物流商" />
            </SelectTrigger>
            <SelectContent>
              {FORWARDERS.map((f) => (
                <SelectItem key={f} value={f}>
                  {f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}

export function requiredFilled(kind: RF, value: string): boolean {
  if (kind === "none") return true;
  if (kind === "forwarder") {
    const [a, b] = value.split("|");
    return Boolean(a && b);
  }
  return value.trim().length > 0;
}
