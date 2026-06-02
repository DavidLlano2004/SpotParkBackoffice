"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Receipt,
  DollarSign,
  TrendingUp,
  Download,
  Search,
  Filter,
  Calendar,
} from "lucide-react";
import { cn } from "@utils/cn";
import { useRoleGuard } from "@hooks/useRoleGuard";

interface Invoice {
  id: string;
  number: string;
  company: string;
  parking: string;
  period: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  date: string;
  dueDate: string;
}

const INVOICES: Invoice[] = [
  {
    id: "i-001",
    number: "INV-2026-0601",
    company: "Universidad de Caldas",
    parking: "Parq. Universidad",
    period: "Mayo 2026",
    amount: 4850000,
    status: "paid",
    date: "2026-06-01",
    dueDate: "2026-06-15",
  },
  {
    id: "i-002",
    number: "INV-2026-0602",
    company: "CC Fundadores S.A.",
    parking: "Parq. CC Fundadores",
    period: "Mayo 2026",
    amount: 8200000,
    status: "pending",
    date: "2026-06-01",
    dueDate: "2026-06-20",
  },
  {
    id: "i-003",
    number: "INV-2026-0603",
    company: "Hotel Termales del Ruiz",
    parking: "Parq. Hotel Termales",
    period: "Mayo 2026",
    amount: 2350000,
    status: "paid",
    date: "2026-05-30",
    dueDate: "2026-06-14",
  },
  {
    id: "i-004",
    number: "INV-2026-0604",
    company: "Clínica de Caldas S.A.S",
    parking: "Parq. Clínica",
    period: "Mayo 2026",
    amount: 3750000,
    status: "overdue",
    date: "2026-05-28",
    dueDate: "2026-06-07",
  },
  {
    id: "i-005",
    number: "INV-2026-0605",
    company: "Aeropuerto del Café",
    parking: "Parq. Aeropuerto",
    period: "Mayo 2026",
    amount: 11200000,
    status: "pending",
    date: "2026-06-01",
    dueDate: "2026-06-18",
  },
  {
    id: "i-006",
    number: "INV-2026-0506",
    company: "Universidad de Caldas",
    parking: "Parq. Universidad",
    period: "Abril 2026",
    amount: 4620000,
    status: "paid",
    date: "2026-05-01",
    dueDate: "2026-05-15",
  },
  {
    id: "i-007",
    number: "INV-2026-0507",
    company: "CC Fundadores S.A.",
    parking: "Parq. CC Fundadores",
    period: "Abril 2026",
    amount: 7980000,
    status: "paid",
    date: "2026-05-01",
    dueDate: "2026-05-20",
  },
  {
    id: "i-008",
    number: "INV-2026-0508",
    company: "Clínica de Caldas S.A.S",
    parking: "Parq. Clínica",
    period: "Abril 2026",
    amount: 3520000,
    status: "paid",
    date: "2026-04-30",
    dueDate: "2026-05-14",
  },
];

const STATUS_CFG = {
  paid: { label: "Pagada", bg: "#E4F3E9", text: "#1F7A3D" },
  pending: { label: "Pendiente", bg: "#FBEFD6", text: "#9A5B0E" },
  overdue: { label: "Vencida", bg: "#FBE4E5", text: "#B4262B" },
};

