import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import type { Collection, Filter } from "mongodb";
import { getMongoDb } from "@/lib/mongodb";

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: "admin";
  createdAt: string;
  updatedAt: string;
};

export type AdminProfile = Omit<AdminUser, "passwordHash">;

declare global {
  var adminUsersInitPromise: Promise<void> | undefined;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, passwordHash: string) {
  const [salt, storedHash] = passwordHash.split(":");

  if (!salt || !storedHash) {
    return false;
  }

  const incomingHash = scryptSync(password, salt, 64).toString("hex");

  return timingSafeEqual(
    Buffer.from(storedHash, "hex"),
    Buffer.from(incomingHash, "hex"),
  );
}

function toAdminProfile(adminUser: AdminUser): AdminProfile {
  return {
    id: adminUser.id,
    email: adminUser.email,
    name: adminUser.name,
    role: adminUser.role,
    createdAt: adminUser.createdAt,
    updatedAt: adminUser.updatedAt,
  };
}

async function getAdminUsersCollection(): Promise<Collection<AdminUser>> {
  const db = await getMongoDb();
  return db.collection<AdminUser>("adminUsers");
}

async function ensureBootstrapAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL?.trim();
  const adminPassword = process.env.ADMIN_PASSWORD?.trim();
  const adminName = process.env.ADMIN_NAME?.trim() || "Danger Dance Admin";

  if (!adminEmail || !adminPassword) {
    return;
  }

  const collection = await getAdminUsersCollection();
  const normalizedEmail = normalizeEmail(adminEmail);
  const existing = await collection.findOne({ email: normalizedEmail });

  if (existing) {
    return;
  }

  const now = new Date().toISOString();

  await collection.insertOne({
    id: randomUUID(),
    email: normalizedEmail,
    name: adminName,
    passwordHash: hashPassword(adminPassword),
    role: "admin",
    createdAt: now,
    updatedAt: now,
  });
}

async function ensureAdminUsersReady() {
  if (!global.adminUsersInitPromise) {
    global.adminUsersInitPromise = (async () => {
      const collection = await getAdminUsersCollection();

      await collection.createIndexes([
        { key: { id: 1 }, unique: true, name: "admin_id_unique" },
        { key: { email: 1 }, unique: true, name: "admin_email_unique" },
      ]);

      await ensureBootstrapAdmin();
    })();
  }

  await global.adminUsersInitPromise;
}

export async function getAdminById(id: string): Promise<AdminProfile | null> {
  await ensureAdminUsersReady();

  const collection = await getAdminUsersCollection();
  const admin = await collection.findOne(
    { id } as Filter<AdminUser>,
    { projection: { _id: 0, passwordHash: 0 } },
  );

  return admin as AdminProfile | null;
}

export async function authenticateAdmin(
  email: string,
  password: string,
): Promise<AdminProfile | null> {
  await ensureAdminUsersReady();

  const collection = await getAdminUsersCollection();
  const normalizedEmail = normalizeEmail(email);
  const admin = await collection.findOne({ email: normalizedEmail });

  if (!admin) {
    return null;
  }

  if (!verifyPassword(password, admin.passwordHash)) {
    return null;
  }

  return toAdminProfile(admin);
}

export async function hasAnyAdminUser() {
  await ensureAdminUsersReady();

  const collection = await getAdminUsersCollection();
  const count = await collection.countDocuments({}, { limit: 1 });

  return count > 0;
}
