import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

const client = new Client({
  host: "127.0.0.1",
  port: 5432,
  user: "postgres",
  password: "mysecretpassword",
  database: "feedbackflow_db",
});

const db = drizzle(client);

export default db;
