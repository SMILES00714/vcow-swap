import { addresses, interfaces } from "./lib/contracts.js";
import { postQuote } from "./lib/cow.js";
import { ethers } from "./lib/ethers.js";
import { estimateGas } from "./lib/ethrpc.js";
import { getSafe, getTransactions } from "./lib/safe.js";
import { check } from "./lib/utils.js";

const [SAFE, TOKEN] = Deno.args;

const safe = ethers.getAddress(SAFE);
const token = ethers.getAddress(TOKEN);

const { nonce } = await getSafe(safe);
const { results: [transaction] } = await getTransactions(safe, { nonce });
check(transaction, "no transaction found");
check(
  transaction.confirmationsRequired <= transaction.confirmations.length,
  "hook missing signatures",
);
check(transaction.to === addresses.MultiSend, "hook not a multi send");
const approval = transaction.dataDecoded.parameters[0].valueDecoded[1];
check(
  approval.to === addresses.Cow && approval.dataDecoded.method === "approve",
  "hook missing approval",
);
const amount = approval.dataDecoded.parameters[1].value;

const hook = {
  target: safe,
  callData: interfaces.Safe.encodeFunctionData("execTransaction", [
    transaction.to,
    transaction.value,
    transaction.data,
    transaction.operation,
    transaction.safeTxGas,
    transaction.baseGas,
    transaction.gasPrice,
    transaction.gasToken,
    transaction.refundReceiver,
    ethers.concat(
      transaction
        .confirmations
        .sort((a, b) => {
          const [x, y] = [a.owner.toLowerCase(), b.owner.toLowerCase()];
          return x < y ? -1 : x > y ? 1 : 0;
        })
        .map((a) => a.signature),
    ),
  ]),
};
const appData = {
  version: "0.11.0",
  metadata: {
    hooks: {
      pre: [
        {
          ...hook,
          gasLimit: `${await estimateGas({
            from: ethers.ZeroAddress,
            to: safe,
            data: hook.callData,
          })}`,
        },
      ],
    },
  },
};
const order = {
  sellToken: addresses.Cow,
  buyToken: token,
  receiver: safe,
  feeAmount: "0",
  kind: "sell",
  partiallyFillable: false,
  sellTokenBalance: "erc20",
  buyTokenBalance: "erc20",
};

const { quote } = await postQuote({
  ...order,
  from: safe,
  sellAmountBeforeFee: amount,
  validFor: 3600,
  appData: JSON.stringify(appData),
  priceQuality: "verified",
  signingScheme: "eip1271",
  onchainOrder: false,
});

const typedData = {
  types: {
    EIP712Domain: [
      { name: "name", type: "string" },
      { name: "version", type: "string" },
      { name: "chainId", type: "uint256" },
      { name: "verifyingContract", type: "address" },
    ],
    Order: [
      { name: "sellToken", type: "address" },
      { name: "buyToken", type: "address" },
      { name: "receiver", type: "address" },
      { name: "sellAmount", type: "uint256" },
      { name: "buyAmount", type: "uint256" },
      { name: "validTo", type: "uint32" },
      { name: "appData", type: "bytes32" },
      { name: "feeAmount", type: "uint256" },
      { name: "kind", type: "string" },
      { name: "partiallyFillable", type: "bool" },
      { name: "sellTokenBalance", type: "string" },
      { name: "buyTokenBalance", type: "string" },
    ],
  },
  primaryType: "Order",
  domain: {
    name: "Gnosis Protocol",
    version: "v2",
    chainId: "1",
    verifyingContract: addresses.Settlement,
  },
  message: {
    ...order,
    sellAmount: amount,
    buyAmount: `${
      BigInt(quote.buyAmount) * 95n / 100n -
      BigInt(quote.feeAmount) * BigInt(quote.buyAmount) /
        BigInt(quote.sellAmount)
    }`,
    validTo: quote.validTo,
    appData: quote.appDataHash,
  },
};
const uid = ethers.solidityPacked(
  ["bytes32", "address", "uint32"],
  [
    ethers.TypedDataEncoder.hash(
      typedData.domain,
      { Order: typedData.types.Order },
      typedData.message,
    ),
    safe,
    typedData.message.validTo,
  ],
);

function output(name) {
  return `out/${name}-${uid}.json`;
}
await Deno.writeTextFile(
  output("app-data"),
  JSON.stringify({
    appData: quote.appData,
    appDataHash: quote.appDataHash,
  }),
);
await Deno.writeTextFile(output("typed-data"), JSON.stringify(typedData));

console.log(typedData.message);
console.log(uid);
