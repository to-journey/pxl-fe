import { PlusSquareIcon } from "@chakra-ui/icons";
import { Button, Flex, Grid, Image, Input, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useGetPumpImages } from "../../api/pump_images";
import { useCreateScore } from "../../api/scoreboard";
import ConfettiCanvas from "../../components/Confetti";
import { GameStatus } from "../../constants/enum";
import { IPumpImage } from "../../interfaces";
import { loadImage } from "../../utils";

const random = () => Math.random() - 0.5;
const ballRadius = 20;
const paneWidth = 100, paneHeight = 15;
const acc = 0.5;
const z = 0.01;
const y2 = 540;

const duration = 1.5;
const fps = 60;
const totalFrames = duration * fps;
const swingAngle = (20 * Math.PI) / 180;
const swingsPerSecond = 0.5;
const totalSwingFrames = totalFrames * swingsPerSecond;

const DEAD_ANIMATION: number[] = [];

for (let i = 0; i < totalSwingFrames; i++) {
    const progress = i / totalSwingFrames;
    const angle = swingAngle * Math.sin(progress * 2 * Math.PI);
    DEAD_ANIMATION.push(angle);
}

while (DEAD_ANIMATION.length < 100) {
    DEAD_ANIMATION.push(DEAD_ANIMATION[DEAD_ANIMATION.length % totalSwingFrames]);
}

const BG_COLORS = ['#6DD1E2', '#6B9FE1', '#6A6EE0', '#4A43DE', '#9E2DF1', '#B46AE1'];
const FLAME_COLORS_DOWN = ['#FC968580', '#E8775E7F', '#DF705B70', '#CF66596F', '#C4635860', '#AB5E5730', '#9C5B552F', '#89544920', '#1A1A1A1F', '#11111110'];
const FLAME_COLORS_UP = ['#80E47C80', '#78D4747F', '#70C46C70', '#68B4646F', '#60A45C60', '#58945430', '#50844C2F', '#48744620', '#1A1A1A1F', '#11111110'];

interface IFlame {
    color: string;
    index: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    r: number;
    time: number;
    live: number;
    life: number;
}

enum Direction {
    UP = 'up',
    DOWN = 'down',
}