export function FacturacionClient() {
  const { isSuperAdmin } = useRoleGuard();
  const [search, setSearch] = useState("");
  const [filterStatus, setStatus] = useState<"all" | Invoice["status"]>("all");

  const filtered = INVOICES.filter((inv) => {
    if (filterStatus !== "all" && inv.status !== filterStatus) return false;
    if (
      search &&
      !inv.company.toLowerCase().includes(search.toLowerCase()) &&
      !inv.number.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  const totalRev = INVOICES.reduce((s, i) => s + i.amount, 0);
  const paidRev = INVOICES.filter((i) => i.status === "paid").reduce(
    (s, i) => s + i.amount,
    0,
  );
  const pendingRev = INVOICES.filter((i) => i.status === "pending").reduce(
    (s, i) => s + i.amount,
    0,
  );
  const overdueRev = INVOICES.filter((i) => i.status === "overdue").reduce(
    (s, i) => s + i.amount,
    0,
  );

  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: "#F3F4EF" }}
        >
          <Receipt size={28} className="text-sp-t3" />
        </div>
        <div className="text-center">
          <div className="text-[16px] font-semibold text-sp-t1">
            Acceso restringido
          </div>
          <div className="text-[13px] text-sp-t3 mt-1">
            Esta sección es exclusiva para Super Admins
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1100px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1
            className="text-[22px] font-bold text-sp-t1"
            style={{ fontFamily: "var(--sp-display)" }}
          >
            Facturación
          </h1>
          <p className="text-[13px] text-sp-t2 mt-1">
            Gestión de facturas y cuentas por cobrar
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-4 h-10 rounded-xl text-[13px] font-semibold hover:opacity-85 transition-opacity"
          style={{ background: "var(--sp-ink)", color: "var(--sp-lime)" }}
        >
          <Download size={16} />
          Exportar
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: "Total facturado",
            value: `$${(totalRev / 1000000).toFixed(1)}M`,
            icon: <DollarSign size={18} />,
            color: "#3B82F6",
            bg: "#E5EEFD",
          },
          {
            label: "Cobrado",
            value: `$${(paidRev / 1000000).toFixed(1)}M`,
            icon: <TrendingUp size={18} />,
            color: "#3DA35D",
            bg: "#E4F3E9",
          },
          {
            label: "Por cobrar",
            value: `$${(pendingRev / 1000000).toFixed(1)}M`,
            icon: <Receipt size={18} />,
            color: "#E0A211",
            bg: "#FBEFD6",
          },
          {
            label: "Vencido",
            value: `$${(overdueRev / 1000000).toFixed(1)}M`,
            icon: <Receipt size={18} />,
            color: "#E5484D",
            bg: "#FBE4E5",
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
              {c.icon}
            </div>
            <div>
              <div className="text-[11px] text-sp-t3">{c.label}</div>
              <div className="text-[20px] font-bold text-sp-t1">{c.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{
          boxShadow: "var(--sp-sh-card)",
          border: "1px solid var(--sp-border-card)",
        }}
      >
        {/* Toolbar */}
        <div
          className="px-5 py-4 flex items-center gap-3"
          style={{ borderBottom: "1px solid var(--sp-border-card)" }}
        >
          <div className="relative flex-1 max-w-[280px]">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-sp-t3"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar empresa o número..."
              className="w-full h-9 pl-8 pr-3 rounded-xl border border-sp-border text-[12.5px] text-sp-t1 bg-sp-bg focus:outline-none focus:border-sp-ink/25"
            />
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            {(
              [
                { k: "all", l: "Todas" },
                { k: "paid", l: "Pagadas" },
                { k: "pending", l: "Pendientes" },
                { k: "overdue", l: "Vencidas" },
              ] as const
            ).map((f) => (
              <button
                key={f.k}
                onClick={() => setStatus(f.k)}
                className={cn(
                  "px-3 h-8 rounded-xl text-[12px] font-medium transition-colors",
                  filterStatus === f.k
                    ? "bg-sp-ink text-white"
                    : "bg-sp-bg text-sp-t2 hover:text-sp-t1",
                )}
              >
                {f.l}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--sp-border-card)" }}>
                {[
                  "Número",
                  "Empresa",
                  "Parqueadero",
                  "Período",
                  "Monto",
                  "Vence",
                  "Estado",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-2.5 text-[11px] font-semibold text-sp-t3 uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-sp-border/40">
              {filtered.map((inv, i) => {
                const s = STATUS_CFG[inv.status];
                return (
                  <motion.tr
                    key={inv.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-sp-bg/60 transition-colors"
                  >
                    <td className="px-5 py-3.5 text-[12px] font-mono font-semibold text-sp-t1">
                      {inv.number}
                    </td>
                    <td className="px-5 py-3.5 text-[12.5px] font-medium text-sp-t1">
                      {inv.company}
                    </td>
                    <td className="px-5 py-3.5 text-[12px] text-sp-t2">
                      {inv.parking}
                    </td>
                    <td className="px-5 py-3.5 text-[12px] text-sp-t2">
                      {inv.period}
                    </td>
                    <td className="px-5 py-3.5 text-[13px] font-bold text-sp-t1">
                      ${inv.amount.toLocaleString("es-CO")}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1 text-[12px] text-sp-t2">
                        <Calendar size={11} />
                        {new Date(inv.dueDate).toLocaleDateString("es-CO", {
                          day: "numeric",
                          month: "short",
                        })}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold"
                        style={{ background: s.bg, color: s.text }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {s.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button className="text-[11.5px] font-medium text-sp-t2 hover:text-sp-t1 transition-colors flex items-center gap-1">
                        <Download size={12} /> PDF
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
