import { useRouter } from "@tanstack/react-router";
import { Undo2 } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/lib/store";

export function FloatingBack() {
  const enabled = useStore((s) => s.floatingEnabled);
  const router = useRouter();
  const [pos, setPos] = useState({ y: 0 });

  if (!enabled) return null;

  return (
    <button
      aria-label="返回上一頁"
      onClick={() => router.history.back()}
      style={{ transform: `translateY(${pos.y}px)` }}
      onPointerDown={(e) => {
        const startY = e.clientY - pos.y;
        const move = (ev: PointerEvent) =>
          setPos({ y: Math.max(-260, Math.min(40, ev.clientY - startY)) });
        const up = () => {
          window.removeEventListener("pointermove", move);
          window.removeEventListener("pointerup", up);
        };
        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", up);
      }}
      className="fixed bottom-44 right-4 z-30 grid size-12 touch-none place-items-center rounded-full border border-border bg-card/90 text-foreground shadow-lg backdrop-blur active:scale-95"
    >
      <Undo2 size={22} />
    </button>
  );
}