const Pump = () => {
    const width = 375, height = 560;
    const { mutate: submitScore } = useCreateScore();
    const { pumpImages } = useGetPumpImages();
    const ref = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef(0);
    const [status, setStatus] = useState<GameStatus>(GameStatus.WELCOME);
    const isLoading = useRef(true);
    const isPlaying = useRef(false);
    const isGameOver = useRef(false);
    const countDown = useRef(0);
    const score = useRef(0);

    const fileRef = useRef<HTMLInputElement | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const ballImage = useRef<any>();
    const paneImage = useRef<any>();

    const ball = useRef({ x: 0, y: 0, vx: 0, vy: 0 });
    const paneX = useRef(width / 2 - paneWidth / 2);
    const direction = useRef(Direction.DOWN);
    const flames = useRef<IFlame[]>([]);
    const bgIndex = useRef(0);
    const opacity = useRef(0);
    const animateIndex = useRef(0);

    const render = () => {
        try {
            const canvas = ref.current;
            const ctx = canvas?.getContext('2d');

            if (ctx) {
                const bi = Math.floor(bgIndex.current / 2);
                ctx.fillStyle = BG_COLORS[bi == 0 ? BG_COLORS.length - 1 : bi - 1];
                ctx.fillRect(0, 0, width, height);

                opacity.current = Math.min(1, opacity.current + 0.1);
                ctx.globalAlpha = opacity.current;
                ctx.fillStyle = BG_COLORS[bi];
                ctx.fillRect(0, 0, width, height);

                if (isPlaying.current) {
                    ball.current.x += ball.current.vx;
                    ball.current.y += ball.current.vy;

                    (direction.current == Direction.UP ? FLAME_COLORS_UP : FLAME_COLORS_DOWN).map((color, index) => {
                        for (let i = 0; i < index / 2 + 1; i++) {
                            let vx = random() * index * 0.02 + random() * 0.8;
                            let vy = random() * index * 0.02 + random() * 0.8;
                            const r = Math.random() * 0.01 + (9 - index) * 1.2;
                            const live = 0.02 + index * 0.020;
                            const life = 0.1 + index * 0.025;
                            flames.current.push({ color, index, x: ball.current.x, y: ball.current.y, vx, vy, r, time: 0, live, life });
                        }
                    });

                    flames.current.forEach((flame, index) => {
                        flame.x += flame.vx;
                        flame.y += flame.vy;
                        flame.time += 0.016;
                        if (flame.time > flame.live) {
                            ctx.beginPath();
                            ctx.arc(flame.x, flame.y, flame.r, 0, Math.PI * 2);
                            ctx.fillStyle = flame.color;
                            ctx.fill();
                            ctx.closePath();
                        }
                        if (flame.time > flame.life) {
                            flames.current.splice(index, 1);
                        }
                    });

                    if (ball.current.y + ballRadius > y2 && direction.current != Direction.UP) {
                        direction.current = Direction.UP;
                        const px1 = paneX.current - paneWidth / 2;
                        const px2 = paneX.current + paneWidth / 2;
                        if (ball.current.x < px1 || ball.current.x > px2)
                            handleGameEnd();
                        else score.current++;
                        const d = Math.hypot(ball.current.vx, ball.current.vy);
                        const pxm = (px1 + px2) / 2;
                        const a = Math.atan2(ball.current.vx, ball.current.vy) + (ball.current.x - pxm) * z;
                        const a2 = Math.max(-1.0471, Math.min(1.0471, a));
                        ball.current.vx = Math.sin(a2) * (d + acc);
                        ball.current.vy = -Math.cos(a2) * (d + acc);
                    }

                    if (ball.current.x - ballRadius < 0 || ball.current.x + ballRadius > width)
                        ball.current.vx = -ball.current.vx;

                    if (ball.current.y - ballRadius < 0) {
                        ball.current.vy = -ball.current.vy;
                        direction.current = Direction.DOWN;
                        bgIndex.current += 1;
                        if (bgIndex.current == 12)
                            bgIndex.current = 0;
                        if (bgIndex.current % 2 == 0)
                            opacity.current = 0;
                    }
                }

                if (paneImage.current) {
                    ctx.drawImage(paneImage.current, paneX.current - paneWidth / 2, ball.current.y + ballRadius > y2 - 5 ? ball.current.y + ballRadius : y2 - 5, paneWidth, paneHeight);
                }

                if (ballImage.current) {
                    ctx.save();
                    const angle = isGameOver.current ? DEAD_ANIMATION[animateIndex.current++] : Math.atan2(ball.current.vx, -ball.current.vy);
                    ctx.setTransform(Math.cos(angle), Math.sin(angle), -Math.sin(angle), Math.cos(angle), ball.current.x, ball.current.y);
                    ctx.drawImage(ballImage.current, -ballRadius, -ballRadius, ballRadius * 2, ballRadius * 2);
                    ctx.restore();
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
        paneImage.current = await loadImage('/img/pump/pane.png');
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

        direction.current = Direction.DOWN;
        flames.current = [];

        ball.current.vx = Math.random() * 5 - 2.5
        ball.current.vy = 3.5;
        ball.current.x = 210;
        ball.current.y = 80;
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
        ballImage.current = await loadImage(selectedIndex == pumpImages.length ? (imageUrl as string) : `${import.meta.env.VITE_API_URL}/public/${pumpImages[selectedIndex].image}`);
        initGame();
        setStatus(GameStatus.GAME);
        await setCountDown();
        isPlaying.current = true;
    }

    const handlePaneMove = (x: number) => {
        if (x > width - paneWidth / 2)
            x = width - paneWidth / 2;
        if (x < paneWidth / 2)
            x = paneWidth / 2;
        paneX.current = x;
    }

    const handleGameEnd = () => {
        isPlaying.current = false;
        isGameOver.current = true;
        submitScore({
            gameId: 3,
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
                            Welcome to "PUMP&DUMP"
                        </Text>
                        <Text textAlign='center' fontFamily='sans-serif' fontSize={16}>
                            Get ready to ride the waves of crypto volatility!
                        </Text>
                    </Flex>
                    <Flex direction='column' gap={2}>
                        <Text textAlign='center' fontSize={16}>
                            Choose your avatar
                        </Text>
                        <Grid templateColumns='repeat(4, minmax(0, 1fr))' gap={2}>
                            {pumpImages.map((pumpImage: IPumpImage, index: number) => (
                                <Image
                                    key={index}
                                    w='48px' h='48px'
                                    {...(index == selectedIndex && { bg: '#fff8', border: '2px solid #fffc' })}
                                    rounded={8}
                                    src={`${import.meta.env.VITE_API_URL}/public/${pumpImage.image}`}
                                    onClick={() => setSelectedIndex(index)}
                                />
                            ))}
                            {imageUrl ? (
                                <Image
                                    w='48px' h='48px'
                                    src={imageUrl}
                                    {...(selectedIndex == pumpImages.length && { bg: '#fff8', border: '2px solid #fffc' })}
                                    rounded={8}
                                    onClick={() => setSelectedIndex(pumpImages.length)}
                                />
                            ) : (
                                <Flex justify='center' align='center' onClick={() => fileRef.current?.click()}>
                                    <Input ref={fileRef} type='file' display='none' onChange={(e) => e.target.files && e.target.files.length > 0 && setImageUrl(URL.createObjectURL(e.target.files[0]))} />
                                    <PlusSquareIcon boxSize={8} />
                                </Flex>
                            )}
                        </Grid>
                    </Flex>
                    <Button bg='#6f00ff' color='white' _hover={{ bg: '#00ffcc' }} onClick={startGame}>
                        Start Game
                    </Button>
                </Flex >
            )}
            {
                status == GameStatus.GAME && (
                    <canvas
                        ref={ref}
                        width={width} height={height}
                        style={{ border: "2px solid white", borderRadius: "16px" }}
                        onMouseMove={(e) => {
                            handlePaneMove(e.clientX - ref.current!.getBoundingClientRect().left);
                        }}
                        onTouchMove={(e) => {
                            e.preventDefault();
                            handlePaneMove(e.touches[0].clientX);
                        }}
                    />
                )
            }
            {
                status == GameStatus.RESULT && (
                    <Flex direction='column' align='center'>
                        <ConfettiCanvas />
                        <Text fontSize={28} fontWeight='bold'>
                            PUMP&DUMP
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
                )
            }
        </Flex >
    )
}

export default Pump;
