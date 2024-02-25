import { addresses, interfaces, multiSend } from "./lib/contracts.js";
import { ethers } from "./lib/ethers.js";

const [AMOUNT, SAFE, DAUGHTER] = Deno.args;

const amount = ethers.parseUnits(AMOUNT, 18).toString();
const safe = ethers.getAddress(SAFE);
const daughter = ethers.getAddress(DAUGHTER);

const hook = {
  version: "1.0",
  chainId: "1",
  createdAt: Date.now(),
  meta: {},
  transactions: [
    {
      to: daughter,
      value: "0",
      data: null,
      contractMethod: {
        inputs: [
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
          {
            internalType: "enum Enum.Operation",
            name: "operation",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "safeTxGas",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "baseGas",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "gasPrice",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "gasToken",
            type: "address",
          },
          {
            internalType: "address payable",
            name: "refundReceiver",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "signatures",
            type: "bytes",
          },
        ],
        name: "execTransaction",
        payable: true,
      },
      contractInputsValues: {
        to: addresses.MultiSend,
        value: "0",
        data: multiSend([
          {
            to: addresses.VCow,
            value: 0,
            data: interfaces.VCow.encodeFunctionData("swap", [amount]),
          },
          {
            to: addresses.Cow,
            value: 0,
            data: interfaces.Cow.encodeFunctionData("transfer", [safe, amount]),
          },
        ]),
        operation: "1",
        safeTxGas: "0",
        baseGas: "0",
        gasPrice: "0",
        gasToken: ethers.ZeroAddress,
        refundReceiver: ethers.ZeroAddress,
        signatures: ethers.solidityPacked(
          ["uint256", "uint256", "uint8"],
          [safe, 0, 1],
        ),
      },
    },
    {
      to: addresses.Cow,
      value: "0",
      data: null,
      contractMethod: {
        inputs: [
          {
            internalType: "address",
            name: "spender",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        name: "approve",
        payable: false,
      },
      contractInputsValues: {
        spender: addresses.VaultRelayer,
        amount,
      },
    },
  ],
};

const output = `out/hook-${hook.createdAt}.json`;
await Deno.writeTextFile(output, JSON.stringify(hook));
console.log(output);
