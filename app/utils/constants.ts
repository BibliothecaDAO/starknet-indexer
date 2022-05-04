export const REALMS_L1_SUBGRAPH_URL =
  process.env.NETWORK === "goerli"
    ? "https://api.thegraph.com/subgraphs/name/bibliothecaforadventurers/realms-goerli"
    : '"https://api.thegraph.com/subgraphs/name/bibliothecaforadventurers/realms';

const NETWORKS = {
  mainnet: {
    REALMS_L1: "0x7AFe30cB3E53dba6801aa0EA647A0EcEA7cBe18d",
    JOURNEY: "0x17963290db8c30552d0cfa2a6453ff20a28c31a2",
    CARRACK: "0xcdfe3d7ebfa793675426f150e928cd395469ca53"
  },
  goerli: {
    REALMS_L1: "0x3dC98f83a0F3Ad77D44a68C6D15e08378DE3df25",
    JOURNEY: "0x7DB8967d8311B0b384F69378399f3b2bd2392d36",
    CARRACK: "0x00aCF4E8292619264a0eaB2f14BE7396ce11d5cD"
  }
};

export const CONTRACTS =
  NETWORKS[process.env.NETWORK === "goerli" ? "goerli" : "mainnet"];
