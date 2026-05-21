import os
import common.paths as paths
from parsers.eu_format import parse_files
import json


# Personal deities, hindu, norse (personal_deities)
# confusianism event_modifiers/00_event_modifiers
# TODO extract flat modifiers in the same way for all religions if possible
def load_religions():

    religions = parse_files(paths.RELIGIONS_PATH, paths.RELIGIONS_FILES)

    fetishist_cults = parse_files(
        paths.FETISHIST_CULTS_PATH, paths.FETISHIST_CULTS_FILES
    )
    fetishist_cults = format_fetishist_cults(fetishist_cults)

    deities = parse_files(paths.DEITIES_PATH, paths.DEITIES_FILES)
    deities = format_deities(deities)

    event_modifiers = parse_files(
        paths.EVENT_MODIFIERS_PATH, paths.EVENT_MODIFIERS_FILES
    )
    harmonized = format_harmonized(event_modifiers)

    church_aspects = parse_files(paths.CHURCH_ASPECTS_PATH, paths.CHURCH_ASPECTS_FILES)
    church_aspects = format_church_aspects(church_aspects)

    religious_reforms = parse_files(
        paths.RELIGIOUS_REFORMS_PATH, paths.RELIGIOUS_REFORMS_FILES
    )
    religious_reforms = format_religious_reforms(religious_reforms)

    transformed_religions = {}
    secondary_religion = {}
    religious_schools = {}

    for religion_group_key, religion_group in religions.items():

        if religion_group_key == "muslim":
            religious_schools = format_religious_schools(religion_group)

        for religion_key, religion in religion_group.items():
            if religion_key in [
                "flags_with_emblem_percentage",
                "flag_emblem_index_range",
                "harmonized_modifier",
                "ai_will_propagate_through_trade",
                "crusade_name",
                "can_form_personal_unions",
                "defender_of_faith",
                "center_of_religion",
                "religious_schools",
            ]:
                continue

            religion["secondary"] = {}
            if "secondary_flat_modifiers" not in religion:
                religion["secondary_flat_modifiers"] = {}

            # Harmonized (Confucianism)
            if religion_key == "confucianism":
                religion["secondary"] = harmonized
                for modifier in harmonized.values():
                    religion["secondary_flat_modifiers"].update(
                        modifier["flat_modifiers"]
                    )

            # Deities (Norse, Hindu)
            for n, deity in deities.items():
                if religion_key in deity["religion"]:
                    religion["secondary"].update({n: deity})
                    religion["secondary_flat_modifiers"].update(deity["flat_modifiers"])

            # Cults (Fetishist, Alcheringa)
            for n, cult in fetishist_cults.items():
                if religion_key in cult["religion"]:
                    religion["secondary"].update({n: cult})
                    religion["secondary_flat_modifiers"].update(cult["flat_modifiers"])

            # Religious reforms (Mayan, Inti, Nahuatl)
            for n, religious_reform in religious_reforms.items():
                if religion_key in religious_reform["religion"]:
                    religion["secondary"] = {"0": religious_reform}
                    religion["secondary_flat_modifiers"] = religious_reform[
                        "flat_modifiers"
                    ]

            # Muslim
            if religion_group_key == "muslim":
                for school, item in religious_schools.items():
                    if religion_key in item["religions"]:
                        religion["secondary"][school] = item
                        religion["secondary_flat_modifiers"].update(
                            item["flat_modifiers"]
                        )

            # Orthodox
            if religion_key == "orthodox":
                religion["secondary"] = format_orthodox_icons(
                    religion["orthodox_icons"]
                )
                for _, icon in religion["secondary"].items():
                    religion["secondary_flat_modifiers"].update(icon["flat_modifiers"])

            # Tengri related
            if "country_as_secondary" in religion:
                secondary_religion[religion_key] = {
                    "flat_modifiers": religion["country_as_secondary"]
                }

            # Protestant/Reformed, Coptic, Anglican, Hussite, Zoroastrianism, Judaism
            aspects = []
            if "aspects" in religion:
                aspects = religion["aspects"]
            if "blessings" in religion:
                aspects = religion["blessings"]

            if len(aspects) > 0:
                secondary = {}
                for aspect in aspects:
                    if aspect not in church_aspects:
                        continue
                    secondary[aspect] = church_aspects[aspect]
                    religion["secondary_flat_modifiers"].update(
                        church_aspects[aspect]["flat_modifiers"]
                    )
                religion["secondary"] = secondary

            transformed_religions[religion_key] = {
                "modifier": religion["country"],
                "secondary": religion["secondary"],
                "secondary_flat_modifiers": religion["secondary_flat_modifiers"],
            }
            transformed_religions[religion_key]["religion_group"] = religion_group_key

    transformed_religions["tengri_pagan_reformed"]["secondary"] = secondary_religion
    for key, secondary in transformed_religions["tengri_pagan_reformed"][
        "secondary"
    ].items():
        transformed_religions["tengri_pagan_reformed"][
            "secondary_flat_modifiers"
        ].update(secondary["flat_modifiers"])

    return transformed_religions


