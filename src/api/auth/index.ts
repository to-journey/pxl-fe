import { useMutation } from "@tanstack/react-query";
import { axios, toast } from "../../utils";

export const useSignInWithDynamicId = (cb: (res: any) => void) => {
    return useMutation({
        mutationFn: (userId: string) => axios.post<any>('/signin-with-dynamic', { userId }),
        onSuccess: cb,
        onError: (err: any) => toast.error(err.response?.data.message || err.message),
    });
}
