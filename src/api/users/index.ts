import { useMutation, useQuery } from "@tanstack/react-query";
import { axios, toast } from "../../utils";

export const useGetUsers = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['getUsers'],
        queryFn: () => axios.get('/users'),
    });

    return { users: data?.data || [], isLoading };
}

export const useUpdateUser = (cb?: () => void) => {
    return useMutation({
        mutationFn: (user: any) => axios.put('/user', user),
        onSuccess: cb,
        onError: (err: any) => toast.error(err.message),
    });
}
