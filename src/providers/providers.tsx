import type { ReactNode } from "react"
import StoreProvider from "./store-provider"
import { Toaster } from "sonner"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "../utils/query-client"

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
        />
      </QueryClientProvider>
    </StoreProvider >
  )
}
