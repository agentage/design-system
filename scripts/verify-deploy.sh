#!/usr/bin/env bash
# Verify the deployed showcase from the public edge after `docker stack deploy`.
#   1. Serves-this-commit - the image bakes COMMIT_SHA into /health, so a failed
#      rollout (Swarm keeps the OLD task serving) can't pass silently. Prefix match.
#   2. Renders - the SPA shell is really there, not just a live health file.
# Ordered commit-first on purpose: the content grep alone is fail-open, since the
# previous container answers it just as happily as the new one.
set -euo pipefail

SITE_FQDN="${SITE_FQDN:-ds.agentage.io}"
want="${COMMIT_SHA:?COMMIT_SHA required}"

# Synthetic deploy probes are service traffic: the edge classifier tags them
# user_type=service instead of guessing 'user'/'bot' from the user agent.
svc_hdr=(-H 'X-Client-Type: service')

# grep, not jq/python: the payload is a flat static file and the runner is
# guaranteed nothing beyond coreutils + curl.
read_commit() {
  curl -sf "${svc_hdr[@]}" "https://${SITE_FQDN}/health" 2>/dev/null |
    grep -o '"commit":"[0-9a-f]\{7,40\}"' | cut -d'"' -f4 || true
}

echo "-- serves-this-commit --"
ok=
for i in $(seq 1 30); do
  got="$(read_commit)"
  case "${want}" in
    "${got:-__none__}"*)
      echo "PASS showcase serving ${got}"
      ok=1
      break
      ;;
  esac
  echo "  attempt $i/30: showcase commit='${got:-<none>}' want='${want:0:12}...'"
  [ "$i" -lt 30 ] && sleep 10
done
[ -n "$ok" ] || {
  echo "::error::${SITE_FQDN} is not serving ${want} (stale task - rollout did not land)"
  exit 1
}

echo "-- renders --"
curl -fsS "${svc_hdr[@]}" "https://${SITE_FQDN}/" | grep -q "Agentage Design System" || {
  echo "::error::${SITE_FQDN} answered /health but did not render the showcase"
  exit 1
}
echo "PASS showcase renders"

echo "Deploy verified against ${SITE_FQDN} (commit ${want:0:12}...)."
