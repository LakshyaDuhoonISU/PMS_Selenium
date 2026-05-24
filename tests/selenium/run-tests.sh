#!/usr/bin/env bash
set -euo pipefail

# Wrapper to run Selenium Maven tests in a graphical display.
# If $DISPLAY is not available, tries to use xvfb-run. Pass -Dheadless=false to Maven
# to run with real browser (non-headless).

ROOT_DIR=$(cd "$(dirname "$0")" && pwd)
cd "$ROOT_DIR"

BASE_CMD=(mvn -DskipTests=false)

# Accept custom baseUrl and headless via environment or properties
BASE_URL_FLAG=${BASE_URL:-}
if [ -n "$BASE_URL_FLAG" ]; then
  BASE_CMD+=("-DbaseUrl=$BASE_URL_FLAG")
fi

if command -v xvfb-run >/dev/null 2>&1; then
  if [ -z "${DISPLAY:-}" ]; then
    echo "No DISPLAY. Running tests under Xvfb..."
    exec xvfb-run -a mvn -Dheadless=false test
  fi
fi

echo "DISPLAY is set, running tests with real browser"
exec mvn -Dheadless=false test
