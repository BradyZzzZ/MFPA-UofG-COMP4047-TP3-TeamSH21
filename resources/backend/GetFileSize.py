"""
Get the size of a file

Developed by: UofG - SH21 Team
As part of COMPSCI 4047 Team Project (H) course at the University of Glasgow
"""

import json
import os
import sys

fileList = json.loads(sys.argv[1])

size = 0
for file in fileList:
    size += os.path.getsize(file)

print(size)
