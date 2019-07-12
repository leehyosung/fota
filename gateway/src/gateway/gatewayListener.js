'use strict'

const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const keystore = require('../keystore');
const bizlogic = require('../bizlogic');
const vc = require('./gatewayVC');

vc.startVC();

const port = 9443;

const options = {
    cert: keystore.certificate(),
    key: keystore.privateKey(),

    // This is necessary only if using client certificate authentication. : true
    requestCert: true,
    rejectUnauthorized: true,

    // This is necessary only if the client uses a self-signed certificate.
    ca: [keystore.certificateOfCa()],
    passphrase: keystore.passphraseOfPrivateKey(),
    minVersion: 'TLSv1.3',
};

https.createServer(options, (req, res) => {
    const urlParsed = url.parse(req.url, true);

    const cipher = req.connection.getCipher();
    const cert = req.connection.getPeerCertificate(true);

    console.log(`[LCOAL CERT] ${req.connection.getCertificate().subject.CN} ${req.connection.getCertificate().fingerprint}`);
    console.log(`[REMOTE CERT] ${cert.subject.CN} ${cert.fingerprint}`);
    console.log(`[REQ:${urlParsed.pathname}] ${req.connection.remoteAddress} ${cipher.version} ${cipher.name}`);

    try {
        switch (urlParsed.pathname) {
            case '/version':
                finalize(res, bizlogic.version());
                break;

            case '/firmware':
                finalize(res, bizlogic.firmware(urlParsed.query.version));
                break;

            case '/':
                finalize(res, {
                    statusCode: 200,
                    body: 'hello 2'
                });
                break;

            default:
                finalize(res, {
                    statusCode: 404,
                    body: `Invalid Path : ${urlParsed.pathname}`
                });
                break
        }
    } catch (e) {
        console.error(e);

        finalize(res, {
            statusCode: 500,
            body: 'Internal Server Error'
        })
    }
}).listen(port);

console.log('2JO-SOTA gateway started successfully.');

function finalize(res, result) {
    res.writeHead(result.statusCode);
    res.end(JSON.stringify(result.body));
}