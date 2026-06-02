import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { Screen } from "@/components/app/Screen";
import { store, useStore } from "@/lib/store";

export const Route = createFileRoute("/messages")({
  head: () => ({
    meta: [
      { title: "訊息紀錄 — 派派通" },
      { name: "description", content: "與運務所之間的訊息往來紀錄。" },
    ],
  }),
  component: Messages,
});

function Messages() {
  const messages = useStore((s) => s.messages);
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  function send() {
    const t = text.trim();
    if (!t) return;
    store.sendMessage(t);
    setText("");
  }

  return (
    <Screen
      title="訊息紀錄"
      hideTabBar
      footer={
        <div className="flex items-center gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="輸入訊息回報運務所…"
            className="h-12 flex-1 rounded-xl border border-border bg-card px-4 text-base outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            onClick={send}
            aria-label="送出訊息"
            disabled={!text.trim()}
            className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground disabled:opacity-40"
          >
            <Send size={20} />
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.from === "me" ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-base font-medium ${
                m.from === "me"
                  ? "rounded-br-md bg-primary text-primary-foreground"
                  : "rounded-bl-md border border-border bg-card"
              }`}
            >
              {m.text}
            </div>
            <time className="mt-1 px-1 font-mono text-[11px] text-muted-foreground">
              {m.from === "me" ? "我" : "運務所"} · {m.time}
            </time>
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </Screen>
  );
}
