function resizeOps() {
    document.documentElement.style.setProperty("--vh", window.innerHeight * 0.01 + "px");
}

resizeOps();

window.addEventListener("resize", resizeOps);

const submitScore = (gameId, score, time) => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
        console.error("No user ID found in local storage. Cannot submit score.");
        return;
    }
    fetch(`https://pxl8d.top/api/submit_score/${gameId}/${userId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            score,
            time,
        }),
    })
        .then(response => response.json())
        .then(data => {
            console.log("Response from server:", data);
        })
        .catch(error => console.error("Error sending score:", error));
}

const loadImage = async (src) => new Promise((resolve, reject) => {
    const image = new Image();
    image.src = src;
    image.onload = () => resolve(image);
    image.onerror = (err) => reject(err);
});

const loadGif = async (src) => new Promise((resolve) => {
    fetch(src)
        .then(response => response.arrayBuffer())
        .then(buffer => {
            const gifReader = new GifReader(new Uint8Array(buffer));
            const width = gifReader.width;
            const height = gifReader.height;

            const totalFrames = gifReader.numFrames();
            const frames = [];

            for (let i = 0; i < totalFrames; i++) {
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                const imageData = ctx.createImageData(width, height);
                gifReader.decodeAndBlitFrameRGBA(i, imageData.data);
                ctx.putImageData(imageData, 0, 0);
                frames.push(canvas);
            }

            resolve(frames);
        });
});

class GIF {
    constructor(frames) {
        this.frames = frames;
        this.currentFrame = 0;
    }

    render(ctx, x, y) {
        if (this.frames.length === 0) return;
        ctx.drawImage(this.frames[this.currentFrame], x, y);
        this.currentFrame = (this.currentFrame + 1) % this.frames.length;
    }
}
