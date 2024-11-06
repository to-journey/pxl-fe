const express = require('express');
const cors = require('cors');
const axios = require('axios');
const admin = require('firebase-admin');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Initialize Firebase Admin SDK
const serviceAccount = require('./firebase-adminsdk.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://cryptalesbot-default-rtdb.firebaseio.com/'
});

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON

// Helper function to send score to Telegram
async function sendScoreToTelegram(chatId, username, score, time) {
    const API_KEY = process.env.TELEGRAM_API_KEY;
    if (!API_KEY) {
        console.error("Error: TELEGRAM_API_KEY is not set.");
        throw new Error('Telegram API key is missing');
    }

    const message = `🏆 *Game Finished!*\n👤 Username: ${username.replace('_', '\\_')}\n🏅 Score: ${score} points\n⏱ Time: ${time} seconds`;
    const botUrl = `https://api.telegram.org/bot${API_KEY}/sendMessage`;

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

        // Get today's date in "YYYY-MM-DD" format
        const today = new Date().toISOString().split('T')[0];

        // Save the score and username to the Firebase scoreboard
        const scoreboardRef = admin.database().ref(`scoreboard/${user_id}`);

        const scoreSnapshot = await scoreboardRef.once('value');
        const scoreData = scoreSnapshot.val();

        if (scoreData && scoreData.date === today) {
            return res.status(400).json({ status: 'error', message: 'Score already submitted today' });
        }

        // Send score to Telegram
        await sendScoreToTelegram(chatId, username, score, time);

        await scoreboardRef.set({
            username: username,
            score: score,
            time: time,
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

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Starting the server on port ${PORT}...`);
});