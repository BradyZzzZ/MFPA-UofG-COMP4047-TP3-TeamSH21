/**
 * Perform the action of moving, copying or writing the file list to a txt file
 *
 * Developed by: UofG - SH21 Team
 * As part of COMPSCI 4047 Team Project (H) course at the University of Glasgow
 */

/**
 * Perform the action of moving, copying or writing the file list to a txt file
 * @param fileList list of files to be moved, copied or written to a txt file
 * @param destPath destination path
 * @param option move, copy or txt
 * @returns status and message
 */
export const outputToDestination = async (
  fileList: string[],
  destPath: string,
  option: 'move' | 'copy' | 'txt'
): Promise<{ status: 'success' | 'error'; message: string }> => {
  let res;
  if (option === 'copy') {
    res = await window.pyshell.runCopyFileToDest(
      JSON.stringify(fileList),
      destPath
    );
  } else if (option === 'move') {
    res = await window.pyshell.runMoveFileToDest(
      JSON.stringify(fileList),
      destPath
    );
  } else {
    if (!destPath.endsWith('.txt')) destPath = destPath.concat('.txt');
    res = await window.pyshell.runWriteFileListToTxt(
      JSON.stringify(fileList),
      destPath
    );
  }
  return JSON.parse(res);
};
