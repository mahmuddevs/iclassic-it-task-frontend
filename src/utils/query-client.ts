import { QueryClient, type QueryKey } from "@tanstack/react-query"

// Create a single client instance
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 1000 * 60 * 5, // 5 minutes default stale time
    },
  },
})

/**
 * Global helper to invalidate query cache from anywhere (inside or outside React)
 */
export const invalidateQuery = (key: string) => {
  const queryKey: QueryKey = Array.isArray(key) ? key : [key]
  return queryClient.invalidateQueries({ queryKey })
}
