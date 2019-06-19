from flask import Flask, render_template, session
from flask_socketio import SocketIO, emit
from update.updateTask import UpdateTask

app = Flask(__name__)
socketio = SocketIO(app)
updateTask = UpdateTask(socketio)


@app.route('/')
def home():
    return render_template('home/home.html')


#version check
@app.route('/version')
def version():
    print("version called")
    return '1'


@app.route('/start', methods=['POST'])
def start():
    print("start")
    updateTask.start()
    return '2'


@app.route('/stop', methods=['POST'])
def stop():
    print("stop called")
    updateTask.stop()
    return '3'


@socketio.on('connect')
def connect():
    emit("connect", 'success')


if __name__ == '__main__':
    app.run()
