import os

class UpdateManage:
    def __init__(self):
        self.init = None

    def update(self, firmware_path, version):
        firmware = open(firmware_path + os.sep + version, 'w+')




