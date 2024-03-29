/**
 * Creates and manages the database, including database and table creation if
 * they don't exist, and exports the database object and table names.
 *
 * Developed by: UofG - SH21 Team
 * As part of COMPSCI 4047 Team Project (H) course at the University of Glasgow
 *
 * References:
 * https://dev.to/arindam1997007/a-step-by-step-guide-to-integrating-better-sqlite3-with-electron-js-app-using-create-react-app-3k16
 * https://github.com/WiseLibs/better-sqlite3/issues/549#issuecomment-774506826
 * https://www.techonthenet.com/sqlite/foreign_keys/foreign_delete.php
 */

const Database = require('better-sqlite3');

const dbPath = './data.db';
const dbArea = 'dbArea';
const dbDirectories = 'directories';
const dbBoundaries = 'boundaries';

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Create dbArea table if it doesn't exist
const stmt = db.prepare(
  `CREATE TABLE IF NOT EXISTS ${dbArea} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    timestamp INTEGER DEFAULT (strftime('%s', 'now')),
    coordinates TEXT NOT NULL,
    image BLOB
  )`
);
stmt.run();

// Create directories table if it doesn't exist
const stmt2 = db.prepare(
  `CREATE TABLE IF NOT EXISTS ${dbDirectories} (
    path Text PRIMARY KEY NOT NULL,
    timestamp INTEGER DEFAULT (strftime('%s', 'now'))
  );`
);
stmt2.run();

// Create boundaries table if it doesn't exist
const stmt3 = db.prepare(
  `CREATE TABLE IF NOT EXISTS ${dbBoundaries} (
    path TEXT PRIMARY KEY NOT NULL,
    left REAL NOT NULL,
    right REAL NOT NULL,
    top REAL NOT NULL,
    bottom REAL NOT NULL,
    parent TEXT NOT NULL,
    FOREIGN KEY (parent) REFERENCES ${dbDirectories}(path) ON DELETE CASCADE
  );`
);
stmt3.run();

exports.db = db;
exports.dbArea = dbArea;
exports.dbDirectories = dbDirectories;
exports.dbBoundaries = dbBoundaries;
