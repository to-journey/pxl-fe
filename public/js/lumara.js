const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let bg_img;
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
});

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

function gameLoop() {
    const width = canvas.width;
    const heihgt = canvas.height;

    const memCanvas = document.createElement('canvas');
    memCanvas.width = width;
    memCanvas.height = heihgt;
    const memCtx = memCanvas.getContext('2d');

    if (bg_img) {
        memCtx.drawImage(bg_img, 0, 0, width, heihgt);
    }

    memCtx.fillStyle = "white";
    memCtx.font = "24px Arial";
    memCtx.fillText(`Score: ${score}`, 10, 30);

    if (gameOver) {
        memCtx.fillStyle = "red";
        memCtx.font = "48px Arial";
        memCtx.textAlign = "center";
        memCtx.fillText("Game Over!", canvas.width / 2, canvas.height / 2);
    }

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

        rocket.x = Math.max(0, Math.min(width - rocket.width, input.x));
        rocket.y = Math.max(0, Math.min(heihgt - rocket.height, input.y));

        const index = Math.floor(score / 10);
        memCtx.save();
        memCtx.translate(rocket.x, rocket.y);
        if (tank_img[index]) {
            memCtx.drawImage(tank_img[index], -2, -2);
        }
        memCtx.restore();

        for (let i = rocks.length - 1; i >= 0; i--) {
            const rock = rocks[i];
            rock.y += gameSpeed;

            memCtx.save();
            memCtx.translate(rock.x, rock.y);
            memCtx.scale(0.15, 0.15);
            rock.gif.render(memCtx, -40, -100);
            memCtx.restore();

            if (isColliding(rocket, rock)) {
                gameOver = true;
                isPlaying = false;
            }

            if (rock.y > heihgt) {
                rocks.splice(i, 1);
            }
        }

        for (let i = coins.length - 1; i >= 0; i--) {
            const coin = coins[i];
            coin.y += gameSpeed;

            memCtx.save();
            memCtx.translate(coin.x, coin.y);
            memCtx.scale(0.1, 0.1);
            coin.gif.render(memCtx, -50, -250);
            memCtx.restore();

            if (isColliding(rocket, coin)) {
                score++;
                gameSpeed += 0.1;
                coins.splice(i, 1);
            }

            if (coin.y > heihgt) {
                coins.splice(i, 1);
            }
        }
    }

    ctx.drawImage(memCanvas, 0, 0);

    requestAnimationFrame(gameLoop);
}

gameLoop();

let isLoading = true;

async function loadAssets() {
    bg_img = await loadImage("/img/lumara/BGR-mobile.png");
    coin_img = await loadGif("/img/lumara/drop.gif");
    rock_img = await loadGif("/img/lumara/rock.gif");
    for (let i = 0; i <= 100; i += 10) {
        const img = await loadImage(`/img/lumara/${i}.png`);
        tank_img.push(img);
    }
    isLoading = false;
}

loadAssets();

$("#start").click(async function () {
    await new Promise((resolve) => {
        const timerId = setInterval(() => {
            if (!isLoading) {
                clearInterval(timerId);
                resolve(true);
            }
        }, 100);
    });

    rocks = [];
    coins = [];

    gameSpeed = 2;
    score = 0;
    gameOver = false;

    coin_spawn_elapse = 0;
    rock_spawn_elapse = 0;

    isPlaying = true;
});
