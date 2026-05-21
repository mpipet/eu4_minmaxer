from flask import Flask, request, current_app, jsonify
from pprint import pprint
import json
from flask_cors import CORS
from es import get_es_client
from routes.religions import religions_bp
from routes.idea_groups import idea_groups_bp
from routes.national_ideas import national_ideas_bp
from routes.modifiers import modifiers_bp
from routes.tags import tags_bp
from routes.policies import policies_bp
from routes.great_projects import great_projects_bp
from config import Config
from flask import Flask, send_from_directory, request
from datetime import datetime, timedelta


app = Flask(__name__, static_folder="images", static_url_path="/images")

@app.route('/health')
def health():
    logger.info("Health endpoint called")
    return {'status': 'ok'}, 200

@app.route('/images/<path:filename>')
def serve_image(filename):
    
    response = send_from_directory('images', filename)
    
    response.headers.pop('Cache-Control', None)
    response.headers.pop('Pragma', None)
    
    response.headers['Cache-Control'] = 'public, max-age=604800, immutable'
    
    expires = datetime.utcnow() + timedelta(days=7)
    response.headers['Expires'] = expires.strftime('%a, %d %b %Y %H:%M:%S GMT')
    
    response.add_etag()
    
    return response

@app.after_request
def force_cache_on_images(response): 
    if request.path.startswith('/images/'):
        # Supprimer tous les headers cache existants
        response.headers.pop('Cache-Control', None)
        response.headers.pop('Pragma', None)
        
        # Forcer nos headers
        response.headers['Cache-Control'] = 'public, max-age=604800, immutable'
        
        expires = datetime.utcnow() + timedelta(days=7)
        response.headers['Expires'] = expires.strftime('%a, %d %b %Y %H:%M:%S GMT')
    
    return response

def register_routes(app):
    app.register_blueprint(religions_bp)
    app.register_blueprint(idea_groups_bp)
    app.register_blueprint(national_ideas_bp)
    app.register_blueprint(modifiers_bp)
    app.register_blueprint(tags_bp)
    app.register_blueprint(policies_bp)
    app.register_blueprint(great_projects_bp)

register_routes(app)

CORS(
    app,
    origins=Config.CORS_ORIGINS,
    allow_headers=['Content-Type', 'Authorization', 'Accept'],
    methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    supports_credentials=False,
    automatic_options=True,  # Flask répond automatiquement aux OPTIONS
    max_age=3600
)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

