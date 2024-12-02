import { ReactNode } from 'react';
import { toast, ToastOptions } from 'react-toastify';

const defaultOption: ToastOptions = {
    hideProgressBar: true,
    autoClose: 5000,
    type: 'info',
    position: 'top-right',
}

export const info = (message: ReactNode) => toast(message, defaultOption);
export const success = (message: ReactNode) => toast(message, { ...defaultOption, type: 'success' });
export const warning = (message: ReactNode) => toast(message, { ...defaultOption, type: 'warning' });
export const error = (message: ReactNode) => toast(message, { ...defaultOption, type: 'error' });
export default { info, success, warning, error };