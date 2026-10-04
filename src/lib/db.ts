import Database from 'better-sqlite3';

const dbPath = 'D:/Desktop/Projects/Vortex/vortex.db';
const db = new Database(dbPath); // Removed readonly to allow table creation/management

// Ensure the users table exists as requested
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    image TEXT,
    role TEXT DEFAULT 'user',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Ensure settings table exists for maintenance mode toggle
db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

export default db;


