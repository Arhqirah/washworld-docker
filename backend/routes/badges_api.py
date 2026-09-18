from icecream import ic
from flask import Blueprint, jsonify, request

from routes.api_common import apply_cors, row_to_json
from x import db


bp = Blueprint("badges_api", __name__, url_prefix="/api")


@bp.after_request
def _cors(response):
    return apply_cors(response)


@bp.get("/badges")
def get_badges():
    conn, cursor = None, None

    try:

        user_id = request.args.get("user_id", "").strip()
        conn, cursor = db()

        if user_id:
            cursor.execute(
                """
                SELECT badge.badge_id, badge.badge_label, badge.badge_description, badge.badge_icon, COALESCE(user_badges.achieved, 0) AS achieved
                FROM badge
                LEFT JOIN user_badges ON badge.badge_id = user_badges.badges_fk AND user_badges.user_fk = %s ORDER BY badge.badge_label
                
                """,
                (user_id,),
            )
        else:
            cursor.execute(
                """
                SELECT badge_id, badge_label, badge_description, badge_icon, 0 AS achieved
                FROM badge ORDER BY badge_label
                """
            )

        rows = cursor.fetchall()

        return jsonify({"badges": [row_to_json(row) for row in rows]})

    except Exception as ex:
        ic(ex)
        return jsonify({"error": "Could not load badges"}), 503

    finally:
        if cursor:
            cursor.close()

        if conn:
            conn.close()



