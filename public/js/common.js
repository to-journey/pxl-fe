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

const loadGif = async(src) => new Promise((resolve) => {
    fetch(src)
        .then(response => response.blob())
        .then(blob => {
            const gif = new window.GIF(blob);
            console.log(gif);
            gif.load(blob);
            gif.on('parsed', function() {
                resolve(gif.frames);
            });
        });
});