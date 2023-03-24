import "reflect-metadata";
import { PrismaClient } from "@prisma/client";
const realmsGeoData = require("./realmsGeoData.json");

export default async function main(prisma: PrismaClient) {
  const realm = await prisma.realm.findFirst({});
  if (realm?.latitude) {
    console.info("Realm coordinates already initialized");
    return;
  }
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
        latitude: coords[1],
      },
    });
  }
}

if (require.main === module) {
  const prisma = new PrismaClient();
  main(prisma)
    .catch((e) => {
      throw e;
    })
    .finally(async () => {
      await prisma.$disconnect();
      console.log("done");
    });
}
