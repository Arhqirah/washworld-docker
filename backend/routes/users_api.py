# User profile and favorites management.
# Prefix: /api/users
# All routes require a valid Bearer token that matches the user_id in the URL.

import uuid
from datetime import datetime

from flask import Blueprint, jsonify, request
from werkzeug.security import generate_password_hash

from routes.api_common import apply_cors, error_response, json_body, row_to_json
from routes.auth_api import _public_user
from routes.auth_tokens import load_user_id_from_token
from x import db, validate_email, validate_password, validate_firstname, validate_lastname, validate_phone

bp = Blueprint("users_api", __name__, url_prefix="/api/users")


@bp.after_request
def _cors(response):
    # Adds CORS headers to all user responses.
    return apply_cors(response)


def _bearer_user_id():
    """Extracts the JWT from the Authorization header and returns the user_id.
    Returns None if the header is missing, malformed, or the token is invalid/expired.
    Called by every protected route in users_api and cars_api."""
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        return None
    token = auth[7:].strip()
    return load_user_id_from_token(token)


def _fetch_user_by_id(cursor, user_id: str):
    """Fetches a non-deleted user row by user_id.
    Used in get_user and after update_user to return the updated profile."""
    cursor.execute(
        """
        SELECT user_id, user_email, user_firstname, user_lastname, user_phone,
               user_created_at, user_updated_at, user_deleted_at, user_verified_at
        FROM users
        WHERE user_id = %s AND user_deleted_at IS NULL
        LIMIT 1
        """,
        (user_id,),
    )
    return cursor.fetchone()


@bp.get("/<user_id>")
def get_user(user_id):
    """GET /api/users/<user_id>
    Returns the user profile. Requires a Bearer token that matches user_id."""
    token_user_id = _bearer_user_id()
    if not token_user_id:
        return error_response("Ikke autoriseret", 401)
    if token_user_id != user_id:
        return error_response("Ingen adgang", 403)

    conn, cursor = None, None
    try:
        conn, cursor = db()
        user = _fetch_user_by_id(cursor, user_id)
        if not user:
            return error_response("Bruger ikke fundet", 404)
        return jsonify(_public_user(user))
    except Exception as e:
        if hasattr(e, "args") and len(e.args) > 1 and e.args[1] == 500:
            message = str(e.args[0])
        else:
            message = "Kunne ikke hente bruger"
        return error_response(message, 503)
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


@bp.put("/<user_id>")
def update_user(user_id):
    """PUT /api/users/<user_id>
    Updates the user's name, email, phone, and optionally password.
    Requires a Bearer token that matches user_id."""
    token_user_id = _bearer_user_id()
    if not token_user_id:
        return error_response("Ikke autoriseret", 401)
    if token_user_id != user_id:
        return error_response("Ingen adgang", 403)

    data = json_body()
    try:
        firstname = validate_firstname(data.get("user_firstname", ""))
        lastname = validate_lastname(data.get("user_lastname", ""))
        email = validate_email(data.get("user_email", ""))
        phone = validate_phone(data.get("user_phone", ""))
    except ValueError as e:
        return error_response(str(e), 400)
    new_password = (data.get("user_password") or "").strip()

    conn, cursor = None, None
    try:
        conn, cursor = db()

        if new_password:
            try:
                new_password = validate_password(new_password)
            except ValueError as e:
                return error_response(str(e), 400)
            password_hash = generate_password_hash(new_password, method="pbkdf2:sha256")
            cursor.execute(
                """
                UPDATE users SET user_firstname=%s, user_lastname=%s, user_email=%s,
                    user_phone=%s, user_password_hashed=%s, user_updated_at=%s
                WHERE user_id=%s AND user_deleted_at IS NULL
                """,
                (firstname, lastname, email, phone, password_hash, datetime.utcnow(), user_id),
            )
        else:
            cursor.execute(
                """
                UPDATE users SET user_firstname=%s, user_lastname=%s, user_email=%s,
                    user_phone=%s, user_updated_at=%s
                WHERE user_id=%s AND user_deleted_at IS NULL
                """,
                (firstname, lastname, email, phone, datetime.utcnow(), user_id),
            )

        conn.commit()
        if cursor.rowcount == 0:
            return error_response("Bruger ikke fundet", 404)

        user = _fetch_user_by_id(cursor, user_id)
        return jsonify(_public_user(user))
    except Exception as e:
        if conn:
            conn.rollback()
        return error_response("Kunne ikke opdatere bruger", 503)
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


