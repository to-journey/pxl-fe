import { Box, Button, Flex, Grid, Image, Input, Text } from "@chakra-ui/react";
import { useMemo, useRef, useState } from "react";
import { useCreateScore } from "../../api/scoreboard";
import ConfettiCanvas from "../../components/Confetti";
import { GameStatus } from "../../constants/enum";

interface IShowMap {
    [key: number]: boolean;
}

const Nexus = () => {
    const { mutate: submitScore } = useCreateScore();
    const [countDown, setCountDown] = useState<number | null>(0);
    const [status, setStatus] = useState<GameStatus>(GameStatus.WELCOME);
    const [score, setScore] = useState(0);
    const [cards, setCards] = useState<number[]>([]);
    const [showImage, setShowImage] = useState<IShowMap>({});
    const [prevSelectedCardIndex, setPrevSelectedCardIndex] = useState<number | null>(null);
    const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
    const [showAll, setShowAll] = useState(false);
    const onceWrong = useRef(false);

    const width = 375, height = 560;

    const { cols, size } = useMemo(() => {
        const cols = cards.length <= 10 ? 2 : cards.length <= 14 ? 3 : 4;
        const rows = Math.ceil(cards.length / cols);
        const size = Math.min(280 / cols, 450 / rows);
        return { cols, rows, size };
    }, [cards]);

    const placeCards = (count: number) => {
        const t = Array.from({ length: 10 }, (_, index) => index).sort(() => Math.random() - 0.5).slice(0, count);
        setCards([...t, ...t].sort(() => Math.random() - 0.5));
    }

    const startGame = () => {
        setStatus(GameStatus.GAME);
        placeCards(3);
        setCountDown(3);
        let countDown = 3;
        const interval = setInterval(() => {
            if (countDown == 0) {
                setShowAll(true);
                setTimeout(() => setShowAll(false), 1500);
                setCountDown(null);
                clearInterval(interval);
                return;
            }
            countDown--;
            setCountDown(countDown);
        }, 1500);
    }

    const handleGameEnd = (s?: number) => {
        submitScore({
            gameId: 8,
            score: s || score,
        });
        setTimeout(() => {
            setStatus(GameStatus.RESULT);
        }, 1000);
    }

    return (
        <Flex
            h='100vh'
            align='center' justify='center'
            bg='linear-gradient(135deg, #6f00ff, #00ffcc)'
            fontFamily='sans-serif'
        >
            {status == GameStatus.WELCOME && (
                <Flex p='16px' direction='column' align='center' gap='16px'>
                    <Flex direction='column'>
                        <Text textAlign='center' fontSize={28} fontWeight='bold'>
                            Welcome to "NEXUS"
                        </Text>
                        <Text textAlign='center' fontFamily='sans-serif' fontSize={16}>
                            Get ready for a fast-paced color challenge!
                        </Text>
                    </Flex>
                    <Button bg='#6f00ff' color='white' _hover={{ bg: '#00ffcc' }} onClick={startGame}>
                        Start Game
                    </Button>
                </Flex>
            )}
            {status == GameStatus.GAME && (
                <Flex position='relative' p='24px' w={width} h={height} justify='center' align='center' border="2px solid white" rounded="16px" bg="url('/img/nexus/bg.png')">
                    <Text position='absolute' left={2} top={2} zIndex={1} fontSize='24px'>
                        Score: {score}
                    </Text>
                    {countDown != null && (
                        <Text position='absolute' zIndex={1} fontSize='28px'>
                            {countDown == 0 ? 'GO!' : countDown}
                        </Text>
                    )}
                    <Grid maxH='560px' templateColumns={`repeat(${cols}, minmax(0, 1fr))`} gap='12px'>
                        {cards.map((card, index) => (
                            <label key={index} htmlFor={`checkbox${index}`} onClick={() => {
                                if (showAll) return;
                                if (selectedCardIndex == null) {
                                    setSelectedCardIndex(index);
                                } else {
                                    if (selectedCardIndex == index) return;
                                    setPrevSelectedCardIndex(selectedCardIndex);
                                    setSelectedCardIndex(index);
                                    if (cards[selectedCardIndex] != cards[index]) {
                                        if (onceWrong.current) {
                                            handleGameEnd();
                                        }
                                        onceWrong.current = true;
                                        setTimeout(() => {
                                            setPrevSelectedCardIndex(null);
                                            setSelectedCardIndex(null);
                                            setTimeout(() => {
                                                setShowImage({});
                                            }, 75);
                                        }, 400);
                                    } else {
                                        setTimeout(() => {
                                            setCards(prev => {
                                                prev[selectedCardIndex] = -1;
                                                prev[index] = -1;
                                                return [...prev];
                                            });
                                            setScore(score + 2);
                                            for (let i = 4, s = 6; i <= 10; i++) {
                                                if (score == s - 2) {
                                                    placeCards(i);
                                                    setShowAll(true);
                                                    setTimeout(() => setShowAll(false), i * 1000 - 2500);
                                                }
                                                s += i * 2;
                                            }
                                            if (score == 102)
                                                handleGameEnd(104);
                                            setPrevSelectedCardIndex(null);
                                            setSelectedCardIndex(null);
                                            setTimeout(() => {
                                                setShowImage({});
                                            }, 75);
                                        }, 400);
                                    }
                                    if (prevSelectedCardIndex != null) {
                                        setTimeout(() => {
                                            setShowImage((prev) => {
                                                prev[prevSelectedCardIndex] = false;
                                                return { ...prev };
                                            });
                                        }, 75);
                                    }
                                }
                            }}>
                                <Input id={`checkbox${index}`} type="checkbox" className="card-check" display='none' checked={showAll || prevSelectedCardIndex == index || selectedCardIndex == index} onChange={(e) => {
                                    if (showAll) return;
                                    setTimeout(() => {
                                        setShowImage((prev) => {
                                            prev[index] = e.target.checked;
                                            return { ...prev };
                                        });
                                    }, 75);
                                }} />
                                <Box className="card" w={`${size}px`} h={`${size}px`}>
                                    {card >= 0 && (
                                        <Box className="img" h='full' position='relative'>
                                            {(showAll || showImage[index]) ? (
                                                <Image h='full' src={`/img/nexus/${card}.png`} />
                                            ) : (
                                                <Image h='full' src="/img/nexus/card.png" />
                                            )}
                                        </Box>
                                    )}
                                </Box>
                            </label>
                        ))}
                    </Grid>
                </Flex>
            )}
            {status == GameStatus.RESULT && (
                <Flex direction='column' align='center'>
                    <ConfettiCanvas />
                    <Text fontSize={28} fontWeight='bold'>
                        NEXUS
                    </Text>
                    <Text fontSize={28} fontWeight='bold'>
                        SCORE: {score}
                    </Text>
                    <Button zIndex={60} bg='#6f00ff' color='white' _hover={{ bg: '#00ffcc' }} onClick={() => {
                        setStatus(GameStatus.GAME);
                        startGame();
                    }}>
                        Play again
                    </Button>
                </Flex>
            )}
        </Flex>
    )
}

export default Nexus;
