import { createContext, FC, ReactNode, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { queryClient } from ".";
import { useGetUserInfo } from "../api/users";
import { IUser } from "../interfaces";
import { storage } from "../utils";

interface IAuth {
    user?: IUser;
    setUser?: (user: IUser) => void;
    token?: string | null;
    setToken?: (token: string) => void;
}

export const AuthContext = createContext<IAuth>({});

interface Props {
    children: ReactNode;
}

const AuthProvider: FC<Props> = ({ children }) => {
    const [token, setToken] = useState(storage.getToken());
    const [param] = useSearchParams();
    const { user } = useGetUserInfo();

    useEffect(() => {
        const token = param.get('token');
        if (token) {
            setToken(token);
        }
    }, [param]);

    useEffect(() => {
        if (token) {
            storage.setToken(token);
            queryClient.invalidateQueries(['getUser']);
        }
    }, [token]);

    return (
        <AuthContext.Provider value={{ token, setToken, user }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;
