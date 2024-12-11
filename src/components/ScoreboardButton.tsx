import { Box, Button, Flex } from "@chakra-ui/react";
import { FC, useState } from "react";
import { useNavigate } from "react-router";

const ScoreboardButton: FC<{
    onClick: () => void;
}> = ({ onClick }) => {
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);

    return (
        <Box onMouseEnter={() => setShowPopup(true)} onMouseLeave={() => setShowPopup(false)}>
            <Button w='full' p='12px 28px 16px 28px' bg="black" _hover={{ shadow: 'inset 0 0 12px #fc02d8' }} fontSize={12}>
                SCOREBOARD
            </Button>
            <Box position='relative'>
                {showPopup && (
                    <Box position='absolute' left={0} top={0} zIndex={10} pt={2}>
                        <Flex py={1} bg='#000c' direction='column' gap='2px' rounded={4}>
                            <Box p='8px 16px' cursor='pointer' _hover={{ shadow: 'inset 0 0 12px #fc02d8' }} onClick={() => {
                                setShowPopup(false);
                                onClick();
                                navigate('/scoreboard?view=weekly');
                            }}>
                                WEEKLY
                            </Box>
                            <Box p='8px 16px' cursor='pointer' _hover={{ shadow: 'inset 0 0 12px #fc02d8' }} onClick={() => {
                                setShowPopup(false);
                                onClick();
                                navigate('/scoreboard?view=daily');
                            }}>
                                DAILY
                            </Box>
                            <Box p='8px 16px' cursor='pointer' _hover={{ shadow: 'inset 0 0 12px #fc02d8' }} onClick={() => {
                                setShowPopup(false);
                                onClick();
                                navigate('/scoreboard?view=total')
                            }}>
                                TOTAL
                            </Box>
                        </Flex>
                    </Box>
                )}
            </Box>
        </Box>
    )
}

export default ScoreboardButton;
