from flask import Flask, request, send_from_directory
from flask_socketio import SocketIO, join_room, emit
from flask_cors import CORS
import os

app = Flask(__name__, static_folder='../frontend/drawiii/out', static_url_path='')
CORS(app)
socketio = SocketIO(app, cors_allowed_origins='*')

@app.route('/')
def serve_frontend(path=''):
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/canvas')
def serve_canvas():
    return send_from_directory(app.static_folder, 'canvas.html')


@socketio.on('join_room')
def handle_join(data):
    # print(data)
    try:
        room = data['room']
    except KeyError:
        print('KeyError')
        return
    join_room(room)
    emit('user_joined', {'msg': f'User joined the room {room}'}, room=room)

@socketio.on('draw_stroke')
def handle_stroke(data):
    room = data['room']
    # print(data)
    emit('receive_stroke', data, room=room, include_self=False)

if __name__ == "__main__":
    socketio.run(app, debug=True)