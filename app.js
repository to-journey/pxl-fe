const dotenv = require('dotenv');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cron = require('node-cron');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser());
app.use(express.json());

dotenv.config();

const serviceAccount = require('./firebase-adminsdk.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DB_URL,
});

const db = admin.database();

const botUrl = process.env.TELEGRAM_BOT_URL;

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

const saveGamePlayedLog = async (gameId, userId) => {
    const gamePlayRef = db.ref('gamePlays').push();
    await gamePlayRef.set({
        gameId: gameId,
        userId: userId,
        timestamp: new Date().getTime()
    });
}

app.post('/submit_score', async (req, res) => {
    try {
        const { score, time, game_id, user_id } = req.body;
        console.log("Data received in /submit_score:", req.body);

        saveGamePlayedLog(game_id, user_id);

        const ref = db.ref(`users/${user_id}`);
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

        const today = new Date().toLocaleDateString();

        const scoreboardRef = db.ref(`scoreboard/${user_id}`);

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
        const scoreboardRef = db.ref('scoreboard');
        const scoreboardSnapshot = await scoreboardRef.once('value');
        const scoreboardData = scoreboardSnapshot.val();

        console.log("Scoreboard data retrieved from Firebase:", scoreboardData);

        if (scoreboardData) {
            const sortedScores = Object.entries(scoreboardData).sort((a, b) => {
                return b[1].score - a[1].score || a[1].time - b[1].time;
            });

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
    const { gameId, userId } = req.params;

    const startOfDay = new Date().setHours(0, 0, 0, 0);
    const endOfDay = new Date().setHours(23, 59, 59, 999);

    try {
        const snapshot = await db.ref('gamePlays').orderByChild('timestamp')
            .startAt(startOfDay)
            .endAt(endOfDay)
            .once('value');

        let played = false;

        snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            if (data.gameId === gameId && data.userId === userId) {
                played = true;
            }
        });

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