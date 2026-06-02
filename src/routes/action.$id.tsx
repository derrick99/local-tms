import { createFileRoute, notFound } from "@tanstack/react-router";
import { ACTIONS } from "@/lib/actions";
import { ScanUpdateScreen } from "@/components/app/ScanUpdateScreen";

export const Route = createFileRoute("/action/$id")({
  component: ActionScreen,
  notFoundComponent: () => (
    <div className="grid min-h-dvh place-items-center p-8 text-center text-muted-foreground">
      查無此動作
    </div>
  ),
});

function ActionScreen() {
  const { id } = Route.useParams();
  const action = ACTIONS[id];
  if (!action) throw notFound();
  return <ScanUpdateScreen action={action} />;
}
