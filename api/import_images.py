import urllib.request
import csv
import os
import requests
import common.paths as paths
from PIL import Image
import json


def convert_dds_to_png(dds_path, png_path):
    """
    Convert a single DDS file to PNG
    """
    try:
        # Open DDS file
        img = Image.open(dds_path)

        # Convert to PNG and save
        img.save(png_path, "PNG")

        print(
            f"✓ Converted: {os.path.basename(dds_path)} -> {os.path.basename(png_path)}"
        )
        return True

    except Exception as e:
        print(f"✗ Error converting {dds_path}: {e}")
        return False


f = open("en.json", "r")
localizations = json.load(f)
# artificialy add needed icons
localizations["icon_powers_administrative"] = ""
localizations["icon_powers_diplomatic"] = ""
localizations["icon_powers_military"] = ""

for filename in os.listdir(paths.FLAGS_PATH):
    filename = filename.replace(".tga", "")
    if filename not in localizations:
        continue
    convert_dds_to_png(
        os.path.join(paths.FLAGS_PATH, filename + ".tga"),
        os.path.join("./images", filename + ".png"),
    )

for filename in os.listdir(paths.ICONS_PATH):
    filename = filename.replace(".dds", "")
    if filename not in localizations:
        continue
    convert_dds_to_png(
        os.path.join(paths.ICONS_PATH, filename + ".dds"),
        os.path.join("./images", filename + ".png"),
    )

great_projects_mapping = {
    "the_kremlin": "kremlin",
    "stone_henge": "stonehenge",
    "saint_peters_cathedral": "stpeters_cathedral",
    "notre_dame": "notre_dame_cathedral",
    "easter_island_statues": "moai",
}
for filename in os.listdir(paths.GREAT_PROJECT_ICON_PATH):
    filename = filename.replace(".dds", "")
    output_filename = filename.replace("great_project_", "")

    if output_filename in great_projects_mapping:
        output_filename = great_projects_mapping[output_filename]

    if output_filename not in localizations:
        continue

    convert_dds_to_png(
        os.path.join(paths.GREAT_PROJECT_ICON_PATH, filename + ".dds"),
        os.path.join("./images", output_filename + ".png"),
    )
convert_dds_to_png(
    os.path.join(paths.GREAT_PROJECT_ICON_PATH, "great_project_suez_canal.dds"),
    os.path.join("./images", "kiel_canal.png"),
)
convert_dds_to_png(
    os.path.join(paths.GREAT_PROJECT_ICON_PATH, "great_project_suez_canal.dds"),
    os.path.join("./images", "panama_canal.png"),
)

for filename in os.listdir(paths.MIX_ICON_PATH):
    if ".dds" not in filename:
        continue

    filename = filename.replace(".dds", "")

    if filename not in localizations:
        continue

    convert_dds_to_png(
        os.path.join(paths.MIX_ICON_PATH, filename + ".dds"),
        os.path.join("./images", filename + ".png"),
    )

for filename in os.listdir(paths.RELIGIONS_ICON_PATH):
    mapping = {
        "fetishist": "shamanism",
        "shia": "shiite",
        "theravada": "buddhism",
        "confucian": "confucianism",
        "sikh": "sikhism",
        "animist": "animism",
        "norse": "norse_pagan_reformed",
        "tengri": "tengri_pagan_reformed",
        "alcheringa": "dreamtime",
        "hindu": "hinduism",
        "mayan": "mesoamerican_religion",
    }
    filename = filename.replace(".dds", "")
    output_filename = filename
    if filename in mapping:
        output_filename = mapping[filename]

    if output_filename not in localizations:
        continue

    convert_dds_to_png(
        os.path.join(paths.RELIGIONS_ICON_PATH, filename + ".dds"),
        os.path.join("./images", output_filename + ".png"),
    )

for filename in os.listdir(paths.IDEAS_ICON_PATH):
    filename = filename.replace(".dds", "")
    output_filename = filename.replace("idea_", "")

    if output_filename not in localizations:
        continue

    convert_dds_to_png(
        os.path.join(paths.IDEAS_ICON_PATH, filename + ".dds"),
        os.path.join("./images", output_filename + ".png"),
    )
