"""
Move files to a destination path

Developed by: UofG - SH21 Team
As part of COMPSCI 4047 Team Project (H) course at the University of Glasgow
"""

from typing import List
import json
import os
import shutil
import sys


def moveFiles(fileList: List[str], destPath: str) -> str:
    """Move files to a destination path

    Args:
        fileList (List[str]): List of files to move
        destPath (str): Destination path

    Returns:
        str: JSON string with status and message
    """
    try:
        for file in fileList:
            # Replace the drive letter and colon with nothing
            relativePath = file.replace(":", "")
            # Join the destination path with the relative path
            newPath = os.path.join(destPath, relativePath)
            # Create directories if they don't exist
            os.makedirs(os.path.dirname(newPath), exist_ok=True)
            # Move the file
            shutil.move(file, newPath)
        return json.dumps({"status": "success", "message": ""})
    except Exception as e:
        return json.dumps({"status": "error", "message": str(e)})


fileList = sys.argv[1]
destPath = sys.argv[2]

res = moveFiles(json.loads(fileList), destPath)
print(res)
