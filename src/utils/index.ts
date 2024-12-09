export { default as axios } from './axios';
export { default as storage } from './storage';
export { default as toast } from './toast';

export const loadImage = async (src: string) => new Promise((resolve, reject) => {
    const image = new Image();
    image.src = src;
    image.onload = () => resolve(image);
    image.onerror = (err) => reject(err);
});