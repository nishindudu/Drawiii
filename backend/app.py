from flask import Flask, request
from flask_socketio import SocketIO, join_room, emit
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins='*')

@socketio.on('join_room')
def handle_join(data):
    print(data)
    room = data['room']
    join_room(room)
    emit('user_joined', {'msg': f'User joined the room {room}'}, room=room)

@socketio.on('draw_stroke')
def handle_stroke(data):
    room = data['room']
    print(data)
    emit('receive_stroke', data, room=room, include_self=False)

if __name__ == "__main__":
    socketio.run(app, debug=True)