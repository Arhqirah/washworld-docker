# Promotional offers — read-only, no authentication required.
# Prefix: /api

from flask import Blueprint, jsonify

from routes.api_common import apply_cors, row_to_json
from x import db

bp = Blueprint("offers_api", __name__, url_prefix="/api")


@bp.after_request
def _cors(response):
    # Adds CORS headers to all offer responses.
    return apply_cors(response)


@bp.get("/offers")
def list_offers():
    """GET /api/offers
    Returns currently active promotional offers — those where today's date falls
    between offer_start_date and offer_end_date.
    Each offer includes a description, discount percentage, and an image URL/path."""
    conn, cursor = None, None
    try:
        conn, cursor = db()
        cursor.execute(
            """
            SELECT offer_id, product_id, offer_description, offer_discount_percentage,
                   offer_start_date, offer_end_date, offer_photo_url
            FROM offers
            WHERE CURDATE() >= DATE(offer_start_date)
              AND CURDATE() <= DATE(offer_end_date)
            ORDER BY offer_start_date DESC
            """
        )
        rows = cursor.fetchall()
        return jsonify({"offers": [row_to_json(r) for r in rows]})
    except Exception as e:
        print(f"Offers error: {e}", flush=True)
        return jsonify({"error": "Kunne ikke hente tilbud"}), 503
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
