import { useQuery, type UseQueryOptions } from "@tanstack/react-query"
import { getFetch } from "../utils/getFetch"
import { useAppSelector } from "../store/store"

export interface GetQueryConfig<TData = unknown, TError = Error>
  extends Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn" | "enabled"> {
  url: string;
  isPrivate?: boolean;
  queryParams?: Record<string, unknown>;
  keys?: unknown[];
  enabled?: boolean;
}

function buildUrl(url: string, params?: Record<string, unknown>): string {
  if (!params || Object.keys(params).length === 0) return url;

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== "") {
      if (Array.isArray(val)) {
        val.forEach((v) => searchParams.append(key, String(v)));
      } else {
        searchParams.append(key, String(val));
      }
    }
  });

  const queryString = searchParams.toString();
  if (!queryString) return url;

  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}${queryString}`;
}

export function useGetQuery<TData = unknown, TError = Error>(
  config: GetQueryConfig<TData, TError>
) {
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const { url, isPrivate, queryParams, keys, enabled = true, ...queryOptions } = config

  // For private queries, only enable if the user is authenticated
  const queryEnabled = isPrivate ? (isAuthenticated && enabled) : enabled;

  return useQuery<TData, TError>({
    queryKey: [url, queryParams || {}, ...(keys || [])],
    queryFn: async () => {
      const finalUrl = buildUrl(url, queryParams);

      const body = await getFetch<{ data: TData }>(finalUrl, {
        method: "GET",
        private: isPrivate,
      });

      return body.data;
    },
    ...queryOptions,
    enabled: queryEnabled,
  });
}