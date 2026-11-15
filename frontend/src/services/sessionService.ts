import { queryClient } from "../app/queryClient";
import { authService } from "./authService";

export const logoutSession = (): void => {
  authService.logout();
  queryClient.clear();
};