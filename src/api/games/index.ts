import { useQuery } from "@tanstack/react-query";
import { axios } from "../../utils";

export const useGetGames = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['getGames'],
        queryFn: () => axios.get('/games'),
    });

    return { games: data?.data || [], isLoading };
}
