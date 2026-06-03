"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";

const MotionLink = motion(Link);
import { toast } from "sonner";
import { useAuthStore } from "@stores/useAuthStore";
import { FormLogin } from "@/features/auth/login/components/FormLogin";
import { FormDataLogin, LoginSchema } from "@/features/auth/login/schemas/login.schema";

function ParkingIllustration() {
  const spaces = Array.from({ length: 9 });
  const activeIndex = 6;

  return (
    <svg width="300" height="190" viewBox="0 0 300 190" className="mt-8">
      <rect width="300" height="190" rx="16" fill="#15171F" />
      <rect x="12" y="18" width="276" height="2" rx="1" fill="#1E2330" />
      {spaces.map((_, i) => (
        <g key={`top-${i}`}>
          <rect
            x={12 + i * 30 + (i > 0 ? i * 1 : 0)}
            y={22}
            width={29}
            height={48}
            rx={4}
            fill={i === activeIndex ? "rgba(198,242,78,0.13)" : "#1C1F28"}
            stroke={i === activeIndex ? "#C6F24E" : "#252930"}
            strokeWidth={i === activeIndex ? 1.5 : 1}
          />
          {i === activeIndex && (
            <rect
              x={12 + i * 30 + (i > 0 ? i * 1 : 0) + 8}
              y={32}
              width={13}
              height={22}
              rx={3}
              fill="rgba(198,242,78,0.55)"
            />
          )}
        </g>
      ))}
      <rect x="12" y="84" width="248" height="7" rx="3.5" fill="#1C1F28" />
      <rect x="12" y="80" width="46" height="15" rx="6" fill="#C6F24E" opacity="0.9" />
      <rect x="62" y="85" width="3" height="5" rx="1.5" fill="#283042" />
      <rect x="72" y="85" width="3" height="5" rx="1.5" fill="#283042" />
      <rect x="82" y="85" width="3" height="5" rx="1.5" fill="#283042" />
      {spaces.map((_, i) => (
        <rect
          key={`bot-${i}`}
          x={12 + i * 30 + (i > 0 ? i * 1 : 0)}
          y={100}
          width={29}
          height={48}
          rx={4}
          fill="#1C1F28"
          stroke="#252930"
          strokeWidth={1}
        />
      ))}
      <rect x="12" y="150" width="276" height="2" rx="1" fill="#1E2330" />
    </svg>
  );
}

