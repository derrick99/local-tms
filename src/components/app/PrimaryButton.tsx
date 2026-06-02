import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { haptic } from "@/lib/haptic";

export function PrimaryButton({
  children,
  loading,
  tone = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  loading?: boolean;
  tone?: "primary" | "dark" | "success" | "destructive";
}) {
  const tones = {
    primary: "bg-primary text-primary-foreground",
    dark: "bg-foreground text-background",
    success: "bg-success text-success-foreground",
    destructive: "bg-destructive text-destructive-foreground",
  };
  return (
    <button
      {...props}
      onPointerDown={(e) => {
        haptic();
        props.onPointerDown?.(e);
      }}
      disabled={loading || props.disabled}
      className={`flex h-16 w-full select-none items-center justify-center gap-2.5 rounded-2xl text-xl font-extrabold tracking-wide ring-1 ring-inset ring-black/10 shadow-[0_6px_0_0_var(--shadow-color)] transition-transform duration-100 ease-out [will-change:transform] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring active:translate-y-[6px] active:shadow-[0_0_0_0_var(--shadow-color)] disabled:translate-y-0 disabled:opacity-40 disabled:shadow-none ${tones[tone]} ${className}`}
    >
      {loading && <Loader2 className="animate-spin" size={22} />}
      {children}
    </button>
  );
}
