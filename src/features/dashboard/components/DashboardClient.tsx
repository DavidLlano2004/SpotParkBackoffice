"use client";

import { useState } from "react";
import { MOCK_PARKINGS } from "@features/parqueaderos/data/mock";
import { MOCK_INCIDENTS } from "@features/incidentes/data/mock";
import { DashboardHeader } from "@features/dashboard/components/DashboardHeader";
import { DashboardMetrics } from "@features/dashboard/components/DashboardMetrics";
import { DashboardCharts } from "@features/dashboard/components/DashboardCharts";
import { DashboardParkingsTable } from "@features/dashboard/components/DashboardParkingsTable";
import { DashboardActivityFeed } from "@features/dashboard/components/DashboardActivityFeed";
import { DashboardAIInsights } from "@features/dashboard/components/DashboardAIInsights";

const activeParkings = MOCK_PARKINGS.filter((p) => p.status === "active");

const totals = {
  rev:          MOCK_PARKINGS.reduce((s, p) => s + p.rev, 0),
  reservas:     MOCK_PARKINGS.reduce((s, p) => s + p.reservas, 0),
  occ:          activeParkings.reduce((s, p) => s + p.occ, 0) / activeParkings.length,
  active:       activeParkings.length,
  total:        MOCK_PARKINGS.length,
  openIncidents: MOCK_INCIDENTS.filter((i) => i.status !== "resolved").length,
};

export function DashboardClient() {
  const [range, setRange] = useState("mes");

  return (
    <div className="w-full flex justify-center">
      <div className="max-w-350">
        <DashboardHeader range={range} onRangeChange={setRange} />
        <DashboardMetrics totals={totals} />
        <DashboardCharts rev={totals.rev} occ={totals.occ} />
        <div className="grid grid-cols-3 gap-3.5 mb-3.5">
          <DashboardParkingsTable />
          <DashboardActivityFeed />
        </div>
        <DashboardAIInsights />
      </div>
    </div>
  );
}
