'use strict'
const ethjs = require('ethereumjs-util');
const crypto = require('crypto');
const Web3 = require('web3');
const argv = require('yargs').command('$0 <rpc-url>').argv;
const { DirtyContract: DIRTY_ADDRESS } = require('../addresses.json');

(async () => {
    const w3 = new Web3(new Web3.providers.HttpProvider(argv.rpcUrl));
    while (true) {
        const root = await getStorageRootAsync(w3);
        console.log(root);
        await delayAsync(5e3);
    }
})();

async function delayAsync(ms) {
    return new Promise((accept, reject) => {
        setTimeout(accept, ms);
    });
}

async function getStorageRootAsync(w3) {
    const t = Date.now();
    const proof = await w3.eth.getProof(
        DIRTY_ADDRESS,
        [randomStorageKey()],
    );
    console.debug(`${((Date.now() - t) / 1e3).toFixed(3)}s`);
    return proof.storageHash;
}

function randomStorageKey() {
    return '0x' + crypto.randomBytes(32).toString('hex');
}