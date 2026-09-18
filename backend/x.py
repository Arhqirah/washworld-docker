import os
import re
import smtplib
import uuid
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from time import time

import mysql.connector


# --- URL helpers ---

def get_frontend_url() -> str:
    url = (os.environ.get("FRONTEND_URL") or "").strip().rstrip("/")
    if not url:
        raise Exception(
            "FRONTEND_URL er ikke sat i .env (fx http://localhost:3000 eller http://192.168.10.132:3000)",
            500,
        )
    return url


def get_backend_url() -> str:
    url = (os.environ.get("BACKEND_URL") or "").strip().rstrip("/")
    if not url:
        raise Exception(
            "BACKEND_URL er ikke sat i .env (fx http://localhost eller http://192.168.10.132)",
            500,
        )
    return url


# --- Database ---

def db():
    try:
        connection = mysql.connector.connect(
            host=os.environ.get("MYSQL_HOST", "mariadb"),
            port=int(os.environ.get("MYSQL_PORT", 3306)),
            user=os.environ["MYSQL_USER"],
            password=os.environ["MYSQL_PASSWORD"],
            database=os.environ["MYSQL_DATABASE"],
            charset="utf8mb4",
        )
        cursor = connection.cursor(dictionary=True)
        return connection, cursor
    except Exception as e:
        print(e, flush=True)
        raise Exception("Database under maintenance", 500)


# --- Validators ---
# All raise ValueError(message) so callers can catch and return an error_response.

_REGEX_EMAIL = r"^[^@\s]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$"


def validate_email(email: str) -> str:
    email = (email or "").strip()
    if not re.match(_REGEX_EMAIL, email):
        raise ValueError("Ugyldig email")
    return email


def validate_password(password: str) -> str:
    password = (password or "").strip()
    if len(password) < 8 or len(password) > 50:
        raise ValueError("Kodeord skal være 8–50 tegn")
    return password


def validate_firstname(value: str) -> str:
    value = (value or "").strip()
    if len(value) < 2 or len(value) > 50:
        raise ValueError("Fornavn skal være 2–50 tegn")
    return value


def validate_lastname(value: str) -> str:
    value = (value or "").strip()
    if len(value) < 2 or len(value) > 50:
        raise ValueError("Efternavn skal være 2–50 tegn")
    return value


def validate_phone(value: str) -> str:
    value = (value or "").strip()
    if len(value) > 20:
        raise ValueError("Telefonnummer er for langt")
    return value


# --- Email ---

def send_verification_email(receiver_email, firstname, verification_key):
    try:
        sender_email = "washworldtest2026@gmail.com"
        password = "cfbx erul ezpe ksuj"
        verification_link = f"{get_backend_url()}/api/auth/verify/{verification_key}"

        message = MIMEMultipart()
        message["From"] = "WashWorld <washworldtest2026@gmail.com>"
        message["To"] = receiver_email
        message["Subject"] = "Please verify your account"

        body = f"""<div style="font-family: Gilroy, Arial, sans-serif; line-height: 1.5; color: #333; padding: 20px; background-color: #f9f9f9; border-radius: 10px; max-width: 600px; margin: auto;">
                <h1>Welcome to WashWorld</h1>
                    <h1>Hi {firstname}</h1>

                    <p>We're excited to have you on board. Please verify your account to get started.</p>

                    <p>You can verify your account by clicking the link below:</p>
                    <h2>
                        <a href="{verification_link}"
                            style="
                            display: inline-block;
                            background-color: #06C167;
                            color: white;
                            padding: 10px 8px;
                            text-decoration: none;
                            font-weight: bold;
                            ">
                            Verify Account
                        </a>
                    </h2>

                    <p>If the button above does not work, please copy and paste the following link into your browser:</p>
                    <p><a href="{verification_link}">{verification_link}</a></p>
                   </div>"""
        message.attach(MIMEText(body, "html"))

        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(sender_email, password)
            server.sendmail(sender_email, receiver_email, message.as_string())
        print("Verification email sent successfully!", flush=True)
        return "email sent"

    except Exception as ex:
        print(ex, flush=True)
        raise Exception("Failed to send verification email", 500)


def send_reset_password_email(receiver_email, firstname, reset_key):
    try:
        sender_email = "washworldtest2026@gmail.com"
        password = "cfbx erul ezpe ksuj"
        reset_link = f"{get_frontend_url()}/reset-password/confirm?key={reset_key}"

        message = MIMEMultipart()
        message["From"] = "WashWorld <washworldtest2026@gmail.com>"
        message["To"] = receiver_email
        message["Subject"] = "Nulstil din adgangskode"

        body = f"""<div style="font-family: Gilroy, Arial, sans-serif; line-height: 1.5; color: #333; padding: 20px; background-color: #f9f9f9; border-radius: 10px; max-width: 600px; margin: auto;">
                <h1>WashWorld</h1>
                <h1>Hej {firstname}</h1>

                <p>Vi har modtaget en anmodning om at nulstille adgangskoden til din WashWorld-konto.</p>
                <p>Klik på knappen nedenfor for at vælge en ny adgangskode. Linket udløber om 15 minutter.</p>

                <h2>
                    <a href="{reset_link}"
                        style="
                        display: inline-block;
                        background-color: #06C167;
                        color: white;
                        padding: 10px 8px;
                        text-decoration: none;
                        font-weight: bold;
                        ">
                        Nulstil adgangskode
                    </a>
                </h2>

                <p>Hvis knappen ikke virker, kopiér og indsæt dette link i din browser:</p>
                <p><a href="{reset_link}">{reset_link}</a></p>

                <p>Hvis du ikke har anmodet om at nulstille din adgangskode, kan du se bort fra denne email.</p>
               </div>"""
        message.attach(MIMEText(body, "html"))

        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(sender_email, password)
            server.sendmail(sender_email, receiver_email, message.as_string())
        print("Reset password email sent successfully!", flush=True)
        return "email sent"

    except Exception as ex:
        print(ex, flush=True)
        raise Exception("Failed to send reset password email", 500)


# --- Password reset keys ---

_REGEX_RESET_KEY = r"^[a-f0-9]{64}:[0-9]{10}$"
RESET_PASSWORD_TTL_SECONDS = 900  # 15 minutes


def make_reset_password_key():
    random_key = uuid.uuid4().hex + uuid.uuid4().hex
    expires_at = int(time()) + RESET_PASSWORD_TTL_SECONDS
    return f"{random_key}:{expires_at}"


def _parse_reset_password_key(reset_key):
    reset_key = str(reset_key).strip()
    if not re.match(_REGEX_RESET_KEY, reset_key):
        raise Exception("company_exception reset_password_key invalid")
    random_key, expires_at = reset_key.split(":")
    return random_key, int(expires_at)


def is_reset_password_key_expired(reset_key):
    _, expires_at = _parse_reset_password_key(reset_key)
    return int(time()) > expires_at
