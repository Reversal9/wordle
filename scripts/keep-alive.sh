#!/usr/bin/env bash
# Pings the Render backend to prevent free-tier spin-down.
# Frontend is a static CDN site and does not need pinging.
# Usage: BACKEND_URL=https://your-backend.onrender.com/api/word ./keep-alive.sh

BACKEND="${BACKEND_URL:-https://your-backend.onrender.com/api/word}"

response=$(curl -sf --max-time 15 "$BACKEND")
if [ $? -eq 0 ]; then
  echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) ok: $response"
else
  echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) FAILED: $BACKEND" >&2
fi
