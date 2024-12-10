import { BoxProps, Image } from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";

interface Props extends BoxProps {
    src?: string;
}

const Avatar: FC<Props> = ({ src, ...rest }) => {
    const [url, setUrl] = useState(src);

    useEffect(() => {
        setUrl(src);
    }, [src]);

    const handleError = () => {
        setUrl('/no-user.png');
    }

    return <Image w='48px' h='48px' objectFit='cover' src={url} onError={handleError} {...rest} />
}

export default Avatar;
