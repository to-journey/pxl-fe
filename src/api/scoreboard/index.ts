import { useMutation, useQuery } from "@tanstack/react-query";
import { axios, toast } from "../../utils";

export const useGetScoreboard = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['getScoreboard'],
        queryFn: () => axios.get('/scores'),
    });

    return { scores: data?.data || [], isLoading };
}

export const useCreateScore = () => {
    return useMutation({
        mutationFn: (data: any) => axios.post('/score', data),
        onError: (err: any) => toast.error(err.response?.data.message || err.message),
    });
}
