import { ScanLine } from "lucide-react";
import { haptic } from "@/lib/haptic";

export function ScanInput({
  value,
  onChange,
  onScan,
  placeholder = "掃描或輸入貨號",
  autoFocus,
}: {
  value: string;
  onChange: (v: string) => void;
  onScan?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  function simulateScan() {
    // mock a barcode scan with a random 5-digit tracking number
    const n = Math.floor(10000 + Math.random() * 89999).toString();
    onChange(n);
    onScan?.();
  }

  return (
    <div className="flex h-16 gap-2">
      <div className="flex flex-1 flex-col justify-center rounded-xl border border-border bg-card px-4 focus-within:ring-2 focus-within:ring-ring">
        <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
          貨號
        </label>
        <input
          autoFocus={autoFocus}
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent font-mono text-lg font-semibold tracking-wider outline-none placeholder:text-muted-foreground/40"
        />
      </div>
      <button
        type="button"
        aria-label="掃描條碼"
        onClick={simulateScan}
        onPointerDown={() => haptic()}
        className="flex aspect-square h-full flex-col items-center justify-center gap-0.5 rounded-xl bg-primary text-primary-foreground shadow-press transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        style={{ ["--shadow-color" as string]: "oklch(0 0 0 / 50%)" }}
      >
        <ScanLine size={26} strokeWidth={2.4} />
        <span className="text-[10px] font-extrabold">掃描</span>
      </button>
    </div>
  );
}
