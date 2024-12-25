import { Button, Flex, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useCreateScore } from "../../api/scoreboard";
import ConfettiCanvas from "../../components/Confetti";
import { GameStatus } from "../../constants/enum";
import { loadImage } from "../../utils";

const poolX = [45, 116.25, 187.5, 258.75, 330];

const Swapsicles = () => {
    const { mutate: submitScore } = useCreateScore();
    const ref = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef(0);
    const [status, setStatus] = useState<GameStatus>(GameStatus.WELCOME);
    const isLoading = useRef(true);
    const isPlaying = useRef(false);
    const isGameOver = useRef(false);
    const countDown = useRef(0);
    const score = useRef(0);

    const bgImage = useRef<any>();
    const poolImages = useRef<any[]>([]);
    const coinImages = useRef<any[]>([]);

    const particles = useRef<any[]>([]);
    const coins = useRef<number[][]>([]);
    const selectedCoinIndex = useRef<number>(-1);
    const cursorPos = useRef({ x: 0, y: 0 });
    const pos = useRef<number>(0);

    const width = 375, height = 560;

    const render = () => {
        try {
            const canvas = ref.current;
            const ctx = canvas?.getContext('2d');

            if (ctx) {
                ctx.clearRect(0, 0, width, height);

                if (bgImage.current) {
                    ctx.drawImage(bgImage.current, 0, 0);
                }

                poolX.forEach((x, index) => {
                    if (poolImages.current[index]) {
                        ctx.drawImage(poolImages.current[index], x - 30, 514, 60, 30);
                    }
                });

                coins.current.forEach((row, i) => {
                    row.forEach((coin, j) => {
                        if (coin >= 0 && coinImages.current[coin]) {
                            if (i == 9 && selectedCoinIndex.current == j) {
                                ctx.drawImage(coinImages.current[coin], cursorPos.current.x - 32, cursorPos.current.y - 32, 64, 64);
                            } else {
                                ctx.drawImage(coinImages.current[coin], poolX[j] - 32, pos.current + i * 80, 64, 64);
                            }
                        }
                    });
                });

                if (isPlaying.current) {
                    pos.current += Math.floor(score.current / 25) * 0.1 + 0.1;
                    particles.current.forEach((particle, index) => {
                        particle.x += particle.sx;
                        particle.y += particle.sy;
                        particle.sy += 0.1;
                        ctx.drawImage(coinImages.current[particle.index], particle.x - particle.r / 2, particle.y - particle.r / 2, particle.r, particle.r);
                        if (particle.y > 560) {
                            particles.current.splice(index, 1);
                        }
                    });
                    if (pos.current >= -290) {
                        handleGameEnd();
                    }
                }
                ctx.textAlign = "left";
                ctx.fillStyle = "white";
                ctx.font = "24px Arial";
                ctx.fillText(`Score: ${score.current}`, 10, 30);
                if (isGameOver.current) {
                    ctx.fillStyle = "red";
                    ctx.font = "48px Arial";
                    ctx.textAlign = "center";
                    ctx.fillText("Game Over!", width / 2, height / 2);
                }
                if (isLoading.current || countDown.current >= 0) {
                    ctx.font = "36px Arial";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";

                    const x = width / 2;
                    const y = height / 2;

                    ctx.fillStyle = "white";
                    if (isLoading.current) {
                        ctx.fillText('Loading assets...', x, y);
                    } else {
                        ctx.fillText(countDown.current == 0 ? 'GO!' : `${countDown.current}`, x, y);
                    }
                }
            }
        } catch (err: any) {
            console.error(err.message);
        }

        animationRef.current = requestAnimationFrame(render);
    }

    const loadAssets = async () => {
        bgImage.current = await loadImage('/img/swapsicles/bg.png');
        poolImages.current = [
            await loadImage('/img/swapsicles/pool1.png'),
            await loadImage('/img/swapsicles/pool2.png'),
            await loadImage('/img/swapsicles/pool3.png'),
            await loadImage('/img/swapsicles/pool4.png'),
            await loadImage('/img/swapsicles/pool5.png'),
        ];
        coinImages.current = [
            await loadImage('/img/swapsicles/1.png'),
            await loadImage('/img/swapsicles/2.png'),
            await loadImage('/img/swapsicles/3.png'),
            await loadImage('/img/swapsicles/4.png'),
            await loadImage('/img/swapsicles/5.png'),
        ];
        isLoading.current = false;
    }

    const setCountDown = () => new Promise((resolve) => {
        countDown.current = 3;
        const timerId = setInterval(() => {
            countDown.current--;
            if (countDown.current == -1) {
                clearInterval(timerId);
                resolve(true);
            }
        }, 1500);
    });

    const addNewRow = () => {
        const row = Array.from({ length: 5 }, (_, index) => index);
        row.sort(() => Math.random() - 0.5);
        coins.current = [row, ...coins.current];
    }

    const initGame = () => {
        pos.current = -544;
        coins.current = [];
        for (let i = 0; i < 10; i++)
            addNewRow();
        isGameOver.current = false;
        score.current = 0;
    }

    const startGame = async () => {
        await new Promise((resolve) => {
            const timerId = setInterval(() => {
                if (!isLoading.current) {
                    clearInterval(timerId);
                    resolve(true);
                }
            }, 100);
        });
        initGame();
        setStatus(GameStatus.GAME);
        await setCountDown();
        isPlaying.current = true;
    }

    const addParticles = (index: number, x: number, y: number) => {
        for (let i = 0; i < 100; i++) {
            particles.current.push({
                index,
                x: x + (Math.random() - 0.5) * 2,
                y: y + (Math.random() - 0.5) * 2,
                sx: (Math.random() - 0.5) * 2,
                sy: (Math.random() - 0.8) * 4,
                r: 2 + Math.random() * 6,
            });
        }
    }

    const handleDown = (x: number, y: number) => {
        if (isPlaying.current) {
            for (let i = 0; i < 5; i++) {
                if (Math.hypot(poolX[i] - x, pos.current + 752 - y) <= 32) {
                    selectedCoinIndex.current = i;
                    return;
                }
            }
        }
    }

    const handleMove = (x: number, y: number) => {
        cursorPos.current = { x, y };
    }

    const handleUp = () => {
        if (isPlaying.current) {
            if (selectedCoinIndex.current >= 0) {
                const { x, y } = cursorPos.current;
                for (let i = 0; i < 5; i++) {
                    if (x >= poolX[i] - 32 && x <= poolX[i] + 32 && y >= 450 && y <= 514) {
                        const selectedCoin = coins.current[9][selectedCoinIndex.current];
                        if (i == selectedCoin) {
                            coins.current[9][selectedCoinIndex.current] = -1;
                            score.current++;
                            if (coins.current[9].reduce((prev, v) => prev + v, 0) == -5) {
                                pos.current -= 80;
                                coins.current.splice(9, 1);
                                addNewRow();
                            }
                            addParticles(selectedCoin, x, y);
                        } else {
                            handleGameEnd();
                        }
                    }
                }
            }
            selectedCoinIndex.current = -1;
        }
    }

    const handleGameEnd = () => {
        isPlaying.current = false;
        isGameOver.current = true;
        submitScore({
            gameId: 8,
            score: score.current,
        });
        setTimeout(() => {
            setStatus(GameStatus.RESULT);
        }, 1000);
    }

    useEffect(() => {
        animationRef.current = requestAnimationFrame(render);
        loadAssets();
        return () => cancelAnimationFrame(animationRef.current);
    }, []);

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
                            Welcome to "SWAPSICLES"
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
                <canvas
                    ref={ref}
                    width={width} height={height}
                    style={{ border: "2px solid white", borderRadius: "16px" }}
                    onMouseDown={(e) => handleDown(e.clientX - ref.current!.getBoundingClientRect().left, e.clientY - ref.current!.getBoundingClientRect().top)}
                    onTouchStart={(e) => {
                        e.preventDefault();
                        e.touches.length == 1 && handleDown(e.touches[0].clientX - ref.current!.getBoundingClientRect().left, e.touches[0]!.clientY - ref.current!.getBoundingClientRect().top)
                    }}
                    onMouseMove={(e) => handleMove(e.clientX - ref.current!.getBoundingClientRect().left, e.clientY - ref.current!.getBoundingClientRect().top)}
                    onTouchMove={(e) => {
                        e.preventDefault();
                        handleMove(e.touches[0].clientX - ref.current!.getBoundingClientRect().left, e.touches[0]!.clientY - ref.current!.getBoundingClientRect().top);
                    }}
                    onMouseUp={handleUp}
                    onTouchEnd={(e) => {
                        e.preventDefault();
                        handleUp();
                    }}
                />
            )}
            {status == GameStatus.RESULT && (
                <Flex direction='column' align='center'>
                    <ConfettiCanvas />
                    <Text fontSize={28} fontWeight='bold'>
                        SWAPSICLES
                    </Text>
                    <Text fontSize={28} fontWeight='bold'>
                        SCORE: {score.current}
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

export default Swapsicles;
