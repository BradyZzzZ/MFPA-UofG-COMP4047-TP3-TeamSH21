"""
Update the database with new files and directories

Developed by: UofG - SH21 Team
As part of COMPSCI 4047 Team Project (H) course at the University of Glasgow
"""

import logging
import os
import sqlite3
import warnings
from glob import glob

from GetBoundries import get_bounds

logging.basicConfig(
    level=logging.ERROR,
    filename="log.log",
    filemode="a",
    format="%(asctime)s - %(message)s",
)

warnings.filterwarnings("ignore")


def insert_variable(path, coordinates, parent):
    try:
        sqliteConnection = sqlite3.connect(
            os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../data.db")
        )
        cursor = sqliteConnection.cursor()

        sqlite_insert_with_param = """INSERT INTO boundaries
                          (path, left, right, top, bottom, parent)
                          VALUES (?, ?, ?, ?, ?, ?);"""
        data_tuple = (
            path,
            coordinates[0],
            coordinates[2],
            coordinates[3],
            coordinates[1],
            parent,
        )
        cursor.execute(sqlite_insert_with_param, data_tuple)
        sqliteConnection.commit()
    except sqlite3.Error as error:
        print("Failed to insert Python variable into boundries table", error)

    finally:
        if sqliteConnection:
            sqliteConnection.close()
            print("The SQLite connection is closed")


def update_directory_timestamp(path):
    try:
        sqliteConnection = sqlite3.connect(
            os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../data.db")
        )
        cursor = sqliteConnection.cursor()

        cursor.execute(
            "UPDATE directories SET timestamp = ? WHERE path = ?",
            (os.path.getmtime(path), path),
        )
        sqliteConnection.commit()

        cursor.close()
        print("Timestamp updated successfully for directory:", path)

    except sqlite3.Error as error:
        print("Failed to update timestamp for directory:", path)
        print("SQLite error:", error)
    finally:
        if sqliteConnection:
            sqliteConnection.close()
            print("The SQLite connection is closed")


def update_database():
    try:
        sqliteConnection = sqlite3.connect(
            os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../data.db")
        )
        cursor = sqliteConnection.cursor()
        print("made connection")
        cursor.execute("""SELECT * FROM directories;""")
        directories = cursor.fetchall()
        print(directories)
        for directory in directories:
            path = directory[0]
            timestamp = directory[1]
            print(path)
            if timestamp == os.path.getmtime(path):
                continue
            else:
                update_directory_timestamp(path)
                # fetch all files
                files = [i for i in glob(os.path.join(path, "**/*.*"), recursive=True)]
                outputDict = {}
                nonGeoFiles = []
                for filename in files:
                    if filename.split(".")[0] not in outputDict:
                        bounds = get_bounds(os.path.join(path, filename))
                        if type(bounds) == list:
                            outputDict[filename.split(".")[0]] = [bounds, []]
                            insert_variable(filename, bounds, path)
                        elif bounds == -1:
                            nonGeoFiles.append(filename)
                    else:
                        nonGeoFiles.append(filename)

                # find sibling files
                for filename in nonGeoFiles[:]:
                    if filename.split(".")[0] in outputDict:
                        outputDict[filename.split(".")[0]][1].append(filename)
                        nonGeoFiles.remove(filename)

                # For every sibling file add to database
                for fileWithBounds in outputDict:
                    for SiblingFile in outputDict[fileWithBounds][1]:
                        insert_variable(
                            SiblingFile, outputDict[fileWithBounds][0], path
                        )

                for file in nonGeoFiles:
                    logging.error("Could not read file: " + file)

        cursor.close()

    except sqlite3.Error as error:
        print("Failed to access directories", error)
    finally:
        if sqliteConnection:
            sqliteConnection.close()
            print("The SQLite connection is closed")


update_database()
