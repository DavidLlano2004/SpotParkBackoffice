import LoginLayout from "@/features/auth/login/layout";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Login" };

export default function LoginPage() {
  return <LoginLayout />;
}
