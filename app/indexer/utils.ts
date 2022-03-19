const contract = (addr: string) => {
  return "&contract=" + addr;
};

const fromBlock = (from: number) => {
  return "&from_block=" + from;
};

const toBlock = (to: number) => {
  return "&to_block=" + to;
};

const name = (names: string) => {
  return "&name=" + names;
};

export { contract, fromBlock, toBlock, name };
