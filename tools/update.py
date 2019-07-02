import os
import requests
from argparse import ArgumentParser
resource = '/update'


def update(firmware_path, version):
        firmware = open(firmware_path + os.sep + version + '.txt', 'w+')
        firmware.write(version)


if __name__ == "__main__":
    parser = ArgumentParser()
    parser.add_argument("url", help="update server url")

    args = parser.parse_args()

    print(args)