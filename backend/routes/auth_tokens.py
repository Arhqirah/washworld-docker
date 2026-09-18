# JWT token creation and validation.
# Used by auth_api.py (to create tokens on login) and users_api.py / cars_api.py (to validate tokens on protected routes).

from datetime import datetime, timedelta, timezone
from typing import Optional

import jwt
from flask import current_app

# Tokens are valid for 7 days.
TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 7
ALGORITHM = "HS256"


def _secret() -> str:
    """Returns the app SECRET_KEY used to sign and verify tokens."""
    return current_app.config["SECRET_KEY"]


def create_access_token(user_id: str) -> str:
    """Creates a signed JWT containing the user_id as the 'sub' claim.
    Called in auth_api.login after successful credential verification."""
    now = datetime.now(timezone.utc)
    payload = {
        "sub": user_id,
        "iat": now,
        "exp": now + timedelta(seconds=TOKEN_MAX_AGE_SECONDS),
    }
    return jwt.encode(payload, _secret(), algorithm=ALGORITHM)


def load_user_id_from_token(token: str) -> Optional[str]:
    """Decodes a JWT and returns the user_id (sub claim).
    Returns None if the token is missing, expired, or has an invalid signature.
    Called by _bearer_user_id() in users_api and cars_api to authenticate requests."""
    if not token:
        return None
    try:
        payload = jwt.decode(token, _secret(), algorithms=[ALGORITHM])
        return payload.get("sub")
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None
