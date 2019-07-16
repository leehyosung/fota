'use strict'

const fs = require('fs');
const https = require('https');
const path = require('path');
const crypto = require('crypto');
const bizlogic = require('../bizlogic');

const interactor = require('../interactor');

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
            const res = JSON.parse(body);
            const resultOfVerification = res.firmware.data === '' ? 'N/A' : verify(res.firmware.signature, Buffer.from(res.firmware.data, 'base64'), certificate);

            console.log(`\nresult of signature verification : ${resultOfVerification}`);

            fs.writeFileSync('../firmware/updateInfo.txt', JSON.stringify({version : res.firmware.version, signature : res.firmware.signature}) , 'utf8');
        }
    }

    printGuide();
}


function verify(signature, binary, certificate) {
    const verify = crypto.createVerify('SHA256');
    verify.update(binary);
    verify.end();

    const publicKey = {
        key: certificate.pubkey,
        format: 'der',
        type: 'spki'
    };

    return verify.verify(crypto.createPublicKey(publicKey), signature, 'base64');
}

function validate(input) {
    // TODO : validation code
    return true
}