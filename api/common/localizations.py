import json
import os
from parsers.eu_format import parse_eu
from parsers.localizations import load_localizations as load_localizations_files
import common.paths as paths

hardcoded_modifiers = {
    "burghers_loyalty_modifier": "Burghers Loyalty Equilibrium",
    "church_loyalty_modifier": "Clergy Loyalty Equilibrium",
    "nobles_influence_modifier": "Nobility Influence",
    "nobles_loyalty_modifier": "Nobility Loyalty Equilibrium",
    "cossacks_privilege_slots": "Cossacks Max Privileges",
    "sea_repair": "Ships repair while in coastal sea provinces",
    "burghers_influence_modifier": "Burghers influence",
    "dhimmi_loyalty_modifier": "Dhimmi Loyalty Equilibrium",
    "modifier_free_leader_pool": "Leader without Upkeep",
    "maratha_loyalty_modifier": "Marathas loyalty equilibrium",
    "rajput_loyalty_modifier": "Rajputs loyalty equilibrium",
    "vaisyas_loyalty_modifier": "Vaisyas loyalty equilibrium",
    "nomadic_tribes_loyalty_modifier": "Tribes loyalty equilibrium",
    "brahmins_hindu_loyalty_modifier": "Brahmins loyalty equilibrium",
    "brahmins_muslim_loyalty_modifier": "Clergy loyalty equilibrium",
    "brahmins_hindu_influence_modifier": "Brahmins Influence",
    "jains_loyalty_modifier": "Jains loyalty equilibrium",
    "church_privilege_slots": "Clergy max privileges",
    "church_influence_modifier": "Clergy influence",
}


modifiers_mapping = {
    "sailor_maintenance_modifer": "MODIFIER_SAILOR_MAINTENANCE",
    "leader_naval_manuever": "NAVAL_LEADER_MANEUVER",
    "light_ship_cost": "LIGHTSHIP_COST",
    "papal_influence": "YEARLY_PAPAL_INFLUENCE",
    "range": "MODIFIER_COLONIAL_RANGE",
    "army_tradition_decay": "YEARLY_ARMY_TRADITION_DECAY",
    "devotion": "YEARLY_DEVOTION",
    "diplomatic_reputation": "MODIFIER_DIPLO_SKILL",
    "fire_damage_received": "MODIFIER_FIRE_DAMAGE_RECIEVED",
    "global_autonomy": "GLOBAL_AUTONOMY_MOD",
    "global_colonial_growth": "MODIFIER_COLONIAL_GROWTH",
    "global_manpower_modifier": "GLOBAL_MANPOWER",
    "trade_range_modifier": "TRADE_RANGE_LABEL",
    "sailors_recovery_speed": "SAILORS_RECOVERY",
    "may_establish_frontier": "MODIFIER_MAY_SIBERIAN_FRONTIER",
    "leader_land_manuever": "LAND_LEADER_MANEUVER",
    "loyalty_change_on_revoked": "MODIFIER_ESTATE_LOYALTY_CHANGE_ON_REVOKED",
    "movement_speed_in_fleet_modifier": "MODIFIER_MOVEMENT_SPEED_IN_FLEET",
    "manpower_recovery_speed": "MANPOWER_RECOVERY",
    "fabricate_claims_cost": "MODIFIER_FABRICATE_CLAIMS_TIME",
    "global_regiment_cost": "REGIMENT_COST",
    "global_regiment_recruit_speed": "RECRUITMENT_TIME",
    "global_sailors_modifier": "GLOBAL_SAILORS",
    "global_ship_cost": "SHIP_COST",
    "global_ship_recruit_speed": "SHIP_RECRUIT_SPEED",
    "heavy_ship_power": "HEAVYSHIP_POWER",
    "light_ship_power": "LIGHTSHIP_POWER",
    "global_spy_defence": "SPY_GLOBAL_DEFENCE",
    "idea_claim_colonies": "MODIFIER_CLAIM_COLONIES",
    "global_tariffs": "GLOBAL_TARIFF_MODIFIER",
    "colonists": "YEARLY_COLONISTS",
    "governing_capacity_modifier": "MODIFIER_GOVERNING_CAPACITY_MODIFIER",
    "diplomats": "YEARLY_DIPLOMATS",
    "missionaries": "YEARLY_MISSIONARIES",
    "merchants": "YEARLY_MERCHANTS",
    "native_uprising_chance": "MODIFIER_NATIVE_UPRISING_CHANCE",
    "heavy_ship_cost": "HEAVYSHIP_COST",
    "morale_damage_received": "MODIFIER_MORALE_DAMAGE_RECIEVED",
    "shock_damage_received": "MODIFIER_SHOCK_DAMAGE_RECIEVED",
    "navy_tradition_decay": "YEARLY_NAVY_TRADITION_DECAY",
    "state_governing_cost": "MODIFIER_STATES_GOVERNING_COST",
    "justify_trade_conflict_cost": "MODIFIER_JUSTIFY_TRADE_CONFLICT_TIME",
    "reinforce_cost_modifier": "MODIFIER_REINFORCE_COST",
    "modifier_cav_to_inf_ratio": "MODIFIER_CAV_TO_INF_RATIO",
    "cav_to_inf_ratio": "MODIFIER_CAV_TO_INF_RATIO",
    "num_accepted_cultures": "MODIFIER_ACCEPTED_CULTURES",
    "embracement_cost": "MODIFIER_EMBRACEMENT_COST",
    "war_exhaustion": "WAR_EXHAUSTION",
    "legitimacy": "YEARLY_LEGITIMACY",
    "prestige": "YEARLY_PRESTIGE",
    "army_tradition": "YEARLY_ARMY_TRADITION",
    "yearly_patriarch_authority": "MODIFIER_YEARLY_PATRIARCH_AUTHORITY",
    "landing_penalty": "MODIFIER_FLAGSHIP_LANDING_PENALTY",
    "merc_independent_from_trade_range": "MODIFIER_MERCENARY_INDEPENDENT_FROM_TRADE_RANGE",
    "cb_on_religious_enemies": "MAY_ATTACK_RELIGIOUS_ENEMIES",
    "merc_leader_army_tradition": "MODIFIER_MERCENARY_LEADER_ARMY_TRADITION",
    "global_prosperity_growth": "MODIFIER_GLOBAL_PROPSPERITY_GROWTH",
    "cb_on_primitives": "MODIFIER_MAY_ATTACK_PRIMITIVES",
    "global_rebel_suppression_efficiency": "MODIFIER_GLOBAL_REBEL_SUPPRESSION",
    "has_galleass": "MODIFIER_HAS_GALLEASSE",
    "reduced_trade_penalty_on_non_main_tradenode": "MODIFIER_REDUCED_TRADE_PENALTY_ON_NON_MAIN_TRADE_NODE",
    "global_religious_conversion_resistance": "MODIFIER_RELIGIOUS_CONVERSION_RESISTANCE",
    "overlord_naval_forcelimit_modifier": "OVERLORD_NAVAL_FORCE_LIMIT_MODIFIER",
}


