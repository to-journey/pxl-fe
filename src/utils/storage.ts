export const setToken = (token: string) => {
    localStorage.setItem('token', token);
}

export const getToken = () => {
    return localStorage.getItem('token');
}

export const deleteToken = () => {
    return localStorage.removeItem('token');
}

export default { setToken, getToken, deleteToken };
