import { useMutation, type UseMutationOptions } from "@tanstack/react-query"
import { getFetch } from "../utils/getFetch"

export interface QueryMutationConfig<TData = unknown, TError = Error, TVariables = void, TContext = unknown> {
  url: string | ((variables: TVariables) => string);
  method?: "POST" | "PUT" | "PATCH" | "DELETE" | ((variables: TVariables) => "POST" | "PUT" | "PATCH" | "DELETE");
  isPrivate?: boolean;
  mutationOptions?: Omit<UseMutationOptions<TData, TError, TVariables, TContext>, "mutationFn">;
}

export function useQueryMutation<TData = unknown, TError = Error, TVariables = void, TContext = unknown>(
  config: QueryMutationConfig<TData, TError, TVariables, TContext>
) {
  const { url, method = "POST", isPrivate = false, mutationOptions } = config

  return useMutation<TData, TError, TVariables, TContext>({
    mutationFn: async (variables: TVariables) => {
      // 1. Resolve URL
      const resolvedUrl = typeof url === "function"
        ? url(variables)
        : url;

      // 2. Resolve Method
      const resolvedMethod = typeof method === "function"
        ? method(variables)
        : method;

      // 3. Dispatch fetch request
      const response = await getFetch<Record<string, unknown>>(resolvedUrl, {
        method: resolvedMethod,
        private: isPrivate,
        body: resolvedMethod === "DELETE" && typeof variables !== "object"
          ? undefined
          : variables,
      });

      // Return body.data if present to match useGetQuery behavior, fallback to full body response
      return response && typeof response === "object" && "data" in response
        ? (response.data as TData)
        : (response as TData);
    },
    ...mutationOptions,
  });
}