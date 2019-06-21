import threading
import time
import requests
from update.update import UpdateManage
from version.version import VersionManage

class UpdateTask(threading.Thread):

    def __init__(self, socketio, firmware_path):
        super(UpdateTask, self).__init__()
        self.socketio = socketio
        self._please_stop = threading.Event()
        self.updateManage = UpdateManage()
        self.versionManage = VersionManage()
        self.firmware_path = firmware_path

    def run(self):
        while not self._please_stop.is_set():
            time.sleep(5)
            print("update check!")
            self.socketio.emit("process", "update check!!")
            #TODO version check 로직 추가
            self.version = self.versionManage.getVersion(self.firmware_path)
            self.updateManage.update(self.firmware_path, '1.0.0')


    def stop(self):
        self._please_stop.set()

