import telebot
import firebase_admin
from firebase_admin import credentials, db

API_KEY = '7813851715:AAEwKzM4TOJsOP7mlrwccy2b5fUq2VHP8P8'
bot = telebot.TeleBot(API_KEY)

cred = credentials.Certificate("firebase-adminsdk.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://cryptalesbot-default-rtdb.firebaseio.com/'
})

@bot.message_handler(commands=['start'])
def send_welcome(message):
    bot.send_message(message.chat.id, "Welcome to CRYPTALES! Use /signup to register your ID.")

@bot.message_handler(commands=['signup'])
def signup_user(message):
    chat_id = message.chat.id
    user_id = message.from_user.id  # Get the unique user ID
    username = message.from_user.username or message.from_user.first_name  # Get username or fallback to first name

    # Store chat_id and username in Firebase
    ref = db.reference(f'users/{user_id}')
    ref.set({
        'chat_id': chat_id,
        'username': username  # Save the username
    })

    bot.send_message(chat_id, f"You have successfully signed up! Your chat ID is {chat_id} and user ID is {user_id}.")
    print(f"Stored chat_id {chat_id} and username {username} for user {user_id}")

    # New line to send user ID back to the frontend
    bot.send_message(chat_id, f"Your User ID is: {user_id}. Please make sure this is stored in your game.")

    # Provide the options to /play and /scoreboard after successful signup
    bot.send_message(chat_id, "You can now use the following commands:\n/play - Start the game\n/scoreboard - View the scoreboard")

@bot.message_handler(commands=['play'])
def start_game(message):
    bot.send_message(
        message.chat.id,
        "Starting the game... Click here to play: [Play CRYPTALES](https://cryptales.vercel.app/)",
        parse_mode="Markdown"
    )

@bot.message_handler(commands=['scoreboard'])
def show_scoreboard(message):
    # Retrieve the scoreboard from Firebase
    scoreboard_ref = db.reference('scoreboard')
    scoreboard_data = scoreboard_ref.get()
    
    if scoreboard_data:
        scoreboard_message = "🏆 SCOREBOARD 🏆\n"  # Add trophy header
        for user_id, score in scoreboard_data.items():
            username = score.get('username', 'Unknown User')  # Get the username
            scoreboard_message += f"{username}: {score['score']} points, {score['time']} seconds\n"  # Show username, score, and time
    else:
        scoreboard_message = "The scoreboard is currently empty."
    
    bot.send_message(message.chat.id, scoreboard_message)

if __name__ == '__main__':
    print("Starting the bot...")
    bot.polling()
