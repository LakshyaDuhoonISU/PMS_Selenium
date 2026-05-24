#!/usr/bin/env bash
set -euo pipefail

# Wrapper to run Selenium Maven tests in a graphical display.
# If $DISPLAY is not available, tries to use xvfb-run. Pass -Dheadless=false to Maven
# to run with real browser (non-headless). Additional Maven args are forwarded.

ROOT_DIR=$(cd "$(dirname "$0")" && pwd)
cd "$ROOT_DIR"

echo "== run-tests.sh starting =="
echo "PWD: $(pwd)"
echo "DISPLAY: ${DISPLAY:-<not set>}"

# Print Chrome/Chromium if available for diagnostics
if command -v google-chrome >/dev/null 2>&1; then
  echo "google-chrome: $(google-chrome --version)"
elif command -v chromium-browser >/dev/null 2>&1; then
  echo "chromium-browser: $(chromium-browser --version)"
elif command -v chromium >/dev/null 2>&1; then
  echo "chromium: $(chromium --version)"
else
  echo "No Chrome/Chromium binary found on PATH"
fi

# Forward any args to mvn, but ensure -Dheadless is set to false for interactive runs
MAVEN_ARGS=("$@")

# If -Dheadless is not explicitly present in args, default to false for interactive runs
if ! printf '%s\n' "${MAVEN_ARGS[@]}" | grep -q "-Dheadless="; then
  MAVEN_ARGS=("-Dheadless=false" "${MAVEN_ARGS[@]}")
fi

echo "Maven args: ${MAVEN_ARGS[*]}"

if command -v xvfb-run >/dev/null 2>&1; then
  if [ -z "${DISPLAY:-}" ]; then
    echo "No DISPLAY. Running tests under Xvfb via xvfb-run..."
    exec xvfb-run -a mvn "${MAVEN_ARGS[@]}" test
  fi
fi

echo "DISPLAY is set; running mvn with provided args"
exec mvn "${MAVEN_ARGS[@]}" test

