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

- `cd server` : Move to server directory
- `npm install` : SOTA server install
- `npm run server` : Run SOTA server
- `npm run device` : Run SOTA device emulator & follow the guide in prompt
