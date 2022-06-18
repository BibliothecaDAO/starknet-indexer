import "reflect-metadata";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const pois = {
  1: { name: "Scrolls" },
  1000: { name: "Realms" },
  1001: { name: "Realms Orders" },
  1002: { name: "Realms Resources" },
  1003: { name: "Realms Wonders" },
  2000: { name: "Crypts and Caverns" }
};

const props = {
  1: { name: "Era" }
};

export async function main() {
  try {
    for (let key in pois) {
      await prisma.lorePOI.create({
        data: {
          id: parseInt(key),
          // @ts-ignore
          name: pois[key].name
        }
      });
    }

    for (let key in props) {
      await prisma.loreProp.create({
        data: {
          id: parseInt(key),
          // @ts-ignore
          name: pois[key].name
        }
      });
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
