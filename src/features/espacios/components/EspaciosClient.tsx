"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Grid3X3, Search, Filter, Car, Bike } from "lucide-react";
import { cn } from "@utils/cn";
import type { SpaceStatus } from "@types-sp/parking.types";

const STATUS_CFG: Record<
  SpaceStatus,
  { label: string; bg: string; text: string }
> = {
  free: { label: "Libre", bg: "#E4F3E9", text: "#1F7A3D" },
  occupied: { label: "Ocupado", bg: "#FBE4E5", text: "#B4262B" },
  reserved: { label: "Reservado", bg: "#FBEFD6", text: "#9A5B0E" },
  disabled: { label: "Bloqueado", bg: "#F3F4EF", text: "#6B7280" },
  maintenance: { label: "Mant.", bg: "#E5EEFD", text: "#1D5FD6" },
};

const MOCK_ZONES = [
  {
    id: "UC-A",
    parkingId: "p1",
    zone: "A",
    type: "car",
    total: 24,
    free: 8,
    occupied: 12,
    reserved: 4,
    disabled: 0,
  },
  {
    id: "UC-B",
    parkingId: "p1",
    zone: "B",
    type: "car",
    total: 24,
    free: 6,
    occupied: 14,
    reserved: 2,
    disabled: 2,
  },
  {
    id: "UC-M",
    parkingId: "p1",
    zone: "M",
    type: "moto",
    total: 30,
    free: 10,
    occupied: 18,
    reserved: 2,
    disabled: 0,
  },
  {
    id: "UC-V",
    parkingId: "p1",
    zone: "V",
    type: "bike",
    total: 20,
    free: 12,
    occupied: 6,
    reserved: 2,
    disabled: 0,
  },
  {
    id: "CC-A",
    parkingId: "p2",
    zone: "A",
    type: "car",
    total: 40,
    free: 15,
    occupied: 20,
    reserved: 5,
    disabled: 0,
  },
  {
    id: "CC-B",
    parkingId: "p2",
    zone: "B",
    type: "car",
    total: 40,
    free: 10,
    occupied: 26,
    reserved: 4,
    disabled: 0,
  },
  {
    id: "CC-M",
    parkingId: "p2",
    zone: "M",
    type: "moto",
    total: 50,
    free: 20,
    occupied: 25,
    reserved: 5,
    disabled: 0,
  },
  {
    id: "HO-A",
    parkingId: "p3",
    zone: "A",
    type: "car",
    total: 35,
    free: 18,
    occupied: 12,
    reserved: 5,
    disabled: 0,
  },
];

const parkingNames: Record<string, string> = {
  p1: "Parqueadero Universidad de Caldas",
  p2: "Parqueadero Centro Comercial Fundadores",
  p3: "Parqueadero Hotel Termales",
};

function OccBar({
  free,
  occupied,
  reserved,
  total,
}: {
  free: number;
  occupied: number;
  reserved: number;
  total: number;
}) {
  return (
    <div
      className="h-2 rounded-full overflow-hidden flex"
      style={{ background: "#F3F4EF" }}
    >
      <div
        style={{ width: `${(occupied / total) * 100}%`, background: "#E5484D" }}
        className="h-full"
      />
      <div
        style={{ width: `${(reserved / total) * 100}%`, background: "#E0A211" }}
        className="h-full"
      />
      <div
        style={{ width: `${(free / total) * 100}%`, background: "#3DA35D" }}
        className="h-full"
      />
    </div>
  );
}

