from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import firebase_admin
from firebase_admin import credentials, db
import os
from dotenv import load_dotenv  # Import to load environment variables

# Load environment variables from .env file
load_dotenv()

# Initialize Firebase
cred = credentials.Certificate("firebase-adminsdk.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://cryptalesbot-default-rtdb.firebaseio.com/'
})

app = Flask(__name__)
CORS(app)

# Helper function to send score to Telegram
def send_score_to_telegram(chat_id, username, score, time):
    API_KEY = os.getenv("TELEGRAM_API_KEY")
    if not API_KEY:
        print("Error: TELEGRAM_API_KEY is not set.")
        return jsonify({'status': 'error', 'message': 'Telegram API key is missing'}), 500

    message = f"🏆 *Game Finished!*\n👤 Username: {username}\n🏅 Score: {score} points\n⏱️ Time: {time} seconds."
    bot_url = f"https://api.telegram.org/bot{API_KEY}/sendMessage"
    payload = {
        'chat_id': chat_id,
        'text': message,
        'parse_mode': 'Markdown'
    }
    response = requests.post(bot_url, json=payload)
    response.raise_for_status()
    print("Score sent to Telegram:", response.json())

@app.route('/submit_score', methods=['POST'])
def submit_score():
    try:
        data = request.get_json()
        print("Data received in /submit_score:", data)  # Log the received data
        score = data.get('score')
        time = data.get('time')
        user_id = data.get('user_id')  # Ensure the user ID is being retrieved correctly

        # Log to verify user_id received
        print(f"Processing score for user_id: {user_id}")

        # Retrieve user information from Firebase
        ref = db.reference(f'users/{user_id}')
        chat_id = ref.child('chat_id').get()
        username = ref.child('username').get()  # Get the username

        print(f"Retrieved chat_id: {chat_id} and username: {username} for user_id: {user_id}")

        if not all([score, time, chat_id, username]):
            print(f"Missing fields - Score: {score}, Time: {time}, Chat ID: {chat_id}, Username: {username}")
            return jsonify({'status': 'error', 'message': 'Missing data in request'}), 400

        # Send score to Telegram
        send_score_to_telegram(chat_id, username, score, time)

        # Save the score and username to the Firebase scoreboard
        scoreboard_ref = db.reference('scoreboard')
        scoreboard_ref.child(user_id).set({
            'username': username,  # Save username
            'score': score,
            'time': time
        })

        return jsonify({'status': 'success', 'message': 'Score sent successfully'}), 200

    except Exception as e:
        print("Error in /submit_score:", e)
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/scoreboard', methods=['GET'])
def get_scoreboard():
    try:
        scoreboard_ref = db.reference('scoreboard')
        scoreboard_data = scoreboard_ref.get()
        
        print("Scoreboard data retrieved from Firebase:", scoreboard_data)  # Log the scoreboard data

        if scoreboard_data:
            # Create a sorted list of scores
            sorted_scores = sorted(scoreboard_data.items(), key=lambda x: (-x[1]['score'], x[1]['time']))

            # Format the scoreboard
            formatted_scores = {}
            for user_id, data in sorted_scores:
                username = data.get('username', 'Unknown User')  # Use 'Unknown User' if username is missing
                score = data.get('score')
                time = data.get('time')
                print(f"Processing User ID: {user_id}, Username: {username}, Score: {score}, Time: {time}")  # Log each entry
                formatted_scores[username] = {
                    'score': score,
                    'time': time
                }

            return jsonify(formatted_scores), 200
        else:
            return jsonify({'status': 'error', 'message': 'No scores recorded'}), 404

    except Exception as e:
        print("Error retrieving scoreboard:", e)
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    print("Starting the server...")
    app.run(debug=True, port=5001)
