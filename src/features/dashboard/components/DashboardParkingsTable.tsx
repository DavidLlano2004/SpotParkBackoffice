import Link from "next/link";
import { Card, CardHeader } from "@components/ui/Card";
import { MOCK_PARKINGS } from "@features/parqueaderos/data/mock";
import { formatCOPk } from "@utils/formatCurrency";
import { MiniSparkline } from "@features/dashboard/components/MiniSparkline";

export function DashboardParkingsTable() {
  const activeParkings = MOCK_PARKINGS.filter((p) => p.status === "active").sort(
    (a, b) => b.rev - a.rev,
  );

  return (
    <Card className="col-span-2" padding="lg">
      <CardHeader
        title="Rendimiento por parqueadero"
        right={
          <Link
            href="/parqueaderos"
            className="text-[13px] font-semibold"
            style={{ color: "var(--sp-lime-deep)" }}
          >
            Ver todos →
          </Link>
        }
      />
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--sp-separator)" }}>
            {["Parqueadero", "Ingresos", "Ocupación", "Reservas", "Tendencia"].map(
              (h) => (
                <th
                  key={h}
                  className="t-micro upper text-sp-t3 text-[11px] text-left px-2 py-2.5"
                >
                  {h}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {activeParkings.map((p) => (
            <tr
              key={p.id}
              className="cursor-pointer hover:bg-sp-elevated/40 transition-colors"
              style={{ borderBottom: "1px solid var(--sp-separator)" }}
            >
              <td className="px-2 py-3">
                <div className="font-semibold text-[13.5px]">{p.short}</div>
                <div className="t-micro text-sp-t3">{p.city}</div>
              </td>
              <td className="px-2 py-3 tnum font-semibold">{formatCOPk(p.rev)}</td>
              <td className="px-2 py-3">
                <OccupancyBar occ={p.occ} />
              </td>
              <td className="px-2 py-3 tnum">{p.reservas}</td>
              <td className="px-2 py-3">
                <MiniSparkline
                  data={p.trend}
                  up={p.trend[p.trend.length - 1] >= p.trend[0]}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function OccupancyBar({ occ }: { occ: number }) {
  const color =
    occ > 0.9 ? "var(--sp-red)" : occ > 0.7 ? "var(--sp-yellow)" : "var(--sp-green)";

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-sp-elevated overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${Math.round(occ * 100)}%`, background: color }}
        />
      </div>
      <span className="tnum text-xs text-sp-t2 w-8">{Math.round(occ * 100)}%</span>
    </div>
  );
}
