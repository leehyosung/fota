import os
import logging
from pathlib import Path

from flask import Flask, render_template, session
from flask_socketio import SocketIO, emit
from update.updateTask import UpdateTask
from flask import request

from OpenSSL import SSL

app = Flask(__name__)
socketio = SocketIO(app)
app.config.from_object('config.Config')
updateTask = UpdateTask(socketio, app.config['FIRMWARE_FILE_PATH'])


@app.route('/')
def home():
    return render_template('home/home.html')


@app.route('/gateway')
def gateway():
    return render_template('gateway/gateway.html')


# version check
@app.route('/version')
def version():
    print("version called")
    return '1'


# update firmware
@app.route('/firmware')
def firmware():
    print('firmware called')
    version = request.form['version']
    print('version info : ' + version)
    return 'data'


##--------------------------------------내부 함수 ----------------------------------
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


path = os.path.dirname(os.path.abspath(__file__))

# context = SSL.Context(SSL.TLSv1_2_METHOD)
# context.use_privatekey_file(path + '/cert/server/privatekey.pem')
# context.use_certificate_file(path + '/cert/server/certificate.pem')

if __name__ == '__main__':
    logging.info("Start RestAPI : listen %s:%s" % ('127.0.0.1', 8443))

    # https://stackoverflow.com/questions/28579142/attributeerror-context-object-has-no-attribute-wrap-socket
    context = (path + '/cert/server/certificate.pem', path + '/cert/server/privatekey.pem')

    app.run(
        host='127.0.0.1',
        port=8443,
        debug = True,
        threaded= True,
        ssl_context=context,
    )