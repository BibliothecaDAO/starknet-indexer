import "reflect-metadata";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const pois = {
  1: { name: "Scrolls" },
  2: { name: "Canvases" },
  100: { name: "Lords & Ladies" }, // players
  200: { name: "Realms" },
  201: { name: "Realms Orders" },
  202: { name: "Realms Resources" },
  203: { name: "Realms Wonders" },
  204: { name: "Realms Resources Exchange (AMM)" },
  300: { name: "Crypts and Caverns" }
}

const props = {
  1: { name: "Era" }
}

export async function main() {
  try {
    for (let key in pois) {
      prisma.lorePOI.create({
        data: {
          id: parseInt(key),
          // @ts-ignore
          name: pois[key].name
        }
      })
    }

    for (let key in props) {
      prisma.loreProp.create({
        data: {
          id: parseInt(key),
          // @ts-ignore
          name: pois[key].name
        }
      })
    }
    
  } catch (e) {
    console.log(e);
  }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("done");
  });
