# Wash history (wash log) — records and retrieves car wash sessions.
# Prefix: /api

from datetime import datetime
import uuid

from icecream import ic
from flask import Blueprint, jsonify, request

from routes.api_common import apply_cors
from x import db


bp = Blueprint("wash_log_api", __name__, url_prefix="/api")


@bp.after_request
def _cors(response):
    # Adds CORS headers to all wash log responses.
    return apply_cors(response)


@bp.get("/wash_log")
def get_wash_log():
    """GET /api/wash_log?user_id=<user_id>
    Returns the full wash history for all cars owned by the user.
    Joins cars, products, and locations so each entry includes car plate,
    product name and price, and the location name and address.
    Uses COALESCE so a per-wash override price takes precedence over the product price."""
    conn, cursor = None, None

    try:
        user_id = request.args.get("user_id", "").strip()

        if not user_id:
            return jsonify({"error": "user_id is required"}), 400

        conn, cursor = db()

        cursor.execute(
            """
            SELECT
                wash_log.wash_log_id,
                wash_log.wash_log_start_time,

                cars.car_id,
                cars.car_license_plate,

                products.product_id,
                products.product_name,
                COALESCE(wash_log.wash_log_price, products.product_price) AS product_price,

                locations.location_id,
                locations.location_name,
                locations.location_address,
                locations.location_zipcode

            FROM wash_log

            INNER JOIN cars
                ON wash_log.car_id = cars.car_id

            LEFT JOIN products
                ON wash_log.product_id = products.product_id

            LEFT JOIN locations
                ON wash_log.location_id = locations.location_id

            WHERE cars.user_id = %s

            ORDER BY wash_log.wash_log_start_time DESC
            """,
            (user_id,),
        )

        rows = cursor.fetchall()

        return jsonify({"wash_log": [dict(row) for row in rows]})

    except Exception as ex:
        ic(ex)
        return jsonify({"error": "Could not load wash log"}), 503

    finally:
        if cursor:
            cursor.close()

        if conn:
            conn.close()


@bp.post("/wash_log")
def create_wash_log():
    """POST /api/wash_log
    Records a new wash session. car_id is required.
    product_id, location_id, and wash_log_price are optional —
    if wash_log_price is omitted, the product's default price is used when the log is read."""
    conn, cursor = None, None

    try:
        data = request.get_json(silent=True) or {}

        car_id = str(data.get("car_id", "")).strip()
        product_id = str(data.get("product_id", "")).strip()
        location_id = str(data.get("location_id", "")).strip()
        wash_log_price_raw = data.get("wash_log_price")
        # Store None if no price override is provided; the GET endpoint falls back to product price.
        wash_log_price = float(wash_log_price_raw) if wash_log_price_raw is not None else None

        if not car_id:
            return jsonify({"error": "Missing car id"}), 400

        wash_log_id = uuid.uuid4().hex
        wash_log_start_time = datetime.now()

        conn, cursor = db()

        cursor.execute(
            """
            INSERT INTO wash_log (
                wash_log_id,
                car_id,
                product_id,
                location_id,
                wash_log_start_time,
                wash_log_price
            )
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (
                wash_log_id,
                car_id,
                product_id if product_id else None,
                location_id if location_id else None,
                wash_log_start_time,
                wash_log_price,
            ),
        )

        conn.commit()

        return jsonify(
            {
                "message": "Wash log created successfully",
                "wash_log_id": wash_log_id,
            }
        ), 201

    except Exception as ex:
        ic(ex)
        return jsonify({"error": "Could not create wash log"}), 503

    finally:
        if cursor:
            cursor.close()

        if conn:
            conn.close()
