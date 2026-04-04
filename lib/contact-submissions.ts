import { randomUUID } from "node:crypto";
import type { Collection } from "mongodb";
import { academyData } from "@/lib/academy";
import { getMongoDb } from "@/lib/mongodb";

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferredCenterId: string;
  preferredCenterName: string;
  message: string;
  status: "new";
  source: "website-contact-form";
  isConnected: boolean;
  adminComments: string;
  createdAt: string;
  updatedAt: string;
  userAgent: string;
  ipAddress: string;
};

type CreateContactSubmissionInput = {
  name: string;
  email: string;
  phone: string;
  preferredCenterId: string;
  message: string;
  userAgent: string;
  ipAddress: string;
};

type UpdateContactSubmissionAdminInput = {
  isConnected?: boolean;
  adminComments?: string;
};

declare global {
  var contactSubmissionsInitPromise: Promise<void> | undefined;
}

export function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isPhone(value: string) {
  return /^[+\d][\d\s()-]{7,}$/.test(value);
}

async function getContactSubmissionsCollection(): Promise<
  Collection<ContactSubmission>
> {
  const db = await getMongoDb();
  return db.collection<ContactSubmission>("contactSubmissions");
}

async function ensureContactSubmissionsReady() {
  if (!global.contactSubmissionsInitPromise) {
    global.contactSubmissionsInitPromise = (async () => {
      const collection = await getContactSubmissionsCollection();

      await collection.createIndexes([
        { key: { id: 1 }, unique: true, name: "contact_submission_id_unique" },
        { key: { createdAt: -1 }, name: "contact_submission_created_at_desc" },
        {
          key: { isConnected: 1, createdAt: -1 },
          name: "contact_submission_connected_created_at",
        },
        {
          key: { status: 1, createdAt: -1 },
          name: "contact_submission_status_created_at",
        },
      ]);
    })();
  }

  await global.contactSubmissionsInitPromise;
}

export async function createContactSubmission(
  input: CreateContactSubmissionInput,
) {
  await ensureContactSubmissionsReady();

  const selectedCenter =
    academyData.contactCenters.find(
      (center) => center.id === input.preferredCenterId,
    ) ?? academyData.contactCenters[0];

  const now = new Date().toISOString();

  const submission: ContactSubmission = {
    id: randomUUID(),
    name: input.name,
    email: input.email,
    phone: input.phone,
    preferredCenterId: selectedCenter.id,
    preferredCenterName: selectedCenter.name,
    message: input.message,
    status: "new",
    source: "website-contact-form",
    isConnected: false,
    adminComments: "",
    createdAt: now,
    updatedAt: now,
    userAgent: input.userAgent,
    ipAddress: input.ipAddress,
  };

  const collection = await getContactSubmissionsCollection();
  await collection.insertOne(submission);

  return submission;
}

export async function listContactSubmissions() {
  await ensureContactSubmissionsReady();

  const collection = await getContactSubmissionsCollection();

  return collection
    .find({}, { projection: { _id: 0 } })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function getContactSubmissionById(id: string) {
  await ensureContactSubmissionsReady();

  const collection = await getContactSubmissionsCollection();

  return collection.findOne(
    { id },
    { projection: { _id: 0 } },
  );
}

export async function updateContactSubmissionAdminFields(
  id: string,
  input: UpdateContactSubmissionAdminInput,
) {
  await ensureContactSubmissionsReady();

  const updates: Partial<ContactSubmission> = {
    updatedAt: new Date().toISOString(),
  };

  if (typeof input.isConnected === "boolean") {
    updates.isConnected = input.isConnected;
  }

  if (typeof input.adminComments === "string") {
    updates.adminComments = input.adminComments.trim();
  }

  const collection = await getContactSubmissionsCollection();

  const result = await collection.findOneAndUpdate(
    { id },
    { $set: updates },
    {
      projection: { _id: 0 },
      returnDocument: "after",
    },
  );

  return result;
}
