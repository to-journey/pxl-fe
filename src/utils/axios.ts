import { default as Axios } from 'axios';

const getToken = () => {
    const token = localStorage.getItem('dynamic_authentication_token');
    return token ? token.slice(1, token.length - 1) : '';
}

const axios = Axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Authorization': `Bearer ${getToken()}`
    }
});

axios.interceptors.request.use(
    config => {
        const token = getToken();
        if (token)
            config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default axios;
