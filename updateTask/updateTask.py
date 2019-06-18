import threading
import time
import requests


class UpdateTask(threading.Thread):

    def __init__(self, socketio):
        super(UpdateTask, self).__init__()
        self.socketio = socketio
        self._please_stop = threading.Event()

    def run(self):
        while not self._please_stop.is_set():
            time.sleep(5)
            print("update check!")
            self.socketio.emit("process", "update check!!")
            #TODO version check 로직 추가


    def stop(self):
        self._please_stop.set()

