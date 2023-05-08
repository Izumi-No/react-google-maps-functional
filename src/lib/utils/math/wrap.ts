export function wrap(n: number, min: number, max: number) {
  const d = max - min;
  return n === max ? n : ((((n - min) % d) + d) % d) + min;
}
