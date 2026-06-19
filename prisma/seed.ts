import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const password = await bcrypt.hash("demo", 10);

  const avery = await prisma.user.upsert({
    where: { email: "demo@nexuscrm.io" },
    update: {},
    create: { name: "Avery Chen", email: "demo@nexuscrm.io", password, role: "ADMIN" },
  });
  const marco = await prisma.user.upsert({
    where: { email: "marco@nexuscrm.io" },
    update: {},
    create: { name: "Marco Rossi", email: "marco@nexuscrm.io", password, role: "SALES_REP" },
  });

  const sofia = await prisma.contact.create({
    data: {
      name: "Sofia Marin",
      email: "sofia@helixlabs.com",
      company: "Helix Labs",
      title: "VP Engineering",
      tags: ["enterprise", "champion"],
      notes: "Technical champion. Cares about SOC2 and SSO.",
      ownerId: marco.id,
    },
  });

  const deal = await prisma.deal.create({
    data: {
      title: "Helix Labs — Platform",
      value: 84000,
      stage: "NEGOTIATION",
      health: "HEALTHY",
      probability: 78,
      ownerId: marco.id,
      contactId: sofia.id,
    },
  });

  await prisma.task.create({
    data: {
      title: "Send SOC2 documentation to Sofia",
      priority: "HIGH",
      status: "TODO",
      aiGenerated: true,
      assigneeId: marco.id,
      contactId: sofia.id,
      dealId: deal.id,
    },
  });

  await prisma.activity.create({
    data: {
      type: "MEETING",
      content: "Discovery call with Sofia — covered security requirements and rollout timeline.",
      userId: marco.id,
      contactId: sofia.id,
      dealId: deal.id,
    },
  });

  console.log("Seeded demo data. Admin login: demo@nexuscrm.io / demo");
  void avery;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
