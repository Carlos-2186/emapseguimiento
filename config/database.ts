import mysql, { type Pool } from 'mysql2/promise';

function createPool(): Pool {
  return mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT ?? 3306),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    namedPlaceholders: false,
  });
}

const globalForDb = globalThis as unknown as { dbPool?: Pool };

export const pool = globalForDb.dbPool ?? createPool();

if (process.env.NODE_ENV !== 'production') {
  globalForDb.dbPool = pool;
}
