import { Button, Flex, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useCreateScore } from "../../api/scoreboard";
import ConfettiCanvas from "../../components/Confetti";
import { GameStatus } from "../../constants/enum";
import { loadImage } from "../../utils";


const Rock = () => {
    const { mutate: submitScore } = useCreateScore();
    const ref = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef(0);
    const [status, setStatus] = useState<GameStatus>(GameStatus.WELCOME);
    const isLoading = useRef(true);
    const isPlaying = useRef(false);
    const isGameOver = useRef(false);
    const countDown = useRef(0);
    const score = useRef(0);
    const wallsRef = useRef<HTMLImageElement[]>([]);
    const ballsRef = useRef<HTMLImageElement[]>([]);

    const pos = useRef(0);
    const panes = useRef<any[]>([]);
    const particles = useRef<any[]>([]);
    const colorIndex = useRef(0);

    const width = 375, height = 560;

    const render = () => {
        try {
            const canvas = ref.current;
            const ctx = canvas?.getContext('2d');

            if (ctx) {
                ctx.clearRect(0, 0, width, height);

                if (isPlaying.current) {
                    pos.current += 2 + (pos.current * 0.0002);

                    ctx.drawImage(ballsRef.current[colorIndex.current], 171.5, 520);

                    for (let i = 0; i < panes.current.length; i++) {
                        const index = panes.current[i];
                        const y = height - (400 + i * 400 - pos.current);
                        if (y >= -400 && y <= height) {
                            ctx.drawImage(wallsRef.current[index], 0, y);
                        }
                    }

                    if (score.current * 400 - pos.current < -340) {
                        if (colorIndex.current != panes.current[score.current]) {
                            handleGameEnd();
                        } else {
                            score.current++;
                            addParticles(185.5, 520);
                        }
                    }

                    particles.current.forEach((particle, index) => {
                        particle.x += particle.sx;
                        particle.y += particle.sy;
                        particle.time += 0.016;
                        ctx.drawImage(ballsRef.current[colorIndex.current], particle.x - particle.r / 2, particle.y - particle.r / 2, particle.r, particle.r);
                        if (particle.time > particle.lifetime) {
                            particles.current.splice(index, 1);
                        }
                    });
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
        wallsRef.current = [
            await loadImage('/img/rock/wall1.png'),
            await loadImage('/img/rock/wall2.png'),
            await loadImage('/img/rock/wall3.png'),
        ];
        ballsRef.current = [
            await loadImage('/img/rock/bullet1.png'),
            await loadImage('/img/rock/bullet2.png'),
            await loadImage('/img/rock/bullet3.png'),
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

    const initGame = () => {
        for (let i = 0; i < 128; i++) {
            let index = 3;
            while (index == 3) {
                index = Math.floor(Math.random() * 3);
            }
            panes.current.push(index);
        }
        pos.current = 0;
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

    const addParticles = (x: number, y: number) => {
        for (let i = 0; i < 100; i++) {
            particles.current.push({
                x: x + (Math.random() - 0.5) * 2,
                y: y + (Math.random() - 0.5) * 2,
                sx: (Math.random() - 0.5) * 2,
                sy: (Math.random() - 0.8) * 4,
                r: 0.5 + Math.random() * 4,
                time: 0,
                lifetime: 0.25 + Math.random() * 0.1,
            });
        }
    }

    const handleClick = () => {
        if (isPlaying.current) {
            colorIndex.current = (colorIndex.current + 1) % 3;
        }
    }

    const handleGameEnd = () => {
        isPlaying.current = false;
        isGameOver.current = true;
        submitScore({
            gameId: 7,
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
                            Welcome to "ROCK&ROLL"
                        </Text>
                        <Text textAlign='center' fontFamily='sans-serif' fontSize={16}>
                            Get ready to tap your way through the cosmic speedway of blocks!
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
                    onMouseDown={handleClick}
                    onTouchStart={handleClick}
                />
            )}
            {status == GameStatus.RESULT && (
                <Flex direction='column' align='center'>
                    <ConfettiCanvas />
                    <Text fontSize={28} fontWeight='bold'>
                        ROCK&ROLL
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

export default Rock;
