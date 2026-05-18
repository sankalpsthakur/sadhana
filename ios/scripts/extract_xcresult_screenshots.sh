#!/usr/bin/env bash
# extract_xcresult_screenshots.sh
#
# Walks an .xcresult bundle and extracts every PNG attachment whose name
# starts with "journey-" into qa-results/2026051810/. Used after
# `xcodebuild test` to satisfy the deliverable
#     qa-results/2026051810/<journey>.png
# from the journey-acceptance task brief.
#
# Usage:
#   ios/scripts/extract_xcresult_screenshots.sh path/to/Test.xcresult qa-results/2026051810
#
# Requires Xcode 16+ (xcresulttool subcommands).

set -euo pipefail

XCRESULT_PATH="${1:-}"
OUT_DIR="${2:-qa-results/2026051810}"

if [[ -z "${XCRESULT_PATH}" ]]; then
  echo "usage: $0 <Test.xcresult> [out_dir]"
  exit 1
fi

if [[ ! -d "${XCRESULT_PATH}" ]]; then
  echo "[err] xcresult bundle not found: ${XCRESULT_PATH}"
  exit 1
fi

mkdir -p "${OUT_DIR}"

# xcresulttool gained a `--legacy` requirement in Xcode 16; we keep that
# branch on but fall through to the new API if the legacy flag is rejected.
JSON=""
if JSON=$(xcrun xcresulttool get --legacy --format json --path "${XCRESULT_PATH}" 2>/dev/null); then
  :
else
  JSON=$(xcrun xcresulttool get --format json --path "${XCRESULT_PATH}")
fi

# Walk the tree looking for attachment payloads with names starting with
# "journey-". The structure is:
#   actions > runDestinations > ... > activities[*].attachments[*]
# Quick path: pipe through python for resilience to the (deep) shape.

python3 - "${XCRESULT_PATH}" "${OUT_DIR}" <<'PY'
import json
import os
import subprocess
import sys

xcresult = sys.argv[1]
out_dir = sys.argv[2]
os.makedirs(out_dir, exist_ok=True)

def _val(node, key, default=None):
    if not isinstance(node, dict): return default
    v = node.get(key)
    if isinstance(v, dict) and '_value' in v: return v['_value']
    if isinstance(v, dict) and '_values' in v: return v['_values']
    return v if v is not None else default

def run_xcresult(*args):
    try:
        return subprocess.check_output(args, stderr=subprocess.DEVNULL)
    except subprocess.CalledProcessError:
        return None

def get_json(path_ref):
    raw = run_xcresult('xcrun', 'xcresulttool', 'get', '--legacy', '--format', 'json', '--path', xcresult, '--id', path_ref)
    if raw is None:
        raw = run_xcresult('xcrun', 'xcresulttool', 'get', '--format', 'json', '--path', xcresult, '--id', path_ref)
    return json.loads(raw) if raw else None

def export(ref, out_path):
    return subprocess.call([
        'xcrun', 'xcresulttool', 'export', '--legacy', '--type', 'file',
        '--path', xcresult, '--id', ref, '--output-path', out_path
    ], stderr=subprocess.DEVNULL) == 0 or subprocess.call([
        'xcrun', 'xcresulttool', 'export', '--type', 'file',
        '--path', xcresult, '--id', ref, '--output-path', out_path
    ], stderr=subprocess.DEVNULL) == 0

raw = subprocess.check_output(['xcrun', 'xcresulttool', 'get', '--legacy', '--format', 'json', '--path', xcresult],
                              stderr=subprocess.DEVNULL)
root = json.loads(raw)

count = 0
seen = set()

def walk(node):
    global count
    if isinstance(node, dict):
        name = _val(node, 'name')
        ref_node = node.get('payloadRef') or node.get('reference')
        ref = None
        if isinstance(ref_node, dict):
            ref = _val(ref_node, 'id')
        if name and isinstance(name, str) and name.startswith('journey-') and ref and ref not in seen:
            seen.add(ref)
            out = os.path.join(out_dir, f'{name.replace("journey-", "")}.png')
            if export(ref, out):
                print(f'[ok] wrote {out}')
                count += 1
            else:
                print(f'[err] could not export {name} (ref={ref})')
        for v in node.values():
            walk(v)
    elif isinstance(node, list):
        for v in node:
            walk(v)

walk(root)
print(f'[done] extracted {count} screenshot(s) -> {out_dir}')
PY
