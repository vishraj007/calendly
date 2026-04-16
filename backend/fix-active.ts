import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.eventType.updateMany({
    where: { isActive: false },
    data: { isActive: true },
  });
  console.log(`✅ Updated ${result.count} event types to isActive=true`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
