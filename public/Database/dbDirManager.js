/**
 * Manages directory database operations such as insertion, retrieval, and
 * deletion.
 *
 * Developed by: UofG - SH21 Team
 * As part of COMPSCI 4047 Team Project (H) course at the University of Glasgow
 */

const dbmgr = require('./dbManager');

const db = dbmgr.db;
const dbDirectories = dbmgr.dbDirectories;

/**
 * Insert directory into database
 * @param {string} name
 * @param {string} timestamp
 */
const insertDirectory = (name, timestamp) => {
  try {
    const query = `INSERT INTO ${dbDirectories} (path, timestamp) VALUES (?, ?)`;
    const stmt = db.prepare(query);
    stmt.run(name, timestamp);
  } catch (err) {
    throw err;
  }
};

/**
 * Get directory list from database
 * @returns {Array<Object>} { path: string, timestamp: number }[]
 */
const getDirectory = () => {
  try {
    const query = `SELECT * FROM ${dbDirectories} ORDER BY timestamp DESC`;
    const stmt = db.prepare(query);
    return stmt.all();
  } catch (err) {
    throw err;
  }
};

/**
 * Delete directory from database
 * @param {string} dir
 */
const deleteDirectory = (dir) => {
  try {
    const query = `DELETE FROM ${dbDirectories} WHERE path = ?`;
    const stmt = db.prepare(query);
    stmt.run(dir);
  } catch (err) {
    throw err;
  }
};

exports.insertDirectory = insertDirectory;
exports.getDirectory = getDirectory;
exports.deleteDirectory = deleteDirectory;
