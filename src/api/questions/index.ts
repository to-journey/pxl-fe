import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../providers";
import { axios, toast } from "../../utils";

export const useGetQuestions = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['getQuestions'],
        queryFn: () => axios.get('/question'),
    });

    return { questions: data?.data || [], isLoading };
}

export const useSaveQuestions = () => {
    return useMutation({
        mutationFn: (data: any) => axios.post('/question', data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['getQuestions'] }),
        onError: (err: any) => toast.error(err.message),
    });
}
