import os
from config import Config

EU4_PATH = Config.EU4_PATH
COMMON_PATH = os.path.join(EU4_PATH, "common")

ICONS_PATH = os.path.join(EU4_PATH, "gfx/interface/ideas_EU4")
FLAGS_PATH = os.path.join(EU4_PATH, "gfx/flags")
MIX_ICON_PATH = os.path.join(EU4_PATH, "gfx/interface")
IDEAS_ICON_PATH = os.path.join(EU4_PATH, "gfx/interface/ideas")
GREAT_PROJECT_ICON_PATH = os.path.join(EU4_PATH, "gfx/interface/great_projects")
RELIGIONS_ICON_PATH = os.path.join(EU4_PATH, "gfx/interface/religion_icons")
NATIONAL_IDEAS_PATH = os.path.join(COMMON_PATH, "ideas")
NATIONAL_IDEAS_FILES = ["00_country_ideas.txt", "zz_group_ideas.txt"]
RELIGIOUS_REFORMS_PATH = os.path.join(COMMON_PATH, "religious_reforms")
RELIGIOUS_REFORMS_FILES = ["00_religious_reforms.txt"]
CHURCH_ASPECTS_PATH = os.path.join(COMMON_PATH, "church_aspects")
CHURCH_ASPECTS_FILES = [
    "00_church_aspects.txt",
    "01_coptic_blessings.txt",
    "03_hussite_aspects.txt",
    "04_zoroastrian_blessings.txt",
    "05_judaism_aspects.txt",
]
FETISHIST_CULTS_PATH = os.path.join(COMMON_PATH, "fetishist_cults")
FETISHIST_CULTS_FILES = ["00_dreaming_stories.txt", "00_fetishist_cults.txt"]
DEITIES_PATH = os.path.join(COMMON_PATH, "personal_deities")
DEITIES_FILES = ["00_hindu_deities.txt", "00_norse_deities.txt"]
EVENT_MODIFIERS_PATH = os.path.join(COMMON_PATH, "event_modifiers")
EVENT_MODIFIERS_FILES = ["00_event_modifiers.txt"]
GREAT_PROJECTS_PATH = os.path.join(COMMON_PATH, "great_projects")
GREAT_PROJECTS_FILES = ["00_great_projects.txt", "01_monuments.txt"]
POLICIES_PATH = os.path.join(COMMON_PATH, "policies")
POLICIES_FILES = ["00_adm.txt", "00_dip.txt", "00_mil.txt"]
RELIGIONS_PATH = os.path.join(COMMON_PATH, "religions")
RELIGIONS_FILES = ["00_religion.txt"]
IDEA_GROUPS_FILE = ["00_basic_ideas.txt"]
LOCALIZATION_PATH = os.path.join(EU4_PATH, "localisation")
