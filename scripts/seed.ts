import bcrypt from "bcryptjs";
import { readDb, writeDb } from "../src/lib/db";
import { defaultChannels, defaultProducts, defaultSeries } from "../src/lib/seed-data";

async function seed() {
  const db = await readDb();
  if (db.products.length > 0) {
    console.log("Database already seeded, skipping.");
    return;
  }

  const passwordHash = await bcrypt.hash("admin123", 10);
  db.users = [
    {
      id: "user-admin",
      username: "admin",
      passwordHash,
      role: "admin",
      createdAt: new Date().toISOString(),
    },
  ];
  db.channels = defaultChannels;
  db.series = defaultSeries;
  db.products = defaultProducts;

  await writeDb(db);
  console.log("Seed complete. Admin login: admin / admin123");
}

seed().catch(console.error);
