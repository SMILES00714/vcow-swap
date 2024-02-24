import { ethers } from "./ethers.js";

const BASE = "https://safe-transaction-mainnet.safe.global/api";

async function get(path) {
  const url = `${BASE}/${path}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Accept": "application/json",
    },
  });
  return await response.json();
}

export async function getSafe(safe) {
  const path = `v1/safes/${safe}/`;
  return await get(path);
}

export async function getTransactions(safe, params) {
  const search = new URLSearchParams(params);
  const path = `v1/safes/${safe}/multisig-transactions/?${search}`;
  return await get(path);
}

export async function getMessage(hash) {
  const path = `v1/messages/${hash}/`;
  return await get(path);
}

export const SAFE_INTERFACE = new ethers.Interface([
  `
    function execTransaction(
      address to,
      uint256 value,
      bytes data,
      uint8 operation,
      uint256 safeTxGas,
      uint256 baseGas,
      uint256 gasPrice,
      address gasToken,
      address refundReceiver,
      bytes signatures
    ) payable returns (bool success)
  `.trim(),
]);
