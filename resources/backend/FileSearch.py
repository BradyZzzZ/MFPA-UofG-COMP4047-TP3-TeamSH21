"""
Search for files in a directory and its subdirectories

Developed by: UofG - SH21 Team
As part of COMPSCI 4047 Team Project (H) course at the University of Glasgow
"""

import os
import sys
import warnings

from osgeo import ogr
import rasterio

warnings.filterwarnings("ignore")


def get_all_files_and_directories(directory):
    OutputFiles = []
    nonOutputFiles = []
    directories = []

    for root, dirs, files in os.walk(directory):
        for filename in files:
            filename = os.path.join(root, filename)
            try:
                ogr.Open(filename, 0)  # Try open file in vector format
                OutputFiles.append([filename, os.path.getsize(filename)])

            # Try read file as raster if error when reading as vector
            except Exception as e:
                try:
                    # Open rasterfile
                    rasterio.open(filename)
                    OutputFiles.append([filename, os.path.getsize(filename)])

                except Exception as e:
                    nonOutputFiles.append(filename)

        for subdir in dirs:
            if os.listdir(os.path.join(root, subdir)):
                subdir_path = os.path.join(root, subdir)
                directories.append([subdir_path])

    outputStarts = [i[0].split(".")[0] for i in OutputFiles]
    for filename in nonOutputFiles[:]:
        if filename.split(".")[0] in outputStarts:
            OutputFiles.append([filename, os.path.getsize(filename)])
            nonOutputFiles.remove(filename)

    OutputDirectories = []
    for i in directories:
        if any(f[0].startswith(i[0]) for f in OutputFiles):
            OutputDirectories.append(i)

    numFiles = len(OutputFiles)
    OutputDirectories += OutputFiles
    OutputDirectories += [numFiles]
    return OutputDirectories


file_paths = get_all_files_and_directories(sys.argv[1])

# Test listing all the files found

for file_path in file_paths:
    print(file_path)
