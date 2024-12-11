import { useMutation } from "@tanstack/react-query"
import { axios, toast } from "../../utils"

export const useSendNotification = (cb?: () => void) => {
    return useMutation({
        mutationFn: (message: string) => axios.post('/message', { message }),
        onSuccess: cb,
        onError: (err: any) => toast.error(err.message),
    })
}
