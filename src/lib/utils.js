export function check(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

export function withoutKeys(object, ...keys) {
  const result = { ...object };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}
