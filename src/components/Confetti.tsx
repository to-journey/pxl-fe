import { useEffect, useRef } from 'react';

type Confetti = {
    color: {
        front: string;
        back: string;
    };
    dimensions: {
        x: number;
        y: number;
    };
    position: {
        x: number;
        y: number;
    };
    rotation: number;
    scale: {
        x: number;
        y: number;
    };
    velocity: {
        x: number;
        y: number;
    };
};

const confettiCount = 600;
const gravity = 0.5;
const terminalVelocity = 5;
const drag = 0.075;
const colors = [
    { front: 'red', back: 'darkred' },
    { front: 'green', back: 'darkgreen' },
    { front: 'blue', back: 'darkblue' },
    { front: 'yellow', back: 'darkyellow' },
    { front: 'orange', back: 'darkorange' },
    { front: 'pink', back: 'darkpink' },
    { front: 'purple', back: 'darkpurple' },
    { front: 'turquoise', back: 'darkturquoise' },
];

const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;

let requestId: number;
let confetti: Confetti[] = [];

export interface Props {
    onFinish?: () => void;
}

const ConfettiCanvas = () => {
    const previousTimestampRef = useRef(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const initConfetti = () => {
        for (let i = 0; i < confettiCount; i++) {
            confetti.push({
                color: colors[Math.floor(randomRange(0, colors.length))],
                dimensions: {
                    x: randomRange(5, 10),
                    y: randomRange(5, 15),
                },
                position: {
                    x: randomRange(0, window.innerWidth),
                    y: window.innerHeight - 1,
                },
                rotation: randomRange(0, 2 * Math.PI),
                scale: {
                    x: 1,
                    y: 1,
                },
                velocity: {
                    x: randomRange(-25, 25),
                    y: randomRange(0, -50),
                },
            });
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        initConfetti();

        const gameLoop = (timestamp: DOMHighResTimeStamp) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            confetti.forEach((confetto, index) => {
                let width = confetto.dimensions.x * confetto.scale.x;
                let height = confetto.dimensions.y * confetto.scale.y;

                ctx.translate(confetto.position.x, confetto.position.y);
                ctx.rotate(confetto.rotation);

                confetto.velocity.x -= confetto.velocity.x * drag;
                confetto.velocity.y = Math.min(confetto.velocity.y + gravity, terminalVelocity);
                confetto.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random();

                confetto.position.x += confetto.velocity.x;
                confetto.position.y += confetto.velocity.y;

                if (confetto.position.y >= canvas.height) confetti.splice(index, 1);

                if (confetto.position.x > canvas.width) confetto.position.x = 0;
                if (confetto.position.x < 0) confetto.position.x = canvas.width;

                confetto.scale.y = Math.cos(confetto.position.y * 0.1);
                ctx.fillStyle = confetto.scale.y > 0 ? confetto.color.front : confetto.color.back;

                ctx.fillRect(-width / 2, -height / 2, width, height);

                ctx.setTransform(1, 0, 0, 1, 0, 0);
            });

            previousTimestampRef.current = timestamp;
            requestId = requestAnimationFrame(gameLoop);
        };

        requestId = requestAnimationFrame(gameLoop);

        return () => {
            confetti = [];
            cancelAnimationFrame(requestId);
        };
    }, [canvasRef]);

    return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 50 }} />;
};

export default ConfettiCanvas;
