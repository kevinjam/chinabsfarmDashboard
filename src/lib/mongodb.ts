import { MongoClient, Db } from 'mongodb';

// Define environment variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/chinabsfarm';
const MONGODB_DB = process.env.MONGODB_DB || 'chinabsfarm';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Define the Cached interface
interface Cached {
  client: MongoClient | null;
  db: Db | null;
}

// Extend the global NodeJS type without using namespace
declare global {
  // Extend the Global type directly
  interface Global {
    mongodb?: Cached; // Make it optional to avoid runtime errors
  }
}

// Use the typed global.mongodb
let cached: Cached = (global as unknown as Global).mongodb || { client: null, db: null };

if (!cached) {
  cached = (global as unknown as Global).mongodb = { client: null, db: null };
}

async function dbConnect(): Promise<{ client: MongoClient; db: Db }> {
  if (cached.client && cached.db) {
    return { client: cached.client, db: cached.db };
  }

  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db(MONGODB_DB);
  cached.client = client;
  cached.db = db;
  return { client, db };
}

export default dbConnect;