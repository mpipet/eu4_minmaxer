import os
import common.paths as paths
from parsers.eu_format import parse_files
import json

ignored_fields = [
    "removed_effect",
    "effect",
    "start",
    "tags",
    "bonus",
    "trigger",
    "free",
    "effect",
]

ignored_fields_with_bonus_start = [
    "removed_effect",
    "effect",
    "tags",
    "trigger",
    "free",
    "effect",
]

def load_national_ideas():

    national_ideas = parse_files(paths.NATIONAL_IDEAS_PATH, paths.NATIONAL_IDEAS_FILES)

    return national_ideas


def add_tags_to_national_ideas(national_ideas):

    for tag, idea_set in national_ideas.items():

        tags = []
        if "trigger" not in idea_set:
            continue

        if "tag" in idea_set["trigger"]:
            tags.append(idea_set["trigger"]["tag"])

        if "OR" in idea_set["trigger"] and "tag" in idea_set["trigger"]["OR"]:

            if type(idea_set["trigger"]["OR"]["tag"]) is list:

                tags = tags + idea_set["trigger"]["OR"]["tag"]
            else:
                tags.append(idea_set["trigger"]["OR"]["tag"])

        idea_set["tags"] = tags

    return national_ideas


def fix_national_ideas(national_ideas):

    FIXABLE_IDEAS = {
        # Venetian ideas
        "VEN_ideas_2": {
            "venetian_arsenal": ("VEN_ideas", "venetian_arsenal"),
            "printing_industry": ("VEN_ideas", "printing_industry"),
            "stato_da_mar": ("VEN_ideas", "stato_da_mar"),
            "conscription": ("VEN_ideas", "conscription"),
            "defend_the_law": ("VEN_ideas", "defend_the_law"),
        },
        "LNS_ideas": {
            "stato_da_mar": ("VEN_ideas", "stato_da_mar"),
        },
        # Turkish and Anatolian ideas
        "anatolian_beyliks_ideas": {
            "ghazi": ("TUR_ideas", "ghazi"),
        },
        "KAR_ideas": {
            "ghazi": ("TUR_ideas", "ghazi"),
        },
        # Indian ideas
        "garjati_ideas": {
            "securing_defenses_central_indic": (
                "central_indic_ideas",
                "securing_defenses_central_indic",
            ),
        },
        "malabari_ideas": {
            "merchants_of_southern_india": (
                "dravidian_ideas",
                "merchants_of_southern_india",
            ),
            "malagasy_pirate_ports": ("BTS_ideas", "malagasy_pirate_ports"),
        },
        "malagasy_ideas": {
            "malagasy_pirate_ports": ("BTS_ideas", "malagasy_pirate_ports"),
        },
        "rajput_ideas": {
            "marwari_horses": ("RJP_ideas", "marwari_horses"),
        },
        "bengali_ideas": {
            "jute_production": ("TPR_ideas", "jute_production"),
        },
        "DEC_ideas": {
            "dakani_language": ("BAH_ideas", "dakani_language"),
        },
        # Persian ideas
        "ERANSHAHR_ideas": {
            "improved_silk_road": ("PER_ideas", "improved_silk_road"),
        },
        # Italian ideas
        "COR_ideas": {
            "SAR_and_COR": ("SAR_ideas", "SAR_and_COR"),
        },
        "SPI_ideas": {
            "the_shroud_of_turin": ("SAV_ideas", "the_shroud_of_turin"),
        },
        # German ideas
        "BYT_ideas": {
            "ans_restore_the_burgraviate": ("ANS_ideas", "ans_restore_the_burgraviate"),
            "ans_franconian_reformers": ("ANS_ideas", "ans_franconian_reformers"),
        },
        "BRU_ideas": {
            "han_niedersachsicher_reichskreis": (
                "HAN_ideas",
                "han_niedersachsicher_reichskreis",
            ),
        },
        "LUN_ideas": {
            "bru_welfian_dynasty": ("BRU_ideas", "bru_welfian_dynasty"),
            "han_niedersachsicher_reichskreis": (
                "HAN_ideas",
                "han_niedersachsicher_reichskreis",
            ),
        },
        "FKN_ideas": {
            "franconian_wine": ("WBG_ideas", "franconian_wine"),
        },
        # Central Asian ideas
        "TRS_ideas": {
            "chagatai_literature": ("TIM_ideas", "chagatai_literature"),
        },
        "QOM_ideas": {
            "reform_the_diwan": ("TIM_ideas", "reform_the_diwan"),
        },
        "QAR_ideas": {
            "in_honor_of_ali": ("QOM_ideas", "in_honor_of_ali"),
        },
        # Arabian ideas
        "RAS_ideas": {
            "coffea_arabica": ("YEM_ideas", "coffea_arabica"),
        },
        # North American ideas
        "CSC_ideas": {
            "the_hudson_bay_company": ("CAN_ideas", "the_hudson_bay_company"),
        },
        # Steppe ideas
        "KHA_ideas": {
            "life_of_steppe_warrior": ("OIR_ideas", "life_of_steppe_warrior"),
        },
        "CHG_ideas": {
            "glory_of_conquest": ("OIR_ideas", "glory_of_conquest"),
        },
        "horde_ideas": {
            "life_of_steppe_warrior": ("OIR_ideas", "life_of_steppe_warrior"),
            "tradition_of_conquest": ("CHG_ideas", "tradition_of_conquest"),
            "logistics_of_khan": ("GLH_ideas", "logistics_of_khan"),
            "glory_of_conquest": ("OIR_ideas", "glory_of_conquest"),
        },
        "cossack_ideas": {
            "zaz_steppe_riders": ("ZAZ_ideas", "zaz_steppe_riders"),
        },
        # Greek ideas
        "LAE_ideas": {
            "epi_latin_knights": ("EPI_ideas", "epi_latin_knights"),
        },
        # British-Dutch Union ideas (mix of GBR and NED)
        "UCN_ideas": {
            "reform_of_comission_buying": ("GBR_ideas", "reform_of_comission_buying"),
            "british_industrialization": ("GBR_ideas", "british_industrialization"),
            "instructie_voor_de_admiraliteiten": (
                "NED_ideas",
                "instructie_voor_de_admiraliteiten",
            ),
            "dutch_trading_spirit": ("NED_ideas", "dutch_trading_spirit"),
            "army_sappers": ("NED_ideas", "army_sappers"),
            "amsterdam_wisselbank": ("NED_ideas", "amsterdam_wisselbank"),
            "city_upon_a_hill": ("GBR_ideas", "city_upon_a_hill"),
        },
        # Ruthenian ideas (complete copy of UKR_ideas)
        "ruthenian_ideas": {
            "mother_of_russian_cities": ("UKR_ideas", "mother_of_russian_cities"),
            "international_influences": ("UKR_ideas", "international_influences"),
            "zaporizhian_cossacs": ("UKR_ideas", "zaporizhian_cossacs"),
            "east_and_west": ("UKR_ideas", "east_and_west"),
            "legacy_of_ancient_rus": ("UKR_ideas", "legacy_of_ancient_rus"),
            "reuniting_rus": ("UKR_ideas", "reuniting_rus"),
            "birth_of_russian_orthodoxy": ("UKR_ideas", "birth_of_russian_orthodoxy"),
        },
        # Other ideas
        "laotian_ideas": {
            "lao_ethnic_diversity": ("LXA_ideas", "lao_ethnic_diversity"),
        },
        "zambezi_ideas": {
            "zambezi_maravi_influences": ("TBK_ideas", "zambezi_maravi_influences"),
        },
    }

    for target_set, ideas_mapping in FIXABLE_IDEAS.items():
        for target_idea, (source_set, source_idea) in ideas_mapping.items():
            if (
                source_set not in national_ideas
                or source_idea not in national_ideas[source_set]
            ):
                continue

            if target_set not in national_ideas:
                national_ideas[target_set] = {}

            national_ideas[target_set][target_idea] = national_ideas[source_set][
                source_idea
            ]

    return national_ideas


