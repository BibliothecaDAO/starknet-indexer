import "reflect-metadata";
import { PrismaClient } from "@prisma/client";
const realmsGeoData = require("./realmsGeoData.json");

const prisma = new PrismaClient();

export async function main() {
  for (let data of realmsGeoData) {
    if (!data.id || !data.coordinates) {
      continue;
    }
    console.log("Updated coordinates for realmId", data.id);
    const coords = data.coordinates;
    await prisma.realm.update({
      where: { realmId: data.id },
      data: {
        longitude: coords[0],
        latitude: coords[1]
      }
    });
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
