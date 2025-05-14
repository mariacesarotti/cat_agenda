import { Pool } from "pg";
import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

const schemaPath = path.join(__dirname, "schema.sql");
const schema = fs.readFileSync(schemaPath, "utf-8");

pool.query(schema)
  .then(() => {
    console.log("✅ Banco de dados inicializado com sucesso!");
    pool.end();
  })
  .catch((err) => {
    console.error("❌ Erro ao inicializar banco de dados:", err);
    pool.end();
  });
