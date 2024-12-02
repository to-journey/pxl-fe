import { Image, Link } from "@chakra-ui/react";
import { FC } from "react";

interface Props {
    src: string;
    label: string;
    to?: string;
}

const GameCard: FC<Props> = ({ src, label, to }) => {
    return (
        <Link href={to} display='flex' flexDirection='column' gap='8px' alignItems='center'>
            <Image src={src} rounded='24px' />
            {label}
        </Link>
    )
}

export default GameCard;
