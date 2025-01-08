import { Box, Button, Flex, Grid, Image, Input, Text } from "@chakra-ui/react";
import { useMemo, useRef, useState } from "react";
import { useCreateScore } from "../../api/scoreboard";
import ConfettiCanvas from "../../components/Confetti";
import { GameStatus } from "../../constants/enum";

interface IOpenMap {
    [key: number]: boolean;
}

const Nexus = () => {
    const { mutate: submitScore } = useCreateScore();
    const [status, setStatus] = useState<GameStatus>(GameStatus.WELCOME);
    const [countDown, setCountDown] = useState<number | null>(0);
    const [score, setScore] = useState(0);
    const isPlaying = useRef(false);
    const [cards, setCards] = useState<number[]>([]);
    const [isOpen, setIsOpen] = useState<IOpenMap>({});
    const [showAll, setShowAll] = useState(false);
    const selectedIndex = useRef<number | null>(null);
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
        setCountDown(3);
        setScore(0);
        isPlaying.current = false;
        setIsOpen({});
        setShowAll(false);
        selectedIndex.current = null;
        onceWrong.current = false;
        placeCards(2);
        let countDown = 3;
        const interval = setInterval(() => {
            if (countDown == 0) {
                isPlaying.current = true;
                setShowAll(true);
                setTimeout(() => setShowAll(false), 2500);
                setCountDown(null);
                clearInterval(interval);
                return;
            }
            countDown--;
            setCountDown(countDown);
        }, 1500);
    }

    const handleGameEnd = (score: number) => {
        submitScore({
            gameId: 8,
            score,
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
            <Image display='none' src='/img/nexus/0.png' />
            <Image display='none' src='/img/nexus/1.png' />
            <Image display='none' src='/img/nexus/2.png' />
            <Image display='none' src='/img/nexus/3.png' />
            <Image display='none' src='/img/nexus/4.png' />
            <Image display='none' src='/img/nexus/5.png' />
            <Image display='none' src='/img/nexus/6.png' />
            <Image display='none' src='/img/nexus/7.png' />
            <Image display='none' src='/img/nexus/8.png' />
            <Image display='none' src='/img/nexus/9.png' />
            {status == GameStatus.WELCOME && (
                <Flex p='16px' direction='column' align='center' gap='16px'>
                    <Flex direction='column'>
                        <Text textAlign='center' fontSize={28} fontWeight='bold'>
                            Welcome to "NEXUS"
                        </Text>
                        <Text textAlign='center' fontFamily='sans-serif' fontSize={16}>
                            Get ready to connect the matching art and claim your victory!
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
                        <Text position='absolute' zIndex={1} fontSize='36px'>
                            {countDown == 0 ? 'GO!' : countDown}
                        </Text>
                    )}
                    <Grid maxH='560px' templateColumns={`repeat(${cols}, minmax(0, 1fr))`} gap='12px'>
                        {cards.map((card, index) => (
                            <label key={index} htmlFor={`checkbox${index}`}>
                                <Input id={`checkbox${index}`} type="checkbox" className="card-check" display='none' checked={showAll || (isOpen[index] ?? false)} onChange={(e) => {
                                    if (!isPlaying.current || isOpen[index] || !e.target.checked || showAll) return;
                                    setIsOpen((prev) => {
                                        prev[index] = true;
                                        return { ...prev };
                                    });
                                    if (selectedIndex.current == null) {
                                        selectedIndex.current = index;
                                    } else {
                                        if (cards[selectedIndex.current] != cards[index]) {
                                            if (onceWrong.current) {
                                                handleGameEnd(score);
                                            }
                                            onceWrong.current = true;
                                            const a = selectedIndex.current, b = index;
                                            selectedIndex.current = null;
                                            setTimeout(() => {
                                                setIsOpen((prev) => {
                                                    prev[a] = false;
                                                    prev[b] = false;
                                                    return { ...prev };
                                                });
                                            }, 500);
                                        } else {
                                            selectedIndex.current = null;
                                            const sc = score + 2;
                                            setScore(sc);
                                            for (let i = 3, s = 4; i <= 11; s += i * 2, i++) {
                                                if (s == sc) {
                                                    if (i == 11) {
                                                        handleGameEnd(sc);
                                                    } else {
                                                        setTimeout(() => {
                                                            setIsOpen({});
                                                            placeCards(i);
                                                            setShowAll(true);
                                                            setTimeout(() => setShowAll(false), i * 1000 - 1500);
                                                        }, 500);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                } />
                                <Box className="card" w={`${size}px`} h={`${size}px`}>
                                    {card >= 0 && (
                                        <Box className="img" h='full' position='relative'>
                                            <Image h='full' src={`/img/nexus/${card}.png`} />
                                            <Image position='absolute' left={0} top={0} h='full' src="/img/nexus/card.png" />
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
