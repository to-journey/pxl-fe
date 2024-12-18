import { Button, Flex, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useCreateScore } from "../../api/scoreboard";
import ConfettiCanvas from "../../components/Confetti";
import { GameStatus } from "../../constants/enum";
import { loadImage } from "../../utils";

const Velocitas = () => {
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
    const block = useRef<any>(null);

    const lines = useRef<any[]>([]);
    const particles = useRef<any[]>([]);
    const state = useRef({ i: -1, j: 0, p: 0 });
    const pos = useRef({ x: 0, y: 0 });

    const width = 375, height = 560;

    const render = () => {
        try {
            const canvas = ref.current;
            const ctx = canvas?.getContext('2d');

            if (ctx) {
                if (bg.current) {
                    ctx?.drawImage(bg.current, 0, 0);
                }
                lines.current = lines.current.map((line, i) => {
                    const points = line?.map((point: any, j: number) => {
                        if (j > 0 && j < line.length - 1) {
                            ctx.beginPath();
                            ctx.arc(point.x, point.y, point.r, 0, Math.PI * 2);
                            ctx.fillStyle = '#fffc';
                            ctx.fill();
                            const gradient = ctx.createRadialGradient(2, 4, 0, 2, 4, 4);

                            gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
                            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

                            ctx.fillStyle = gradient;
                            ctx.fillRect(point.x - 4, point.y - 4, 8, 8);
                        }
                        if (j > 0) {
                            ctx.beginPath();
                            ctx.moveTo(line[j - 1].x, line[j - 1].y);
                            ctx.lineTo(line[j].x, line[j].y);
                            ctx.lineWidth = 2;
                            const d = Math.hypot(line[j].x - line[j - 1].x, line[j].y - line[j - 1].y);
                            const o = Math.floor(255 / (1 + d * 0.04));
                            if (state.current.i == i) ctx.strokeStyle = '#fff8';
                            else ctx.strokeStyle = `#ffffff${o.toString(16).padStart(2, '0')}`;
                            ctx.stroke();
                        }
                        let sx = point.sx;
                        let sy = point.sy;
                        const x = point.x + sx;
                        const y = point.y + sy;
                        if (x < 0 || x > width) sx = -sx;
                        if (y < 0 || y > width) sy = -sy;
                        return { x, y, sx, sy, r: point.r };
                    });
                    return points;
                });
                if (isPlaying.current) {
                    let { i, j, p } = state.current;
                    const line = lines.current[i];
                    const d = Math.hypot(line[j + 1].x - line[j].x, line[j + 1].y - line[j].y);
                    const d2 = d * p + Math.ceil((score.current + 1) / 5) * 2;
                    if (d2 > d) {
                        j++;
                        p = 0;
                        if (j >= line.length - 1) {
                            handleGameEnd();
                        }
                    } else {
                        p = d2 / d;
                    }
                    if (j < line.length - 1) {
                        state.current = { ...state.current, i, j, p };
                        const x = line[j].x * (1 - p) + line[j + 1].x * p;
                        const y = line[j].y * (1 - p) + line[j + 1].y * p;
                        if (block.current) {
                            ctx.drawImage(block.current, x - 32, y - 32, 64, 64);
                        }
                        pos.current = { x, y };

                        particles.current.forEach((particle, index) => {
                            particle.x += particle.sx;
                            particle.y += particle.sy;
                            particle.time += 0.016;
                            ctx.beginPath();
                            ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
                            ctx.fillStyle = '#fffc';
                            ctx.fill();
                            if (particle.time > particle.lifetime) {
                                particles.current.splice(index, 1);
                            }
                        });
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
        bg.current = await loadImage('/img/velocitas/bg.png');
        block.current = await loadImage('/img/velocitas/block.png');;
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
        lines.current = [];
        for (let i = 0; i < 8; i++) {
            const length = Math.floor(6 + Math.random() * 4);
            const line = Array.from(
                { length },
                (_, index) => {
                    let x = Math.random() * width, y = Math.random() * height;
                    let sx = (Math.random() - 0.5) * 0.5, sy = (Math.random() - 0.5) * 0.5;
                    if (index == 0 || index == length - 1) {
                        if (Math.random() > 0.5) {
                            x = 0;
                            sx = 0;
                            if (Math.random() > 0.5) {
                                x = width;
                            }
                        } else {
                            y = 0;
                            sy = 0;
                            if (Math.random() > 0.5) {
                                y = height;
                            }
                        }
                    }
                    return { x, y, sx, sy, r: 2 + Math.random() * 2 };
                },
            );
            lines.current.push(line);
        }
        isGameOver.current = false;
        score.current = 0;
        state.current = { ...state.current, i: -1 };
    }

    const placeBlock = () => {
        let i = 8;
        while (i == 8)
            i = Math.floor(Math.random() * 8);
        state.current = { ...state.current, i, j: 0, p: 0 };
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
        placeBlock();
        isPlaying.current = true;
    }

    const addParticles = (x: number, y: number) => {
        for (let i = 0; i < 100; i++) {
            particles.current.push({
                x: x + (Math.random() - 0.5) * 5,
                y: y + (Math.random() - 0.5) * 5,
                sx: (Math.random() - 0.5) * 2,
                sy: (Math.random() - 0.5) * 2,
                r: 0.5 + Math.random() * 2,
                time: 0,
                lifetime: 0.5 + Math.random() * 0.25,
            });
        }
    }

    const handleClick = (x: number, y: number) => {
        if (isPlaying.current) {
            if (x >= pos.current.x - 48 && x <= pos.current.x + 48 && y >= pos.current.y - 48 && y <= pos.current.y + 48) {
                score.current++;
                placeBlock();
                addParticles(x, y);
            }
        }
    }

    const handleGameEnd = () => {
        isPlaying.current = false;
        isGameOver.current = true;
        submitScore({
            gameId: 6,
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
                            Welcome to "VELOCITAS BLOCCA"
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
                    onMouseDown={(e) => handleClick(e.clientX - ref.current!.getBoundingClientRect().left, e.clientY - ref.current!.getBoundingClientRect().top)}
                    onTouchStart={(e) => e.touches.length == 0 && handleClick(e.touches[0].clientX - ref.current!.getBoundingClientRect().left, e.touches[0]!.clientY - ref.current!.getBoundingClientRect().top)}
                />
            )}
            {status == GameStatus.RESULT && (
                <Flex direction='column' align='center'>
                    <ConfettiCanvas />
                    <Text fontSize={28} fontWeight='bold'>
                        VELOCITAS BLOCCA
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

export default Velocitas;
