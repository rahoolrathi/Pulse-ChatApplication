import hooks from "./index";
import { userservice } from "../services/userService";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryClient";

export const useAllUsers = () => {
  const { token } = hooks.useAuth();

  return useQuery({
    queryKey: queryKeys.allUsers,
    queryFn: () => userservice.getAllUsers(token),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });
};
