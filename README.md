# 2JO - SOTA

## TODO - Requirements

**All of the belows should be proven to be fulfilled**

### Security Requirements

- Apply mutual authentication via TLS
    - Server authentication by Gateway
    - Gateway authentication by Server
    - Device authentication by Gateway
- Apply TLSv1.3
- Handle certificate / private key files securely
- Handle private key passphrase securely
- Validate any input (for device / server)
- Hide any exception information in output of server
- Verify firmware via signature
- Handle resources via manual key store

#### Key Store

- Must provide input / output interface
- Works on its own OS process (different with SOTA application process)
- Works on its own account
- Resources should be placed in the key store account

- 로깅 구현

## About Certificates

- Server CN : 2jo-server
- Gateway CN : 2jo-gateway

## Addresses

**Only applies in 2jo network**

- Server : 192.168.0.6



## SOTA Server

### Prerequite

- nodejs version >= 12.5

### How to install / run SOTA Server

- `sudo chmod u+s /usr/local/bin/node` : Turn on seteuid(0) feature
- `sudo useradd keystore` : Create keystore user
- Modify keystoreUserId in `server/config.json`
- `sudo chown -R keystore:keystore ./config ./cert && sudo chmod -R o-r ./config ./cert` : Set secrecy on files in ./config, ./cert
- `cd server` : Move to server directory
- `npm install` : SOTA server install
- `npm run server` : Run SOTA server
- `npm run device` : Run SOTA device emulator & follow the guide in prompt

### password

- server password : U2FsdGVkX1/ZVlTjL/ZbJ8nX4eBesHhnwrBhnzb8clY=
- gateway password : U2FsdGVkX182FSwGocG6CtHYxlvfO2h+uWZwzS16qts=
- device password : U2FsdGVkX1/mlkh3PZxZh4vWZneN4LyUsfLUZEUPDQg=