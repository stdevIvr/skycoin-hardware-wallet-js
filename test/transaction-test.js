const Suite = require('node-test');
const deviceWallet = require('../device-wallet');

const suite = new Suite('Transaction testing');

const rejectPromise = function (msg) {
    console.log("Promise rejected", msg);
};

const wordReader = function () {
    return new Promise((resolve) => {
        console.log("Inside wordReader callback, please input word: ");
        const word = scanf('%s');
        resolve(word);
    });
};

const pinCodeReader = function () {
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

const setup = function () {
    return new Promise((resolve, reject) => {
        const wipePromise = deviceWallet.devWipeDevice();
        wipePromise.then(() => {
            const promise = deviceWallet.devSetMnemonic("cloud flower upset remain green metal below cup stem infant art thank");
            // const promise = deviceWallet.devGenerateMnemonic();
            promise.then(() => resolve("Setup done"));
            // deviceWallet.devBackupDevice("cloud flower upset remain green metal below cup stem infant art thank");
        }, (msg) => {
            console.log(msg);
            reject(new Error("setup failed"));
        });
    });
};

const sample_1 = function (t) {
    return new Promise((resolve, reject) => {
        const setupPromise = setup();
        setupPromise.then(() => {
            // --------------------
            const transactionInput = {
                'hashIn': "181bd5656115172fe81451fae4fb56498a97744d89702e73da75ba91ed5200f9",
                'index': 0
            };
            const transactionInputs = [transactionInput];

            const transactionOutput = {
                'address': "K9TzLrgqz7uXn3QJHGxmzdRByAzH33J2ot",
                'coin': 100000,
                'hour': 2
            };
            const transactionOutputs = [transactionOutput];

            const transactionPromise = deviceWallet.devSkycoinTransactionSign(transactionInputs, transactionOutputs, pinCodeReader, wordReader);
            transactionPromise.then((signatures) => {
                t.equal(signatures.length, 1);
                const checkSignPromise = deviceWallet.devCheckMessageSignature(
                    "2EU3JbveHdkxW6z5tdhbbB2kRAWvXC2pLzw",
                    "d11c62b1e0e9abf629b1f5f4699cef9fbc504b45ceedf0047ead686979498218",
                    signatures[0],
                    wordReader
                );
                checkSignPromise.then((check) => {
                    t.equal("Address emiting that signature: 2EU3JbveHdkxW6z5tdhbbB2kRAWvXC2pLzw", check);
                    resolve("Test success");
                }, rejectPromise);
            }, rejectPromise);
        }, rejectPromise);
    });
};

const sample_2 = function (t) {
    return new Promise((resolve, reject) => {
        const setupPromise = setup();
        setupPromise.then(() => {
            // --------------------
            const transactionInput = {
                'hashIn': "01a9ef6c25271229ef9760e1536c3dc5ccf0ead7de93a64c12a01340670d87e9",
                'index': 0
            };
            const transactionInput1 = {
                'hashIn': "8c2c97bfd34e0f0f9833b789ce03c2e80ac0b94b9d0b99cee6ea76fb662e8e1c",
                'index': 0
            };
            const transactionInputs = [
                transactionInput,
                transactionInput1
            ];

            const transactionOutput = {
                'address': "K9TzLrgqz7uXn3QJHGxmzdRByAzH33J2ot",
                'coin': 20800000,
                'hour': 255
            };
            const transactionOutputs = [transactionOutput];

            const transactionPromise = deviceWallet.devSkycoinTransactionSign(transactionInputs, transactionOutputs, pinCodeReader, wordReader);
            transactionPromise.then((signatures) => {
                t.equal(signatures.length, transactionInputs.length);
                const checkSignPromise = deviceWallet.devCheckMessageSignature(
                    "2EU3JbveHdkxW6z5tdhbbB2kRAWvXC2pLzw",
                    "9bbde062d665a8b11ae15aee6d4f32f0f3d61af55160c142060795a219378a54",
                    signatures[0],
                    wordReader
                );
                checkSignPromise.then((check) => {
                    t.equal("Address emiting that signature: 2EU3JbveHdkxW6z5tdhbbB2kRAWvXC2pLzw", check);
                    const checkSignPromise1 = deviceWallet.devCheckMessageSignature(
                        "2EU3JbveHdkxW6z5tdhbbB2kRAWvXC2pLzw",
                        "f947b0352b19672f7b7d04dc2f1fdc47bc5355878f3c47a43d4d4cfbae07d026",
                        signatures[1],
                        wordReader
                    );
                    checkSignPromise1.then((check1) => {
                        t.equal("Address emiting that signature: 2EU3JbveHdkxW6z5tdhbbB2kRAWvXC2pLzw", check1);
                        resolve("Test success");
                    }, rejectPromise);
                }, rejectPromise);
            }, rejectPromise);

        }, rejectPromise);
    });
};

const sample_3 = function (t) {
    return new Promise((resolve, reject) => {
        const setupPromise = setup();
        setupPromise.then(() => {
            // --------------------
            const transactionInput = {
                'hashIn': "da3b5e29250289ad78dc42dcf007ab8f61126198e71e8306ff8c11696a0c40f7",
                'index': 0
            };
            const transactionInput1 = {
                'hashIn': "33e826d62489932905dd936d3edbb74f37211d68d4657689ed4b8027edcad0fb",
                'index': 0
            };
            const transactionInput2 = {
                'hashIn': "668f4c144ad2a4458eaef89a38f10e5307b4f0e8fce2ade96fb2cc2409fa6592",
                'index': 0
            };
            const transactionInputs = [
                transactionInput,
                transactionInput1,
                transactionInput2
            ];

            const transactionOutput = {
                'address': "K9TzLrgqz7uXn3QJHGxmzdRByAzH33J2ot",
                'coin': 111000000,
                'hour': 6464556
            };
            const transactionOutput1 = {
                'address': "2iNNt6fm9LszSWe51693BeyNUKX34pPaLx8",
                'coin': 1900000,
                'hour': 1
            };
            const transactionOutputs = [
                transactionOutput,
                transactionOutput1
            ];

            const transactionPromise = deviceWallet.devSkycoinTransactionSign(transactionInputs, transactionOutputs, pinCodeReader, wordReader);
            transactionPromise.then((signatures) => {
                t.equal(signatures.length, transactionInputs.length);
                const checkSignPromise = deviceWallet.devCheckMessageSignature(
                    "2EU3JbveHdkxW6z5tdhbbB2kRAWvXC2pLzw",
                    "ff383c647551a3ba0387f8334b3f397e45f9fc7b3b5c3b18ab9f2b9737bce039",
                    signatures[0],
                    wordReader
                );
                checkSignPromise.then((check) => {
                    t.equal("Address emiting that signature: 2EU3JbveHdkxW6z5tdhbbB2kRAWvXC2pLzw", check);
                    const checkSignPromise1 = deviceWallet.devCheckMessageSignature(
                        "2EU3JbveHdkxW6z5tdhbbB2kRAWvXC2pLzw",
                        "c918d83d8d3b1ee85c1d2af6885a0067bacc636d2ebb77655150f86e80bf4417",
                        signatures[1],
                        wordReader
                    );
                    checkSignPromise1.then((check1) => {
                        t.equal("Address emiting that signature: 2EU3JbveHdkxW6z5tdhbbB2kRAWvXC2pLzw", check1);
                        const checkSignPromise2 = deviceWallet.devCheckMessageSignature(
                            "2EU3JbveHdkxW6z5tdhbbB2kRAWvXC2pLzw",
                            "0e827c5d16bab0c3451850cc6deeaa332cbcb88322deea4ea939424b072e9b97",
                            signatures[2],
                            wordReader
                        );
                        checkSignPromise2.then((check2) => {
                            t.equal("Address emiting that signature: 2EU3JbveHdkxW6z5tdhbbB2kRAWvXC2pLzw", check2);
                            resolve("Test success");
                        }, rejectPromise);
                    }, rejectPromise);
                }, rejectPromise);
            }, rejectPromise);

        }, rejectPromise);
    });
};

const sample_4 = function (t) {
    return new Promise((resolve, reject) => {
        const setupPromise = setup();
        setupPromise.then(() => {
            // --------------------
            const transactionInput = {
                'hashIn': "b99f62c5b42aec6be97f2ca74bb1a846be9248e8e19771943c501e0b48a43d82",
                'index': 0
            };
            const transactionInput1 = {
                'hashIn': "cd13f705d9c1ce4ac602e4c4347e986deab8e742eae8996b34c429874799ebb2",
                'index': 0
            };
            const transactionInputs = [
                transactionInput,
                transactionInput1
            ];

            const transactionOutput = {
                'address': "22S8njPeKUNJBijQjNCzaasXVyf22rWv7gF",
                'coin': 23100000,
                'hour': 0
            };
            const transactionOutputs = [transactionOutput];

            const transactionPromise = deviceWallet.devSkycoinTransactionSign(transactionInputs, transactionOutputs, pinCodeReader, wordReader);
            transactionPromise.then((signatures) => {
                t.equal(signatures.length, transactionInputs.length);
                const checkSignPromise = deviceWallet.devCheckMessageSignature(
                    "2EU3JbveHdkxW6z5tdhbbB2kRAWvXC2pLzw",
                    "42a26380399172f2024067a17704fceda607283a0f17cb0024ab7a96fc6e4ac6",
                    signatures[0],
                    wordReader
                );
                checkSignPromise.then((check) => {
                    t.equal("Address emiting that signature: 2EU3JbveHdkxW6z5tdhbbB2kRAWvXC2pLzw", check);
                    const checkSignPromise1 = deviceWallet.devCheckMessageSignature(
                        "2EU3JbveHdkxW6z5tdhbbB2kRAWvXC2pLzw",
                        "5e0a5a8c7ea4a2a500c24e3a4bfd83ef9f74f3c2ff4bdc01240b66a41e34ebbf",
                        signatures[1],
                        wordReader
                    );
                    checkSignPromise1.then((check1) => {
                        t.equal("Address emiting that signature: 2EU3JbveHdkxW6z5tdhbbB2kRAWvXC2pLzw", check1);
                        resolve("Test success");
                    }, rejectPromise);
                }, rejectPromise);
            }, rejectPromise);

        }, rejectPromise);
    });
};

const sample_5 = function (t) {
    return new Promise((resolve, reject) => {
        const setupPromise = setup();
        setupPromise.then(() => {
            // --------------------
            const transactionInput = {
                'hashIn': "4c12fdd28bd580989892b0518f51de3add96b5efb0f54f0cd6115054c682e1f1",
                'index': 0
            };
            const transactionInputs = [transactionInput];

            const transactionOutput = {
                'address': "2iNNt6fm9LszSWe51693BeyNUKX34pPaLx8",
                'coin': 1000000,
                'hour': 0
            };
            const transactionOutputs = [transactionOutput];

            const transactionPromise = deviceWallet.devSkycoinTransactionSign(transactionInputs, transactionOutputs, pinCodeReader, wordReader);
            transactionPromise.then((signatures) => {
                t.equal(signatures.length, transactionInputs.length);
                const checkSignPromise = deviceWallet.devCheckMessageSignature(
                    "2EU3JbveHdkxW6z5tdhbbB2kRAWvXC2pLzw",
                    "c40e110f5e460532bfb03a5a0e50262d92d8913a89c87869adb5a443463dea69",
                    signatures[0],
                    wordReader
                );
                checkSignPromise.then((check) => {
                    t.equal("Address emiting that signature: 2EU3JbveHdkxW6z5tdhbbB2kRAWvXC2pLzw", check);
                    resolve("Test success");
                }, rejectPromise);
            }, rejectPromise);

        }, rejectPromise);
    });
};

const sample_6 = function (t) {
    return new Promise((resolve, reject) => {
        const setupPromise = setup();
        setupPromise.then(() => {
            // --------------------
            const transactionInput = {
                'hashIn': "c5467f398fc3b9d7255d417d9ca208c0a1dfa0ee573974a5fdeb654e1735fc59",
                'index': 0
            };
            const transactionInputs = [transactionInput];

            const transactionOutput = {
                'address': "K9TzLrgqz7uXn3QJHGxmzdRByAzH33J2ot",
                'coin': 10000000,
                'hour': 1
            };
            const transactionOutput1 = {
                'address': "VNz8LR9JTSoz5o7qPHm3QHj4EiJB6LV18L",
                'coin': 5500000,
                'hour': 0
            };
            const transactionOutput2 = {
                'address': "22S8njPeKUNJBijQjNCzaasXVyf22rWv7gF",
                'coin': 4500000,
                'hour': 1
            };
            const transactionOutputs = [
                transactionOutput,
                transactionOutput1,
                transactionOutput2
            ];

            const transactionPromise = deviceWallet.devSkycoinTransactionSign(transactionInputs, transactionOutputs, pinCodeReader, wordReader);
            transactionPromise.then((signatures) => {
                t.equal(signatures.length, transactionInputs.length);
                const checkSignPromise = deviceWallet.devCheckMessageSignature(
                    "2EU3JbveHdkxW6z5tdhbbB2kRAWvXC2pLzw",
                    "7edea77354eca0999b1b023014eb04638b05313d40711707dd03a9935696ccd1",
                    signatures[0],
                    wordReader
                );
                checkSignPromise.then((check) => {
                    t.equal("Address emiting that signature: 2EU3JbveHdkxW6z5tdhbbB2kRAWvXC2pLzw", check);
                    resolve("Test success");
                }, rejectPromise);
            }, rejectPromise);

        }, rejectPromise);
    });
};

const sample_7 = function (t) {
    return new Promise((resolve, reject) => {
        const setupPromise = setup();
        setupPromise.then(() => {
            // --------------------
            const transactionInput = {
                'hashIn': "7b65023cf64a56052cdea25ce4fa88943c8bc96d1ab34ad64e2a8b4c5055087e",
                'index': 0
            };
            const transactionInput1 = {
                'hashIn': "0c0696698cba98047bc042739e14839c09bbb8bb5719b735bff88636360238ad",
                'index': 0
            };
            const transactionInput2 = {
                'hashIn': "ae3e0b476b61734e590b934acb635d4ad26647bc05867cb01abd1d24f7f2ce50",
                'index': 0
            };
            const transactionInputs = [
                transactionInput,
                transactionInput1,
                transactionInput2
            ];

            const transactionOutput = {
                'address': "22S8njPeKUNJBijQjNCzaasXVyf22rWv7gF",
                'coin': 25000000,
                'hour': 33
            };
            const transactionOutputs = [transactionOutput];

            const transactionPromise = deviceWallet.devSkycoinTransactionSign(transactionInputs, transactionOutputs, pinCodeReader, wordReader);
            transactionPromise.then((signatures) => {
                t.equal(signatures.length, transactionInputs.length);

                const checkSignPromise = deviceWallet.devCheckMessageSignature(
                    "2EU3JbveHdkxW6z5tdhbbB2kRAWvXC2pLzw",
                    "ec9053ab9988feb0cfb3fcce96f02c7d146ff7a164865c4434d1dbef42a24e91",
                    signatures[0],
                    wordReader
                );
                checkSignPromise.then((check) => {
                    t.equal("Address emiting that signature: 2EU3JbveHdkxW6z5tdhbbB2kRAWvXC2pLzw", check);
                    const checkSignPromise1 = deviceWallet.devCheckMessageSignature(
                        "2EU3JbveHdkxW6z5tdhbbB2kRAWvXC2pLzw",
                        "332534f92c27b31f5b73d8d0c7dde4527b540024f8daa965fe9140e97f3c2b06",
                        signatures[1],
                        wordReader
                    );
                    checkSignPromise1.then((check1) => {
                        t.equal("Address emiting that signature: 2EU3JbveHdkxW6z5tdhbbB2kRAWvXC2pLzw", check1);
                        const checkSignPromise2 = deviceWallet.devCheckMessageSignature(
                            "2EU3JbveHdkxW6z5tdhbbB2kRAWvXC2pLzw",
                            "63f955205ceb159415268bad68acaae6ac8be0a9f33ef998a84d1c09a8b52798",
                            signatures[2],
                            wordReader
                        );
                        checkSignPromise2.then((check2) => {
                            t.equal("Address emiting that signature: 2EU3JbveHdkxW6z5tdhbbB2kRAWvXC2pLzw", check2);
                            resolve("Test success");
                        }, rejectPromise);
                    }, rejectPromise);
                }, rejectPromise);

            }, rejectPromise);
        }, rejectPromise);
    });
};

const sample_8 = function (t) {
    return new Promise((resolve, reject) => {
        const setupPromise = setup();
        setupPromise.then(() => {
            // --------------------
            const transactionInput = {
                'hashIn': "ae6fcae589898d6003362aaf39c56852f65369d55bf0f2f672bcc268c15a32da",
                'index': 0
            };
            const transactionInputs = [transactionInput];

            const transactionOutput = {
                'address': "3pXt9MSQJkwgPXLNePLQkjKq8tsRnFZGQA",
                'coin': 1000000,
                'hour': 1000
            };
            const transactionOutputs = [transactionOutput];

            const transactionPromise = deviceWallet.devSkycoinTransactionSign(transactionInputs, transactionOutputs, pinCodeReader, wordReader);
            transactionPromise.then((signatures) => {
                t.equal(signatures.length, transactionInputs.length);
                const checkSignPromise = deviceWallet.devCheckMessageSignature(
                    "2EU3JbveHdkxW6z5tdhbbB2kRAWvXC2pLzw",
                    "47bfa37c79f7960df8e8a421250922c5165167f4c91ecca5682c1106f9010a7f",
                    signatures[0],
                    wordReader
                );
                checkSignPromise.then((check) => {
                    t.equal("Address emiting that signature: 2EU3JbveHdkxW6z5tdhbbB2kRAWvXC2pLzw", check);
                    resolve("Test success");
                }, rejectPromise);
            }, rejectPromise);

        }, rejectPromise);
    });
};

const sample_9 = function (t) {
    return new Promise((resolve, reject) => {
        const setupPromise = setup();
        setupPromise.then(() => {
            // --------------------
            const transactionInput = {
                'hashIn': "ae6fcae589898d6003362aaf39c56852f65369d55bf0f2f672bcc268c15a32da",
                'index': 0
            };
            const transactionInputs = [transactionInput];

            const transactionOutput = {
                'address': "3pXt9MSQJkwgPXLNePLQkjKq8tsRnFZGQA",
                'coin': 300000,
                'hour': 500
            };
            const transactionOutput1 = {
                'address': "S6Dnv6gRTgsHCmZQxjN7cX5aRjJvDvqwp9",
                'coin': 700000,
                'hour': 500
            };
            const transactionOutputs = [
                transactionOutput,
                transactionOutput1
            ];

            const transactionPromise = deviceWallet.devSkycoinTransactionSign(transactionInputs, transactionOutputs, pinCodeReader, wordReader);
            transactionPromise.then((signatures) => {
                t.equal(signatures.length, transactionInputs.length);
                const checkSignPromise = deviceWallet.devCheckMessageSignature(
                    "2EU3JbveHdkxW6z5tdhbbB2kRAWvXC2pLzw",
                    "e0c6e4982b1b8c33c5be55ac115b69be68f209c5d9054954653e14874664b57d",
                    signatures[0],
                    wordReader
                );
                checkSignPromise.then((check) => {
                    t.equal("Address emiting that signature: 2EU3JbveHdkxW6z5tdhbbB2kRAWvXC2pLzw", check);
                    resolve("Test success");
                }, rejectPromise);
            }, rejectPromise);

        }, rejectPromise);
    });
};

const sample_10 = function (t) {
    return new Promise((resolve, reject) => {
        const setupPromise = setup();
        setupPromise.then(() => {
            // --------------------
            const transactionInput = {
                'hashIn': "ae6fcae589898d6003362aaf39c56852f65369d55bf0f2f672bcc268c15a32da",
                'index': 0
            };
            const transactionInputs = [transactionInput];

            const transactionOutput = {
                'address': "S6Dnv6gRTgsHCmZQxjN7cX5aRjJvDvqwp9",
                'coin': 1000000,
                'hour': 1000
            };
            const transactionOutputs = [transactionOutput];

            const transactionPromise = deviceWallet.devSkycoinTransactionSign(transactionInputs, transactionOutputs, pinCodeReader, wordReader);
            transactionPromise.then((signatures) => {
                t.equal(signatures.length, transactionInputs.length);
                const checkSignPromise = deviceWallet.devCheckMessageSignature(
                    "2EU3JbveHdkxW6z5tdhbbB2kRAWvXC2pLzw",
                    "457648543755580ad40ab461bbef2b0ffe19f2130f2f220cbb2f196b05d436b4",
                    signatures[0],
                    wordReader
                );
                checkSignPromise.then((check) => {
                    t.equal("Address emiting that signature: 2EU3JbveHdkxW6z5tdhbbB2kRAWvXC2pLzw", check);
                    resolve("Test success");
                }, rejectPromise);
            }, rejectPromise);
        }, rejectPromise);
    });
};

suite.test('Transactions', async function (t) {
    if (deviceWallet.getDevice() === null) {
        console.log("Skycoin hardware NOT FOUND, using emulator");
        deviceWallet.setDeviceType(deviceWallet.DeviceTypeEnum.EMULATOR);
    } else {
        console.log("Skycoin hardware is plugged in");
        deviceWallet.setDeviceType(deviceWallet.DeviceTypeEnum.USB);
    }

    var testPromise = new Promise(function (resolve, reject) {
        setTimeout(function () {
            sample_1(t).then(() => {
                return sample_2(t);
            }).then(() => {
                return sample_3(t);
            }).then(() => {
                return sample_4(t);
            }).then(() => {
                return sample_5(t);
            }).then(() => {
                return sample_6(t);
            }).then(() => {
                return sample_7(t);
            }).then(() => {
                return sample_8(t);
            }).then(() => {
                return sample_9(t);
            }).then(() => {
                return sample_10(t);
            });
        }, 200);
    });

    try {
        var result = await testPromise;
        expect(result).to.equal(0);
        process.exit(0);
    }
    catch (err) {
        console.log('Not success');
    }
}).setTimeout(Infinity);
