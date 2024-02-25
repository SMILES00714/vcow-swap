import { ethers } from "./ethers.js";

export const addresses = {
  MultiSend: "0x40A2aCCbd92BCA938b02010E17A5b8929b49130D",
  VCow: "0xD057B63f5E69CF1B929b356b579Cba08D7688048",
  Cow: "0xDEf1CA1fb7FBcDC777520aa7f396b4E015F497aB",
  Settlement: "0x9008D19f58AAbD9eD0D60971565AA8510560ab41",
  VaultRelayer: "0xC92E8bdf79f0507f65a392b0ab4667716BFE0110",
}

export const interfaces = {
  Safe: new ethers.Interface([
    "function execTransaction(address to, uint256 value, bytes data, uint8 operation, uint256 safeTxGas, uint256 baseGas, uint256 gasPrice, address gasToken, address refundReceiver, bytes signatures) payable returns (bool success)",
  ]),
  MultiSend: new ethers.Interface([
    "function multiSend(bytes transactions) payable",
  ]),
  VCow: new ethers.Interface([
    "function swap(uint256 amount)",
  ]),
  Cow: new ethers.Interface([
    "function transfer(address recipient, uint256 amount) returns (bool success)",
  ]),
}

export function multiSend(calls) {
  return interfaces.MultiSend.encodeFunctionData("multiSend", [
    ethers.concat(calls.map(({ to, value, data }) =>
      ethers.solidityPacked(
        ["uint8", "address", "uint256", "uint256", "bytes"],
        [0, to, value, ethers.dataLength(data), data],
      )
    )),
  ]);
}
