#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PYTHON_BINDING_DIR="$ROOT_DIR/python-binding"
TMP_DIR="$(mktemp -d)"

cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

python3 -m venv "$TMP_DIR/venv"
# shellcheck disable=SC1091
source "$TMP_DIR/venv/bin/activate"

python -m pip install -q --upgrade pip pytest
cd "$PYTHON_BINDING_DIR"
python -m pytest tests/ -v
