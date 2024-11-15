const loadImage = async (src) => new Promise((resolve, reject) => {
    const image = new Image();
    image.src = src;
    image.onload = () => resolve(image);
    image.onerror = (err) => reject(err);
});

const random = () => Math.random() - 0.5

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

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
confettiCanvas.width = window.innerWidth;
confettiCanvas.height = window.innerHeight;
const confettiCtx = confettiCanvas.getContext('2d');

const x1 = 10, x2 = 355, y1 = 10, y2 = 540;
const width = 340;
const ballRadius = 20;
const paneWidth = 100, paneHeight = 15;
const acc = 0.5;
const z = 0.01;
const images_count = 6;

const ballV = {};
let ballX, ballY;
let paneX = x1 + width / 2;

let pane = null, ball = null;
let once = false;
let pos;

const duration = 1.5;
const fps = 60;
const totalFrames = duration * fps;
const swingAngle = (20 * Math.PI) / 180;
const swingsPerSecond = 0.5;
const totalSwingFrames = totalFrames * swingsPerSecond;

const DEAD_ANIMATION = [];

for (let i = 0; i < totalSwingFrames; i++) {
    const progress = i / totalSwingFrames;
    const angle = swingAngle * Math.sin(progress * 2 * Math.PI);
    DEAD_ANIMATION.push(angle);
}

while (DEAD_ANIMATION.length < 100) {
    DEAD_ANIMATION.push(DEAD_ANIMATION[DEAD_ANIMATION.length % totalSwingFrames]);
}

let bgIndex = 0;
let opacity = 0;
let score = 0;
let isPlaying = false;
let isDead = false;
let animateIndex = 0;

const BG_COLORS = [
    '#6DD1E2',
    '#6B9FE1',
    '#6A6EE0',
    '#4A43DE',
    '#9E2DF1',
    '#B46AE1',
];

const FLAME_COLORS_DOWN = [
    '#FC968580',
    '#E8775E7F',
    '#DF705B70',
    '#CF66596F',
    '#C4635860',
    '#AB5E5730',
    '#9C5B552F',
    '#89544920',
    '#1A1A1A1F',
    '#11111110',
];

const FLAME_COLORS_UP = [
    '#80E47C80',
    '#78D4747F',
    '#70C46C70',
    '#68B4646F',
    '#60A45C60',
    '#58945430',
    '#50844C2F',
    '#48744620',
    '#1A1A1A1F',
    '#11111110',
];

let flames = [];

function update() {
    const bi = Math.floor(bgIndex / 2);
    ctx.fillStyle = BG_COLORS[bi == 0 ? BG_COLORS.length - 1 : bi - 1];
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    opacity = Math.min(1, opacity + 0.1);
    ctx.globalAlpha = opacity;
    ctx.fillStyle = BG_COLORS[bi];
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.globalAlpha = 0.2;
    ctx.font = '72px Arial';
    ctx.fillStyle = 'black';
    const text = `${score}`;
    const textWidth = ctx.measureText(text).width;
    const textHeight = 72;
    const x = (canvas.width - textWidth) / 2;
    const y = (canvas.height + textHeight / 2) / 2;
    ctx.fillText(text, x, y);
    ctx.globalAlpha = 1.0;

    if (isPlaying) {
        ballX += ballV.x;
        ballY += ballV.y;

        (pos == 'bottom' ? FLAME_COLORS_UP : FLAME_COLORS_DOWN).map((color, index) => {
            for (let i = 0; i < index / 2 + 1; i++) {
                let vx = random() * index * 0.02 + random() * 0.8;
                let vy = random() * index * 0.02 + random() * 0.8;
                const r = Math.random() * 0.01 + (9 - index) * 1.2;
                const live = 0.02 + index * 0.020;
                const life = 0.1 + index * 0.025;
                flames.push({ color, index, x: ballX, y: ballY, vx, vy, r, time: 0, live, life });
            }
        });

        for (let i = 0; i < flames.length; i++) {
            flames[i].x += flames[i].vx;
            flames[i].y += flames[i].vy;
            flames[i].time += 0.016;
            if (flames[i].time > flames[i].live) {
                ctx.beginPath();
                ctx.arc(flames[i].x, flames[i].y, flames[i].r, 0, Math.PI * 2);
                ctx.fillStyle = flames[i].color;
                ctx.fill();
                ctx.closePath();
            }
        }

        flames = flames.filter(flame => flame.life > flame.time);

        if (ballY + ballRadius > y2 && pos != 'bottom') {
            pos = 'bottom';
            const px1 = paneX - paneWidth / 2;
            const px2 = paneX + paneWidth / 2;
            if (ballX < px1 || ballX > px2) {
                handleGameEnd();
                return;
            }
            const d = Math.hypot(ballV.x, ballV.y);
            const pxm = (px1 + px2) / 2;
            const a = Math.atan2(ballV.x, ballV.y) + (ballX - pxm) * z;
            ballV.x = Math.sin(a) * (d + acc);
            ballV.y = -Math.cos(a) * (d + acc);
            score += 1;
        }

        if (ballX - ballRadius < x1 || ballX + ballRadius > x2)
            ballV.x = -ballV.x;

        if (ballY - ballRadius < y1) {
            ballV.y = -ballV.y;
            pos = 'top';
            bgIndex += 1;
            if (bgIndex == 12)
                bgIndex = 0;
            if (bgIndex % 2 == 0)
                opacity = 0;
        }
    }

    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    confetti.forEach((confetto, index) => {
        let width = confetto.dimensions.x * confetto.scale.x;
        let height = confetto.dimensions.y * confetto.scale.y;

        // Move canvas to position and rotate
        confettiCtx.translate(confetto.position.x, confetto.position.y);
        confettiCtx.rotate(confetto.rotation);

        // Apply forces to velocity
        confetto.velocity.x -= confetto.velocity.x * drag;
        confetto.velocity.y = Math.min(confetto.velocity.y + gravity, terminalVelocity);
        confetto.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random();

        // Set position
        confetto.position.x += confetto.velocity.x;
        confetto.position.y += confetto.velocity.y;

        // Delete confetti when out of frame
        if (confetto.position.y >= confettiCanvas.height) confetti.splice(index, 1);

        // Loop confetto x position
        if (confetto.position.x > confettiCanvas.width) confetto.position.x = 0;
        if (confetto.position.x < 0) confetto.position.x = confettiCanvas.width;

        // Spin confetto by scaling y
        confetto.scale.y = Math.cos(confetto.position.y * 0.1);
        confettiCtx.fillStyle = confetto.scale.y > 0 ? confetto.color.front : confetto.color.back;

        // Draw confetti
        confettiCtx.fillRect(-width / 2, -height / 2, width, height);

        // Reset transform matrix
        confettiCtx.setTransform(1, 0, 0, 1, 0, 0);
    });

    ctx.drawImage(pane, paneX - paneWidth / 2, ballY + ballRadius > y2 - 5 ? ballY + ballRadius : y2 - 5, paneWidth, paneHeight);
    if (ball) {
        ctx.save();
        const angle = isDead ? DEAD_ANIMATION[animateIndex++] : Math.atan2(ballV.x, -ballV.y);
        ctx.setTransform(Math.cos(angle), Math.sin(angle), -Math.sin(angle), Math.cos(angle), ballX, ballY);
        ctx.drawImage(ball, -ballRadius, -ballRadius, ballRadius * 2, ballRadius * 2);
        ctx.restore();
    }
}

