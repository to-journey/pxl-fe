import telebot
import firebase_admin
from firebase_admin import credentials, db

API_KEY = "7813851715:AAEwKzM4TOJsOP7mlrwccy2b5fUq2VHP8P8"
bot = telebot.TeleBot(API_KEY)

cred = credentials.Certificate("firebase-adminsdk.json")
firebase_admin.initialize_app(
    cred, {"databaseURL": "https://cryptalesbot-default-rtdb.firebaseio.com/"}
)


@bot.message_handler(commands=["start"])
def send_welcome(message):
    bot.send_message(
        message.chat.id, "Welcome to CRYPTALES! Use /signup to register your ID."
    )


@bot.message_handler(commands=["signup"])
def signup_user(message):
    chat_id = message.chat.id
    user_id = message.from_user.id  # Get the unique user ID
    username = (
        message.from_user.username or message.from_user.first_name
    )  # Get username or fallback to first name

    # Store chat_id and username in Firebase
    ref = db.reference(f"users/{user_id}")
    ref.set({"chat_id": chat_id, "username": username})  # Save the username

    bot.send_message(
        chat_id,
        f"You have successfully signed up! Your chat ID is {chat_id} and user ID is {user_id}.",
    )
    print(f"Stored chat_id {chat_id} and username {username} for user {user_id}")

    # New line to send user ID back to the frontend
    bot.send_message(
        chat_id,
        f"Your User ID is: {user_id}. Please make sure this is stored in your game.",
    )

    # Provide the options to /play and /scoreboard after successful signup
    bot.send_message(
        chat_id,
        "You can now use the following commands:\n/play - Start the game\n/scoreboard - View the scoreboard",
    )


@bot.message_handler(commands=["play"])
def start_game(message):
    user_id = message.from_user.id
    bot.send_message(
        message.chat.id,
        f"Starting the game... Click here to play: [Play CRYPTALES](https://telebot-orpin.vercel.app?user_id={user_id})",
        parse_mode="Markdown",
    )

@bot.message_handler(commands=['scoreboard'])
def show_scoreboard(message):
    user_id = str(message.from_user.id)  # Get the current user's ID as a string
    scoreboard_ref = db.reference("scoreboard")
    scoreboard_data = scoreboard_ref.get()

    if not scoreboard_data:
        scoreboard_message = "The scoreboard is currently empty."
    else:
        sorted_scores = sorted(
            scoreboard_data.items(), key=lambda x: (-x[1]["score"], x[1]["time"])
        )

        scoreboard_message = "🏆 SCOREBOARD 🏆\n"
        top_3 = sorted_scores[:3]

        medals = ["🥇", "🥈", "🥉"]
        for i, (uid, score) in enumerate(top_3):
            username = score.get("username", "Unknown User")
            scoreboard_message += f"{medals[i]} {username}: {score['score']} points, {score['time']} seconds\n"

        current_user_position = next(
            (i for i, (uid, _) in enumerate(sorted_scores) if uid == user_id), None
        )

        if current_user_position is not None and current_user_position >= 3:
            current_user_data = sorted_scores[current_user_position][1]
            scoreboard_message += f"\n🎖 {current_user_data['username']}: {current_user_data['score']} points, {current_user_data['time']} seconds"

    bot.send_message(message.chat.id, scoreboard_message)

if __name__ == "__main__":
    print("Starting the bot...")
    bot.polling()
