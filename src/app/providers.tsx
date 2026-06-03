"use client";

import { RouterProvider } from "@heroui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );
  const router = useRouter();

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider navigate={router.push}>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "var(--sp-surface)",
              border: "1px solid var(--sp-border-card)",
              color: "var(--sp-t1)",
              fontFamily: "var(--sp-font)",
              fontSize: "13px",
            },
          }}
        />
      </RouterProvider>
    </QueryClientProvider>
  );
}
