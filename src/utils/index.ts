export { default as axios } from './axios';
export { default as toast } from './toast';

export const loadImage = async (src: string) => new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.src = src;
    image.onload = () => resolve(image);
    image.onerror = (err) => reject(err);
});