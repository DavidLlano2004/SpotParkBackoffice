import { Card, CardHeader } from "@components/ui/Card";
import { RevenueAreaChart } from "@features/dashboard/components/RevenueAreaChart";
import { OccupancyDonut } from "@features/dashboard/components/OccupancyDonut";
import {
  MOCK_REVENUE_SERIES,
  MOCK_VEHICLE_SPLIT,
} from "@features/parqueaderos/data/mock";
import { formatCOPk } from "@utils/formatCurrency";

interface Props {
  rev: number;
  occ: number;
}

export function DashboardCharts({ rev, occ }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3.5 mb-3.5">
      <Card className="col-span-2" padding="lg">
        <CardHeader
          title="Ingresos"
          right={<span className="t-micro text-sp-t3">Últimos 6 meses</span>}
        />
        <RevenueAreaChart data={MOCK_REVENUE_SERIES} />
        <div
          className="grid grid-cols-3 gap-2.5 mt-3 pt-3.5"
          style={{ borderTop: "1px solid var(--sp-separator)" }}
        >
          {[
            [
              "Total periodo",
              formatCOPk(MOCK_REVENUE_SERIES.reduce((s, d) => s + d.value, 0)),
            ],
            ["Promedio diario", formatCOPk(rev / 30)],
            ["Mejor día", "$2.1M"],
          ].map(([label, val]) => (
            <div key={label}>
              <div className="t-micro upper text-sp-t3 text-[10px]">{label}</div>
              <div
                className="tnum text-[18px] font-bold mt-0.5"
                style={{ fontFamily: "var(--sp-display)" }}
              >
                {val}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card padding="lg">
        <CardHeader title="Ocupación por tipo" />
        <OccupancyDonut data={MOCK_VEHICLE_SPLIT} totalOcc={occ} />
      </Card>
    </div>
  );
}
