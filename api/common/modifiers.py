import os
import csv
import shutil


def map_modifiers_to_ES_format(modifiers, localizations):

    documents = []
    for modifier in modifiers:
        document = {
            "type": "modifiers",
            "searchable_name": localizations.translate(modifier),
            "name": modifier,
        }
        documents.append(document)

    return documents
