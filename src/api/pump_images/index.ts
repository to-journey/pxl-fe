import { useMutation, useQuery } from "@tanstack/react-query";
import { axios, toast } from "../../utils";

export const useCreatePumpImages = () => {
    return useMutation({
        mutationFn: (data: any) => axios.post('/pump-images', data),
        onError: (err: any) => toast.error(err.response?.data.message || err.message),
    });
}

export const useGetPumpImages = () => {
    const { data, isPending } = useQuery({
        queryKey: ['getPumpImages'],
        queryFn: () => axios.get('/pump-images'),
    });

    return { pumpImages: data?.data || [], isPending };
}

export const useUpdatePumpImages = () => {
    return useMutation({
        mutationFn: (data: any) => axios.put(`/pump-images/${data.id}`, data),
        onError: (err: any) => toast.error(err.response?.data.message || err.message),
    })
}

export const useDeletePumpImages = () => {
    return useMutation({
        mutationFn: (id: any) => axios.delete(`/pump-images/${id}`),
        onError: (err: any) => toast.error(err.response?.data.message || err.message),
    })
}
