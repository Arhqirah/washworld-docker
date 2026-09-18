# Car wash location data — read-only, no authentication required.
# Prefix: /api

from flask import Blueprint, jsonify

from routes.api_common import apply_cors, row_to_json
from x import db

bp = Blueprint("locations_api", __name__, url_prefix="/api")


@bp.after_request
def _cors(response):
    # Adds CORS headers to all location responses.
    return apply_cors(response)


@bp.get("/locations")
def list_locations():
    """GET /api/locations
    Returns all car wash locations with name, address, zipcode, GPS coordinates, and opening hours.
    Used by the map view and location list in the frontend."""
    conn, cursor = None, None
    try:
        conn, cursor = db()
        cursor.execute(
            """
            SELECT location_id, location_name, location_address, location_zipcode,
                   location_coordinate_x, location_coordinate_y, location_open_hours
            FROM locations
            ORDER BY location_name
            """
        )
        rows = cursor.fetchall()
        return jsonify({"locations": [row_to_json(r) for r in rows]})
    except Exception as e:
        if hasattr(e, "args") and len(e.args) > 1 and e.args[1] == 500:
            message = str(e.args[0])
        else:
            message = "Could not load locations"
        return jsonify({"error": message}), 503
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


@bp.get("/locations/<location_id>/equipment")
def list_location_equipment(location_id):
    """GET /api/locations/<location_id>/equipment
    Returns the equipment at a specific location: type (vaskehal/stovsuger/vask_selv),
    number, status (Ledig/Optaget/Ud af drift), and max vehicle dimensions."""
    location_id = (location_id or "").strip()
    if not location_id:
        return jsonify({"error": "Missing location id"}), 400

    conn, cursor = None, None
    try:
        conn, cursor = db()
        cursor.execute(
            """
            SELECT location_equipment_id, location_id, location_equipment_type,
                   location_equipment_number, location_equipment_status,
                   location_equipment_max_height, location_equipment_max_width
            FROM location_equipment
            WHERE location_id = %s
            ORDER BY location_equipment_type, location_equipment_number
            """,
            (location_id,),
        )
        rows = cursor.fetchall()
        return jsonify({"equipment": [row_to_json(r) for r in rows]})
    except Exception as e:
        if hasattr(e, "args") and len(e.args) > 1 and e.args[1] == 500:
            message = str(e.args[0])
        else:
            message = "Could not load equipment"
        return jsonify({"error": message}), 503
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
