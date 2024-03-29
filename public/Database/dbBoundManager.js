/**
 * Retrieve the area that intersects with the given coordinates.
 *
 * Developed by: UofG - SH21 Team
 * As part of COMPSCI 4047 Team Project (H) course at the University of Glasgow
 */

const dbmgr = require('./dbManager');
const turf = require('@turf/turf');

const db = dbmgr.db;
const dbBoundaries = dbmgr.dbBoundaries;

/**
 * Get boundaries from database
 * @param {number} left
 * @param {number} right
 * @param {number} top
 * @param {number} bottom
 * @returns {Array<Object>} {filesOrDirs: (File | Directory)[], name: string, isfile: boolean, ischecked: CheckState}[]
 */
const getBoundaries = (left, right, top, bottom) => {
  try {
    // Fetch all boundaries from the database
    const allBoundaries = db.prepare(`SELECT * FROM ${dbBoundaries}`).all();

    // Create a GeoJSON Polygon for the input polygon
    const polygon = turf.polygon([
      [
        [left, top],
        [right, top],
        [right, bottom],
        [left, bottom],
        [left, top],
      ],
    ]);

    // Filter boundaries based on intersection with the polygon
    const intersectingBoundaries = allBoundaries.filter((boundary) => {
      const boundaryPolygon = turf.polygon([
        [
          [boundary.left, boundary.top],
          [boundary.right, boundary.top],
          [boundary.right, boundary.bottom],
          [boundary.left, boundary.bottom],
          [boundary.left, boundary.top],
        ],
      ]);
      return turf.booleanIntersects(boundaryPolygon, polygon);
    });

    return intersectingBoundaries;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

exports.getBoundaries = getBoundaries;
