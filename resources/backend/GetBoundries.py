"""
Get the bounds of a file

Developed by: UofG - SH21 Team
As part of COMPSCI 4047 Team Project (H) course at the University of Glasgow
"""

import logging
import math
import os
import warnings

import geopandas
import rasterio
from osgeo import ogr
from pyproj import Transformer

warnings.filterwarnings("ignore", message=r".*Warning.*")
logging.basicConfig(
    level=logging.ERROR,
    filename="log.log",
    filemode="a",
    format="%(asctime)s - %(message)s",
)


def get_bounds(filename):
    crs = None
    try:
        file = ogr.Open(filename, 0)  # Try open file in vector format

        # check if file is part of shape file and if it is get crs from prj file else use geopandas to read crs
        # Needed as large shapefile takes long time to read
        if filename.endswith(
            (
                "shp",
                ".shx",
                ".dbf",
                ".prj",
                ".sbn",
                ".sbx",
                ".fbn",
                ".fbx",
                ".ain",
                ".aih",
                ".ixs",
                ".mxs",
                ".atx",
                ".shp.xml",
                ".cpg",
                ".qix",
            )
        ) and os.path.exists(filename.split(".")[0] + ".shp"):
            with open(filename.split(".")[0] + ".prj") as prj:
                crs = prj.readline()
        else:
            try:
                crs = geopandas.read_file(filename, engine="pyogrio").crs
            except:
                logging.error(
                    "Geopandas cannot read "
                    + filename
                    + " crs assuming crs is epsg:4326"
                )

        # Find bounds of vector file by getting extent of each layer
        min_x, max_x, min_y, max_y = math.inf, -math.inf, math.inf, -math.inf
        for layer_index in range(
            file.GetLayerCount()
        ):  # Check for extent of every layer in file
            layer_min_x, layer_max_x, layer_min_y, layer_max_y = file.GetLayerByIndex(
                layer_index
            ).GetExtent()
            min_x = min(min_x, layer_min_x)
            max_x = max(max_x, layer_max_x)
            min_y = min(min_y, layer_min_y)
            max_y = max(max_y, layer_max_y)

        # If crs has been found transform coordinates to epsg:4326, if no crs found assuming coordinates are in epsg:4326
        if crs != None:
            try:
                transformer = Transformer.from_crs(crs, "epsg:4326")
                min_x, min_y = transformer.transform(min_x, min_y)
                max_x, max_y = transformer.transform(max_x, max_y)
            except Exception as e:
                logging.error(
                    " Error transforming Vector file: "
                    + filename
                    + " coordinates assuming epsg:4326"
                )
        return [min_x, min_y, max_x, max_y]

    # Try read file as raster if error when reading as vector
    except Exception as e:
        try:

            # Open rasterfile
            file = rasterio.open(filename)
            min_x, min_y, max_x, max_y = file.bounds
            crs = file.crs

            # If crs has been found transform coordinates to epsg:4326, if no crs found assuming coordinates are in epsg:4326
            try:
                transformer = Transformer.from_crs(crs, "epsg:4326")
                min_x, min_y = transformer.transform(min_x, min_y)
                max_x, max_y = transformer.transform(max_x, max_y)
            except Exception as e:
                logging.error(
                    "Error transforming raster file: "
                    + filename
                    + " coordinates assuming epsg:4326"
                )
            return [min_x, min_y, max_x, max_y]

        except Exception as e:
            return -1
