import { createContext, FC, ReactNode, useEffect, useState } from "react";
import { useSignInWithDynamicId } from "../api/auth";
import { IUser } from "../interfaces";
import { axios, storage } from "../utils";

interface IAuth {
    user?: IUser;
    setUser?: (user: IUser) => void;
    token?: string | null;
    setToken?: (token: string) => void;
    signInWithDynamicId?: (userId: string) => void;
    logout?: () => void;
}

export const AuthContext = createContext<IAuth>({});

interface Props {
    children: ReactNode;
}

const AuthProvider: FC<Props> = ({ children }) => {
    const [token, setToken] = useState(storage.getToken());
    const [user, setUser] = useState<IUser>();
    const { mutate: signInWithDynamicId } = useSignInWithDynamicId((res) => {
        setToken?.(res.data.token);
    });

    const logout = () => {
        setToken(null);
    }

    const getUserInfo = async () => {
        try {
            const res = await axios.get('/user-info');
            setUser(res.data);
        } catch (err: any) {
            console.error(err.message);
            setUser(undefined);
        }
    }

    useEffect(() => {
        if (token) {
            storage.setToken(token);
            getUserInfo();
        } else {
            storage.deleteToken();
            setUser(undefined);
        }
    }, [token]);

    return (
        <AuthContext.Provider value={{ token, setToken, user, signInWithDynamicId, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;
