"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@stores/useAuthStore";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const isAuth = useAuthStore((s) => s.isAuth);
  const router = useRouter();

  useEffect(() => {
    if (!isAuth) router.replace("/inicio");
  }, [isAuth, router]);

  if (!isAuth) return null;
  return <>{children}</>;
}
