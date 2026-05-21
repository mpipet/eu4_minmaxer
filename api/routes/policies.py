from flask import Flask, Blueprint, request, current_app, jsonify
from pprint import pprint
from es import get_es_client
import json
from config import PaginationConfig

policies_bp = Blueprint("policies", __name__)


@policies_bp.route("/policies", methods=["GET"])
def policies_list():
    """
    Search with relevance scoring: documents with more matching modifiers rank higher

    Query params:
    - modifiers: one or more modifiers (required)
    """
    # Get parameters
    modifiers = request.args.getlist("modifiers_filter")
    idea_groups = request.args.getlist("idea_groups")
    monarch_powers = request.args.getlist("monarch_powers_filter")
    types = request.args.getlist("types")

    pagination = PaginationConfig.get_pagination_params(request.args)

    client = get_es_client()
    # Build query with scoring
    query = {
        "query": {
            "bool": {
                "must": (
                    [{"term": {"type.keyword": "policies"}}]
                    + [
                        {"term": {"modifiers.keyword": modifier}}
                        for modifier in modifiers
                    ]
                    + [
                        {"term": {"idea_groups.keyword": idea_group}}
                        for idea_group in idea_groups
                    ]
                    + [
                        {"term": {"monarch_power.keyword": monarch_power}}
                        for monarch_power in monarch_powers
                    ]
                ),
            }
        },
        "from": pagination["offset"],
        "size": pagination["page_size"],
        "sort": [{"_score": {"order": "desc"}}],  # Sort by score descending
    }

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
