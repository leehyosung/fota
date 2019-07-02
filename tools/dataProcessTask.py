import os
from argparse import ArgumentParser


def update(firmware_path, version):
    firmware = open(firmware_path + os.sep + version + '.txt', 'w+')
    firmware.write(version)


def getVersion(firmware_path, version):
    firmware = open(firmware_path + os.sep + version + '.txt', 'r')
    files = firmware.name
    print(files)


if __name__ == "__main__":
    parser = ArgumentParser()
    parser.add_argument("url", help="update server url")

    args = parser.parse_args()
    #TODO 포맷 정하기 key, firmware read write
    print(args)