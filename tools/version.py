import os


class VersionManage:
    def __init__(self):
        self.init = None

    def getVersion(self, firmware_path, version):
        firmware = open(firmware_path + os.sep + version + '.txt', 'w+')
        files = firmware.read()
        print(files)
