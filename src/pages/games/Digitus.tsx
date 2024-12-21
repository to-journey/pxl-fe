import { Button, Flex, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useCreateScore } from "../../api/scoreboard";
import ConfettiCanvas from "../../components/Confetti";
import { GameStatus } from "../../constants/enum";
import { loadImage } from "../../utils";

const Digitus = () => {
    const { mutate: submitScore } = useCreateScore();
    const ref = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef(0);
    const [status, setStatus] = useState<GameStatus>(GameStatus.WELCOME);
    const isLoading = useRef(true);
    const isPlaying = useRef(false);
    const isGameOver = useRef(false);
    const countDown = useRef(0);
    const score = useRef(0);

    const bg = useRef<any>(null);
    const d1 = useRef<any>(null);
    const d2 = useRef<any>(null);
    const flush = useRef<any>(null);
    const telos = useRef<any>(null);
    const clock = useRef<any>(null);

    const lastTime = useRef(0);
    const count = useRef(30);
    const coins = useRef<any[]>([]);

    const width = 375, height = 560;

    const render = () => {
        try {
            const canvas = ref.current;
            const ctx = canvas?.getContext('2d');

            if (ctx) {
                if (bg.current) {
                    ctx.drawImage(bg.current, -280, 0);
                }

                if (Math.floor(score.current / 2) % 2 == 0) {
                    if (d1) ctx.drawImage(d1.current, -280, 0);
                }
                if (Math.floor(score.current / 2) % 2 == 1) {
                    if (d2) ctx.drawImage(d2.current, -280, 0);
                    if (flush) {
                        ctx.globalAlpha = 0.9 + Math.random() * 0.2;
                        ctx.drawImage(flush.current, -280 + Math.random() * 8, Math.random() * 8);
                        ctx.globalAlpha = 1;
                    }
                }

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

                coins.current.forEach((coin, index) => {
                    coin.sy += 0.1;
                    coin.x += coin.sx;
                    coin.y += coin.sy;

                    if (telos.current) {
                        ctx.drawImage(telos.current, coin.x, coin.y, coin.d, coin.d);
                    }

                    if (coin.y > height) {
                        coins.current.slice(index, 1);
                    }
                });

                ctx.fillStyle = '#0008';
                ctx.fillRect(0, 528, 375, 32);

                ctx.fillStyle = 'pink';
                ctx.font = '12px Arial';
                ctx.textAlign = 'left';
                if (telos.current) {
                    ctx.drawImage(telos.current, 8, 536, 15, 15);
                }
                ctx.fillText(`$TLOS COINS: ${score.current}`, 30, 545);
                if (clock.current) {
                    ctx.drawImage(clock.current, 264, 536, 15, 15);
                }
                ctx.fillText(`TIMER: ${count.current} sec`, 284, 545);
            }
        } catch (err: any) {
            console.error(err.message);
        }

        animationRef.current = requestAnimationFrame(render);
    }

    const loadAssets = async () => {
        bg.current = await loadImage('/img/digitus/pxArt.png');
        d1.current = await loadImage('/img/digitus/d1.png');
        d2.current = await loadImage('/img/digitus/d2.png');
        telos.current = await loadImage('/img/digitus/telos.png');
        flush.current = await loadImage('/img/digitus/flush.png');
        clock.current = await loadImage('/img/digitus/clock.png');
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

    const initGame = () => {
        isGameOver.current = false;
        score.current = 0;

        count.current = 30;
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
        startCountdown();
        isPlaying.current = true;
    }

    const startCountdown = () => {
        const interval = setInterval(() => {
            if (count.current > 0) {
                count.current--;
            } else {
                handleGameEnd();
                clearInterval(interval);
            }
        }, 1000);
    }

    const handleGameEnd = () => {
        isPlaying.current = false;
        isGameOver.current = true;
        submitScore({
            gameId: 5,
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

    const addCoins = () => {
        const x = 260;
        const y = 440;
        for (let i = 0; i < 5; i++) {
            coins.current.push({
                x,
                y,
                d: Math.random() * 32 + 32,
                sx: (Math.random() - 0.5) * 3,
                sy: -(Math.random() - 0.3) * 5,
            });
        }
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
                            Welcome to "DIGITUS MAXIMUS"
                        </Text>
                        <Text textAlign='center' fontFamily='sans-serif' fontSize={16}>
                            Tap your way to victory—mine those coins before your time runs out!
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
                    onMouseUp={(e) => {
                        if (isPlaying.current) {
                            if (e.button == 0 || e.button == 2) {
                                const curTime = Date.now();
                                if (Date.now() - lastTime.current > 50) {
                                    console.log(curTime);
                                    score.current++;
                                    addCoins();
                                    lastTime.current = curTime;
                                }
                            }
                        }
                    }}
                    onTouchEnd={(e) => {
                        if (isPlaying.current) {
                            if (e.touches.length == 0) {
                                score.current++;
                                addCoins();
                            }
                        }
                    }}
                />
            )}
            {status == GameStatus.RESULT && (
                <Flex direction='column' align='center'>
                    <ConfettiCanvas />
                    <Text fontSize={28} fontWeight='bold'>
                        DIGITUS MAXIMUS
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

export default Digitus;
