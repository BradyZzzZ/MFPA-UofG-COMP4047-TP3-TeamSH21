"""
Create a txt file with the given list of files

Developed by: UofG - SH21 Team
As part of COMPSCI 4047 Team Project (H) course at the University of Glasgow
"""

import json
import os
import sys
from typing import List


def createTxtFile(fileList: List[str], destPath: str) -> str:
    """Create a txt file with the given list of files

    Args:
        fileList (List[str]): List of files
        destPath (str): Destination path

    Returns:
        str: JSON string with status and message
    """
    try:
        # Create directories if they don't exist
        os.makedirs(os.path.dirname(destPath), exist_ok=True)
        # Write the list of files to the txt file
        with open(destPath, "w") as file:
            file.write("\n".join(map(json.dumps, fileList)))
        return json.dumps({"status": "success", "message": ""})
    except Exception as e:
        return json.dumps({"status": "error", "message": str(e)})


# Get the list of files and destination path from command-line arguments
file_list = json.loads(sys.argv[1])
dest_path = sys.argv[2]

# Create the text file with the list of files
res = createTxtFile(file_list, dest_path)
print(res)
