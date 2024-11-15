let currentQuestionIndex = 0;
let score = 0;
let elapsedTime = 0;
let timerInterval;

let questions = [];

async function startGame() {
    const result = await new Promise((resolve, reject) => {
        fetch(`https://pxl8d.top/api/questions`)
            .then(response => resolve(response.json()))
            .catch(error => reject(error));
    });

    questions = JSON.parse(result.questions);

    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    currentQuestionIndex = 0;
    score = 0;
    elapsedTime = 0;
    document.getElementById('score').textContent = score;
    document.querySelector('.button-container').style.display = 'block';
    startTimer();
    loadQuestion();
}

function loadQuestion() {
    if (currentQuestionIndex >= questions.length) {
        endGame();
        return;
    }
    const questionObj = questions[currentQuestionIndex];
    document.getElementById('question-text').textContent = questionObj.question;
    document.querySelector('.question-container').style.backgroundImage = questionObj.background;
    document.getElementById('feedback').textContent = '';
    document.getElementById('feedback').className = 'feedback';
    document.getElementById('explanation').textContent = '';

    document.getElementById('myth-button').disabled = false;
    document.getElementById('fact-button').disabled = false;
    document.getElementById('next-button').style.display = 'none';
}

function submitAnswer(answer) {
    const questionObj = questions[currentQuestionIndex];
    if (answer === questionObj.answer) {
        score++;
        document.getElementById('feedback').textContent = "Correct!";
        document.getElementById('feedback').className = 'feedback correct';
    } else {
        document.getElementById('feedback').textContent = "Wrong!";
        document.getElementById('feedback').className = 'feedback wrong';
    }
    document.getElementById('explanation').textContent = questionObj.explanation;
    document.getElementById('score').textContent = score;

    document.getElementById('myth-button').disabled = true;
    document.getElementById('fact-button').disabled = true;
    document.getElementById('next-button').style.display = 'inline-block';
}

function nextQuestion() {
    currentQuestionIndex++;
    loadQuestion();
}

function startTimer() {
    document.getElementById('timer').textContent = elapsedTime;
    timerInterval = setInterval(() => {
        elapsedTime++;
        document.getElementById('timer').textContent = elapsedTime;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function endGame() {
    stopTimer();
    document.getElementById('question-text').textContent = `Congratulations! Your final score is ${score}.`;
    document.getElementById('feedback').textContent = '';
    document.getElementById('explanation').textContent = '';

    document.querySelector('.button-container').style.display = 'none';
    document.getElementById('next-button').style.display = 'none';

    const currentUserId = localStorage.getItem('user_id');
    console.log("User ID from local storage:", currentUserId);

    submitScoreToServer(score, elapsedTime);
    window.location.href = "tg://resolve?domain=pxlgames_bot";
}

function submitScoreToServer(finalScore, timeElapsed) {
    const userId = localStorage.getItem('user_id');
    console.log("Attempting to send score to server:", {
        score: finalScore,
        time: timeElapsed,
        user_id: userId
    });

    if (!userId) {
        console.error("No user ID found in local storage. Cannot submit score.");
        return;
    }

    fetch("https://pxl8d.top/api/submit_score", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            score: finalScore,
            time: timeElapsed,
            game_id: 'CRYPTALES',
            user_id: userId
        }),
    })
        .then(response => response.json())
        .then(data => {
            console.log("Response from server:", data);
        })
        .catch(error => console.error("Error sending score:", error));
}

document.getElementById("start-game-button").onclick = function () {
    const userId = localStorage.getItem('user_id');
    if (userId) {
        startGame();
    } else {
        console.error("User ID not found. Please ensure you are signed up.");
    }
};