def extract_modifiers_from_national_ideas(national_ideas):

    modifiers_list = []

    for key, named_modifier in national_ideas.items():

        for modifier_name in named_modifier.keys():
            if modifier_name in ignored_fields_with_bonus_start:
                continue

            modifiers_list = modifiers_list + list(
                national_ideas[key][modifier_name].keys()
            )
            if "effect" in modifiers_list:
                modifiers_list.remove("effect")
            if "remove_effect" in modifiers_list:
                modifiers_list.remove("remove_effect")

    return list(set(modifiers_list))


def extract_tags_from_national_ideas(national_ideas):

    tags = []
    for _, idea_set in national_ideas.items():
        tags = tags + idea_set["tags"]

    return list(set(tags))


def map_national_ideas_to_ES_format(national_ideas, localizations):

    documents = []
    for key, ideas_set in national_ideas.items():
        document = {
            "type": "national_ideas",
            "name": key,
            "searchable_name": localizations.translate(key),
            "flat_modifiers": {},
            "start": ideas_set["start"],
            "bonus": ideas_set["bonus"],
            "trigger": ideas_set["trigger"],
            "tags": ideas_set["tags"],
        }

        modifiers = {}

        # Convert named modifier to integer to avoid new ES fields creation
        named_modifiers = [x for x in ideas_set.keys() if x not in ignored_fields]
        for idx, named_modifier in enumerate(named_modifiers):
            modifiers[idx] = ideas_set[named_modifier]

        named_modifiers.insert(0, "start")
        named_modifiers.append("bonus")

        global_acc = []
        for key, modifier in enumerate(named_modifiers):
            modifiers_list = [
                x for x in ideas_set[modifier].keys() if x not in ignored_fields_with_bonus_start
            ]
            global_acc = global_acc + list(modifiers_list)

            for m in modifiers_list:
                document["flat_modifiers"][m] = ideas_set[modifier][m]

        modifiers["modifiers"] = list(set(global_acc))
        modifiers["searchable_modifiers"] = localizations.translate(
            list(set(global_acc))
        )
        modifiers["searchable_tags"] = localizations.translate(document["tags"])

        document.update(modifiers)
        documents.append(document)

    return documents
