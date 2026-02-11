from flask import Flask
from flask_cors import CORS
from routes import api

app = Flask(__name__)
CORS(app)

app.register_blueprint(api, url_prefix='/api')

@app.route('/')
def home():
    return {
        'message': 'NFL Tracking API',
        'endpoints': {
            'games': '/api/games',
            'plays': '/api/plays?game_id=GAME_ID',
            'play_tracking': '/api/play/PLAY_ID/tracking',
            'play_routes': '/api/play/PLAY_ID/routes',
            'players': '/api/players?position=POSITION'
        }
    }

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)