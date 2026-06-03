"use client";

import ButtonFilter from "@/features/dashboard/components/ui/ButtonFilter";

const DATE_RANGES = [
  { k: "hoy", l: "Hoy" },
  { k: "semana", l: "Esta semana" },
  { k: "mes", l: "Este mes" },
  { k: "ano", l: "Este año" },
  { k: "personalizado", l: "Personalizado" },
];

interface Props {
  range: string;
  onRangeChange: (k: string) => void;
}

export function DashboardHeader({ range, onRangeChange }: Props) {
  const today = new Date().toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="flex items-end justify-between mb-5">
      <div>
        <h1 className="t-h1">Dashboard</h1>
        <p className="t-small mt-0.5 capitalize" style={{ color: "var(--sp-t3)" }}>
          {today}
        </p>
      </div>
      <div className="flex gap-1.5">
        {DATE_RANGES.map(({ k, l }) => (
          <ButtonFilter
            key={k}
            k={k}
            range={range}
            textButton={l}
            actionButton={() => onRangeChange(k)}
          />
        ))}
      </div>
    </div>
  );
}
