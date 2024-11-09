import telebot
import firebase_admin
from firebase_admin import credentials, db

API_KEY = "7607500072:AAEaAYBc1TIzEHjjsvsJ46yNSkp9XwZPgZ0"
bot = telebot.TeleBot(API_KEY)

cred = credentials.Certificate("./firebase-adminsdk.json")
firebase_admin.initialize_app(
    cred, {"databaseURL": "https://pxl8d-4a7a8-default-rtdb.firebaseio.com/"}
)


@bot.message_handler(commands=["start"])
def send_welcome(message):
    bot.send_message(
        message.chat.id, "Welcome to PXL GAMES! 🕹️\nUse /signup to register your user ID."
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
        f"You have successfully signed up with the user ID {user_id}",
    )
    print(f"Stored chat_id {chat_id} and username {username} for user {user_id}")

    # Provide the options to /play and /scoreboard after successful signup
    bot.send_message(
        chat_id,
        "You can now use the following\ncommands:\n/play - Start the game\n/scoreboard - View the scoreboard",
    )


@bot.message_handler(commands=["play"])
def start_game(message):
    user_id = message.from_user.id
    bot.send_message(
        message.chat.id,
        f"Starting the game...\nClick here to play: [PXL GAMES](https://pxl8d.top?user_id={user_id})",
        parse_mode="Markdown",
    )

@bot.message_handler(commands=["question"])
def start_game(message):
    if message.from_user.id == '5988835567':
        user_id = message.from_user.id
        bot.send_message(
            message.chat.id,
            f"Click here to edit question: [Edit question](https://pxl8d.top/questions.html",
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

        for i, (uid, score) in enumerate(sorted_scores):
            if i == 5:
                scoreboard_message += "...\n"
            if i < 5 or user_id == uid:
                username = score.get("username", "Unknown User")
                scoreboard_message += f"{i + 1}. <b>{username}</b>: {score['score']} points, {score['time']} seconds\n"
        
        if len(sorted_scores) > 5:
            scoreboard_message += "...\n"
        
    bot.send_message(message.chat.id, scoreboard_message, parse_mode='HTML')

if __name__ == "__main__":
    print("Starting the bot...")
    bot.polling()
