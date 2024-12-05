import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../providers";
import { axios, toast } from "../../utils";

export const useGetQuestions = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['getQuestions'],
        queryFn: () => axios.get('/questions'),
    });

    return { questions: data?.data || [], isLoading };
}

export const useSaveQuestions = (date: string) => {
    return useMutation({
        mutationFn: (question: string) => axios.post(`/questions?date=${date}`, { question }),
        onError: (err: any) => toast.error(err.message),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['getQuestions'] }),
    });
}
