import { PrismaClient } from "@prisma/client";
import { Provider } from "starknet";

const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient;
  provider: Provider;
}

export const context: Context = {
  prisma: prisma,
  provider: new Provider({
    network: process.env.NETWORK === "goerli" ? "goerli-alpha" : "mainnet-alpha"
  })
};
