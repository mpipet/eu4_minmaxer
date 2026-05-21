import os
import common.paths as paths
from parsers.eu_format import parse_files
import json

ignored_fields = [
    "removed_effect",
    "effect",
    "ai_will_do",
    "important",
    "category",
    "tags",
    "bonus",
    "trigger",
    "free",
    "effect",
]


def load_great_projects():

    great_projects = parse_files(paths.GREAT_PROJECTS_PATH, paths.GREAT_PROJECTS_FILES)

    return great_projects


def extract_modifiers_from_great_projects(great_projects):

    modifiers_list = []

    for _, great_project in great_projects.items():
        if type(great_project["tier_3"]["country_modifiers"]) == list:
            continue

        modifiers_list = modifiers_list + list(
            great_project["tier_3"]["country_modifiers"].keys()
        )

    return list(set(modifiers_list))


def map_great_projects_to_ES_format(great_projects, localizations):

    documents = []
    for key, great_project in great_projects.items():

        if type(great_project["tier_3"]["country_modifiers"]) == list:
            continue

        document = {
            "type": "great_projects",
            "name": key,
            "searchable_name": localizations.translate(key),
            "tier_1": (
                great_project["tier_1"]["country_modifiers"]
                if "country_modifiers" in great_project["tier_1"]
                else {}
            ),
            "tier_2": (
                great_project["tier_2"]["country_modifiers"]
                if "country_modifiers" in great_project["tier_2"]
                else {}
            ),
            "tier_3": (
                great_project["tier_3"]["country_modifiers"]
                if "country_modifiers" in great_project["tier_3"]
                else {}
            ),
        }

        document = document | {
            "flat_modifiers": document["tier_3"],
            "modifiers": list(document["tier_3"].keys()),
            "searchable_modifiers": localizations.translate(
                list(document["tier_3"].keys())
            ),
        }

        documents.append(document)

    return documents
