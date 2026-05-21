import time
from common.national_ideas import (
    extract_modifiers_from_national_ideas,
    extract_tags_from_national_ideas,
    add_tags_to_national_ideas,
    fix_national_ideas,
    load_national_ideas,
    map_national_ideas_to_ES_format,
)
from common.modifiers import map_modifiers_to_ES_format
from common.idea_groups import (
    load_idea_groups,
    map_idea_groups_to_ES_format,
    extract_modifiers_from_idea_groups,
)
from common.tags import map_tag_to_ES_format
from common.policies import (
    load_policies,
    map_policies_to_ES_format,
    extract_modifiers_from_policies,
)
from common.religions import load_religions, map_religions_to_ES_format
from common.great_projects import (
    load_great_projects,
    map_great_projects_to_ES_format,
    extract_modifiers_from_great_projects,
)
from common.localizations import Localizations
from elasticsearch import Elasticsearch, helpers
import json
import os

localizations = Localizations()


great_projects = load_great_projects()
policies = load_policies()
religions = load_religions()
idea_groups = load_idea_groups()

national_ideas = load_national_ideas()
national_ideas = fix_national_ideas(national_ideas)
national_ideas = add_tags_to_national_ideas(national_ideas)

modifiers = extract_modifiers_from_national_ideas(national_ideas)
modifiers = list(set(modifiers + extract_modifiers_from_idea_groups(idea_groups)))
modifiers = list(set(modifiers + extract_modifiers_from_great_projects(great_projects)))
modifiers = list(set(modifiers + extract_modifiers_from_policies(policies)))

tags = extract_tags_from_national_ideas(national_ideas)

bulk = map_modifiers_to_ES_format(modifiers, localizations)
bulk = bulk + map_tag_to_ES_format(tags, localizations)
bulk = bulk + map_idea_groups_to_ES_format(idea_groups, localizations)
bulk = bulk + map_policies_to_ES_format(policies, localizations)

bulk = bulk + map_national_ideas_to_ES_format(national_ideas, localizations)
bulk = bulk + map_religions_to_ES_format(religions, localizations)
bulk = bulk + map_great_projects_to_ES_format(great_projects, localizations)

localizations.translate_list(["ADM", "DIP", "MIL"])
localizations.dump_localizations("./en.json")

es_host = "https://" + os.getenv("ES_HOST") + ":" + os.getenv("ES_PORT")
es = Elasticsearch(
    # timeout=300,
    request_timeout=600,
    hosts=[es_host],
    basic_auth=(os.getenv("ES_USER"), os.getenv("ES_PASSWORD")),
    ca_certs=os.getenv("ES_SSL_CERT"),
)

mapping = {
    "settings": {
        "index.max_ngram_diff": 16,
        "index.mapping.total_fields.limit": 30000,
        "analysis": {
            "tokenizer": {
                "ngram_tokenizer": {
                    "type": "ngram",
                    "min_gram": 2,
                    "max_gram": 15,
                    "token_chars": ["letter", "digit"],
                }
            },
            "filter": {
                "edge_ngram_filter": {
                    "type": "edge_ngram",
                    "min_gram": 2,
                    "max_gram": 15,
                }
            },
            "analyzer": {
                "standard_analyzer": {
                    "type": "custom",
                    "tokenizer": "standard",
                    "filter": ["lowercase"],
                },
                "engram_analyzer": {
                    "type": "custom",
                    "tokenizer": "standard",
                    "filter": ["lowercase", "edge_ngram_filter"],
                },
                "ngram_analyzer": {
                    "type": "custom",
                    "tokenizer": "ngram_tokenizer",
                    "filter": ["lowercase"],
                },
            },
        },
    },
    "mappings": {
        "dynamic_templates": [
            {
                "strings_as_searchable": {
                    "match_mapping_type": "string",
                    "mapping": {
                        "type": "text",
                        "fields": {
                            "keyword": {"type": "keyword", "ignore_above": 256},
                            "standard": {
                                "type": "text",
                                "analyzer": "standard_analyzer",
                            },
                            "engram": {
                                "type": "text",
                                "analyzer": "engram_analyzer",
                                "search_analyzer": "standard_analyzer",
                            },
                            "ngram": {
                                "type": "text",
                                "analyzer": "ngram_analyzer",
                                "search_analyzer": "standard_analyzer",
                            },
                        },
                    },
                }
            },
            {
                "floats_as_filterable": {
                    "match_mapping_type": "double",
                    "mapping": {"type": "float"},
                }
            },
            {
                "longs_as_filterable": {
                    "match_mapping_type": "long",
                    "mapping": {"type": "long"},
                }
            },
        ]
    },
}

es.options(request_timeout=600)
es.options(ignore_status=[400, 404]).indices.delete(index="eu4_english_data")
es.indices.create(index="eu4_english_data", body=mapping)
helpers.bulk(es, bulk, index="eu4_english_data")
