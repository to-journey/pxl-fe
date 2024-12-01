import { useQuery } from "@tanstack/react-query";
import { axios } from "../../utils";

export const useGetScoreboard = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['getScoreboard'],
        queryFn: () => axios.get('/scores'),
    });

    return { scores: data?.data || [], isLoading };
}
