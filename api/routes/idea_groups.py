from flask import Flask, Blueprint, request, current_app, jsonify
from pprint import pprint
from es import get_es_client
import json
from config import PaginationConfig

idea_groups_bp = Blueprint("idea_groups", __name__)


@idea_groups_bp.route("/idea_groups", methods=["GET"])
def idea_groups_list():
    """
    Search with relevance scoring: documents with more matching modifiers rank higher

    Query params:
    - modifiers: one or more modifiers (required)
    """
    # Get parameters
    query_param = request.args.get("query")
    modifiers = request.args.getlist("modifiers_filter")
    category = request.args.get("category_filter")
    types = request.args.getlist("types")

    pagination = PaginationConfig.get_pagination_params(request.args)

    client = get_es_client()
    # Build query with scoring
    query = {
        "query": {
            "bool": {
                "must": (
                    [{"term": {"type.keyword": "idea_groups"}}]
                    + [
                        {"term": {"modifiers.keyword": modifier}}
                        for modifier in modifiers
                    ]
                ),
            }
        },
        "from": pagination["offset"],
        "size": pagination["page_size"],
        "sort": [{"_score": {"order": "desc"}}],  # Sort by score descending
    }

    if query_param:
        query["query"]["bool"]["minimum_should_match"] = 1
        query["query"]["bool"]["should"] = [
            {
                "term": {
                    "searchable_name.keyword": {
                        "value": query_param,
                        "boost": 50,
                    }
                }
            },
            {
                "match": {
                    "searchable_name.standard": {
                        "query": query_param,
                        "boost": 30,
                    }
                }
            },
            {
                "match": {
                    "searchable_name.engram": {
                        "query": query_param,
                        "boost": 20,
                    }
                }
            },
            {"match": {"searchable_name.ngram": {"query": query_param, "boost": 10}}},
        ]

    if category:
        query["query"]["bool"]["must"].append({"term": {"category.keyword": category}})

    try:
        # Execute search
        response = client.search(index="eu4_english_data", body=query)

        # Extract results
        hits = response["hits"]["hits"]
        total = response["hits"]["total"]["value"]

        # Format response
        results = []
        for hit in hits:
            source = hit["_source"]
            matched_modifiers = [
                m for m in modifiers if m in source.get("modifiers", [])
            ]
            result = {
                "id": hit["_id"],
                "score": hit["_score"],
                "matched_modifiers": matched_modifiers,
            }
            result.update(source)
            results.append(result)

        response = PaginationConfig.format_pagination_response(
            data=results,
            total=total,
            page=pagination["page"],
            page_size=pagination["page_size"],
        )
        return jsonify(response)

    except Exception as e:
        return jsonify({"error": f"Search failed: {str(e)}", "status": "error"}), 500
