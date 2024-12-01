import { useMutation, useQuery } from "@tanstack/react-query";
import { axios, toast } from "../../utils";
import { queryClient } from "../../providers";

export const useGetUsers = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['getUsers'],
        queryFn: () => axios.get('/users'),
    });

    return { users: data?.data || [], isLoading };
}

export const useGetUserInfo = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['getUserInfo'],
        queryFn: () => axios.get('/user-info'),
    });

    return { user: data?.data || {}, isLoading };
}

export const useUpdateUserInfo = () => {
    return useMutation({
        mutationFn: (user: any) => axios.put('/user', user),
        onSuccess: () => {
            toast.success('User info has been successfully updated.');
            queryClient.invalidateQueries(['getUserInfo']);
        },
        onError: (err: any) => toast.error(err.message),
    });
}