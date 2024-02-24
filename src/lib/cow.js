const BASE = "https://api.cow.fi/mainnet/api";

async function post(path, body) {
  console.log(body);
  const url = `${BASE}/${path}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const result = await response.json();
  if (result.errorType) {
    throw new Error(result.description);
  }

  return result;
}

export async function postQuote(order) {
  const path = "v1/quote";
  return await post(path, order);
}

export async function postOrder(order) {
  const path = "v1/orders";
  return await post(path, order);
}
