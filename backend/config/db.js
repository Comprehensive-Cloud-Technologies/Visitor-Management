import pg from 'pg';
import dotenv from 'dotenv';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

dotenv.config({
  path: fileURLToPath(new URL('../.env', import.meta.url))
});

const { Pool } = pg;

const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false
});

// Convert MySQL ? placeholders to PostgreSQL $1, $2, ...
function convertPlaceholders(sql) {
  let i = 0;
  return sql.replace(/\?/g, () => `$${++i}`);
}

// Convert MySQL-specific SQL to PostgreSQL
function adaptSQL(sql) {
  return sql
    .replace(/DATE_FORMAT\s*\(\s*([^,]+?)\s*,\s*'%Y-%m-%d'\s*\)/gi, "TO_CHAR($1, 'YYYY-MM-DD')")
    .replace(/DATE_FORMAT\s*\(\s*([^,]+?)\s*,\s*'%b'\s*\)/gi, "TO_CHAR($1, 'Mon')")
    .replace(/TIME_FORMAT\s*\(\s*([^,]+?)\s*,\s*'%H:%i'\s*\)/gi, "TO_CHAR(($1)::time, 'HH24:MI')")
    .replace(/\bCURDATE\s*\(\s*\)/gi, 'CURRENT_DATE')
    .replace(/\bCURRENT_TIME\s*\(\s*\)/gi, 'CURRENT_TIME')
    .replace(/\bYEAR\s*\(\s*([^)]+)\s*\)/gi, 'EXTRACT(YEAR FROM $1)')
    .replace(/\bMONTH\s*\(\s*([^)]+)\s*\)/gi, 'EXTRACT(MONTH FROM $1)')
    .replace(/\bCAST\s*\(\s*([^)]+?)\s+AS\s+CHAR\s*\)/gi, 'CAST($1 AS TEXT)');
}

function buildResult(pgResult, sql) {
  const isInsert = /^\s*INSERT\b/i.test(sql);
  const isModify = /^\s*(UPDATE|DELETE)\b/i.test(sql);

  if (isInsert) {
    return [{
      insertId: pgResult.rows && pgResult.rows.length > 0 ? pgResult.rows[0].id : null,
      affectedRows: pgResult.rowCount || 0
    }, []];
  }
  if (isModify) {
    return [{
      affectedRows: pgResult.rowCount || 0,
      changedRows: pgResult.rowCount || 0
    }, []];
  }
  return [pgResult.rows || [], []];
}

async function runQuery(client, sql, params = []) {
  let adapted = adaptSQL(sql);
  const isInsert = /^\s*INSERT\b/i.test(sql);

  if (isInsert && !/\bRETURNING\b/i.test(adapted)) {
    adapted = adapted.trimEnd().replace(/;?\s*$/, '') + ' RETURNING id';
  }

  adapted = convertPlaceholders(adapted);
  const result = await client.query(adapted, params);
  return buildResult(result, sql);
}

const pool = {
  async execute(sql, params = []) {
    return runQuery(pgPool, sql, params);
  },

  async query(sql, params = []) {
    return runQuery(pgPool, sql, params);
  },

  async getConnection() {
    const client = await pgPool.connect();
    return {
      async execute(sql, params = []) {
        return runQuery(client, sql, params);
      },
      async query(sql, params = []) {
        return runQuery(client, sql, params);
      },
      async beginTransaction() {
        await client.query('BEGIN');
      },
      async commit() {
        await client.query('COMMIT');
      },
      async rollback() {
        try { await client.query('ROLLBACK'); } catch {}
      },
      release() {
        client.release();
      }
    };
  }
};

export default pool;
