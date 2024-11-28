import { Flex, Image } from "@chakra-ui/react";
import { FC } from "react";
import { useNavigate } from "react-router";

interface Props {
    src: string;
    label: string;
    to?: string;
}

const GameCard: FC<Props> = ({ src, label, to }) => {
    const navigate = useNavigate();

    return (
        <Flex direction='column' gap='8px' align='center' onClick={() => to && navigate(to)}>
            <Image src={src} rounded='24px' />
            {label}
        </Flex>
    )
}

export default GameCard;
