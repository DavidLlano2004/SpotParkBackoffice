import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const INSIGHTS = [
  {
    type: "Oportunidad",
    body: "El parqueadero Terminal tiene 40% de ocupación los miércoles AM. Considera una tarifa reducida para atraer más usuarios.",
    action: "Ver análisis",
  },
  {
    type: "Alerta",
    body: "Los ingresos de Hosp. Santa Sofía cayeron 18% esta semana. El vigilante Pedro Sáenz tiene 3 anomalías sin resolver.",
    action: "Investigar",
  },
  {
    type: "Predicción",
    body: "Próximo viernes festivo: demanda proyectada +45%. Considera reactivar La Estación para ese día.",
    action: "Planear",
  },
];

export function DashboardAIInsights() {
  return (
    <div
      className="rounded-2xl p-[18px] relative overflow-hidden"
      style={{
        background: "var(--sp-lime-bg)",
        border: "1px solid var(--sp-lime-tint)",
      }}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl"
        style={{ background: "var(--sp-lime)" }}
      />
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={18} style={{ color: "var(--sp-lime-deep)" }} />
        <span
          className="text-[14.5px] font-semibold"
          style={{ color: "var(--sp-lime-deep)" }}
        >
          SpotPark AI · Insights del negocio
        </span>
      </div>
      <div
        className="grid grid-cols-3 gap-6 pt-4"
        style={{ borderTop: "1px solid var(--sp-lime-tint)" }}
      >
        {INSIGHTS.map(({ type, body, action }, i) => (
          <motion.div
            key={type}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 + i * 0.12 }}
          >
            <div
              className="t-micro upper text-[10px] mb-1.5"
              style={{ color: "var(--sp-lime-deep)" }}
            >
              {type}
            </div>
            <p className="t-small leading-[1.5] m-0">{body}</p>
            <button
              className="text-[12.5px] font-semibold mt-2 p-0"
              style={{
                background: "none",
                border: "none",
                color: "var(--sp-lime-deep)",
                cursor: "pointer",
              }}
            >
              {action} →
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
