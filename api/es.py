from elasticsearch import Elasticsearch
from config import Config

_client = None

def get_es_client():
    global _client
    if _client is None:
        _client = Elasticsearch(
            hosts=["https://" + Config.ES_HOST + ":" + str(Config.ES_PORT)],
            basic_auth=(Config.ES_USER, Config.ES_PASSWORD),
            ca_certs=Config.ES_SSL_CERT,
        )
    return _client