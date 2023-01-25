import "reflect-metadata";
import { PrismaClient } from "@prisma/client";
import { ResourceId } from "../utils/game_constants";

const prisma = new PrismaClient();

export async function main() {
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

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("done");
  });
