import bcrypt from "bcryptjs";
import { readDb, writeDb } from "./db";
import { defaultChannels, defaultProducts, defaultSeries } from "./seed-data";

let initialized = false;

export async function ensureDbSeeded() {
  if (initialized) return;
  const db = await readDb();

  if (db.products.length === 0 && db.series.length === 0) {
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
  } else if (db.series.length === 0 && db.products.length > 0) {
    await writeDb(db);
  }

  initialized = true;
}