function animate() {
    update();
    requestAnimationFrame(animate);
}

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

const initGame = () => {
    isDead = false;
    score = 0;
    pos = 'top';
    flames = [];
    ballV.x = Math.random() * 5 - 2.5
    ballV.y = 3.5;
    ballX = 210;
    ballY = 80;
}

const handleGameEnd = () => {
    isPlaying = false;
    isDead = true;
    animateIndex = 0;
    setTimeout(() => {
        $("#game").hide();
        $("#hits").html(`<span class="h2">${score}</span> hits`);
        $("#scoreboard").show();
        initConfetti();
    }, 1500);
}

const handlePaneMove = (x) => {
    if (x > x2 - paneWidth / 2)
        x = x2 - paneWidth / 2;
    if (x < x1 + paneWidth / 2)
        x = x1 + paneWidth / 2;
    paneX = x;
}

const startGame = () => {
    initGame();
    isPlaying = true;
}

window.addEventListener('load', async () => {
    $("#game").hide();
    $("#scoreboard").hide();
    $("#upload_confirm_modal").hide();
    pane = await loadImage('/img/pump/pane.png');
    initGame();
    animate();
});

canvas.addEventListener("mousemove", function (e) {
    handlePaneMove(e.offsetX);
});

canvas.addEventListener("touchmove", function (e) {
    e.preventDefault();
    handlePaneMove(e.touches[0].clientX);
}, { passive: false });

$("#start").click(function () {
    if (!ball)
        return;
    $("#home").hide();
    $("#game").show();
    startGame();
});

$(".icon").click(async function () {
    for (let i = 0; i <= images_count; i++)
        $(`#icon${i}`).toggleClass('selected', false);
    $(this).toggleClass('selected');
    ball = await loadImage($(this).attr('src'));
});

$("#upload").click(async function () {
    $("#upload_confirm_modal").show()
});

$("#play_again").click(() => {
    $("#scoreboard").hide();
    $("#game").show();
    startGame();
});

$("#ok").click(() => {
    $("#upload_confirm_modal").hide();
    const fileInput = document.createElement('input');
    const t = $(fileInput);
    t.attr('type', 'file');
    t.change((e) => {
        if (e.target.files.length > 0) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                ball = await loadImage(e.target.result);
                const icon0 = $("#icon0");
                icon0.attr('src', e.target.result);
                icon0.show();
                icon0.toggleClass('selected');
                $("#picker").hide();
                $("#game").show();
                startGame();
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    });
    fileInput.click();
});

$("#cancel").click(() => {
    $("#upload_confirm_modal").hide();
});

function resizeOps() {
    document.documentElement.style.setProperty("--vh", window.innerHeight * 0.01 + "px");
}

resizeOps();

window.addEventListener("resize", resizeOps);
