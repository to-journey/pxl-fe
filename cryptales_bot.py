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
        message.chat.id,
        "Welcome to PXLGAMES! 🕹️\nUse /signup to register your user ID.",
    )

@bot.message_handler(commands=["signup"])
def signup_user(message):
    chat_id = message.chat.id
    user_id = message.from_user.id
    username = message.from_user.username or message.from_user.first_name

    ref = db.reference(f"users/{user_id}")
    ref.set({"chat_id": chat_id, "username": username})

    bot.send_message(
        chat_id,
        f"You have successfully signed up with the user ID {user_id}",
    )
    print(f"Stored chat_id {chat_id} and username {username} for user {user_id}")

    bot.send_message(
        chat_id,
        "You can now use the following\ncommands:\n/play - Start the game\n/scoreboard - View the scoreboard",
    )

@bot.message_handler(commands=["play"])
def start_game(message):
    user_id = message.from_user.id
    bot.send_message(
        message.chat.id,
        f"Starting the game...\nClick here to play: [PXLGAMES](https://pxl8d.top?user_id={user_id})",
        parse_mode="Markdown",
    )

@bot.message_handler(commands=["question"])
def start_game(message):
    if message.from_user.id == "5988835567":
        bot.send_message(
            message.chat.id,
            f"Click here to edit question: [Edit question](https://pxl8d.top/questions.html",
            parse_mode="Markdown",
        )

@bot.message_handler(commands=["users"])
def get_users(message):
    users_ref = db.reference("users")
    users = users_ref.get()
    total_users = len(users)

    users_message = f"Total number of users: {total_users}"

    bot.send_message(message.chat.id, users_message)

@bot.message_handler(commands=["scoreboard"])
def show_scoreboard(message):
    cur_user = str(message.from_user.id)
    scoreboard_ref = db.reference("scoreboard")
    scoreboard_data = scoreboard_ref.get()

    if not scoreboard_data:
        scoreboard_message = "The scoreboard is currently empty."
    else:
        aggregated_data = {}

        for game, users in scoreboard_data.items():
            for user_id, user_data in users.items():
                if user_id not in aggregated_data:
                    aggregated_data[user_id] = {
                        'id': user_id,
                        'score': 0,
                        'time': 0,
                        'username': user_data['username']
                    }
                
                aggregated_data[user_id]['score'] += user_data.get('score', 0)
                aggregated_data[user_id]['time'] += user_data.get('time', 0)

        result_list = list(aggregated_data.values())
        result_list.sort(key=lambda x: (x['score'], -x['time']), reverse=True)

        scoreboard_message = "🏆 SCOREBOARD 🏆\n"

        rank = 1
        for user in result_list:
            if rank <= 5 or user['id'] == cur_user:
                scoreboard_message += f"{rank}. <b>{user['username']}</b>: {user['score']} points, {user['time']} seconds\n"
            if rank == 6 and user['id'] != cur_user:
                scoreboard_message += "...\n"
            rank = rank + 1
        
        if len(result_list) > 5:
            scoreboard_message += "...\n"

    bot.send_message(message.chat.id, scoreboard_message, parse_mode="HTML")

if __name__ == "__main__":
    print("Starting the bot...")
    bot.polling()
