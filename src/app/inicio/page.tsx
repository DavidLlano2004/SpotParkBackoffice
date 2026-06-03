import InicioPage from "@/features/auth/inicio/InicioPage";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "SpotPark · Acceso" };

export default function Inicio() {
  return <InicioPage />;
}
