const dotenv = require('dotenv');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cron = require('node-cron');
const bodyParser = require('body-parser');

// Load environment variables from .env file
dotenv.config();

// Initialize Firebase Admin SDK
const serviceAccount = require('./firebase-adminsdk.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://pxl8d-4a7a8-default-rtdb.firebaseio.com/'
});

const app = express();
app.use(cors());
app.use(bodyParser());
app.use(express.json()); // Middleware to parse JSON

const API_KEY = process.env.TELEGRAM_API_KEY;
const botUrl = `https://api.telegram.org/bot${API_KEY}/sendMessage`;

// Helper function to send score to Telegram
async function sendScoreToTelegram(chatId, username, score, time) {
    const message = `🏆 *Game Finished!*\n👤 Username: ${username.replace('_', '\\_')}\n🏅 Score: ${score} points\n⏱ Time: ${time} seconds`;

    try {
        const response = await axios.post(botUrl, {
            chat_id: chatId,
            text: message,
            parse_mode: 'Markdown'
        });
        console.log("Score sent to Telegram:", response.data);
    } catch (error) {
        console.error("Error sending score to Telegram:", error.message);
        throw error;
    }
}

app.post('/submit_score', async (req, res) => {
    try {
        const { score, time, user_id } = req.body;
        console.log("Data received in /submit_score:", req.body);

        // Retrieve user information from Firebase
        const ref = admin.database().ref(`users/${user_id}`);
        const userSnapshot = await ref.once('value');
        const userData = userSnapshot.val();

        if (!userData) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        const { chat_id: chatId, username } = userData;

        if (!score || !time || !chatId || !username) {
            console.error(`Missing fields - Score: ${score}, Time: ${time}, Chat ID: ${chatId}, Username: ${username}`);
            return res.status(400).json({ status: 'error', message: 'Missing data in request' });
        }

        await sendScoreToTelegram(chatId, username, score, time);

        // Get today's date in "YYYY-MM-DD" format
        const today = new Date().toLocaleDateString();

        // Save the score and username to the Firebase scoreboard
        const scoreboardRef = admin.database().ref(`scoreboard/${user_id}`);

        const scoreSnapshot = await scoreboardRef.once('value');
        const scoreData = scoreSnapshot.val();

        if (scoreData && scoreData.date === today) {
            return res.status(400).json({ status: 'error', message: 'Score already submitted today' });
        }

        await scoreboardRef.set({
            username: username,
            score: score + (scoreData?.score || 0),
            time: time + (scoreData?.time || 0),
            date: today
        });

        return res.json({ status: 'success', message: 'Score sent successfully' });
    } catch (error) {
        console.error("Error in /submit_score:", error.message);
        return res.status(500).json({ status: 'error', message: error.message });
    }
});

app.get('/scoreboard', async (req, res) => {
    try {
        const scoreboardRef = admin.database().ref('scoreboard');
        const scoreboardSnapshot = await scoreboardRef.once('value');
        const scoreboardData = scoreboardSnapshot.val();

        console.log("Scoreboard data retrieved from Firebase:", scoreboardData);

        if (scoreboardData) {
            // Create a sorted list of scores
            const sortedScores = Object.entries(scoreboardData).sort((a, b) => {
                return b[1].score - a[1].score || a[1].time - b[1].time;
            });

            // Format the scoreboard
            const formattedScores = {};
            for (const [userId, data] of sortedScores) {
                const username = data.username || 'Unknown User';
                formattedScores[username] = {
                    score: data.score,
                    time: data.time
                };
                console.log(`Processing User ID: ${userId}, Username: ${username}, Score: ${data.score}, Time: ${data.time}`);
            }

            return res.json(formattedScores);
        } else {
            return res.status(404).json({ status: 'error', message: 'No scores recorded' });
        }
    } catch (error) {
        console.error("Error retrieving scoreboard:", error.message);
        return res.status(500).json({ status: 'error', message: error.message });
    }
});

app.post('/questions', async (req, res) => {
    try {
        const { questions } = req.body;
        const questionRef = admin.database().ref('questions/prev');
        questionRef.set(questions);
        res.status(201).json({ message: 'Success' });
    } catch (error) {
        console.error('Error creating question:', error);
        res.status(500).send('Error creating question');
    }
});

app.get('/questions', async (req, res) => {
    try {
        const snapshot = await admin.database().ref('questions/current').once('value');
        const questions = snapshot.val();
        res.status(200).json({ questions });
    } catch (error) {
        console.error('Error reading questions:', error);
        res.status(500).send('Error reading questions');
    }
});

const setQuestions = async () => {
    const questionRefPrev = admin.database().ref('questions/prev');
    const questionRef = admin.database().ref('questions/current');
    try {
        const snapshot = await questionRefPrev.once('value');

        if (snapshot.exists()) {
            const questionsData = snapshot.val();
            await questionRef.set(questionsData);
            console.log('Data copied from questions/prev to questions/current successfully.');
        } else {
            console.log('No data found at questions/prev.');
        }
    } catch (error) {
        console.error('Error copying data:', error);
    }
}

const sendDailyNotification = async () => {
    try {
        const usersRef = admin.database().ref('users');
        const snapshot = await usersRef.once('value');
        if (snapshot.exists()) {
            const users = snapshot.val();
            for (const userId in users) {
                await axios.post(botUrl, {
                    chat_id: userId,
                    text: `New game is live.\n/play - Start the game.`,
                    parse_mode: 'Markdown'
                });
            }
        } else {
            console.log("No users found.");
        }
    } catch (err) {
        console.error(err.message);
    }
}

const clearScoreboard = async () => {
    try {
        await scoreboardRef.set(null);
        console.log("Scoreboard cleared successfully.");
    } catch (error) {
        console.error("Error clearing scoreboard:", error);
    }
}

cron.schedule('0 8 * * *', () => {
    console.log('Sending daily notification...');
    setQuestions();
    sendDailyNotification();
});

cron.schedule('0 8 * * 1', () => {
    console.log("Running scheduled task to clear scoreboard...");
    clearScoreboard();
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Starting the server on port ${PORT}...`);
});