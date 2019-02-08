# Library documentation

This library is intended for communicating with the Skycoin hardware wallet, for requesting data and
sending instructions.

This documentation contains general information about how to use the library.

<!-- MarkdownTOC autolink="true" bracket="round" levels="1,2,3" -->


<!-- /MarkdownTOC -->

## Overview

The following actions are possible

- Apply settings like passphrase and pin - see [devApplySettings](#devApplySettings)
- Update firmware - see [devUpdateFirmware](#devUpdateFirmware)
- Ask device to generate addresses - see [devAddressGen](#devAddressGen)
- Configure device mnemonic - see [devSetMnemonic](#devSetMnemonic)
- Ask device to generate mnemonic - see [devGenerateMnemonic](#devGenerateMnemonic)
- Configure device PIN code - see [devChangePin](#devChangePin)
- Get firmware version - see [devGetVersionDevice](#devGetVersionDevice)
- Ask device to sign message - see [devSkycoinSignMessage](#devSkycoinSignMessage)
- Ask device to check signature - see [devCheckMessageSignature](#devCheckMessageSignature)
- Wipe device - see [devWipeDevice](#devWipeDevice)
- Ask the device to perform the seed backup procedure - see [devBackupDevice](#devBackupDevice)
- Ask the device to perform the seed recovery procedure - see [devRecoveryDevice](#devRecoveryDevice)
- Ask the device Features - see [devGetFeatures](#devGetFeatures)
- Ask the device to cancel the ongoing procedure - see [devCancelRequest](#devCancelRequest)
- Ask the device to sign a transaction using the provided information - see [devSkycoinTransactionSign](#devSkycoinTransactionSign)

## General characteristics to take into account

- As many of the operations performed by the hardware wallet can be slow, most of the functions of the library
return promises, in order to get the data in a async way and prevent interrupting the normal operation of the
application while waiting for a response.

- Before using the functions of this library, it is necessary to call the [setDeviceType](#setDeviceType)
function. If that is not done, the promises of most functions will be rejected with the
`Error: Device type not defined` message.

- If the user enters an incorrect PIN, the promises of most functions will be rejected with the
`Error: PIN invalid` message.

- If a function that requests the PIN is called and the application rejects the promise that it should have
used to send the PIN to the library, the promise of the function originally called is rejected with the
`PIN cancelled` message.

- The hardware wallet can only perform one operation at a time, so if it is busy or waiting for user input,
it is necessary to wait for the current operation to finish or call the - [devCancelRequest](#devCancelRequest)
function before starting a new operation.

- When a function returns a promise and the procedure fails, the promise could be rejected, but some functions
don't do that, so it is important to be aware of the particular way in which each function responds.

## Functions reference

- [devAddressGen](#devAddressGen)
- [devApplySettings](#devApplySettings)
- [devBackupDevice](#devBackupDevice)
- [devCancelRequest](#devCancelRequest)
- [devChangePin](#devChangePin)
- [devCheckMessageSignature](#devCheckMessageSignature)
- [devGenerateMnemonic](#devGenerateMnemonic)
- [devGetFeatures](#devGetFeatures)
- [devGetVersionDevice](#devGetVersionDevice)
- [devRecoveryDevice](#devRecoveryDevice)
- [devSetMnemonic](#devSetMnemonic)
- [devSkycoinSignMessage](#devSkycoinSignMessage)
- [devSkycoinTransactionSign](#devSkycoinTransactionSign)
- [devUpdateFirmware](#devUpdateFirmware)
- [devWipeDevice](#devWipeDevice)
- [getDevice](#getDevice)
- [setDeviceType](#setDeviceType)

### devAddressGen

*Signature:*
```
devAddressGen(addressN, startIndex, confirmAddress, pinCodeReader, passphraseReader)
```

*Purpose:*

Asks the hardware wallet to return some of its addresses. When calling this function, the hardware
wallet calculates the addresses in a sequential and deterministic way.

*Params:*
- addressN: Number of addresses that the hardware wallet will return.
- startIndex: Index of the first address that will be returned by the hardware wallet.
- confirmAddress: If set to true, the address will only be returned if the user confirms the operation
in the hardware wallet. For this parameter to work it is necessary to request only one address.
- pinCodeReader: [Auxiliary function to obtain the PIN.](#auxiliary-function-to-obtain-the-PIN)
- passphraseReader: [Auxiliary function to obtain the passphrase.](#auxiliary-function-to-obtain-the-passphrase)


*Return value:*

A promise that receives a text string that depends on the result of the operation:
- If the wallet does not have a seed (promise rejected): `Error: Mnemonic not set`.
- If the user cancels the operation (promise rejected): `Error: Action cancelled by user`.
- If the operation ends correctly: A string with a JSON array containing the addresses returned by
the hardware wallet, like this one:
```
[ '2ZwFEfCFQJk9RmLTdVrK8ioavo4DJRfwZr4', '2L2f1g35KjsHPcshax7NLGeRRpw2oixBGqC' ]
```

*Notes:*
- Since the hardware wallet internally recovers the addresses sequentially, starting with the first one, the
process will be slower if addresses with high indexes are requested.

### devApplySettings

*Signature:*
```
devApplySettings(usePassphrase, pinCodeReader)
```

*Purpose:*

Enable or disable the passphrase protection.

*Params:*
- usePassphrase: Indicates if the passphrase protection must be enabled (true) or disable (false).
- pinCodeReader: [Auxiliary function to obtain the PIN.](#auxiliary-function-to-obtain-the-PIN)


*Return value:*

A promise that receives a text string that depends on the result of the operation:
- If the user cancels the operation (promise rejected): `Error: Action cancelled by user`.
- If the operation ends correctly: `Settings applied`

*Notes:*
- A security alert must accepted in the hardware wallet for the operation to be completed.
- This function can be called even when the hardware wallet does not have a seed, but it is important
to keep in mind that in that case the changes made with this function can be overwritten when
adding a seed to the hardware wallet.
- If the hardware wallet already has the passphrase protection enabled and this function is
called to enabled it again, no error occurs. The same applies for when the wallet not has
the passphrase protection disable and this function is called to disable it.

### devBackupDevice

*Signature:*
```
devBackupDevice(pinCodeReader)
```

*Purpose:*

Asks the hardware wallet to show the mnemonic (seed) on its screen, to allow the user to back it up.

*Params:*
- pinCodeReader: [Auxiliary function to obtain the PIN.](#auxiliary-function-to-obtain-the-PIN)

*Return value:*

A promise that receives a text string that depends on the result of the operation:
- If the wallet does not have a seed, the user cancels the operation or the user has already backed
up the seed: `Backup Device operation failed or refused`.
- If the operation ends correctly: `Backup Device operation completed`.

*Notes:*
- A security alert must accepted in the hardware wallet for the operation to be completed.
- Once the process is finished, it is not possible to use this function again, unless the hardware wallet
is wiped and a new seed is assigned to it.

### devCancelRequest

*Signature:*
```
devCancelRequest()
```

*Purpose:*

Cancels any operation currently active on the hardware wallet, so that it is possible to start a new one.

*Params:*
- None

*Return value:*

A promise that receives a string with `Action cancelled by user`.

*Notes:*
- This function can be called safely even if no operation is active. The response will be the same.

### devChangePin

*Signature:*
```
devChangePin(pinCodeReader)
```

*Purpose:*

Assigns a PIN to the hardware wallet (if it does not have one) or changes the current PIN.

*Params:*
- pinCodeReader: [Auxiliary function to obtain the PIN.](#auxiliary-function-to-obtain-the-PIN)

*Return value:*

A promise that receives a text string that depends on the result of the operation:
- If the user cancels the operation (promise rejected): `Error: Action cancelled by user`.
- If the promise returned by `pinCodeReader` is rejected: The function returns nothing.
- If the PINs entered by the user do not match (promise rejected): `Error: PIN mismatch`.
- If the operation ends correctly: `PIN changed`.

*Notes:*
- A security alert must accepted in the hardware wallet for the operation to be completed.
- To know if the hardware wallet has a PIN, call the [devGetFeatures](#devGetFeatures) function.
- This function can be called even when the hardware wallet does not have a seed.

### devCheckMessageSignature

*Signature:*
```
devCheckMessageSignature(address, message, signature, passphraseReader)
```

*Purpose:*

Check if a signature was made for a specific message and with a specific address.

*Params:*
- address: Address that is suspected to have been used to sign the message.
- message: Message that is suspected to have been signed.
- signature: Signature to be checked with the message and the address.
- passphraseReader: [Auxiliary function to obtain the passphrase.](#auxiliary-function-to-obtain-the-passphrase)


*Return value:*

A promise that receives a text string that depends on the result of the operation:
- If the signature or the address is invalid (promise rejected): `Error: Wrong answer kind`.
- If the signature does not correspond to the message or address (promise rejected): `Error: Wrong signature`.
- If the operation ends correctly: A text containing the address used to sign the message, like this one:
```
Address emiting that signature: 2MQU26XaiERSZNvThT4ST3iCBEGEcCEPpjB
```

*Notes:*
- This function can be called even when the hardware wallet does not have a seed.

### devGenerateMnemonic

*Signature:*
```
devGenerateMnemonic(usePassphrase)
```

*Purpose:*

Asks the hardware wallet to create a new random mnemonic (seed) and use it.

*Params:*
- usePassphrase: If set to true, a passphrase will be requested before being able to perform
some operations (the hardware wallet may save the passphrase until it is disconnected, to avoid
asking for it very frequently).

*Return value:*

A promise that receives a text string that depends on the result of the operation:
- If the hardware wallet alreadys has a mnemonic: `Generate Mnemonic operation failed or refused`.
- If the operation ends correctly: `Generate Mnemonic operation completed`.

*Notes:*
- This function does not ask the user for confirmation.

### devGetFeatures

*Signature:*
```
devGetFeatures()
```

*Purpose:*

Gets a list with the characteristics and configuration of the currently connected hardware wallet.

*Params:*
- None

*Return value:*

A promise that receives a prefixed JSON string with the data. Example response:
```json
Features {
  vendor: 'Skycoin Foundation',
  majorVersion: 1,
  minorVersion: 6,
  patchVersion: 1,
  deviceId: '0123456789ABCDEF12345678',
  pinProtection: true,
  passphraseProtection: false,
  initialized: true,
  bootloaderHash: Uint8Array [195, 166, 187, 155, 8, 246, 210, 232, 110, 9, 30, 81, 134, 25, 35, 61, 227, 14, 68, 145, 239, 81, 6, 157, 32, 171, 91, 60, 200, 33, 53, 217 ],
  pinCached: false,
  passphraseCached: false,
  needsBackup: false,
  model: '1'
}
```

*Notes:*
- This function can be called even when the hardware wallet does not have a seed.

### devGetVersionDevice

*Signature:*
```
devGetVersionDevice()
```

*Purpose:*

Gets the version number of the firmware the hardware wallet is running.

*Params:*
- None

*Return value:*

A promise that receives a string with the version, like this one:
```
Firmware Version 1.6.1
```

*Notes:*
- This function can be called even when the hardware wallet does not have a seed.

### devRecoveryDevice

*Signature:*
```
devRecoveryDevice(usePassphrase, wordReader)
```

*Purpose:*

Makes the hardware wallet initiate the procedure to safely restore a previously saved mnemonic (seed).

*Params:*
- usePassphrase: If set to true, a passphrase will be requested before being able to perform
some operations (the hardware wallet may save the passphrase until it is disconnected, to avoid
asking for it very frequently).
- wordReader: [Auxiliary function to obtain the passphrase.](#auxiliary-function-to-obtain-the-passphrase)

*Return value:*

A promise that receives a text string that depends on the result of the operation:
- If the wallet already has a mnemonic or the user cancels the operation (promise rejected):
`Error: Expected WordAck after Button confirmation`.
- If the hardware wallet asks for a specific word and a different word is entered (promise rejected):
`Error: Wrong word retyped`.
- If the user enters a word that is not part of the dictionary (promise rejected):
`Error: Word not found in a wordlist`.
- If the user enters an invalid seed (promise rejected): `Error: Invalid seed, are words in correct order?`.
- If the operation ends correctly: `Device recovered`.

*Notes:*
- A security alert must accepted in the hardware wallet for the operation to be completed.

### devSetMnemonic

*Signature:*
```
devSetMnemonic(mnemonic)
```

*Purpose:*

Assigns a new mnemonic (seed) to the hardware wallet. THIS FUNCTION IS NOT SAFE FOR PRODUCTION, AS THE SEED
WOULD BE KNOWN BY THE COMPUTER USING THE LIBRARY. USE IT ONLY FOR TESTING AND DURING DEVELOPMENT.

*Params:*
- mnemonic: mnemonic (seed) that will be assigned to the hardware wallet.

*Return value:*

A promise that receives a text string that depends on the result of the operation:
- If the wallet already has a mnemonic or the user cancels the operation:
`Set Mnemonic operation failed or refused`.
- If the operation ends correctly: `Set Mnemonic operation completed`.

*Notes:*
- A security alert must accepted in the hardware wallet for the operation to be completed.
- The function only accepts mnemonics with 12 words and a valid checksum (like those generated by the Skycoin wallets).

### devSkycoinSignMessage

*Signature:*
```
devSkycoinSignMessage(addressN, message, pinCodeReader, passphraseReader)
```

*Purpose:*

Allows to sign a message with the hardware wallet.

*Params:*
- addressN: Index of the address that will be used to sign the message.
- message: Message to be signed.
- pinCodeReader: [Auxiliary function to obtain the PIN.](#auxiliary-function-to-obtain-the-PIN)
- passphraseReader: [Auxiliary function to obtain the passphrase.](#auxiliary-function-to-obtain-the-passphrase)

*Return value:*

A promise that receives a text string that depends on the result of the operation:
- If the wallet does not have a seed (promise rejected): `Error: Mnemonic not set`.
- If the operation ends correctly: the signature returned by the hardware wallet, in plain text.

*Notes:*
- Since the hardware wallet internally recovers the addresses sequentially, starting with the first one, the
process will be slower if an address with high index is used.

### devSkycoinTransactionSign

*Signature:*
```
devSkycoinTransactionSign(inputTransactions, outputTransactions, pinCodeReader, passphraseReader)
```

*Purpose:*

Allows to sign a transaction with the hardware wallet.

*Params:*
- inputTransactions: list of objects with the following fields
  * 'hashIn': input hash
  * 'index': input index
- outputTransactions: list of objects with the following fields
  `address`: Skycoin address in `base58` format
  `addressIndex`: address index
  `coin`: output coins
  `hour`: output hours
- pinCodeReader: [Auxiliary function to obtain the PIN.](#auxiliary-function-to-obtain-the-PIN)
- passphraseReader: [Auxiliary function to obtain the passphrase.](#auxiliary-function-to-obtain-the-passphrase)

*Return value:*

A promise that receives a text string that depends on the result of the operation:
- If the wallet does not have a seed (promise rejected): `Error: Mnemonic not set`.
- If the operation ends correctly: the signature returned by the hardware wallet, in plain text.

*Notes:*
- Since the hardware wallet internally recovers the addresses sequentially, starting with the first one, the
process will be slower if an address with high index is used.

### devUpdateFirmware

*Signature:*
```
devUpdateFirmware(data, hash)
```

*Purpose:*

Updates the firmware of the connected hardware wallet. For the operation to be done correctly, the
hardware wallet must be in bootloader mode (it must have been connected to the USB port while the two
physical buttons were being pressed).

*Params:*
- data: `Buffer` with the firmware data. Can be obtained opening the file with `fs.readFile`.
- hash: Hash of the firmware. If you do not have the hash, you can calculate with
`sha256(data.slice(0x100))`, but it is best to use a previously calculated hash, for security reasons.

*Return value:*

A promise that receives a text string that depends on the result of the operation:
- If the hardware wallet is not in bootloader mode (promise rejected):
`Error: Update firmware operation failed or refused`.
- If the user cancels the operation at the beginning: the promise never receives a value (you should
be careful with this).
- If the user cancels the operation at the end (promise rejected):
`Error: Update firmware operation failed or refused`.
- If the operation ends correctly: `Update firmware operation completed`.

*Notes:*
- A security alert must accepted in the hardware wallet for the operation to be completed.

### devWipeDevice

*Signature:*
```
devWipeDevice()
```

*Purpose:*

Wipes the hardware wallet, so that it is possible to configure it again as a new device.

*Params:*
- None

*Return value:*

A promise that receives a text string that depends on the result of the operation:
- If the user cancels the operation: `Wipe Device operation failed or refused`.
- If the operation ends correctly: `Wipe Device operation completed`.

*Notes:*
- A security alert must accepted in the hardware wallet for the operation to be completed.
- If the hardware wallet does not have data and the user accepts the security alert, the function
does not fail, it ends successfully.

### getDevice

*Signature:*
```
getDevice()
```

*Purpose:*

Gets an object that allow to communicate with the hardware wallet at a low level. This function
is mainly intended for internal use, but it is useful to detect if the hardware wallet is connected.

*Params:*
- None

*Return value:*

If the hardware wallet is connected, returns an object to communicate with it at a low level.
If the hardware wallet is no connected, returns `null`.

*Notes:*
- If this function returns a value other than `null`, it is necessary to call the `close()`
function of the returned object before calling any other function related to the hardware
wallet, to free resources. If this is not done, there may be problems in Mac OS.

### setDeviceType

*Signature:*
```
setDeviceType(devType)
```

*Purpose:*

Tells the library if it should communicate with a physical device connected via USB or an emulator running on
the local machine. It must be called before making calls to other functions.

*Params:*
- devType: it must be one of the values of the [DeviceTypeEnum](#DeviceTypeEnum) enum.

*Return value:*
- None

## Enums

- [DeviceTypeEnum](#DeviceTypeEnum)

### DeviceTypeEnum

This enum stores the different options that can be passed to the [setDeviceType](#setDeviceType) function.

*Values:*
- EMULATOR: Hardware wallet emulator.
- USB: Physical device.

## Auxiliary functions

Some of the functions may require the user to enter the PIN code or a passphrase during the
process, so it is necessary to provide them auxiliary functions for obtaining that data and send it to the
library, so that operations can continue.

### Auxiliary function to obtain the PIN

When a function initiates a procedure that may require the PIN to be entered, it is necessary to send it, as
a parameter, a function for obtaining the PIN and returning it to the library. Regardless of which function
was called, the auxiliary function to obtain the PIN always has the same form.

The auxiliary function does not receive any parameter.

The auxiliary function must return a promise that returns a string with the PIN entered by the user, or be
rejected if the user decided not to enter the PIN (this causes the operation to be canceled without returning
anything through the promise). It is important to keep in mind that the PIN that the promise must return is
not the PIN number in plain text, but the position of the numbers within the matrix shown on the hardware
wallet screen.

For example, if the hardware wallet displays on the screen a matrix like this:
```
-------------
| 6 | 7 | 4 |
-------------
| 1 | 9 | 3 |
-------------
| 8 | 5 | 2 |
-------------
```
If the promise returns "1234", then the hardware wallet will consider that the PIN the user entered is "8521",
due to the position of the numbers on the matrix.

This is an example of an auxiliary function:

```
const pinCodeReader = function() {
    // Promise that will send the data to the library after obtaining it.
    return new Promise((resolve, reject) => {
        // Get the PIN using the console.
        console.log("Enter your PIN:");
        const pinCode = scanf('%s');
        // Just as an example, the operation is canceled if the PIN has less than 4 digits (the error message is not relevant).
        if (pinCode.length < 4) {
            reject(new Error("Bad pin code"));
            return;
        }
        // Return the PIN.
        resolve(pinCode);
    });
};
```

### Auxiliary function to obtain the passphrase

When a function initiates a procedure that may require the passphrase to be entered, it is necessary to send it,
as a parameter, a function for obtaining the passphrase and returning it to the library. Regardless of which
function was called, the auxiliary function to obtain the passphrase always has the same form.

The auxiliary function does not receive any parameter.

The auxiliary function must return a promise that returns a string with the passphrase entered by the user, or be
rejected if the user decided not to enter the passphrase (this causes the operation to be canceled without
returning anything through the promise).

This is an example of an auxiliary function:

```
const passphraseReader = function() {
    // Promise that will send the data to the library after obtaining it.
    return new Promise((resolve, reject) => {
        // Get the passphrase using the console.
        console.log("Enter your passphrase:");
        const passphrase = scanf('%s');
        // Just as an example, the operation is canceled if the passphrase has less than 4 characters (the error message is not relevant).
        if (passphrase.length < 4) {
            reject(new Error("Bad passphrase"));
            return;
        }
        // Return the passphrase.
        resolve(passphrase);
    });
};
```
