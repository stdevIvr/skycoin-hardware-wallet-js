const deviceWallet = require('./device-wallet');
const scanf = require('scanf');
const fs = require('fs');
const sha256 = require('js-sha256');

if( deviceWallet.getDevice() === null ) {
    console.log("Skycoin hardware NOT FOUND, using emulator");
    deviceWallet.setDeviceType(deviceWallet.DeviceTypeEnum.EMULATOR);
} else {
    deviceWallet.setDeviceType(deviceWallet.DeviceTypeEnum.USB);
}
const rejectPromise = function(msg) {
  console.log("Promise rejected", msg);
};

const wordReader = function() {
    return new Promise((resolve) => {
        console.log("Inside wordReader callback, please input word: ");
        const word = scanf('%s');
        resolve(word);
    });
};

const pinCodeReader = function() {
    return new Promise((resolve, reject) => {
        console.log("Got inside pinCodeReader");
        const pinCode = scanf('%s');
        if (pinCode.length != 4) {
            reject(new Error("Bad bad pin code"));
            return;
        }
        resolve(pinCode);
    });
};

const testApplySettings = false;
if (testApplySettings) {
    const promise = deviceWallet.devApplySettings(true);
    promise.then(console.log, rejectPromise);
}

const testTransactionSign = true;

if (testTransactionSign) {
    const inputTransaction = {
        'hashIn': "99a1a50ffa21ab48ee7c31d01e7e14451f9834f5294468bd17e87c5018900b81",
        'index': 0
    };
    const inputTransactionArray = [
    inputTransaction,
    inputTransaction
    ];
    const outputTransaction1 = {
        'address': "BCbAa3vS7bPLH2bwL7MvedND5uta5bceHj",
        'address_index': 2,
        'coin': 125000000,
        'hour': 4
    };
    const outputTransaction2 = {
        'address': "2kVVoMkH7aTVXsiGwZEALpkHZ6sUyumL8hH",
        'coin': 2000000,
        'hour': 3
    };
    const outputTransactionArray = [
    outputTransaction1,
    outputTransaction2
    ];
    const promise = deviceWallet.devSkycoinTransactionSign(
        inputTransactionArray,
        outputTransactionArray,
        pinCodeReader,
        wordReader
        );
    promise.then(console.log, rejectPromise);
}

const testSign = false;

if (testSign) {
    const signPromise = deviceWallet.devSkycoinSignMessage(3, "Hello World!", null);
    signPromise.then(
        (signature) => {
            console.log("Signature promise resolved", signature);
            const signPromise2 = deviceWallet.devSkycoinSignMessage(3, "Hello World!", pinCodeReader, wordReader);
            signPromise2.then(
                (signature2) => {
                    console.log("Signature promise resolved", signature2);
                },
                rejectPromise
            );
        },
        rejectPromise
    );
}

const testAddressGen = false;

if (testAddressGen) {
    const promise = deviceWallet.devAddressGen(9, 3, true, pinCodeReader, wordReader);
    promise.then(console.log, rejectPromise);
}

const testPinChange = false;
if (testPinChange) {
    const promise = deviceWallet.devChangePin(pinCodeReader);
    promise.then(
        () => {
            console.log("promise resolved");
            const promise2 = deviceWallet.devChangePin();
            promise2.then(
                () => {
                    console.log("promise resolved");
                },
                rejectPromise
            );
        },
        rejectPromise
    );
}

const testFirmwareUpdate = false;

if (testFirmwareUpdate) {
    fs.readFile('skycoin-firmware-passphrase-experiment.bin', function(err, data) {
        console.log(err);
        console.log(data);
        console.log(data.length);
        deviceWallet.devUpdateFirmware(data, sha256(data.slice(0x100)));
  });
}

const testGetVersion = false;

if (testGetVersion) {
    const promise = deviceWallet.devGetVersionDevice();
    promise.then(
        (version) => {
            console.log("Version is: ", version);
        },
        rejectPromise
    );
}

const testRecovery = false;

if (testRecovery) {
    const promise = deviceWallet.devRecoveryDevice(true, wordReader);
    promise.then(console.log, rejectPromise);
}

const testFeatures = false;

if (testFeatures) {
    const promise = deviceWallet.devGetFeatures();
    promise.then(console.log, rejectPromise);
}

const testCancel = false;
if (testCancel) {
    const promise = deviceWallet.devCancelRequest();
    promise.then(console.log, rejectPromise);
}

const testBackup = false;
if (testBackup) {
    const promise = deviceWallet.devBackupDevice(pinCodeReader);
    promise.then(console.log, rejectPromise);
}

const testMnemonic = false;
if (testMnemonic) {
    const mnemonic = "cloud flower upset remain green metal below cup stem infant art thank";
    const promise = deviceWallet.devSetMnemonic(mnemonic);
    promise.then(console.log, rejectPromise);
}

const testGenerateMnemonic = false;
if (testGenerateMnemonic) {
    const promise = deviceWallet.devGenerateMnemonic(true);
    promise.then(console.log, rejectPromise);
}
