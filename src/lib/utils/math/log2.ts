function log2(x: number): number {
  if (Math.log2) {
    return Math.log2(x);
  }
  return Math.log(x) / Math.LN2;
}

export default log2;
