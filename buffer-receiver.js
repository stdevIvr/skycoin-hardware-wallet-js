const messages = require('./protob/skycoin');

class BufferReceiver {
    constructor() {
        this.msgIndex = 0;
        this.msgSize = undefined;
        this.bytesToGet = undefined;
        this.kind = undefined;
        this.dataBuffer = undefined;
    }

    // eslint-disable-next-line max-statements
    parseHeader(data) {
        console.log("Received data of length: ", data.length);
        const dv8 = new Uint8Array(data);
        const msgIdSlice = dv8.slice(3, 5);
        const msgSizeSlice = dv8.slice(5, 9);
        this.kind = msgIdSlice[1] + (msgIdSlice[0] << 8);
        this.msgSize = msgSizeSlice[3] + (msgSizeSlice[2] << 8) + (msgSizeSlice[1] << 16) + (msgSizeSlice[0] << 24);
        console.log("That message says its size is: ", this.msgSize);
        console.log("msgid slice:", msgIdSlice);
        console.log("Slice:", msgSizeSlice);
        if (this.msgSize == 0) {
            console.log("Skiping message parsing, msgSize == 0");
            this.dataBuffer = new Uint8Array(64);
            return;
        }
        this.dataBuffer = new Uint8Array(64 * Math.ceil((this.msgSize + 9) / 64));
        this.dataBuffer.set(dv8.slice(9));
        this.bytesToGet = this.msgSize + 9 - 64;

        console.log(
            "Received header",
            " msg this.kind: ", messages.MessageType[this.kind],
            " size: ", this.msgSize,
            "buffer lenght: ", this.dataBuffer.byteLength,
            "\nRemaining bytesToGet:", this.bytesToGet
            );
    }

    // eslint-disable-next-line max-statements
    receiveBuffer(data, callback) {

        if (this.bytesToGet === undefined) {
            this.parseHeader(data);

            if (this.bytesToGet > 0) {
                return;
            }
            callback(this.kind, this.dataBuffer.slice(0, this.msgSize));
            return;
        }

        this.dataBuffer.set(data.slice(1), (63 * this.msgIndex) + 55);
        this.msgIndex += 1;
        this.bytesToGet -= 64;

        console.log(
            "Received data", " msg kind: ",
            messages.MessageType[this.kind],
            " size: ", this.msgSize, "buffer lenght: ",
            this.dataBuffer.byteLength,
            "\nRemaining bytesToGet:", this.bytesToGet
            );

        if (this.bytesToGet > 0) {
            return;
        }
        if (callback) {
            // eslint-disable-next-line callback-return
            callback(this.kind, this.dataBuffer.slice(0, this.msgSize));
        }
    }
}

module.exports = {
    BufferReceiver
};
