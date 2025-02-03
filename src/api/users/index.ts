import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../providers";
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

export const useUpdateUserById = () => {
    return useMutation({
        mutationFn: (user: any) => axios.put(`/user/${user.id}`, user),
        onSuccess: () => toast.success('User has been successfully updated.'),
        onError: (err: any) => toast.error(err.message),
    });
}

export const useDeleteUserById = () => {
    return useMutation({
        mutationFn: (userId: number) => axios.delete(`/user/${userId}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['getUsers'] });
            toast.success('User has been successfully deleted.');
        },
        onError: (err: any) => toast.error(err.message),
    });
}
