# Entry point for the WashWorld Flask API.
# Creates the Flask app, loads the secret key, and registers all API blueprints.

import os

from flask import Flask, jsonify

from routes.auth_api import bp as auth_api_bp
from routes.locations_api import bp as locations_api_bp
from routes.users_api import bp as users_api_bp
from routes.subscriptions_api import bp as subscriptions_api_bp
from routes.cars_api import bp as cars_api_bp
from routes.wash_log_api import bp as wash_log_api_bp
from routes.offers_api import bp as offers_api_bp

app = Flask(__name__)
# SECRET_KEY is used to sign JWT tokens. Set via environment variable in production.
app.config["SECRET_KEY"] = os.environ.get(
    "SECRET_KEY",
    "washworld-dev-secret-change-me",
)

# Each blueprint handles one domain of the API.
app.register_blueprint(locations_api_bp)      # GET /api/locations, /api/locations/<id>/equipment
app.register_blueprint(auth_api_bp)            # /api/auth/login, /register, /verify, /forgot-password, /reset-password
app.register_blueprint(users_api_bp)           # /api/users/<id>, /favorites, /subscriptions
app.register_blueprint(subscriptions_api_bp)   # /api/subscriptions
app.register_blueprint(cars_api_bp)            # /api/users/<id>/cars
app.register_blueprint(wash_log_api_bp)        # /api/wash_log
app.register_blueprint(offers_api_bp)          # /api/offers


@app.route("/")
def index():
    return jsonify({"status": "ok"})


@app.route("/test")
def test():
    return "ok"


if __name__ == "__main__":
    app.run(debug=True)