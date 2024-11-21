const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let tank_img = [];
let coin_img;

const rocket = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 100,
    width: 50,
    height: 50,
};

const rocks = [];
const coins = [];
let gameSpeed = 2;
let score = 0;
let gameOver = false;

const input = { x: rocket.x };

canvas.addEventListener("mousemove", (e) => {
    input.x = e.clientX - canvas.getBoundingClientRect().left - rocket.width / 2;
    input.y = e.clientY - canvas.getBoundingClientRect().top - rocket.height / 2;
});

canvas.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    input.x = touch.clientX - canvas.getBoundingClientRect().left - rocket.width / 2;
    input.y = touch.clientY - canvas.getBoundingClientRect().top - rocket.height / 2;
});

function spawnRock() {
    const size = Math.random() * 40 + 30;
    rocks.push({
        x: Math.random() * (canvas.width - size),
        y: -size,
        width: size,
        height: size,
    });
}

function spawnCoin() {
    const size = 20;
    let validPosition = false;
    let x, y;

    while (!validPosition) {
        x = Math.random() * (canvas.width - size);
        y = -size;

        validPosition = rocks.every((rock) => {
            return !(
                x < rock.x + rock.width &&
                x + size > rock.x &&
                y < rock.y + rock.height &&
                y + size > rock.y
            );
        });
    }

    coins.push({
        x,
        y,
        width: size,
        height: size,
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

function gameLoop() {
    if (gameOver) {
        ctx.fillStyle = "red";
        ctx.font = "48px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    rocket.x = Math.max(0, Math.min(canvas.width - rocket.width, input.x));
    rocket.y = Math.max(0, Math.min(canvas.height - rocket.height, input.y));
    ctx.fillRect(rocket.x, rocket.y, rocket.width, rocket.height);

    for (let i = rocks.length - 1; i >= 0; i--) {
        const rock = rocks[i];
        rock.y += gameSpeed;

        ctx.fillStyle = "gray";
        ctx.fillRect(rock.x, rock.y, rock.width, rock.height);

        if (isColliding(rocket, rock)) {
            gameOver = true;
        }

        if (rock.y > canvas.height) {
            rocks.splice(i, 1);
        }
    }

    for (let i = coins.length - 1; i >= 0; i--) {
        const coin = coins[i];
        coin.y += gameSpeed;

        ctx.fillStyle = "gold";
        ctx.beginPath();
        ctx.arc(coin.x + coin.width / 2, coin.y + coin.height / 2, coin.width / 2, 0, Math.PI * 2);
        ctx.fill();

        if (isColliding(rocket, coin)) {
            score++;
            gameSpeed += 0.5;
            coins.splice(i, 1);
        }

        if (coin.y > canvas.height) {
            coins.splice(i, 1);
        }
    }

    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.fillText(`Score: ${score}`, 10, 30);

    requestAnimationFrame(gameLoop);
}

setInterval(spawnRock, 750);
setInterval(spawnCoin, 1200);

gameLoop();

$("#start").click(async function () {
    for (let i = 0; i <= 100; i += 10) {
        const img = await loadImage(`/img/lumara/${i}.png`);
        console.log(img);
        tank_img.push(img);
    }
    coin_img = await loadGif(`/img/lumara/drop.gif`);
    console.log(coin_img);
});
