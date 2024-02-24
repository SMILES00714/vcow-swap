import { postOrder, postQuote } from "./lib/cow.js";
import { ethers } from "./lib/ethers.js";
import { getMessage } from "./lib/safe.js";
import { check, withoutKeys } from "./lib/utils.js";

const [ORDERUID] = Deno.args;

const uid = ethers.hexlify(ORDERUID);
const appData = JSON.parse(
  await Deno.readTextFile(`out/app-data-${uid}.json`),
);
const { message: order } = JSON.parse(
  await Deno.readTextFile(`out/typed-data-${uid}.json`),
);

const [orderDigest, safe] = [
  ethers.dataSlice(uid, 0, 32),
  ethers.getAddress(ethers.dataSlice(uid, 32, 52)),
];
const message = await getMessage(ethers.TypedDataEncoder.hash(
  {
    chainId: "1",
    verifyingContract: safe,
  },
  { SafeMessage: [{ name: "message", type: "bytes" }] },
  { message: orderDigest },
));
check(message.preparedSignature, "order not signed");

const { id: quoteId, quote } = await postQuote({
  ...withoutKeys(order, "sellAmount", "buyAmount"),
  ...appData,
  from: safe,
  sellAmountBeforeFee: order.sellAmount,
  priceQuality: "verified",
  signingScheme: "eip1271",
  onchainOrder: false,
});
check(
  BigInt(order.buyAmount) < BigInt(quote.buyAmount),
  "order is no longer in price",
);

await postOrder({
  ...order,
  ...appData,
  signingScheme: "eip1271",
  signature: message.preparedSignature,
  from: safe,
  quoteId,
});
console.log(`https://explorer.cow.fi/orders/${uid}`);
