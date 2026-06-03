import VigilanteLoginLayout from "@/features/auth/vigilante-login/VigilanteLoginLayout";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Acceso · Operaciones" };

export default function VigilanteLoginPage() {
  return <VigilanteLoginLayout />;
}
