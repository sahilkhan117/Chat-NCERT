import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let connectionString = "";
let clientInstance: any = null;
let dbInstance: any = null;

export function setConnectionString(url: string) {
  if (url && connectionString !== url) {
    connectionString = url;
    // Reset cached instances
    clientInstance = null;
    dbInstance = null;
  }
}

function getActiveDb() {
  if (!connectionString) {
    // Check if process.env.DATABASE_URL exists (e.g. under Node.js / Next.js / migrations)
    const envUrl = (typeof process !== "undefined" && process.env ? process.env.DATABASE_URL : "") || "";
    if (envUrl) {
      connectionString = envUrl;
    } else {
      throw new Error("Database connection string not initialized. Call setConnectionString() first.");
    }
  }

  if (!dbInstance) {
    clientInstance = postgres(connectionString, { prepare: false });
    dbInstance = drizzle(clientInstance, { schema });
  }
  return dbInstance;
}

// Create a proxy to delegate all properties to the active drizzle instance
export const db = new Proxy({} as any, {
  get(target, prop, receiver) {
    // Handle the case when checking if it's a promise or special symbol
    if (prop === "then" || prop === "toJSON") return undefined;
    
    const activeDb = getActiveDb();
    const value = Reflect.get(activeDb, prop, target);
    if (typeof value === "function") {
      return value.bind(activeDb);
    }
    return value;
  },
  set(target, prop, value, receiver) {
    const activeDb = getActiveDb();
    return Reflect.set(activeDb, prop, value, target);
  }
});

export * from "./schema";
