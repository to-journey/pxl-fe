import { useMutation, useQuery } from "@tanstack/react-query";
import { axios, toast } from "../../utils";

export const useGetUsers = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['getUsers'],
        queryFn: () => axios.get('/user'),
    });

    return { users: data?.data || [], isLoading };
}

export const useUpdateUser = () => {
    return useMutation({
        mutationFn: (user: any) => axios.put('/user', user),
        onSuccess: () => toast.success('User info has been successfully updated.'),
        onError: (err: any) => toast.error(err.message),
    });
}
