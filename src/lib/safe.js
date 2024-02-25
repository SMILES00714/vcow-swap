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
