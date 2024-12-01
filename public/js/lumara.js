const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let bg_img = [];
let bg;
let tank_img = [];
let coin_img = [];
let rock_img = [];

let rocks = [];
let coins = [];
let gameSpeed = 2;
let score = 0;
let gameOver = false;

const rocket = {
    x: canvas.width / 2 - 24,
    y: canvas.height - 108,
    width: 45,
    height: 105,
};

const input = { x: rocket.x, y: rocket.y };

canvas.addEventListener("mousemove", (e) => {
    input.x = e.clientX - canvas.getBoundingClientRect().left - rocket.width / 2;
    input.y = e.clientY - canvas.getBoundingClientRect().top - rocket.height;
});

canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    input.x = touch.clientX - canvas.getBoundingClientRect().left - rocket.width / 2;
    input.y = touch.clientY - canvas.getBoundingClientRect().top - rocket.height;
}, { passive: false });

function spawnRock() {
    const width = 30;
    const height = 45;
    rocks.push({
        x: Math.random() * (canvas.width - width),
        y: -height,
        width,
        height,
        gif: new GIF(rock_img),
    });
}

function spawnCoin() {
    const width = 35;
    const height = 50;
    let validPosition = false;
    let x, y;

    while (!validPosition) {
        x = Math.random() * (canvas.width - width);
        y = -height;

        validPosition = rocks.every((rock) => {
            return !(
                x < rock.x + rock.width &&
                x + width > rock.x &&
                y < rock.y + rock.height &&
                y + height > rock.y
            );
        });
    }

    coins.push({
        x,
        y,
        width,
        height,
        gif: new GIF(coin_img),
    });
}

function isColliding(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

let coin_spawn_elapse = 0;
let rock_spawn_elapse = 0;

let isPlaying = false;
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

    const memCanvas = document.createElement('canvas');
    memCanvas.width = width;
    memCanvas.height = height;
    const memCtx = memCanvas.getContext('2d');

    if (bg) {
        bg.render(memCtx, 0, 0);
    } else {
        memCtx.fillStyle = '#6DD1E2';
        memCtx.fillRect(0, 0, width, height);
    }

    memCtx.fillStyle = "white";
    memCtx.font = "24px Arial";
    memCtx.fillText(`Score: ${score}`, 10, 30);

    if (gameOver) {
        memCtx.fillStyle = "red";
        memCtx.font = "48px Arial";
        memCtx.textAlign = "center";
        memCtx.fillText("Game Over!", width / 2, height / 2);
    }

    if (countDown >= 0) {
        memCtx.font = "36px Arial";
        memCtx.textAlign = "center";
        memCtx.textBaseline = "middle";

        const x = width / 2;
        const y = height / 2;

        memCtx.fillStyle = "white";
        memCtx.fillText(countDown == 4 ? 'Loading assets...' : (countDown > 0 ? `${countDown}` : 'GO!'), x, y);
    }

    rocket.x = Math.max(0, Math.min(width - rocket.width, input.x));
    rocket.y = Math.max(0, Math.min(height - rocket.height, input.y));

    const index = Math.floor(score / 10);
    memCtx.save();
    memCtx.translate(rocket.x, rocket.y);
    if (tank_img[index]) {
        memCtx.drawImage(tank_img[index], -2, -2);
    }
    memCtx.restore();

    if (isPlaying) {
        coin_spawn_elapse++;
        rock_spawn_elapse++;

        if (coin_spawn_elapse > 120 - gameSpeed * 10) {
            coin_spawn_elapse = 0;
            spawnCoin();
        }

        if (rock_spawn_elapse > 90 - gameSpeed * 10) {
            rock_spawn_elapse = 0;
            spawnRock();
        }

        for (let i = rocks.length - 1; i >= 0; i--) {
            const rock = rocks[i];
            rock.y += gameSpeed;

            memCtx.save();
            memCtx.translate(rock.x, rock.y);
            rock.gif.render(memCtx, -6, -15);
            memCtx.restore();

            if (isColliding(rocket, rock)) {
                handleGameEnd();
            }

            if (rock.y > height) {
                rocks.splice(i, 1);
            }
        }

        for (let i = coins.length - 1; i >= 0; i--) {
            const coin = coins[i];
            coin.y += gameSpeed;

            memCtx.save();
            memCtx.translate(coin.x, coin.y);
            coin.gif.render(memCtx, -5, -25);
            memCtx.restore();

            if (isColliding(rocket, coin)) {
                score++;
                gameSpeed += 0.1;
                coins.splice(i, 1);
            }

            if (coin.y > height) {
                coins.splice(i, 1);
            }
        }
    }

    ctx.drawImage(memCanvas, 0, 0);

    drawConfetti();
    requestAnimationFrame(gameLoop);
}

gameLoop();

const handleGameEnd = () => {
    isPlaying = false;
    gameOver = true;
    submitScore(4, score);
    $("#score").html(`Score: ${score}`);
    setTimeout(() => {
        $("#game").addClass('hide');
        $("#scoreboard").removeClass('hide');
        initConfetti();
    }, 1000);
}

async function loadAssets() {
    bg_img = await loadGif("/img/lumara/bg.gif");
    bg = new GIF(bg_img);
    coin_img = await loadGif("/img/lumara/drop.gif");
    rock_img = await loadGif("/img/lumara/rock.gif");
    for (let i = 0; i <= 100; i += 10) {
        const img = await loadImage(`/img/lumara/${i}.png`);
        tank_img.push(img);
    }
    countDown = 3;
}

loadAssets();

function startGame() {
    rocks = [];
    coins = [];

    gameSpeed = 2;
    score = 0;
    gameOver = false;

    coin_spawn_elapse = 0;
    rock_spawn_elapse = 0;

    const timerId = setInterval(() => {
        countDown--;
        if (countDown == -1) {
            clearInterval(timerId);
            isPlaying = true;
        }
    }, 1000);
}

$("#start").click(async function () {
    $("#welcome").hide();
    $("#game").removeClass('hide');
    await new Promise((resolve) => {
        const timerId = setInterval(() => {
            if (countDown < 4) {
                clearInterval(timerId);
                resolve(true);
            }
        }, 100);
    });
    startGame();
});

$("#play_again").click(function () {
    if (isPlaying) return;
    $("#game").removeClass('hide');
    $("#scoreboard").addClass('hide');
    startGame();
});