/**
 * Traverses a directory tree and returns the directory tree
 *
 * Developed by: UofG - SH21 Team
 * As part of COMPSCI 4047 Team Project (H) course at the University of Glasgow
 */

import { CheckState, Directory } from '@/components';

/**
 * Traverses a directory tree and returns the directory tree
 * @param path Path to traverse
 * @param tree Directory tree
 * @returns Directory tree
 */
export const traverseDirectory = (
  path: string[],
  tree: Directory
): Directory => {
  let currentDir = tree;

  // Traverse the directory tree
  for (const dirName of path) {
    // Find the subdirectory in the current directory
    let subDir = currentDir.filesOrDirs.find(
      (item) => item.name === dirName
    ) as Directory;

    // If the subdirectory does not exist, create it
    if (!subDir) {
      subDir = {
        name: dirName,
        isfile: false,
        ischecked: CheckState.UNCHECKED,
        filesOrDirs: [],
      };

      // Add the subdirectory to the current directory
      currentDir.filesOrDirs.push(subDir);
    }

    // Update current directory
    currentDir = subDir;
  }

  // Check if the innermost item has a file extension
  if (currentDir.name.includes('.') && !currentDir.isfile) {
    currentDir.isfile = true;
  }

  return tree;
};
