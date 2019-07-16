'use strict'

const crypto = require('crypto');
const bizlogic = require('../bizlogic');

const Keystore = require('../Keystore');
const interactor = require('../interactor');

const pki = require('node-forge').pki;


module.exports.startVC = startVC;

//version checker
function startVC(){
    printGuide();
    interactor(onInput);
}

function printGuide() {
    const msg =
        `\n---------------- 2JO Gateway Emulator! ----------------------------------` +
        `\n[version] Type for the latest version checking.` +
        `\n[firmware] Type for downloading the latest firmware.` +
        `\n[firmware?version=?] Type for downloading the specific firmware version.` +
        `\n[quit or ctrl + C] Type for exit.` +
        `\n------------------------------------------------------------------------\n`;

    console.log(msg)
}

async function onInput(input) {
    input = input.toLowerCase();

    if (validate(input) === false) {
        console.log(`Invalid input! : ${input}`)
    } else {
        let [statusCode, body, certificate] = await bizlogic.request('/' + input);

        if (statusCode === 200 && input.startsWith('firmware')) {
            //firmware 요청일 경우
            const res = JSON.parse(body);
            const resultOfVerification = res.firmware.data === '' ? 'N/A' : await verify(res.firmware.signature, Buffer.from(res.firmware.data, 'base64'), res.firmware.certificate);

            console.log(`\nresult of signature verification : ${resultOfVerification}`);
        }
    }

    printGuide();
}


async function verify(signature, binary, certificate) {
    const server_cert = pki.certificateFromPem(certificate);
    const check_cert = await verify_certificate(server_cert);

    if(!check_cert) {
        console.log('invalid signature ');
        throw new Error(`Invalid Signature `);
    }

    const verify = crypto.createVerify('SHA256');
    verify.update(binary);
    verify.end();

    const publicKeyPem = pki.publicKeyToPem(server_cert.publicKey);

    const publicKey = {
        key: publicKeyPem.toString(),
        format: 'pem',
        type: 'spki'
    };

    return verify.verify(crypto.createPublicKey(publicKey), signature, 'base64');
}

//certificate 유효성 체크
async function verify_certificate(server_cert) {
    try {
        const keystore = new Keystore(process.argv[2]);
        const ca_cert_pem = await keystore.certificateOfCa();

        const ca_cert = pki.certificateFromPem(ca_cert_pem);

        return ca_cert.verify(server_cert);
    } catch (e) {
        console.debug('error ' + e.toString())
    }
}

//input 유효성 체크
function validate(input) {
    // TODO : validation code
    return true
}