/**
 * Parses a stringified array of coordinates into an array of objects with x and
 * y properties
 *
 * Developed by: UofG - SH21 Team
 * As part of COMPSCI 4047 Team Project (H) course at the University of Glasgow
 */

/**
 * Parses a stringified array of coordinates into an array of objects with x and y properties
 * @param coordString stringified array of coordinates
 * @returns array of objects with x and y properties
 */
export const parseCoordinates = (
  coordString: string
): { x: number; y: number }[] => {
  const coordsArray = JSON.parse(coordString);
  return coordsArray.map(([x, y]: [number, number]) => ({ x, y }));
};
