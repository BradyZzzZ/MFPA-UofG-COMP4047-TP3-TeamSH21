/**
 * Format unix timestamp to readable format
 *
 * Developed by: UofG - SH21 Team
 * As part of COMPSCI 4047 Team Project (H) course at the University of Glasgow
 */

import { timestampFmt } from '@/constants';

/**
 * Format unix timestamp to readable format
 * @param unixTimestamp unix timestamp
 * @returns formatted timestamp
 */
export const formatUnixTimestamp = (
  unixTimestamp: number,
  fmt: Intl.DateTimeFormatOptions = timestampFmt
): string => {
  const date = new Date(unixTimestamp * 1000);
  const formattedTimestamp = date.toLocaleString('en-US', fmt);
  const [month, day, yearAndTime] = formattedTimestamp.split('/');
  const [year, time] = yearAndTime.split(',');

  return `${day.trim()}/${month.trim()}/${year.trim()}, ${time.trim()}`;
};
