import os
import requests

class NetworkSender:
    def __init__(self, server_url, version_url, firmware_url):
        self.server_url = server_url
        self.version_url = version_url
        self.firmware_url = firmware_url
        return

    def sendVersion(self):
        request_url = self.server_url + os.sep + self.version_url