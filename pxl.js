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

    // Log user ID before submission
    const currentUserId = localStorage.getItem('user_id');
    console.log("User ID from local storage:", currentUserId); // Check what's stored

    submitScoreToServer(score, elapsedTime);  // Send the score to the server
    window.location.href = "tg://resolve?domain=pxlgames_bot";
}

function fetchChatId(userId) {
    console.log("Fetching chat ID for user ID:", userId); // Log the user ID being fetched
    fetch(`https://pxl8d.top/api/get_chat_id/${userId}`)
        .then(response => response.json())
        .then(data => {
            if (data.chat_id) {
                localStorage.setItem('user_chat_id', data.chat_id);
                localStorage.setItem('user_id', userId); // Ensure user_id is set here
                console.log("Chat ID and User ID fetched and saved:", data.chat_id, userId);
            } else {
                console.error("Chat ID not found for user ID:", userId);
            }
        })
        .catch(error => console.error("Error fetching chat ID:", error));
}

function signupUser(userId) {
    console.log("Signing up user with ID:", userId);
    localStorage.setItem('user_id', userId);
    console.log("User ID saved to local storage:", localStorage.getItem('user_id')); // Confirm saving
    fetchChatId(userId); // Fetch chat ID after saving user ID
}

function submitScoreToServer(finalScore, timeElapsed) {
    const userId = localStorage.getItem('user_id'); // Ensure user_id is stored correctly
    console.log("Attempting to send score to server:", {
        score: finalScore,
        time: timeElapsed,
        user_id: userId
    });

    // Check if userId is null
    if (!userId) {
        console.error("No user ID found in local storage. Cannot submit score.");
        return;
    }

    // Proceed with fetch request...
    fetch("https://pxl8d.top/api/submit_score", {  // Your current ngrok URL
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            score: finalScore,
            time: timeElapsed,
            user_id: userId
        }),
    })
        .then(response => response.json())
        .then(data => {
            console.log("Response from server:", data);
        })
        .catch(error => console.error("Error sending score:", error));
}

function fetchScoreboard() {
    fetch("http://127.0.0.1:5001/scoreboard")
        .then(response => response.json())
        .then(data => {
            console.log("Scoreboard data:", data); // Check the data received

            let scoreboardDisplay = "🏆 SCOREBOARD 🏆\n"; // Add trophy header
            for (const [username, details] of Object.entries(data)) {
                scoreboardDisplay += `${username}: ${details.score} points, ${details.time} seconds\n`;
            }
            document.getElementById('scoreboard').textContent = scoreboardDisplay; // Assume you have a display element
        })
        .catch(error => console.error("Error fetching scoreboard:", error));
}
