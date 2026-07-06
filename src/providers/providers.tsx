import type { ReactNode } from "react"
import StoreProvider from "./store-provider"
import { Toaster } from "sonner"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "../utils/query-client"
import { NuqsAdapter } from "nuqs/adapters/react"

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      <QueryClientProvider client={queryClient}>
        <NuqsAdapter>
          {children}
        </NuqsAdapter>
        <Toaster
          position="top-right"
          richColors
          closeButton
        />
      </QueryClientProvider>
    </StoreProvider >
  )
}
