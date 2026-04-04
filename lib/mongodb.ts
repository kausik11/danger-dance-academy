import { MongoClient } from "mongodb";

declare global {
  var mongoClientPromise: Promise<MongoClient> | undefined;
}

function getMongoClientPromise() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error(
      "Missing MONGODB_URI. Add it to your environment before using the academy backend.",
    );
  }

  if (!global.mongoClientPromise) {
    const client = new MongoClient(mongoUri);
    global.mongoClientPromise = client.connect();
  }

  return global.mongoClientPromise;
}

export async function getMongoDb() {
  const mongoDbName = process.env.MONGODB_DB_NAME ?? "danger-dance-academy";
  const connectedClient = await getMongoClientPromise();
  return connectedClient.db(mongoDbName);
}
