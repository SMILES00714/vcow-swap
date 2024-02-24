import { ethers } from "./lib/ethers.js";

const [AMOUNT] = Deno.args;

const amount = ethers.parseUnits(AMOUNT, 18).toString();
const hook = {
  version: "1.0",
  chainId: "1",
  createdAt: Date.now(),
  meta: {},
  transactions: [
    {
      to: "0xD057B63f5E69CF1B929b356b579Cba08D7688048",
      value: "0",
      data: null,
      contractMethod: {
        inputs: [
          {
            name: "amount",
            type: "uint256",
            internalType: "uint256",
          },
        ],
        name: "swap",
        payable: false,
      },
      contractInputsValues: {
        amount,
      },
    },
    {
      to: "0xDEf1CA1fb7FBcDC777520aa7f396b4E015F497aB",
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
        spender: "0xC92E8bdf79f0507f65a392b0ab4667716BFE0110",
        amount,
      },
    },
  ],
};

const output = `out/hook-${hook.createdAt}.json`;
await Deno.writeTextFile(output, JSON.stringify(hook));
console.log(output);
