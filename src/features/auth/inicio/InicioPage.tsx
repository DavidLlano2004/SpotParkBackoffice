"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const T = { duration: 0.22, ease: [0.2, 0.8, 0.2, 1] as const };
const BASE_SHADOW =
  "0 1px 2px rgba(15,17,21,.04),0 4px 16px rgba(15,17,21,.05)";

/* Children read the parent's whileHover="hover" via variant propagation */
const barV = {
  rest: { scaleX: 0 },
  hover: { scaleX: 1, transition: { duration: 0.25 } },
};
const tileV = {
  rest: { scale: 1, rotate: 0 },
  hover: { scale: 1.06, rotate: -3, transition: T },
};
const arrowOpsV = {
  rest: { x: 0, boxShadow: "0 6px 18px rgba(148,195,34,.40)" },
  hover: { x: 4, boxShadow: "0 10px 28px rgba(148,195,34,.70)", transition: T },
};
const arrowAdminV = {
  rest: { x: 0, boxShadow: "0 6px 18px rgba(59,130,246,.42)" },
  hover: { x: 4, boxShadow: "0 10px 28px rgba(59,130,246,.70)", transition: T },
};

/* Card-level hover: y-lift + shadow + border color */
const opsCardV = {
  hover: {
    y: -7,
    boxShadow: "0 22px 50px rgba(0,0,0,.32)",
    borderColor: "#C6F24E",
    transition: T,
  },
};
const adminCardV = {
  hover: {
    y: -7,
    boxShadow: "0 22px 50px rgba(0,0,0,.32)",
    borderColor: "#3B82F6",
    transition: T,
  },
};

const opsFeats = [
  "Escaneo de placas",
  "Mapa de espacios",
  "Turnos",
  "Incidentes",
];
const adminFeats = ["Dashboard", "Reportes", "Tarifas", "Empresas"];

