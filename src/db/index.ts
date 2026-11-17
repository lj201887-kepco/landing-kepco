import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../../drizzle/schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

// Transaction 풀러 모드는 prepared statement를 지원하지 않으므로 비활성화
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
