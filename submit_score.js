const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.submitScore = functions.https.onRequest((req, res) => {
    if (req.method !== "POST") {
        return res.status(403).send("Forbidden!");
    }

    const { score, time, user_id } = req.body;

    // Check if user_id is provided
    if (!user_id) {
        return res.status(400).json({ error: "User ID is required." });
    }

    // Log the user ID for debugging
    console.log("User ID received:", user_id);

    const userRef = admin.database().ref(`users/${user_id}`);

    userRef.once("value")
        .then(snapshot => {
            if (!snapshot.exists()) {
                return res.status(404).json({ error: "User not found." });
            }

            const chat_id = snapshot.val().chat_id;
            const username = snapshot.val().username;

            // Record the score
            const scoreboardRef = admin.database().ref(`scoreboard/${user_id}`);
            return scoreboardRef.set({
                username: username,
                score: score,
                time: time
            }).then(() => {
                // Logic to send the score to Telegram can go here
                return res.status(200).json({ message: "Score submitted successfully." });
            });
        })
        .catch(error => {
            console.error("Error fetching user data:", error);
            return res.status(500).json({ error: "Internal server error." });
        });
});
