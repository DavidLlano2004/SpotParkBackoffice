import {
  DollarSign,
  CalendarCheck,
  ParkingSquare,
  Building2,
  Users,
  AlertTriangle,
} from "lucide-react";
import { MetricCard } from "@components/ui/MetricCard";

export interface DashboardTotals {
  rev: number;
  reservas: number;
  occ: number;
  active: number;
  total: number;
  openIncidents: number;
}

interface Props {
  totals: DashboardTotals;
}

export function DashboardMetrics({ totals }: Props) {
  return (
    <>
      <div className="grid grid-cols-3 gap-3.5 mb-3.5">
        <MetricCard
          icon={<DollarSign size={19} />}
          iconBg="var(--sp-green-bg)"
          label="Ingresos totales"
          value={totals.rev}
          prefix="$"
          trend="12% vs mes anterior"
          trendDir="up"
          delay={0}
        />
        <MetricCard
          icon={<CalendarCheck size={19} />}
          iconBg="var(--sp-blue-bg)"
          label="Reservas completadas"
          value={totals.reservas}
          trend="8% vs mes anterior"
          trendDir="up"
          delay={0.05}
        />
        <MetricCard
          icon={<ParkingSquare size={19} />}
          iconBg="var(--sp-lime-bg)"
          label="Ocupación promedio"
          value={Math.round(totals.occ * 100)}
          suffix="%"
          ring={totals.occ}
          trend="2% vs mes anterior"
          trendDir="down"
          delay={0.1}
        />
      </div>

      <div className="grid grid-cols-3 gap-3.5 mb-5">
        <MetricCard
          icon={<Building2 size={19} />}
          iconBg="var(--sp-elevated)"
          label="Parqueaderos activos"
          value={totals.active}
          sub={`de ${totals.total} totales`}
          delay={0.15}
        />
        <MetricCard
          icon={<Users size={19} />}
          iconBg="var(--sp-blue-bg)"
          label="Trabajadores activos"
          value={12}
          sub="3 en turno ahora"
          subColor="var(--sp-green-tx)"
          delay={0.2}
        />
        <MetricCard
          icon={<AlertTriangle size={19} />}
          iconBg="var(--sp-yellow-bg)"
          label="Incidentes abiertos"
          value={totals.openIncidents}
          sub="Requieren atención"
          subColor="var(--sp-orange)"
          warn
          delay={0.25}
        />
      </div>
    </>
  );
}
