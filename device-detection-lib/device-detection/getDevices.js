"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDevices;

var _nodeHid = require("node-hid");

var _nodeHid2 = _interopRequireDefault(_nodeHid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var filterInterface = function filterInterface(device) {
  return ["win32", "darwin"].includes(process.platform) ? // $FlowFixMe bug in HID flow def
  device.usagePage === 65280 : device.interface === 0;
};
function getDevices() {
  // $FlowFixMe bug in HID flow def
  return _nodeHid2.default.devices().filter(filterInterface);
}

console.log(getDevices());
module.exports = exports.default;