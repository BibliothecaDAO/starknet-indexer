import "reflect-metadata";
import { PrismaClient } from "@prisma/client";
import { ResourceId } from "../utils/game_constants";

export default async function main(prisma: PrismaClient) {
  const realms = await prisma.realm.findMany({ select: { realmId: true } });

  const updates = realms
    .map((realm) => [
      { realmId: realm.realmId, resourceId: ResourceId.Wheat },
      { realmId: realm.realmId, resourceId: ResourceId.Fish },
    ])
    .flat();

  try {
    await prisma.resource.createMany({ data: updates });
  } catch (e) {
    console.error("already created");
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
