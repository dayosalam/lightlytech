import { useQuery } from "@tanstack/react-query";
import { getAlerts } from "../api/readings";

export const useAlerts = () => {
    return useQuery({
        queryKey: ["alerts"],
        queryFn: getAlerts,
        staleTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
};