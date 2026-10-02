# ---- Stage 1: install dependencies ----
FROM python:3.9-slim AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# ---- Stage 2: minimal runtime image ----
FROM python:3.9-slim
WORKDIR /app
ENV FLASK_APP=app.py

# Rootless: create a dedicated non-root user with its own home directory
RUN addgroup --system appgroup \
    && adduser --system --home /home/appuser --ingroup appgroup appuser

# Bring in only the installed packages from the builder stage (no pip cache,
# no build tools left behind)
COPY --from=builder /root/.local /home/appuser/.local
ENV PATH=/home/appuser/.local/bin:$PATH

COPY . .
RUN chown -R appuser:appgroup /app /home/appuser

USER appuser

CMD flask run --host=0.0.0.0 --port=${PORT:-8080}