export default function VigilanteLoginLayout() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormDataLogin>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  });

  const onSubmit = async (data: FormDataLogin) => {
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 800));
    if (data.email === "vigilante@spotpark.co") {
      setUser(
        {
          id: "guard-1",
          name: "Vigilante",
          init: "VG",
          email: data.email,
          phone: "",
          role: "vigilante",
          parkings: [],
        },
        "mock-token-vigilante",
      );
      toast.success("Bienvenido");
      router.push("/vigilante/dashboard");
    } else {
      setError("Credenciales incorrectas. Intenta de nuevo.");
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen md:h-screen md:grid flex flex-col relative"
      style={{ gridTemplateColumns: "1.05fr 1fr", background: "var(--sp-bg)" }}
    >
      {/* ── Left panel (desktop only) ── */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="hidden md:flex relative flex-col items-center justify-center p-12 overflow-hidden"
        style={{ background: "var(--sp-ink)" }}
      >
        {/* Back button — desktop */}
        <MotionLink
          href="/inicio"
          className="absolute top-5 left-5 z-20 flex items-center gap-1.5"
          style={{
            height: 34,
            padding: "0 12px 0 8px",
            borderRadius: 50,
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.72)",
            fontSize: 13,
            fontWeight: 500,
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 6,
            cursor: "pointer",
          }}
          whileHover={{
            background: "rgba(255,255,255,0.16)",
            color: "rgba(255,255,255,0.96)",
            x: -1,
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.15 }}
        >
          <motion.svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            variants={{ hover: { x: -2 } }}
          >
            <path
              d="M19 12H5m7 7-7-7 7-7"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
          Inicio
        </MotionLink>

        <div
          className="absolute -top-16 -right-12 w-64 h-64 rounded-full"
          style={{ background: "rgba(198,242,78,.10)" }}
        />
        <div
          className="absolute -bottom-14 -left-10 w-48 h-48 rounded-full"
          style={{ background: "rgba(198,242,78,.06)" }}
        />

        <div className="relative z-10 flex flex-col items-center">
          <div
            className="w-16 h-16 rounded-[18px] flex items-center justify-center mb-4"
            style={{ background: "var(--sp-lime)", boxShadow: "var(--sp-sh-lime)" }}
          >
            <span
              className="text-[34px] font-bold leading-none"
              style={{ color: "var(--sp-ink)", fontFamily: "var(--sp-display)" }}
            >
              P
            </span>
          </div>
          <h1 className="t-h1 text-white">SpotPark</h1>
          <p className="t-small mt-1" style={{ color: "var(--sp-lime)" }}>
            Panel de Operaciones
          </p>

          <ParkingIllustration />

          <p
            className="t-small text-center max-w-70 mt-6"
            style={{ color: "rgba(255,255,255,.5)" }}
          >
            Tu parqueadero, organizado y eficiente.
          </p>
        </div>
      </motion.div>

      {/* ── Right panel (form) ── */}
      <div className="flex flex-col justify-center px-6 py-10 md:p-12 flex-1">
        <div className="max-w-92 mx-auto w-full">

          {/* Back button — mobile only */}
          <MotionLink
            href="/inicio"
            className="md:hidden flex items-center gap-1.5 mb-7"
            style={{
              color: "var(--sp-t2)",
              fontSize: 13,
              fontWeight: 500,
              textDecoration: "none",
              cursor: "pointer",
              width: "fit-content",
            }}
            whileHover={{ x: -3, opacity: 1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0.75 }}
            animate={{ opacity: 0.75 }}
            transition={{ duration: 0.15 }}
          >
            <motion.svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              variants={{ hover: { x: -2 } }}
            >
              <path
                d="M19 12H5m7 7-7-7 7-7"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
            Volver al inicio
          </MotionLink>

          {/* SpotPark brand — mobile only */}
          <div className="flex items-center gap-2.5 mb-6 md:hidden">
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "var(--sp-lime)",
                boxShadow: "var(--sp-sh-lime)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--sp-display)",
                fontWeight: 700,
                fontSize: 20,
                color: "var(--sp-ink)",
                lineHeight: 1,
                flexShrink: 0,
              }}
            >
              P
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--sp-display)",
                  fontWeight: 600,
                  fontSize: 16,
                  color: "var(--sp-ink)",
                }}
              >
                SpotPark
              </div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--sp-t3)",
                }}
              >
                Panel de Operaciones
              </div>
            </div>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="t-h1"
          >
            Bienvenido
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="t-body mt-1.5 mb-8"
            style={{ color: "var(--sp-t2)" }}
          >
            Ingresa tus credenciales para continuar.
          </motion.p>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="rounded-xl p-3 mb-4 text-sm"
              style={{
                background: "var(--sp-red-bg)",
                border: "1px solid var(--sp-red)",
                color: "var(--sp-red-tx)",
              }}
            >
              {error}
            </motion.div>
          )}

          <FormLogin
            loading={loading}
            onSubmit={handleSubmit(onSubmit)}
            control={control}
            errors={errors}
            emailPlaceholder="tu@spotpark.co"
            buttonText="Ingresar"
          />

          <p
            className="t-micro text-center mt-6"
            style={{ color: "var(--sp-t4)" }}
          >
            SpotPark Backoffice · v2.4 · Universidad de Caldas
          </p>
        </div>
      </div>
    </div>
  );
}
