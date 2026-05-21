import os
import common.paths as paths
from parsers.eu_format import parse_files
import json

ignored_fields = [
    "removed_effect",
    "remove_effect",
    "effect",
    "ai_will_do",
    "important",
    "category",
    "tags",
    "trigger",
    "free",
    "bonus",
    "effect",
]


def load_idea_groups():

    idea_groups = parse_files(paths.NATIONAL_IDEAS_PATH, paths.IDEA_GROUPS_FILE)

    return idea_groups


def extract_modifiers_from_idea_groups(idea_groups):

    modifiers_list = []

    for key, named_modifier in idea_groups.items():

        for modifier_name in named_modifier.keys():
            if modifier_name in ignored_fields:
                continue

            modifiers_list = modifiers_list + [
                x
                for x in idea_groups[key][modifier_name].keys()
                if x not in ignored_fields
            ]

    return list(set(modifiers_list))


def map_idea_groups_to_ES_format(idea_groups, localizations):

    documents = []
    for key, idea_group in idea_groups.items():
        document = {
            "type": "idea_groups",
            "name": key,
            "flat_modifiers": {},
            "bonus": idea_group["bonus"],
            "category": idea_group["category"],
            "searchable_name": localizations.translate(key),
        }

        # Convert named modifier to integer to avoid new ES fields creation
        modifiers = {}
        named_modifiers = [x for x in idea_group.keys() if x not in ignored_fields]
        for idx, named_modifier in enumerate(named_modifiers):
            modifiers[idx] = idea_group[named_modifier]

        named_modifiers.append("bonus")
        global_acc = []
        for _, modifier in enumerate(named_modifiers):
            modifiers_list = [
                x for x in idea_group[modifier].keys() if x not in ignored_fields
            ]

            global_acc = global_acc + list(modifiers_list)
            for m in modifiers_list:
                document["flat_modifiers"][m] = idea_group[modifier][m]

        modifiers["modifiers"] = list(set(global_acc))
        modifiers["searchable_modifiers"] = localizations.translate(
            list(set(global_acc))
        )
        localizations.translate(document["name"])
        document.update(modifiers)
        documents.append(document)

    return documents