@bp.delete("/<user_id>")
def delete_user(user_id):
    """DELETE /api/users/<user_id>
    Soft-deletes the user by setting user_deleted_at. The row stays in the database.
    Requires a Bearer token that matches user_id."""
    token_user_id = _bearer_user_id()
    if not token_user_id:
        return error_response("Ikke autoriseret", 401)
    if token_user_id != user_id:
        return error_response("Ingen adgang", 403)

    conn, cursor = None, None
    try:
        conn, cursor = db()
        cursor.execute(
            "UPDATE users SET user_deleted_at=%s WHERE user_id=%s AND user_deleted_at IS NULL",
            (datetime.utcnow(), user_id),
        )
        conn.commit()
        if cursor.rowcount == 0:
            return error_response("Bruger ikke fundet", 404)
        return jsonify({"message": "Bruger slettet"})
    except Exception:
        if conn:
            conn.rollback()
        return error_response("Kunne ikke slette bruger", 503)
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


@bp.get("/<user_id>/subscriptions")
def get_user_subscriptions(user_id):
    """GET /api/users/<user_id>/subscriptions
    Returns all subscriptions linked to the user's cars, including car name and license plate.
    Requires a Bearer token that matches user_id."""
    token_user_id = _bearer_user_id()
    if not token_user_id:
        return error_response("Ikke autoriseret", 401)
    if token_user_id != user_id:
        return error_response("Ingen adgang", 403)

    conn, cursor = None, None
    try:
        conn, cursor = db()
        cursor.execute(
            """
            SELECT s.subscription_id, s.product_id, s.car_id, s.subscriptions_name,
                   s.subscriptions_price, s.subscriptions_status, s.subscriptions_start_date,
                   s.subscriptions_end_date, s.subscriptions_next_billing_date,
                   c.car_name, c.car_license_plate
            FROM subscriptions s
            JOIN cars c ON s.car_id = c.car_id
            WHERE c.user_id = %s
            ORDER BY s.subscriptions_start_date DESC
            """,
            (user_id,),
        )
        rows = cursor.fetchall()
        return jsonify({"subscriptions": [row_to_json(r) for r in rows]})
    except Exception as e:
        return error_response("Kunne ikke hente abonnementer", 503)
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


@bp.get("/<user_id>/favorites")
def get_favorites(user_id):
    """GET /api/users/<user_id>/favorites
    Returns a list of location IDs the user has saved as favorites.
    Requires a Bearer token that matches user_id."""
    token_user_id = _bearer_user_id()
    if not token_user_id:
        return error_response("Ikke autoriseret", 401)
    if token_user_id != user_id:
        return error_response("Ingen adgang", 403)

    conn, cursor = None, None
    try:
        conn, cursor = db()
        cursor.execute(
            "SELECT location_fk FROM favorites WHERE user_fk = %s",
            (user_id,),
        )
        rows = cursor.fetchall()
        return jsonify({"favorites": [r["location_fk"] for r in rows]})
    except Exception:
        return error_response("Kunne ikke hente favoritter", 503)
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


@bp.post("/<user_id>/favorites")
def add_favorite(user_id):
    """POST /api/users/<user_id>/favorites
    Adds a location to the user's favorites. Returns 200 silently if already added.
    Requires a Bearer token that matches user_id. Body: { location_id }"""
    token_user_id = _bearer_user_id()
    if not token_user_id:
        return error_response("Ikke autoriseret", 401)
    if token_user_id != user_id:
        return error_response("Ingen adgang", 403)

    data = json_body()
    location_id = (data.get("location_id") or "").strip()
    if not location_id:
        return error_response("location_id mangler", 400)

    conn, cursor = None, None
    try:
        conn, cursor = db()
        cursor.execute(
            "SELECT favorites_id FROM favorites WHERE user_fk = %s AND location_fk = %s",
            (user_id, location_id),
        )
        if cursor.fetchone():
            return jsonify({"message": "Allerede favorit"}), 200

        cursor.execute(
            "INSERT INTO favorites (favorites_id, user_fk, location_fk) VALUES (%s, %s, %s)",
            (uuid.uuid4().hex, user_id, location_id),
        )
        conn.commit()
        return jsonify({"message": "Favorit tilføjet"}), 201
    except Exception:
        if conn:
            conn.rollback()
        return error_response("Kunne ikke tilføje favorit", 503)
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


@bp.delete("/<user_id>/favorites/<location_id>")
def remove_favorite(user_id, location_id):
    """DELETE /api/users/<user_id>/favorites/<location_id>
    Removes a location from the user's favorites.
    Requires a Bearer token that matches user_id."""
    token_user_id = _bearer_user_id()
    if not token_user_id:
        return error_response("Ikke autoriseret", 401)
    if token_user_id != user_id:
        return error_response("Ingen adgang", 403)

    conn, cursor = None, None
    try:
        conn, cursor = db()
        cursor.execute(
            "DELETE FROM favorites WHERE user_fk = %s AND location_fk = %s",
            (user_id, location_id),
        )
        conn.commit()
        return jsonify({"message": "Favorit fjernet"})
    except Exception:
        if conn:
            conn.rollback()
        return error_response("Kunne ikke fjerne favorit", 503)
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
