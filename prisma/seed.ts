import { PrismaClient } from "../app/generated/prisma/client";
import bcrypt from "bcryptjs";
import { config } from "dotenv";
config({ path: ".env" });
config({ path: ".env.local", override: true });

// Use relative import — @/ alias not resolved outside Next.js compiler
// eslint-disable-next-line @typescript-eslint/no-require-imports
const whitelabelConfig = require("../config/whitelabel").default as {
  seed: {
    adminEmail: string;
    adminPassword: string;
    userEmail: string;
    userPassword: string;
    userCompany: string;
  };
};
const { seed } = whitelabelConfig;

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // --- Product Tags ---
  const tagDefs = [
    { id: "pt_white_diamonds", value: "white-diamonds", label: "White Diamonds", color: "bg-slate-600 text-slate-100", sortOrder: 0 },
    { id: "pt_jewelry",        value: "jewelry",        label: "Jewelry",        color: "bg-purple-600 text-purple-100", sortOrder: 1 },
    { id: "pt_rfid",           value: "rfid",           label: "RFID",           color: "bg-blue-600 text-blue-100",   sortOrder: 2 },
    { id: "pt_md_mobile",      value: "md-mobile",      label: "MD Mobile",      color: "bg-orange-600 text-orange-100", sortOrder: 3 },
    { id: "pt_md_commerce",    value: "md-commerce",    label: "MD Commerce",    color: "bg-pink-600 text-pink-100",   sortOrder: 4 },
    { id: "pt_md_connect",     value: "md-connect",     label: "MD Connect",     color: "bg-cyan-600 text-cyan-100",   sortOrder: 5 },
  ];

  for (const t of tagDefs) {
    await prisma.productTag.upsert({
      where: { id: t.id },
      update: { label: t.label, color: t.color, sortOrder: t.sortOrder },
      create: { id: t.id, value: t.value, label: t.label, color: t.color, sortOrder: t.sortOrder },
    });
  }
  console.log("✓ 6 product tags seeded");

  // --- Hash passwords ---
  const adminPasswordHash = await bcrypt.hash(seed.adminPassword, 12);
  const userPasswordHash = await bcrypt.hash(seed.userPassword, 12);

  // --- DB users ---
  const adminUser = await prisma.user.upsert({
    where: { email: seed.adminEmail },
    update: { passwordHash: adminPasswordHash },
    create: {
      email: seed.adminEmail,
      role: "ADMIN",
      monthlyAllowance: 50,
      currentBalance: 50,
      passwordHash: adminPasswordHash,
    },
  });

  const testUser = await prisma.user.upsert({
    where: { email: seed.userEmail },
    update: { passwordHash: userPasswordHash },
    create: {
      email: seed.userEmail,
      role: "USER",
      companyName: seed.userCompany,
      monthlyAllowance: 10,
      currentBalance: 10,
      passwordHash: userPasswordHash,
    },
  });

  console.log(`✓ Admin: ${adminUser.email}`);
  console.log(`✓ Test user: ${testUser.email}`);

  // Tiptap JSON description helper
  function tiptapDoc(text: string): string {
    return JSON.stringify({
      type: "doc",
      content: [{ type: "paragraph", content: [{ type: "text", text }] }],
    });
  }

  // --- Feature requests ---
  const pending1 = await prisma.featureRequest.upsert({
    where: { id: "seed-pending-1" },
    update: {},
    create: {
      id: "seed-pending-1",
      title: "Bulk inventory import via CSV",
      description: tiptapDoc("Allow users to import large inventory batches using a CSV template. This would save hours of manual data entry for large diamond collections."),
      productTagId: "pt_white_diamonds",
      status: "PENDING",
      authorId: testUser.id,
    },
  });

  const pending2 = await prisma.featureRequest.upsert({
    where: { id: "seed-pending-2" },
    update: {},
    create: {
      id: "seed-pending-2",
      title: "RFID tag batch printing",
      description: tiptapDoc("Print multiple RFID tags in a single batch job, with customizable label templates and barcode options."),
      productTagId: "pt_rfid",
      status: "PENDING",
      authorId: adminUser.id,
    },
  });

  const open1 = await prisma.featureRequest.upsert({
    where: { id: "seed-open-1" },
    update: {},
    create: {
      id: "seed-open-1",
      title: "Advanced jewelry search filters",
      description: tiptapDoc("Add filter options for metal type, stone count, and price range on the jewelry inventory page."),
      productTagId: "pt_jewelry",
      status: "OPEN",
      caratCost: 15,
      totalFunded: 6,
      authorId: testUser.id,
    },
  });

  const open2 = await prisma.featureRequest.upsert({
    where: { id: "seed-open-2" },
    update: {},
    create: {
      id: "seed-open-2",
      title: "Mobile push notifications for low stock",
      description: tiptapDoc("Send push notifications to the MD Mobile app when any SKU falls below a configurable threshold."),
      productTagId: "pt_md_mobile",
      status: "OPEN",
      caratCost: 20,
      totalFunded: 12,
      authorId: adminUser.id,
    },
  });

  const committed1 = await prisma.featureRequest.upsert({
    where: { id: "seed-committed-1" },
    update: {},
    create: {
      id: "seed-committed-1",
      title: "MD Commerce storefront theming",
      description: tiptapDoc("Allow merchants to customize colors, fonts, and hero images for their MD Commerce storefronts without touching code."),
      productTagId: "pt_md_commerce",
      status: "COMMITTED",
      caratCost: 10,
      totalFunded: 10,
      authorId: testUser.id,
    },
  });

  const shipped1 = await prisma.featureRequest.upsert({
    where: { id: "seed-shipped-1" },
    update: {},
    create: {
      id: "seed-shipped-1",
      title: "MD Connect supplier API integration",
      description: tiptapDoc("A REST API integration layer to sync supplier price lists and availability in real time via MD Connect."),
      productTagId: "pt_md_connect",
      status: "SHIPPED",
      caratCost: 8,
      totalFunded: 8,
      authorId: adminUser.id,
    },
  });

  console.log("✓ 6 feature requests seeded");

  // --- Contributions ---
  await prisma.contribution.upsert({ where: { id: "seed-contrib-1" }, update: {}, create: { id: "seed-contrib-1", userId: adminUser.id, featureId: open1.id, amount: 4 } });
  await prisma.contribution.upsert({ where: { id: "seed-contrib-2" }, update: {}, create: { id: "seed-contrib-2", userId: testUser.id, featureId: open1.id, amount: 2 } });
  await prisma.contribution.upsert({ where: { id: "seed-contrib-3" }, update: {}, create: { id: "seed-contrib-3", userId: testUser.id, featureId: open2.id, amount: 7 } });
  await prisma.contribution.upsert({ where: { id: "seed-contrib-4" }, update: {}, create: { id: "seed-contrib-4", userId: adminUser.id, featureId: open2.id, amount: 5 } });
  await prisma.contribution.upsert({ where: { id: "seed-contrib-5" }, update: {}, create: { id: "seed-contrib-5", userId: testUser.id, featureId: committed1.id, amount: 5 } });
  await prisma.contribution.upsert({ where: { id: "seed-contrib-6" }, update: {}, create: { id: "seed-contrib-6", userId: adminUser.id, featureId: committed1.id, amount: 5 } });

  void pending1; void pending2; void shipped1;

  console.log("✓ Contributions seeded");
  console.log("✅ Seed complete");
}

main()
  .catch((e) => { console.error("Seed failed:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