export default function InicioPage() {
  const router = useRouter();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "1") router.push("/vigilante-login");
      if (e.key === "2") router.push("/login");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [router]);

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "var(--sp-ink)", padding: "48px 28px" }}
    >
      {/* Grid overlay */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px)`,
          backgroundSize: "46px 46px",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 70% at 50% 42%,#000 35%,transparent 78%)",
          maskImage:
            "radial-gradient(ellipse 80% 70% at 50% 42%,#000 35%,transparent 78%)",
        }}
      />
      <div
        className="fixed rounded-full pointer-events-none z-0"
        style={{
          width: 520,
          height: 520,
          background: "rgba(198,242,78,.16)",
          filter: "blur(70px)",
          top: -160,
          left: -120,
        }}
      />
      <div
        className="fixed rounded-full pointer-events-none z-0"
        style={{
          width: 440,
          height: 440,
          background: "rgba(59,130,246,.12)",
          filter: "blur(70px)",
          bottom: -180,
          right: -100,
        }}
      />

      <div className="relative z-10 w-full max-w-[960px]">
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="flex items-center gap-3 justify-center mb-8"
        >
          <div
            className="flex items-center justify-center"
            style={{
              width: 46,
              height: 46,
              borderRadius: 14,
              background: "var(--sp-lime)",
              boxShadow: "var(--sp-sh-lime)",
              fontFamily: "var(--sp-display)",
              fontWeight: 700,
              fontSize: 26,
              color: "var(--sp-ink)",
              lineHeight: 1,
            }}
          >
            P
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--sp-display)",
                fontWeight: 600,
                fontSize: 21,
                letterSpacing: "-0.02em",
                color: "#fff",
              }}
            >
              SpotPark
            </div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "var(--sp-t3)",
                marginTop: 2,
              }}
            >
              Plataforma de gestión
            </div>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.13 }}
          className="text-center mb-10"
        >
          <h1
            style={{
              fontFamily: "var(--sp-display)",
              fontWeight: 700,
              fontSize: 42,
              letterSpacing: "-0.03em",
              lineHeight: 1.04,
              color: "#fff",
              margin: 0,
            }}
          >
            Bienvenido.
            <br />
            <span style={{ color: "var(--sp-lime)" }}>Elige tu panel.</span>
          </h1>
          <p
            style={{
              margin: "14px auto 0",
              maxWidth: 440,
              color: "rgba(255,255,255,.62)",
              fontSize: 15.5,
              lineHeight: 1.55,
            }}
          >
            Un mismo ecosistema, dos formas de operar. Entra al panel que
            necesitas hoy.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-6">
          {/* ── Operaciones ── */}
          <motion.a
            href="/vigilante-login"
            initial={{
              opacity: 0,
              y: 14,
              borderColor: "rgba(0,0,0,0)",
              boxShadow: BASE_SHADOW,
            }}
            animate={{
              opacity: 1,
              y: 0,
              borderColor: "rgba(0,0,0,0)",
              boxShadow: BASE_SHADOW,
            }}
            transition={{ duration: 0.2, delay: 0.01 }}
            whileHover="hover"
            whileTap={{ scale: 0.95 }}
            variants={opsCardV}
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              textDecoration: "none",
              color: "inherit",
              background: "var(--sp-surface)",
              borderRadius: "var(--sp-r-xl)",
              padding: "30px 30px 26px",
              borderWidth: "1.5px",
              borderStyle: "solid",
              overflow: "hidden",
              cursor: "pointer",
            }}
          >
            {/* Top accent bar */}
            <motion.div
              initial="rest"
              variants={barV}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                height: 4,
                background: "var(--sp-lime)",
                transformOrigin: "left",
              }}
            />

            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: 22,
              }}
            >
              <motion.div
                initial="rest"
                variants={tileV}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--sp-lime-bg)",
                }}
              >
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2 4 5.5v5.6c0 4.6 3.2 8.4 8 10.4 4.8-2 8-5.8 8-10.4V5.5L12 2Z"
                    stroke="#5E7F12"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                  <path
                    d="m8.6 12 2.4 2.4 4.4-4.6"
                    stroke="#5E7F12"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  height: 26,
                  padding: "0 12px",
                  borderRadius: "var(--sp-r-pill)",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  background: "var(--sp-lime-bg)",
                  color: "var(--sp-lime-deep)",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--sp-lime-deep)",
                  }}
                />
                Empleado
              </span>
            </div>

            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--sp-t3)",
              }}
            >
              Operación diaria
            </div>
            <h2
              style={{
                fontFamily: "var(--sp-display)",
                fontWeight: 600,
                fontSize: 25,
                letterSpacing: "-0.02em",
                margin: "7px 0 10px",
                color: "var(--sp-ink)",
              }}
            >
              Panel de Operaciones
            </h2>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.55,
                color: "var(--sp-t2)",
                margin: "0 0 20px",
              }}
            >
              Registra entradas y salidas, controla los espacios en tiempo real
              y resuelve incidentes desde el punto.
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 24,
              }}
            >
              {opsFeats.map((f) => (
                <span
                  key={f}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    height: 30,
                    padding: "0 11px",
                    borderRadius: "var(--sp-r-pill)",
                    background: "var(--sp-elevated)",
                    color: "var(--sp-t1)",
                    fontSize: 12.5,
                    fontWeight: 500,
                  }}
                >
                  {f}
                </span>
              ))}
            </div>

            <div
              style={{
                marginTop: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: 18,
                borderTop: "1px solid var(--sp-separator)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--sp-font)",
                  fontWeight: 600,
                  fontSize: 15,
                  color: "var(--sp-ink)",
                }}
              >
                Entrar al panel
              </span>
              <motion.span
                initial="rest"
                variants={arrowOpsV}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  background: "var(--sp-lime)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12h14m-6-6 6 6-6 6"
                    stroke="#0F1115"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.span>
            </div>
          </motion.a>

          {/* ── Administración ── */}
          <motion.a
            href="/login"
            initial={{
              opacity: 0,
              y: 14,
              borderColor: "rgba(0,0,0,0)",
              boxShadow: BASE_SHADOW,
            }}
            animate={{
              opacity: 1,
              y: 0,
              borderColor: "rgba(0,0,0,0)",
              boxShadow: BASE_SHADOW,
            }}
            transition={{ duration: 0.2, delay: 0.1 }}
            whileHover="hover"
            whileTap={{ scale: 0.95 }}
            variants={adminCardV}
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              textDecoration: "none",
              color: "inherit",
              background: "var(--sp-surface)",
              borderRadius: "var(--sp-r-xl)",
              padding: "30px 30px 26px",
              borderWidth: "1.5px",
              borderStyle: "solid",
              overflow: "hidden",
              cursor: "pointer",
            }}
          >
            {/* Top accent bar */}
            <motion.div
              initial="rest"
              variants={barV}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                height: 4,
                background: "var(--sp-blue)",
                transformOrigin: "left",
              }}
            />

            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: 22,
              }}
            >
              <motion.div
                initial="rest"
                variants={tileV}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--sp-blue-bg)",
                }}
              >
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 20V9l5-3v14M9 20V4l6 2v14M15 20V9l5 2v9M3 20h18"
                    stroke="#1D5FD6"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  height: 26,
                  padding: "0 12px",
                  borderRadius: "var(--sp-r-pill)",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  background: "var(--sp-blue-bg)",
                  color: "var(--sp-blue-tx)",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--sp-blue-tx)",
                  }}
                />
                Admintración
              </span>
            </div>

            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--sp-t3)",
              }}
            >
              Visión de negocio
            </div>
            <h2
              style={{
                fontFamily: "var(--sp-display)",
                fontWeight: 600,
                fontSize: 25,
                letterSpacing: "-0.02em",
                margin: "7px 0 10px",
                color: "var(--sp-ink)",
              }}
            >
              Panel de Administración
            </h2>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.55,
                color: "var(--sp-t2)",
                margin: "0 0 20px",
              }}
            >
              Métricas del negocio, parqueaderos, tarifas y equipo, con insights
              y proyecciones de SpotPark AI.
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 24,
              }}
            >
              {adminFeats.map((f) => (
                <span
                  key={f}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    height: 30,
                    padding: "0 11px",
                    borderRadius: "var(--sp-r-pill)",
                    background: "var(--sp-elevated)",
                    color: "var(--sp-t1)",
                    fontSize: 12.5,
                    fontWeight: 500,
                  }}
                >
                  {f}
                </span>
              ))}
            </div>

            <div
              style={{
                marginTop: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: 18,
                borderTop: "1px solid var(--sp-separator)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--sp-font)",
                  fontWeight: 600,
                  fontSize: 15,
                  color: "var(--sp-ink)",
                }}
              >
                Entrar al panel
              </span>
              <motion.span
                initial="rest"
                variants={arrowAdminV}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  background: "var(--sp-blue)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12h14m-6-6 6 6-6 6"
                    stroke="#fff"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.span>
            </div>
          </motion.a>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-9"
          style={{ color: "rgba(255,255,255,.34)", fontSize: 12.5 }}
        >
          Pulsa{" "}
          <kbd
            style={{
              fontFamily: "var(--sp-mono)",
              fontSize: 11,
              background: "rgba(255,255,255,.08)",
              border: "1px solid rgba(255,255,255,.12)",
              borderRadius: 6,
              padding: "2px 6px",
              color: "rgba(255,255,255,.6)",
            }}
          >
            1
          </kbd>{" "}
          Operaciones ·{" "}
          <kbd
            style={{
              fontFamily: "var(--sp-mono)",
              fontSize: 11,
              background: "rgba(255,255,255,.08)",
              border: "1px solid rgba(255,255,255,.12)",
              borderRadius: 6,
              padding: "2px 6px",
              color: "rgba(255,255,255,.6)",
            }}
          >
            2
          </kbd>{" "}
          Administración &nbsp;·&nbsp; SpotPark © 2026 · Bogotá
        </motion.div>
      </div>
    </div>
  );
}
