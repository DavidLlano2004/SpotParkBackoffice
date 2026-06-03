"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { toast } from "sonner";

const MotionLink = motion(Link);
import { useAuthStore } from "@stores/useAuthStore";
import { FormLogin } from "@/features/auth/login/components/FormLogin";
import {
  FormDataLogin,
  LoginSchema,
} from "@/features/auth/login/schemas/login.schema";
import SpotParkBrandMobile from "@/components/ui/spotParkBrandMobile/SpotParkBrandMobile";

export default function LoginLayout() {
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
    if (data.email === "juli.matias.2004@gmail.com") {
      setUser(
        {
          id: "admin-1",
          name: "Natalia Soto",
          init: "NS",
          email: data.email,
          phone: "312 990 4456",
          role: "super",
          parkings: [],
        },
        "mock-token-xxx",
      );
      toast.success("Bienvenida, Natalia");
      router.push("/");
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
        {/* Back button — desktop, anchored to dark panel */}
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
            style={{
              background: "var(--sp-lime)",
              boxShadow: "var(--sp-sh-lime)",
            }}
          >
            <span
              className="text-[34px] font-bold leading-none"
              style={{
                color: "var(--sp-ink)",
                fontFamily: "var(--sp-display)",
              }}
            >
              P
            </span>
          </div>
          <h1 className="t-h1 text-white">SpotPark</h1>
          <p className="t-small mt-1" style={{ color: "var(--sp-lime)" }}>
            Panel Administrativo
          </p>

          <svg width="340" height="220" viewBox="0 0 340 220" className="mt-8">
            <rect width="340" height="220" rx="16" fill="#15171F" />
            {[0, 1, 2].map((i) => (
              <g key={i}>
                <rect
                  x={20 + i * 104}
                  y="20"
                  width="92"
                  height="58"
                  rx="8"
                  fill="#1C1F28"
                />
                <rect
                  x={30 + i * 104}
                  y="32"
                  width="40"
                  height="6"
                  rx="3"
                  fill="#283042"
                />
                <rect
                  x={30 + i * 104}
                  y="48"
                  width={[60, 46, 54][i]}
                  height="12"
                  rx="3"
                  fill={["#C6F24E", "#3DA35D", "#3B82F6"][i]}
                />
              </g>
            ))}
            <polyline
              points="20,170 60,150 100,158 140,128 180,138 220,108 260,118 300,90 320,96"
              fill="none"
              stroke="#C6F24E"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line
              x1="20"
              y1="190"
              x2="320"
              y2="190"
              stroke="#283042"
              strokeWidth="1.5"
            />
          </svg>

          <p
            className="t-small text-center max-w-[280px] mt-6"
            style={{ color: "rgba(255,255,255,.5)" }}
          >
            Gestiona todos tus parqueaderos desde un solo lugar.
          </p>
        </div>
      </motion.div>

      {/* ── Right panel (form) ── */}
      <div className="flex flex-col justify-center px-6 py-10 md:p-12 flex-1">
        <div className="max-w-[368px] mx-auto w-full">
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

          <SpotParkBrandMobile />

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
            Ingresa a tu panel administrativo.
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
          />

          <p
            className="t-micro text-center mt-6"
            style={{ color: "var(--sp-t4)" }}
          >
            SpotPark Admin · v2.4 · Manizales, Colombia
          </p>
        </div>
      </div>
    </div>
  );
}
