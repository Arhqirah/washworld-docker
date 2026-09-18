# Shared utilities used by every API blueprint.
# Import apply_cors, row_to_json, json_body, and error_response into each routes file.

from decimal import Decimal

from flask import jsonify, request


def apply_cors(response):
    """Adds CORS headers so the frontend (any origin) can call the API.
    Called via @bp.after_request in every blueprint."""
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    return response


def row_to_json(row):
    """Converts a database row dict to a JSON-safe dict.
    Turns Decimal values into float and datetime/date into ISO 8601 strings.
    Used whenever rows from the DB are serialized and returned to the client."""
    out = {}
    for key, value in row.items():
        if isinstance(value, Decimal):
            out[key] = float(value)
        elif hasattr(value, "isoformat"):
            out[key] = value.isoformat(sep=" ", timespec="seconds")
        else:
            out[key] = value
    return out


def json_body():
    """Returns the parsed JSON body of the current request, or {} if missing/invalid.
    Used in every POST and PUT handler instead of calling request.get_json() directly."""
    return request.get_json(silent=True) or {}


def error_response(message, status=400):
    """Builds a consistent error JSON response with both 'error' and 'message' keys.
    Used throughout all API modules to return structured error payloads."""
    return jsonify({"error": message, "message": message}), status