def extract_modifiers(national_ideas):

    modifiers = []
    for _, idea_set in national_ideas.items():
        for _, value in idea_set.items():
            if isinstance(value, dict):
                for (
                    modifier,
                    _,
                ) in value.items():
                    if modifier in [
                        "NOT",
                        "OR",
                        "AND," "tag",
                        "effect",
                        "has_country_flag",
                        "is_revolution_target",
                        "trigger",
                        "religion_group",
                        "tag",
                        "TAG",
                    ]:
                        continue
                    modifiers.append(modifier)

    return list(set(modifiers))


class Localizations:

    def __init__(self):
        files = [
            "eldorado_l_english.yml",
            "hedgehog_l_english.yml",
            "emperor_map_l_english.yml",
            "diplomacy_l_english.yml",
            "north_america_redone_l_english.yml",
            "rule_britannia_l_english.yml",
            "winds_of_change_l_english.yml",
            "goose_1_35_l_english.yml",
            "king_of_kings_l_english.yml",
            "policies_l_english.yml",
            "mandate_of_heaven_l_english.yml",
            "cossacks_l_english.yml",
            "origins_l_english.yml",
            "leviathan_l_english.yml",
            "scandinavia_l_english.yml",
            "common_sense_l_english.yml",
            "manchu_l_english.yml",
            "religion_l_english.yml",
            "powers_and_ideas_l_english.yml",
            "mare_nostrum_l_english.yml",
            "dharma_l_english.yml",
            "cradle_of_civilization_l_english.yml",
            "aow_l_english.yml",
            "text_l_english.yml",
            "hnn_l_english.yml",
            "00_lanfang_l_english.yml",
            "tmm_l_english.yml",
            "golden_century_l_english.yml",
            "powers_and_ideas_l_english.yml",
            "modifers_l_english.yml",
            "emperor_missions_l_english.yml",
            "emperor_content_l_english.yml",
            "synthetic_dawn_l_english.yml",
            "emperor_l_english.yml",
            "nw2_l_english.yml",
            "domination_l_english.yml",
            "countries_l_english.yml",
            "tags_phase4_l_english.yml",
            "EU4_l_english.yml",
            "gecko_1_34_l_english.yml",
        ]
        files = [os.path.join(paths.LOCALIZATION_PATH, file) for file in files]
        self.localizations = load_localizations_files(files)
        self.minimal_localizations = {}

    def dump_localizations(self, path):

        content = json.dumps(self.minimal_localizations)
        with open(path, "w") as f:
            f.write(content)

    def translate(self, item):

        if type(item) == list:
            return self.translate_list(item)
        else:
            return self.translate_key(item)

    def translate_key(self, key):

        if key in hardcoded_modifiers:
            self.minimal_localizations[key] = hardcoded_modifiers[key]
            return hardcoded_modifiers[key]

        if key in modifiers_mapping:
            self.minimal_localizations[key] = self.localizations[modifiers_mapping[key]]
            return self.localizations[modifiers_mapping[key]]

        if key in self.localizations:
            self.minimal_localizations[key] = self.localizations[key]
            return self.localizations[key]

        if key.upper() in self.localizations:
            self.minimal_localizations[key] = self.localizations[key.upper()]
            return self.localizations[key.upper()]

        if "MODIFIER_" + key.upper() in self.localizations:
            self.minimal_localizations[key] = self.localizations[
                "MODIFIER_" + key.upper()
            ]
            return self.localizations["MODIFIER_" + key.upper()]

        print("warning absent ", key)

        return key

    def translate_list(self, l):

        translated = []
        for k in l:
            translated_key = self.translate_key(k)
            translated.append(translated_key)

        return translated
