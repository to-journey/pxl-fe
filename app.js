const dotenv = require('dotenv');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cron = require('node-cron');
const bodyParser = require('body-parser');
const { DateTime } = require('luxon');

const app = express();
app.use(cors());
app.use(bodyParser());
app.use(express.json());

app.use((req, res, next) => {
    const allowedOrigin = 'https://pxl8d.top';
    const origin = req.headers.origin;

    if (origin === allowedOrigin) {
        res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
        next();
    } else {
        res.status(403).send('Forbidden');
    }
});

dotenv.config();

const serviceAccount = require('./firebase-adminsdk.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DB_URL,
});

const db = admin.database();

const botUrl = process.env.TELEGRAM_BOT_URL;

async function sendScoreToTelegram(chatId, username, score, time) {
    let message = `🏆 *Game Finished!*\n👤 Username: ${username.replace('_', '\\_')}\n🏅 Score: ${score} points`;
    if (time)
        message += `\n⏱ Time: ${time} seconds`;

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

app.post('/submit_score/:gameId/:userId', async (req, res) => {
    try {
        const { gameId, userId } = req.params;
        const { score, time } = req.body;

        const ref = db.ref(`users/${userId}`);
        const userSnapshot = await ref.once('value');
        const userData = userSnapshot.val();

        if (!userData) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        const { chat_id: chatId, username } = userData;

        if (score == undefined || chatId == undefined || username == undefined) {
            console.error(`Missing fields - Score: ${score}, Chat ID: ${chatId}, Username: ${username}`);
            return res.status(400).json({ status: 'error', message: 'Missing data in request' });
        }

        await sendScoreToTelegram(chatId, username, score, time);

        const scoreboardRef = db.ref(`scoreboard/${gameId}/${userId}`);
        const scoreSnapshot = await scoreboardRef.once('value');
        const scoreData = scoreSnapshot.val();

        const dt = DateTime.now().setZone('America/Los_Angeles');
        const today = dt.toFormat('MM/dd/yyyy');
        if (scoreData && scoreData?.date == today) {
            return res.status(400).json({ status: 'error', message: 'Score already submitted today' });
        }

        const updatedTime = (time || 0) + (scoreData?.time || 0);

        await scoreboardRef.set({
            date: today,
            score: score + (scoreData?.score || 0),
            ...(updatedTime ? { time: updatedTime } : {}),
            username,
        });

        return res.json({ status: 'success', message: 'Score sent successfully' });
    } catch (error) {
        console.error("Error in /submit_score:", error.message);
        return res.status(500).json({ status: 'error', message: error.message });
    }
});

app.post('/questions', async (req, res) => {
    try {
        const { questions } = req.body;
        const questionRef = db.ref('questions/prev');
        questionRef.set(questions);
        res.status(201).json({ message: 'Success' });
    } catch (error) {
        console.error('Error creating question:', error);
        res.status(500).send('Error creating question');
    }
});

app.get('/questions', async (req, res) => {
    try {
        const snapshot = await db.ref('questions/current').once('value');
        const questions = snapshot.val();
        res.status(200).json({ questions });
    } catch (error) {
        console.error('Error reading questions:', error);
        res.status(500).send('Error reading questions');
    }
});

app.get('/checkGame/:gameId/:userId', async (req, res) => {
    try {
        const { gameId, userId } = req.params;
        const scoreboardRef = db.ref(`scoreboard/${gameId}/${userId}`);

        const scoreSnapshot = await scoreboardRef.once('value');
        const scoreData = scoreSnapshot.val();

        const dt = DateTime.now().setZone('America/Los_Angeles');
        const today = dt.toFormat('MM/dd/yyyy');
        const played = scoreData?.date == today;

        res.json({ played });
    } catch (error) {
        console.error('Error checking game play:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const setQuestions = async () => {
    const questionRefPrev = db.ref('questions/prev');
    const questionRef = db.ref('questions/current');
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
        const usersRef = db.ref('users');
        const snapshot = await usersRef.once('value');
        if (snapshot.exists()) {
            const users = snapshot.val();
            for (const userId in users) {
                try {
                    await axios.post(botUrl, {
                        chat_id: userId,
                        text: `New game is live.\n/play - Start the game.`,
                        parse_mode: 'Markdown'
                    });
                } catch (err) {
                    console.error(`Couldn't send daily notification to ${userId}`);
                }
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
        const scoreboardRef = db.ref(`scoreboard`);
        await scoreboardRef.set(null);
        console.log("Scoreboard cleared successfully.");
    } catch (error) {
        console.error("Error clearing scoreboard:", error);
    }
}

cron.schedule('0 0 * * *', () => {
    console.log('Sending daily notification...');
    setQuestions();
    sendDailyNotification();
});

cron.schedule('0 0 * * 1', () => {
    console.log("Running scheduled task to clear scoreboard...");
    clearScoreboard();
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Starting the server on port ${PORT}...`);
});