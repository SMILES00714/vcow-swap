const URL = "https://eth.llamarpc.com";

async function post(method, params) {
  const response = await fetch(URL, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method,
      params,
      id: 0x5afe,
    }),
  });
  const { result } = await response.json();
  return result;
}

export async function estimateGas(call, block = "latest") {
  return BigInt(await post("eth_estimateGas", [call, block]));
}
