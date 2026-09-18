# Subscription (service plan) management — no authentication required on these endpoints.
# Prefix: /api

import uuid

from icecream import ic
from flask import Blueprint, jsonify

from routes.api_common import apply_cors, error_response, json_body, row_to_json
from x import db


bp = Blueprint("subscriptions_api", __name__, url_prefix="/api")


@bp.after_request
def _cors(response):
    # Adds CORS headers to all subscription responses.
    return apply_cors(response)


@bp.get("/subscriptions")
def get_subscriptions():
    """GET /api/subscriptions
    Returns all subscriptions in the database regardless of status."""
    conn, cursor = None, None

    try:
        conn, cursor = db()

        cursor.execute(
            """
            SELECT subscription_id, product_id, car_id, location_id, subscriptions_name,
                   subscriptions_price, subscriptions_status, subscriptions_start_date,
                   subscriptions_end_date, subscriptions_next_billing_date
            FROM subscriptions
            """
        )

        rows = cursor.fetchall()

        return jsonify({"subscriptions": [row_to_json(r) for r in rows]})

    except Exception as ex:
        ic(ex)
        return jsonify({"error": "Could not load subscriptions"}), 503

    finally:
        if cursor:
            cursor.close()

        if conn:
            conn.close()


@bp.post("/subscriptions")
def create_subscription():
    """POST /api/subscriptions
    Creates a new subscription. product_id and car_id are optional (nullable in the DB).
    Required fields: subscription_name, subscription_price, subscription_status,
    subscription_start_date, subscription_end_date, subscription_next_billing_date."""
    conn, cursor = None, None
    try:
        data = json_body()
        # product_id and car_id are nullable in the DB — sent as None if empty.
        product_id = str(data.get("product_id", "")).strip() or None
        car_id = str(data.get("car_id", "")).strip() or None
        location_id = str(data.get("location_id", "")).strip() or None
        subscription_name = str(data.get("subscription_name", "")).strip()
        subscription_price = str(data.get("subscription_price", "")).strip()
        subscription_status = str(data.get("subscription_status", "")).strip()
        subscription_start_date = str(data.get("subscription_start_date", "")).strip()
        subscription_end_date = str(data.get("subscription_end_date", "")).strip()
        subscription_next_billing_date = str(data.get("subscription_next_billing_date", "")).strip()

        if not subscription_name:
            return error_response("Mangler abonnementsnavn", 400)
        if not subscription_price:
            return error_response("Mangler pris", 400)
        if not subscription_status:
            return error_response("Mangler status", 400)
        if not subscription_start_date:
            return error_response("Mangler startdato", 400)
        if not subscription_end_date:
            return error_response("Mangler slutdato", 400)
        if not subscription_next_billing_date:
            return error_response("Mangler næste faktureringsdato", 400)

        subscription_id = uuid.uuid4().hex
        conn, cursor = db()
        cursor.execute(
            """
            INSERT INTO subscriptions (
                subscription_id, product_id, car_id, location_id, subscriptions_name,
                subscriptions_price, subscriptions_status, subscriptions_start_date,
                subscriptions_end_date, subscriptions_next_billing_date
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (
                subscription_id, product_id, car_id, location_id, subscription_name,
                subscription_price, subscription_status, subscription_start_date,
                subscription_end_date, subscription_next_billing_date,
            ),
        )
        conn.commit()
        return jsonify({"message": "Abonnement oprettet", "subscription_id": subscription_id}), 201
    except Exception as ex:
        ic(ex)
        if conn:
            conn.rollback()
        return error_response("Kunne ikke oprette abonnement", 503)
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


@bp.delete("/subscriptions/<subscription_id>")
def delete_subscription(subscription_id):
    """DELETE /api/subscriptions/<subscription_id>
    Permanently removes a subscription from the database."""
    conn, cursor = None, None
    try:
        subscription_id = (subscription_id or "").strip()
        if not subscription_id:
            return error_response("Mangler subscription id", 400)

        conn, cursor = db()
        cursor.execute(
            "DELETE FROM subscriptions WHERE subscription_id = %s",
            (subscription_id,),
        )
        conn.commit()

        if cursor.rowcount == 0:
            return error_response("Abonnement ikke fundet", 404)
        return jsonify({"message": "Abonnement slettet"})
    except Exception as ex:
        ic(ex)
        if conn:
            conn.rollback()
        return error_response("Kunne ikke slette abonnement", 503)
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


@bp.put("/subscriptions/<subscription_id>")
def update_subscription(subscription_id):
    """PUT /api/subscriptions/<subscription_id>
    Updates the status, end date, and next billing date of a subscription.
    All three fields are required."""
    conn, cursor = None, None
    try:
        subscription_id = (subscription_id or "").strip()
        if not subscription_id:
            return error_response("Mangler subscription id", 400)

        data = json_body()
        subscription_status = str(data.get("subscription_status", "")).strip()
        subscription_end_date = str(data.get("subscription_end_date", "")).strip()
        subscription_next_billing_date = str(data.get("subscription_next_billing_date", "")).strip()

        if not subscription_status:
            return error_response("Mangler status", 400)
        if not subscription_end_date:
            return error_response("Mangler slutdato", 400)
        if not subscription_next_billing_date:
            return error_response("Mangler næste faktureringsdato", 400)

        conn, cursor = db()
        cursor.execute(
            """
            UPDATE subscriptions
            SET subscriptions_status = %s,
                subscriptions_end_date = %s,
                subscriptions_next_billing_date = %s
            WHERE subscription_id = %s
            """,
            (subscription_status, subscription_end_date, subscription_next_billing_date, subscription_id),
        )
        conn.commit()

        if cursor.rowcount == 0:
            return error_response("Abonnement ikke fundet", 404)
        return jsonify({"message": "Abonnement opdateret"})
    except Exception as ex:
        ic(ex)
        if conn:
            conn.rollback()
        return error_response("Kunne ikke opdatere abonnement", 503)
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
