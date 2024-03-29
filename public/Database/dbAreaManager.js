/**
 * Provides CRUD operations for the area history database.
 *
 * Developed by: UofG - SH21 Team
 * As part of COMPSCI 4047 Team Project (H) course at the University of Glasgow
 *
 * References:
 * https://dev.to/arindam1997007/a-step-by-step-guide-to-integrating-better-sqlite3-with-electron-js-app-using-create-react-app-3k16
 * https://github.com/WiseLibs/better-sqlite3/issues/549#issuecomment-774506826
 * https://stackoverflow.com/a/2413833/17302377
 */

const dbmgr = require('./dbManager');

const db = dbmgr.db;
const dbArea = dbmgr.dbArea;

/**
 * Create an area record
 * @param {String} name
 * @param {Number} timestamp
 * @param {String} coordinates
 * @param {Blob} image
 */
const createArea = (name, timestamp, coordinates, image) => {
  try {
    const query = `INSERT INTO ${dbArea} (name, timestamp, coordinates, image) VALUES (?, ?, ?, ?)`;
    const stmt = db.prepare(query);
    stmt.run(name, timestamp, coordinates, image);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

/**
 * Read area records
 * @param {'timestamp' | 'name' | undefined} order default: 'timestamp'
 * @param {'ASC' | 'DESC' | undefined} sort default: 'DESC'
 * @param {number | undefined} offset default: 0
 * @param {number | undefined} limit default: -1
 * @returns {Array<Object>} { id: number, name: string, timestamp: number, coordinates: string, image: Blob }[]
 */
const readArea = (
  order = 'timestamp',
  sort = 'DESC',
  offset = 0,
  limit = -1
) => {
  try {
    const allowedOrders = ['timestamp', 'name'];

    if (!allowedOrders.includes(order)) {
      throw new Error('Invalid order parameter');
    }

    const allowedSorts = ['ASC', 'DESC'];

    if (!allowedSorts.includes(sort.toUpperCase())) {
      throw new Error('Invalid sort parameter');
    }

    if (offset < 0) {
      throw new Error('Invalid offset parameter');
    }

    if (limit < -1) {
      throw new Error('Invalid limit parameter');
    }

    const query = `SELECT * FROM ${dbArea} ORDER BY ${order} COLLATE NOCASE ${sort} LIMIT ${limit} OFFSET ${offset}`;
    const stmt = db.prepare(query);
    return stmt.all();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

/**
 * Update an area record
 * @param {number} id
 * @param {string | undefined} name
 * @param {string | undefined} coordinates
 * @param {Blob | undefined} image
 */
const updateArea = (id, name, coordinates, image) => {
  try {
    let query = `UPDATE ${dbArea} SET`;

    const params = [];

    if (name) {
      query += ` name = ?,`;
      params.push(name);
    }
    if (coordinates) {
      query += ` coordinates = ?,`;
      params.push(coordinates);
    }
    if (image) {
      query += ` image = ?,`;
      params.push(image);
    }

    query = query.slice(0, -1); // Remove trailing comma
    query += ` WHERE id = ?`;
    params.push(id);

    const stmt = db.prepare(query);
    stmt.run(...params);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

/**
 * Delete an area record
 * @param {number} id
 */
const deleteArea = (id) => {
  try {
    const query = `DELETE FROM ${dbArea} WHERE id = ?`;
    const stmt = db.prepare(query);
    stmt.run(id);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

/**
 * Get the number of area records
 * @returns {number}
 */
const getAreaCount = () => {
  try {
    const query = `SELECT COUNT(*) FROM ${dbArea}`;
    const stmt = db.prepare(query);
    return stmt.get()['COUNT(*)'];
  } catch (err) {
    console.error(err);
    throw err;
  }
};

/**
 * Search for area records
 * @param {string} search
 * @param {'timestamp' | 'name' | undefined} order default: 'timestamp'
 * @param {'ASC' | 'DESC' | undefined} sort default: 'DESC'
 * @param {number | undefined} offset default: 0
 * @param {number | undefined} limit default: -1
 * @returns {Array<Object>} { id: number, name: string, timestamp: number, coordinates: string, image: Blob }[]
 */
const searchArea = (
  search,
  order = 'timestamp',
  sort = 'DESC',
  offset = 0,
  limit = -1
) => {
  try {
    const allowedOrders = ['timestamp', 'name'];

    if (!allowedOrders.includes(order)) {
      throw new Error('Invalid order parameter');
    }

    const allowedSorts = ['ASC', 'DESC'];

    if (!allowedSorts.includes(sort.toUpperCase())) {
      throw new Error('Invalid sort parameter');
    }

    if (offset < 0) {
      throw new Error('Invalid offset parameter');
    }

    if (limit < -1) {
      throw new Error('Invalid limit parameter');
    }

    const query = `SELECT * FROM ${dbArea} WHERE name LIKE '%${search}%' ORDER BY ${order} COLLATE NOCASE ${sort} LIMIT ${limit} OFFSET ${offset}`;
    const stmt = db.prepare(query);
    return stmt.all();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

/**
 * Get the number of area records
 * @param {string} search
 * @returns {number}
 */
const getSearchAreaCount = (search) => {
  try {
    const query = `SELECT COUNT(*) FROM ${dbArea} WHERE name LIKE '%${search}%'`;
    const stmt = db.prepare(query);
    return stmt.get()['COUNT(*)'];
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = {
  createArea,
  readArea,
  updateArea,
  deleteArea,
  getAreaCount,
  searchArea,
  getSearchAreaCount,
};
