def map_tag_to_ES_format(tags, localizations):

    documents = []
    for tag in tags:
        document = {
            "type": "tags",
            "name": tag,
            "searchable_name": localizations.translate(tag),
        }

        documents.append(document)

    return documents
