from flask import Flask, Blueprint, request, current_app, jsonify
from pprint import pprint
from es import get_es_client
import json
from config import PaginationConfig

national_ideas_bp = Blueprint("national_ideas", __name__)


@national_ideas_bp.route("/national_ideas", methods=["GET"])
def national_ideas_list():
    """
    Search with relevance scoring: documents with more matching modifiers rank higher

    Query params:
    - modifiers: one or more modifiers (required)
    - page: page number (default: 1)
    - size: results per page (default: 20, max: 100)
    """

    # Get parameters
    modifiers = request.args.getlist("modifiers_filter")
    tag = request.args.get("tag_filter")
    sort_field = request.args.get("sort_field")
    sort_direction = request.args.get("sort_direction", "desc")

    pagination = PaginationConfig.get_pagination_params(request.args)

    client = get_es_client()
    # Build query with scoring
    query = {
        "query": {
            "bool": {
                "must": (
                    [{"term": {"type.keyword": "national_ideas"}}]
                    + [
                        {"term": {"modifiers.keyword": modifier}}
                        for modifier in modifiers
                    ]
                ),
            }
        },
        "from": pagination["offset"],
        "size": pagination["page_size"],
    }

    if tag:
        query["query"]["bool"]["must"].append({"term": {"tags.keyword": tag}})

    sort_clause = []
    if sort_field:
        sort_clause = [
            {
                f"flat_modifiers.{sort_field}": {
                    "order": sort_direction,
                }
            }
        ]

    try:
        # Execute search
        response = client.search(
            index="eu4_english_data",
            body=query,
            sort=sort_clause,
        )

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
