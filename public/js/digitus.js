const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let bg;
let d1, d2;
let flush;
let telos;
let clock;

let count = 30;
let score = 0;
const coins = [];

let isPlaying = false;
let gameOver = false;
let countDown = 4;

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

const randomRange = (min, max) => Math.random() * (max - min) + min;

let confetti = [];
const confettiCanvas = document.getElementById('confettiCanvas');
confettiCanvas.width = window.innerWidth;
confettiCanvas.height = window.innerHeight;
const confettiCtx = confettiCanvas.getContext('2d');


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
                y: window.innerHeight - 10,
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

const drawConfetti = () => {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    confetti.forEach((confetto, index) => {
        let width = confetto.dimensions.x * confetto.scale.x;
        let height = confetto.dimensions.y * confetto.scale.y;

        confettiCtx.translate(confetto.position.x, confetto.position.y);
        confettiCtx.rotate(confetto.rotation);

        confetto.velocity.x -= confetto.velocity.x * drag;
        confetto.velocity.y = Math.min(confetto.velocity.y + gravity, terminalVelocity);
        confetto.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random();

        confetto.position.x += confetto.velocity.x;
        confetto.position.y += confetto.velocity.y;

        if (confetto.position.y >= confettiCanvas.height) confetti.splice(index, 1);

        if (confetto.position.x > confettiCanvas.width) confetto.position.x = 0;
        if (confetto.position.x < 0) confetto.position.x = confettiCanvas.width;

        confetto.scale.y = Math.cos(confetto.position.y * 0.1);
        confettiCtx.fillStyle = confetto.scale.y > 0 ? confetto.color.front : confetto.color.back;

        confettiCtx.fillRect(-width / 2, -height / 2, width, height);

        confettiCtx.setTransform(1, 0, 0, 1, 0, 0);
    });
}

function gameLoop() {
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    if (bg) ctx.drawImage(bg, -280, 0);

    if (Math.floor(score / 2) % 2 == 0) {
        if (d1) ctx.drawImage(d1, -280, 0);
    }
    if (Math.floor(score / 2) % 2 == 1) {
        if (d2) ctx.drawImage(d2, -280, 0);
        if (flush) {
            ctx.globalAlpha = 0.9 + Math.random() * 0.2;
            ctx.drawImage(flush, -280 + Math.random() * 8, Math.random() * 8);
            ctx.globalAlpha = 1;
        }
    }

    if (gameOver) {
        ctx.fillStyle = "red";
        ctx.font = "48px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Game Over!", width / 2, height / 2);
    }

    if (countDown >= 0) {
        ctx.font = "36px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const x = width / 2;
        const y = height / 2;

        ctx.fillStyle = "white";
        ctx.fillText(countDown == 4 ? 'Loading assets...' : (countDown > 0 ? `${countDown}` : 'GO!'), x, y);
    }

    coins.forEach((coin, index) => {
        coin.sy += 0.1;
        coin.x += coin.sx;
        coin.y += coin.sy;

        if (telos) {
            ctx.drawImage(telos, coin.x, coin.y, coin.d, coin.d);
        }

        if (coin.y > height) {
            coins.slice(index, 1);
        }
    });

    ctx.fillStyle = '#0008';
    ctx.fillRect(0, 528, 375, 32);

    ctx.fillStyle = 'pink';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    if (telos) {
        ctx.drawImage(telos, 8, 536, 15, 15);
    }
    ctx.fillText(`$TLOS COINS: ${score}`, 30, 545);
    if (clock) {
        ctx.drawImage(clock, 264, 536, 15, 15);
    }
    ctx.fillText(`TIMER: ${count} sec`, 284, 545);

    drawConfetti();
    requestAnimationFrame(gameLoop);
}

gameLoop();

const loadAssets = async () => {
    bg = await loadImage('/img/digitus/pxArt.png');
    d1 = await loadImage('/img/digitus/d1.png');
    d2 = await loadImage('/img/digitus/d2.png');
    telos = await loadImage('/img/digitus/telos.png');
    flush = await loadImage('/img/digitus/flush.png');
    clock = await loadImage('/img/digitus/clock.png');
    countDown = 3;
}

loadAssets();

function addCoins() {
    const x = 260;
    const y = 440;
    for (let i = 0; i < 5; i++) {
        coins.push({
            x,
            y,
            d: Math.random() * 32 + 32,
            sx: (Math.random() - 0.5) * 3,
            sy: -(Math.random() - 0.3) * 5,
        });
    }
}

canvas.addEventListener("mouseup", () => {
    if (isPlaying) {
        score++;
        addCoins();
    }
});

canvas.addEventListener("touchend", (e) => {
    e.preventDefault();
    if (isPlaying && e.touches.length == 0) {
        score++;
        addCoins();
    }
}, { passive: false });

const handleGameEnd = () => {
    isPlaying = false;
    gameOver = true;
    submitScore(5, score);
    $("#score").html(`Score: ${score}`);
    setTimeout(() => {
        $("#game").addClass('hide');
        $("#scoreboard").removeClass('hide');
        initConfetti();
    }, 1000);
}

function startCountdown() {
    const interval = setInterval(() => {
        if (count > 0) {
            count--;
        } else {
            handleGameEnd();
            clearInterval(interval);
        }
    }, 1000);
}

async function startGame() {
    await new Promise((resolve) => {
        const timerId = setInterval(() => {
            if (countDown < 4) {
                clearInterval(timerId);
                resolve(true);
            }
        }, 100);
    });

    count = 30;
    score = 0;

    countDown = 3;
    gameOver = false;

    const timerId = setInterval(() => {
        countDown--;
        if (countDown == -1) {
            clearInterval(timerId);
            isPlaying = true;
            startCountdown();
        }
    }, 1000);
}

$("#start").click(async function () {
    $("#welcome").hide();
    $("#game").removeClass('hide');
    startGame();
});

$("#play_again").click(function () {
    if (isPlaying) return;
    $("#game").removeClass('hide');
    $("#scoreboard").addClass('hide');
    startGame();
});