export function EspaciosClient() {
  const [search, setSearch] = useState("");
  const [filterType, setType] = useState<"all" | "car" | "moto" | "bike">(
    "all",
  );
  const [filterPark, setPark] = useState<string>("all");

  const totalSpaces = MOCK_ZONES.reduce((s, z) => s + z.total, 0);
  const totalFree = MOCK_ZONES.reduce((s, z) => s + z.free, 0);
  const totalOccupied = MOCK_ZONES.reduce((s, z) => s + z.occupied, 0);
  const globalOcc = Math.round((totalOccupied / totalSpaces) * 100);

  const filtered = MOCK_ZONES.filter((z) => {
    if (filterType !== "all" && z.type !== filterType) return false;
    if (filterPark !== "all" && z.parkingId !== filterPark) return false;
    if (
      search &&
      !parkingNames[z.parkingId].toLowerCase().includes(search.toLowerCase()) &&
      !z.zone.includes(search.toUpperCase())
    )
      return false;
    return true;
  });

  return (
    <div className="max-w-[1100px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1
            className="text-[22px] font-bold text-sp-t1"
            style={{ fontFamily: "var(--sp-display)" }}
          >
            Espacios
          </h1>
          <p className="text-[13px] text-sp-t2 mt-1">
            Vista global de todos los espacios en tiempo real
          </p>
        </div>
        <div
          className="px-4 py-2 rounded-xl text-[12px] font-medium flex items-center gap-2"
          style={{
            background: "#E4F3E9",
            color: "#1F7A3D",
            border: "1px solid #B7E4C7",
          }}
        >
          <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
          Datos en tiempo real
        </div>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: "Total espacios",
            value: totalSpaces,
            color: "#3B82F6",
            bg: "#E5EEFD",
          },
          {
            label: "Libres",
            value: totalFree,
            color: "#3DA35D",
            bg: "#E4F3E9",
          },
          {
            label: "Ocupados",
            value: totalOccupied,
            color: "#E5484D",
            bg: "#FBE4E5",
          },
          {
            label: "Ocupación global",
            value: `${globalOcc}%`,
            color: "#E0A211",
            bg: "#FBEFD6",
          },
        ].map((c) => (
          <div
            key={c.label}
            className="bg-white rounded-2xl p-4 flex items-center gap-3"
            style={{
              boxShadow: "var(--sp-sh-card)",
              border: "1px solid var(--sp-border-card)",
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: c.bg, color: c.color }}
            >
              <Grid3X3 size={18} />
            </div>
            <div>
              <div className="text-[11px] text-sp-t3">{c.label}</div>
              <div className="text-[22px] font-bold text-sp-t1">{c.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-sp-t3"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar parqueadero o zona..."
            className="h-9 pl-8 pr-3 rounded-xl border border-sp-border text-[12.5px] text-sp-t1 bg-white focus:outline-none focus:border-sp-ink/25 w-60"
          />
        </div>
        <div className="flex gap-1.5">
          {(
            [
              { k: "all", l: "Todos" },
              { k: "car", l: "Autos" },
              { k: "moto", l: "Motos" },
              { k: "bike", l: "Bicis" },
            ] as const
          ).map((f) => (
            <button
              key={f.k}
              onClick={() => setType(f.k)}
              className={cn(
                "px-3 h-9 rounded-xl text-[12px] font-medium transition-colors",
                filterType === f.k
                  ? "bg-sp-ink text-white"
                  : "bg-white text-sp-t2 hover:text-sp-t1",
              )}
              style={
                filterType !== f.k
                  ? { border: "1px solid var(--sp-border-card)" }
                  : undefined
              }
            >
              {f.l}
            </button>
          ))}
        </div>
        <select
          value={filterPark}
          onChange={(e) => setPark(e.target.value)}
          className="h-9 px-3 rounded-xl border border-sp-border text-[12.5px] text-sp-t2 bg-white focus:outline-none ml-auto"
        >
          <option value="all">Todos los parqueaderos</option>
          {Object.entries(parkingNames).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </div>

      {/* Zone cards grid */}
      <div className="grid grid-cols-2 gap-4">
        {filtered.map((z, i) => {
          const occ = Math.round((z.occupied / z.total) * 100);
          return (
            <motion.div
              key={z.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl p-5"
              style={{
                boxShadow: "var(--sp-sh-card)",
                border: "1px solid var(--sp-border-card)",
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-sp-t1">
                      Zona {z.zone}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-sp-t3">
                      {z.type === "bike" ? (
                        <Bike size={12} />
                      ) : (
                        <Car size={12} />
                      )}
                      {z.type === "car"
                        ? "Autos"
                        : z.type === "moto"
                          ? "Motos"
                          : "Bicicletas"}
                    </span>
                  </div>
                  <div className="text-[11.5px] text-sp-t3 mt-0.5 truncate max-w-[260px]">
                    {parkingNames[z.parkingId]}
                  </div>
                </div>
                <div
                  className="px-2 py-0.5 rounded-full text-[11px] font-semibold"
                  style={{
                    background:
                      occ >= 80 ? "#FBE4E5" : occ >= 50 ? "#FBEFD6" : "#E4F3E9",
                    color:
                      occ >= 80 ? "#B4262B" : occ >= 50 ? "#9A5B0E" : "#1F7A3D",
                  }}
                >
                  {occ}% ocupado
                </div>
              </div>

              <OccBar
                free={z.free}
                occupied={z.occupied}
                reserved={z.reserved}
                total={z.total}
              />

              <div className="flex gap-4 mt-3">
                {[
                  { label: "Libres", value: z.free, color: "#3DA35D" },
                  { label: "Ocupados", value: z.occupied, color: "#E5484D" },
                  { label: "Reservados", value: z.reserved, color: "#E0A211" },
                  { label: "Total", value: z.total, color: "#6B7280" },
                ].map((s) => (
                  <div key={s.label} className="flex-1">
                    <div className="text-[10px] text-sp-t3">{s.label}</div>
                    <div
                      className="text-[15px] font-bold"
                      style={{ color: s.color }}
                    >
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
