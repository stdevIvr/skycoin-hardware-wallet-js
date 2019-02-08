const deviceWallet = require('./device-wallet');
const scanf = require('scanf');

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
// eslint-disable-next-line max-lines-per-function
const sandbox = function() {
  if( deviceWallet.getDevice() === null ) {
    console.log("Skycoin hardware NOT FOUND, using emulator");
    deviceWallet.setDeviceType(deviceWallet.DeviceTypeEnum.EMULATOR);
  } else {
    console.log("Skycoin hardware is plugged in");
    deviceWallet.setDeviceType(deviceWallet.DeviceTypeEnum.USB);
  }
  const wipePromise = deviceWallet.devWipeDevice();
  wipePromise.then(
    // eslint-disable-next-line max-lines-per-function
    () => {
    // eslint-disable-next-line max-len
    const setMnemonicPromise = deviceWallet.devSetMnemonic("cloud flower upset remain green metal below cup stem infant art thank");
    setMnemonicPromise.then(
      // eslint-disable-next-line max-statements
      () => {
        const addrPromise = deviceWallet.devAddressGen(1, 0);
        addrPromise.then(
          (addresses) => {
            console.log("Address Promise resolved", addresses);
            const input1 = {
              'hashIn': "a885343cc57aedaab56ad88d860f2bd436289b0248d1adc55bcfa0d9b9b807c3",
              'index': 0
            };
            const inputTransactionArray = [input1];
            const output1 = {
              'address': "zC8GAQGQBfwk7vtTxVoRG7iMperHNuyYPs",
              'coin': 1000000,
              'hour': 1
            };
            const outputTransactionArray = [output1];
            const signPromise = deviceWallet.devSkycoinTransactionSign(
              inputTransactionArray,
              outputTransactionArray,
              pinCodeReader,
              wordReader
            );

            signPromise.then(
              (response) => {
                console.log("Signature promise resolved", response);
                const checkSignPromise = deviceWallet.devCheckMessageSignature(
                  "2EU3JbveHdkxW6z5tdhbbB2kRAWvXC2pLzw",
                  "27b43911824fef1a6b1a5a1906e45dc50b252650622e0c6eda085f77aa2f33d1",
                  response[0]
                );
                checkSignPromise.then(
                  (check) => {
                    console.log(check);
                  },
                  rejectPromise
                );
              },
              rejectPromise
            );
          },
          rejectPromise
        );
      },
      rejectPromise
    );
  },
  rejectPromise
  );
};
sandbox();
