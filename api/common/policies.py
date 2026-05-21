import os
import common.paths as paths
from parsers.eu_format import parse_files

ignored_fields = [
    "removed_effect",
    "allow",
    "potential",
    "ai_will_do",
    "monarch_power",
    "effect",
    "trigger",
    "free",
    "tags",
    "effect",
]


def load_policies():

    policies = parse_files(paths.POLICIES_PATH, paths.POLICIES_FILES)

    return policies


def extract_modifiers_from_policies(policies):

    modifiers_list = []

    for key, named_modifier in policies.items():

        for modifier_name in named_modifier.keys():
            if modifier_name in ignored_fields:
                continue

            modifiers_list.append(modifier_name)

    return modifiers_list


def map_policies_to_ES_format(policies, localizations):

    documents = []
    for key, policy in policies.items():
        document = {
            "type": "policies",
            "name": key,
            "searchable_name": localizations.translate(key),
            "flat_modifiers": {},
            "idea_groups": policy["allow"]["full_idea_group"],
            "monarch_power": policy["monarch_power"],
        }

        # Add a searchable list of modifiers for each policy
        named_modifiers = [x for x in policy.keys() if x not in ignored_fields]
        global_acc = []
        for key, modifier in enumerate(named_modifiers):
            global_acc = global_acc + [modifier]

            document["flat_modifiers"][modifier] = policy[modifier]

        document["modifiers"] = list(set(global_acc))
        document["searchable_modifiers"] = localizations.translate(
            list(set(global_acc))
        )

        documents.append(document)

    return documents
