import { addresses } from "./lib/contracts.js";
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
      to: addresses.VCow,
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
