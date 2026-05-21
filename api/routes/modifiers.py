from flask import Flask, Blueprint, request, current_app, jsonify
from pprint import pprint
from es import get_es_client
import json

modifiers_bp = Blueprint('modifiers', __name__)

@modifiers_bp.route("/modifiers", methods=["GET"])
def modifiers_list():

    query_param = request.args.get('query')
    query = {
        "bool": {
            "filter": [
                {
                    "term": {
                        "type.keyword": "modifiers"
                    }
                }
            ]
        }
    }

    if query_param != "" and query_param is not None:
        query["bool"]["minimum_should_match"] = 1
        query["bool"]["should"] = [
                {
                    "term": {
                        "searchable_name.keyword": {
                            "value": query_param,
                            "boost": 50
                        }
                    }
                },
                {
                    "match": {
                        "searchable_name.standard": {
                            "query": query_param,
                            "boost": 30
                        }
                    }
                },
                {
                    "match": {
                        "searchable_name.engram": {
                            "query": query_param,
                            "boost": 20
                        }
                    }
                },
                {
                    "match": {
                        "searchable_name.ngram": {
                            "query": query_param,
                            "boost": 10
                        }
                    }
                }
            ]

    client = get_es_client()
    try:
        # Execute search
        response = client.search(
            index='eu4_english_data',
            query=query
        )
        
        # Extract results
        hits = response['hits']['hits']
        total = response['hits']['total']['value']
        
        # Format response
        results = []
        for hit in hits:
            source = hit['_source']
            result = {
                'id': hit['_id'],
                'score': hit['_score'],
            }
            result.update(source) 
            results.append(result)
        
        return jsonify({
            'status': 'success',
            'total': total,
            'results': results,
        })
        
    except Exception as e:
        return jsonify({
            'error': f'Search failed: {str(e)}',
            'status': 'error'
        }), 500
