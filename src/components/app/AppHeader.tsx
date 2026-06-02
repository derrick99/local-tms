import { Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft, MoreVertical, Sun, Moon } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { store, useStore, unreadCount, pendingCount } from "@/lib/store";

export function AppHeader({
  title,
  showBack = true,
}: {
  title: string;
  showBack?: boolean;
}) {
  const router = useRouter();
  const account = useStore((s) => s.account);
  const floating = useStore((s) => s.floatingEnabled);
  const theme = useStore((s) => s.theme);
  const unread = useStore(() => unreadCount());
  const pending = useStore(() => pendingCount());
  const [confirmLogout, setConfirmLogout] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface px-4 pb-2.5 pt-3">
      <div className="flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-3">
          {showBack ? (
            <button
              aria-label="返回"
              onClick={() => router.history.back()}
              className="-ml-1 grid size-9 place-items-center rounded-lg active:bg-accent"
            >
              <ArrowLeft size={22} />
            </button>
          ) : (
            <span aria-hidden className="-ml-1 grid size-9 place-items-center opacity-25">
              <ArrowLeft size={22} />
            </span>
          )}
          <h1 className="truncate text-lg font-bold tracking-tight">{title}</h1>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              aria-label="更多"
              className="relative grid size-9 place-items-center rounded-lg active:bg-accent"
            >
              <MoreVertical size={22} />
              {unread > 0 && (
                <span className="absolute right-1.5 top-1.5 size-2.5 rounded-full bg-destructive ring-2 ring-surface" />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem asChild>
              <Link to="/notifications" className="flex justify-between">
                通知
                {unread > 0 && (
                  <span className="rounded bg-destructive px-1.5 text-xs font-bold text-destructive-foreground">
                    {unread}
                  </span>
                )}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/pending" className="flex justify-between">
                暫存列表
                {pending > 0 && (
                  <span className="rounded bg-warning px-1.5 text-xs font-bold text-warning-foreground">
                    {pending}
                  </span>
                )}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/messages">訊息紀錄</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/route-scan">路線掃碼</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/password">變更密碼</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                store.toggleTheme();
              }}
              className="flex justify-between"
            >
              <span className="flex items-center gap-2">
                {theme === "light" ? <Sun size={16} /> : <Moon size={16} />}
                淺色模式
              </span>
              <Switch checked={theme === "light"} className="pointer-events-none" />
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                store.toggleFloating();
              }}
              className="flex justify-between"
            >
              浮動返回鈕
              <Switch checked={floating} className="pointer-events-none" />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setConfirmLogout(true);
              }}
              className="text-destructive focus:text-destructive"
            >
              登出
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <p className="mt-1 flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <span className="size-2 rounded-full bg-success" />
        帳號：{account ?? "—"}
      </p>

      <AlertDialog open={confirmLogout} onOpenChange={setConfirmLogout}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>確定要登出？</AlertDialogTitle>
            <AlertDialogDescription>
              登出後尚未上傳的暫存資料仍會保留於本機。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                store.logout();
                router.navigate({ to: "/login" });
              }}
            >
              登出
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
}
