'use strict'

const https = require('https');
const url = require('url');

const Keystore = require('../Keystore');
const bizlogic = require('../bizlogic');
const vc = require('./gatewayVC');

require('../config').apply();

//start version check
vc.startVC();

run();

async function run() {
    const port = 9443; //TODO 포트 정보 업데이트

    https.createServer((await options()), async (req, res) => {
        const urlParsed = url.parse(req.url, true);

        const cipher = req.connection.getCipher();
        const cert = req.connection.getPeerCertificate(true);

        console.debug(`[PID:${process.pid}|UID:${process.getuid()}|LCOAL_CERT] ${req.connection.getCertificate().subject.CN} ${req.connection.getCertificate().fingerprint}`);
        console.debug(`[PID:${process.pid}|UID:${process.getuid()}|REMOTE_CERT] ${cert.subject.CN} ${cert.fingerprint}`);
        console.log(`[REQ:${urlParsed.pathname}] ${req.connection.remoteAddress} ${cipher.version} ${cipher.name}`);

        try {
            switch (urlParsed.pathname) {
                case '/version':
                    const response = await bizlogic.version(req.url);
                    finalize(res, response);
                    break;

                case '/firmware':
                    finalize(res, await bizlogic.firmware(req.url));
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

    console.log('2JO-SOTA gateway started successfully.')

}

async function options() {
    const keystore = new Keystore(process.argv[2]);

    return {
        cert: await keystore.certificate(),
        key: await keystore.privateKey(),

        // This is necessary only if using client certificate authentication. : true
        requestCert: true,
        rejectUnauthorized: true,

        // This is necessary only if the client uses a self-signed certificate.
        ca: [(await keystore.certificateOfCa())],
        passphrase: await keystore.passphraseOfPrivateKey(),
        minVersion: 'TLSv1.3',
    };
}

function finalize(res, result) {
    res.writeHead(result.statusCode);
    res.end(JSON.stringify(result.body));
}