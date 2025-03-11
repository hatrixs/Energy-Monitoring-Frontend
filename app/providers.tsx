"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useState } from "react"

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Tiempo que los datos se consideran frescos
            staleTime: 60 * 1000, // 1 minuto
            // Tiempo que los datos se mantienen en caché
            gcTime: 5 * 60 * 1000, // 5 minutos
            // Reintentos en caso de error
            retry: 1,
            // Refetch automático cuando la ventana recupera el foco
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && <ReactQueryDevtools />}
    </QueryClientProvider>
  )
} 