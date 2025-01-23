let currentQuestionIndex = 0;
let score = 0;
let elapsedTime = 0;
let timerInterval;

let questions = [];

async function startGame() {
    const result = await new Promise((resolve, reject) => {
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);
        let date = params.get('date') || 'today';
        date = date ? date : 'today';
        fetch(`https://pxlgames.xyz/api/question/${date}`)
            .then(response => resolve(response.json()))
            .catch(error => reject(error));
    });

    questions = JSON.parse(result.question);
    questions = questions.sort(() => Math.random() > 0.5 ? -1 : 1);

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

    submitScore(1, score, elapsedTime);
}

document.getElementById("start-game-button").onclick = function () {
    startGame();
};