def format_harmonized(event_modifiers):

    harmonized = {
        key: {"flat_modifiers": modifier}
        for key, modifier in event_modifiers.items()
        if "harmonized" in key
    }

    return harmonized


def format_fetishist_cults(fetishit_cults):

    formated_fetishit_cults = {}
    for key, fetishit_cult in fetishit_cults.items():
        excluded_fields = ["allow", "ai_will_do", "sprite"]

        flat_modifiers = {
            x: fetishit_cult[x]
            for x in fetishit_cult.keys()
            if x not in excluded_fields
        }
        formated_fetishit_cults[key] = {
            "flat_modifiers": flat_modifiers,
            "religion": [fetishit_cult["allow"]["religion"]],
        }

    return formated_fetishit_cults


def format_deities(deities):

    formated_deities = {}
    for key, deity in deities.items():
        excluded_fields = [
            "sprite",
            "potential",
            "trigger",
            "effect",
            "removed_effect",
            "ai_will_do",
        ]

        flat_modifiers = {x: deity[x] for x in deity.keys() if x not in excluded_fields}
        formated_deities[key] = {
            "flat_modifiers": flat_modifiers,
            "religion": [deity["potential"]["religion"]],
        }

    return formated_deities


def format_church_aspects(church_aspects):

    formated_church_aspects = {}
    for key, church_aspect in church_aspects.items():
        excluded_fields = ["potential", "trigger", "ai_will_do", "cost", "effect"]

        formated_church_aspects[key] = {
            x: church_aspect[x]
            for x in church_aspect.keys()
            if x not in excluded_fields
        }

        formated_church_aspects[key]["flat_modifiers"] = formated_church_aspects[
            key
        ].pop("modifier")

    return formated_church_aspects


def format_religious_reforms(religious_reforms):

    formated_religious_reforms = {}

    for name, item in religious_reforms.items():
        excluded_fields = ["can_buy_idea", "trigger", "ai_will_do"]
        entries = [x for x in item.keys() if x not in excluded_fields]
        flat_modifiers = {}
        for entry in entries:
            flat_modifiers.update(item[entry])

        formated_religious_reform = {
            "religion": [item["trigger"]["religion"]],
            "flat_modifiers": flat_modifiers,
        }

        formated_religious_reforms[name] = formated_religious_reform

    return formated_religious_reforms


def format_religious_schools(muslim_group):

    religious_schools = {}
    excluded_fields = [
        "potential_invite_scholar",
        "can_invite_scholar",
        "on_invite_scholar",
        "invite_scholar_modifier_display",
        "picture",
    ]

    for school, item in muslim_group["religious_schools"].items():

        religions = []
        modifiers = [x for x in item.keys() if x not in excluded_fields]
        flat_modifiers = {m: item[m] for m in modifiers}
        #  Retrieves religion limit field to apply schools to the right muslim religions
        for i in item["can_invite_scholar"]["if"]:
            if "NOT" not in i["limit"].keys():
                continue

            for y in i["limit"]["NOT"]:
                if "religion" in y:
                    religions.append(y["religion"])

        religious_school = {
            "flat_modifiers": flat_modifiers,
            "religions": religions,
        }
        religious_schools[school] = religious_school

    return religious_schools


def format_orthodox_icons(orthodox_icons):

    formated_orthodox_icons = {}
    excluded_fields = ["allow", "visible", "ai_will_do"]
    for icon, item in orthodox_icons.items():

        modifiers = [x for x in item.keys() if x not in excluded_fields]
        flat_modifiers = {m: item[m] for m in modifiers}
        formated_orthodox_icons[icon] = {"flat_modifiers": flat_modifiers}

    return formated_orthodox_icons


def map_religions_to_ES_format(religions, localizations):

    documents = []
    for key, religion in religions.items():
        for idx, name in enumerate(religion["secondary"].keys()):
            if "flat_modifiers" not in religion["secondary"][name]:
                print(key, name, religion["secondary"][name])

        document = {
            "type": "religions",
            "name": key,
            "searchable_name": localizations.translate(key),
            "base_modifiers": religion["modifier"],
            "religion_group": religion["religion_group"],
            "secondary": {
                idx: religion["secondary"][name]
                for idx, name in enumerate(religion["secondary"].keys())
                if name != "religion"
            },
            "flat_modifiers": religion["modifier"]
            | religion["secondary_flat_modifiers"],
            "modifiers": list(religion["modifier"].keys())
            + list(religion["secondary_flat_modifiers"].keys()),
            "searchable_modifiers": localizations.translate(
                list(religion["modifier"].keys())
                + list(religion["secondary_flat_modifiers"].keys())
            ),
        }

        documents.append(document)

    return documents
