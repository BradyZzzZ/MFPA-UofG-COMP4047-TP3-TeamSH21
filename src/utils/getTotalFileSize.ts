/**
 * Get total size of files in the array
 *
 * Developed by: UofG - SH21 Team
 * As part of COMPSCI 4047 Team Project (H) course at the University of Glasgow
 */

export const getTotalFilesSize = (fileArraySize: number) => {
  let i = 0;

  const sizeMap = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  while (fileArraySize >= 1024 && i < sizeMap.length) {
    i++;
    fileArraySize /= 1024;
  }

  return `${fileArraySize.toFixed(2)} ${sizeMap[i]}`;
};
