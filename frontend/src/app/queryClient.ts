import { QueryClient } from "@tanstack/react-query";

// Instancia única compartida: la usan main.tsx (provider) y
// sessionService.ts (queryClient.clear() al cerrar sesión).
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      retry: 1,
    },
  },
});
