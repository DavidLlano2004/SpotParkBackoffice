import { Card, CardHeader } from "@components/ui/Card";
import { MOCK_ACTIVITY } from "@features/parqueaderos/data/mock";
import { ACTIVITY_META } from "@constants/colors";

const activityIcons: Record<string, React.ReactNode> = {
  entry:       <span className="text-[13px]">🚗</span>,
  exit:        <span className="text-[13px]">↗</span>,
  reservation: <span className="text-[13px]">📅</span>,
  incident:    <span className="text-[13px]">⚠️</span>,
  worker:      <span className="text-[13px]">👤</span>,
};

export function DashboardActivityFeed() {
  return (
    <Card padding="lg">
      <CardHeader
        title="Actividad reciente"
        right={
          <span
            className="flex items-center gap-1.5 text-[11.5px] font-semibold"
            style={{ color: "var(--sp-green-tx)" }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full sp-pulse"
              style={{ background: "var(--sp-green)" }}
            />
            En vivo
          </span>
        }
      />
      <div className="max-h-[280px] overflow-y-auto no-sb -mx-1">
        {MOCK_ACTIVITY.map((a, i) => {
          const meta = ACTIVITY_META[a.kind];
          return (
            <div
              key={a.id}
              className="flex gap-2.5 py-2.5 px-1"
              style={{
                borderBottom:
                  i < MOCK_ACTIVITY.length - 1
                    ? "1px solid var(--sp-separator)"
                    : "none",
              }}
            >
              <div
                className="w-7 h-7 rounded-[9px] flex items-center justify-center shrink-0"
                style={{ background: meta.bg }}
              >
                {activityIcons[a.kind]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium leading-snug">{a.text}</div>
                <div className="flex gap-1.5 mt-0.5">
                  <span className="t-micro text-sp-t3">{a.parking}</span>
                  <span className="t-micro text-sp-t4">· {a.ago}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
