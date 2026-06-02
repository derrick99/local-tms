import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { MapPin, Plus, Trash2, Navigation } from "lucide-react";
import { Screen } from "@/components/app/Screen";
import { PrimaryButton } from "@/components/app/PrimaryButton";
import { useStore, store } from "@/lib/store";

export const Route = createFileRoute("/route-sort")({
  head: () => ({ meta: [{ title: "自動路順 — 派派通" }] }),
  component: RouteSort,
});

function RouteSort() {
  const router = useRouter();
  const locations = useStore((s) => s.savedLocations);
  const [origin, setOrigin] = useState("gps");

  return (
    <Screen
      title="自動路順排序"
      activeTab="delivery"
      footer={
        <PrimaryButton
          onClick={() => {
            toast.success("已產生最佳配送順序");
            router.history.back();
          }}
        >
          開始排序
        </PrimaryButton>
      }
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm font-bold text-muted-foreground">選擇出發點</p>
        <button
          onClick={() => setOrigin("gps")}
          className={`flex items-center gap-3 rounded-xl border px-4 py-4 font-bold ${
            origin === "gps" ? "border-primary bg-primary/10 text-primary" : "border-border bg-card"
          }`}
        >
          <Navigation size={20} /> 使用目前位置（GPS）
        </button>

        <div className="flex items-center gap-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">已儲存位置</h2>
          <span className="h-px flex-1 bg-border" />
        </div>
        {locations.map((l) => (
          <button
            key={l.id}
            onClick={() => setOrigin(l.id)}
            className={`flex items-center justify-between rounded-xl border px-4 py-4 font-bold ${
              origin === l.id ? "border-primary bg-primary/10 text-primary" : "border-border bg-card"
            }`}
          >
            <span className="flex items-center gap-3">
              <MapPin size={20} /> {l.name}
            </span>
            <Trash2
              size={18}
              className="text-muted-foreground"
              onClick={(e) => {
                e.stopPropagation();
                store.removeSavedLocation(l.id);
              }}
            />
          </button>
        ))}
        <button
          onClick={() => store.addSavedLocation(`新位置 ${locations.length + 1}`)}
          className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3 font-bold text-muted-foreground active:bg-accent"
        >
          <Plus size={18} /> 新增位置
        </button>
      </div>
    </Screen>
  );
}
