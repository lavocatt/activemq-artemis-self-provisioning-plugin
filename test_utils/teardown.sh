#!/bin/bash
set +e  # Don't fail on cleanup errors
rm -rf test-results/ playwright-report/ || true
CONSOLE_PID=$(sudo lsof -t -i:9000)
if [ ! -z "$CONSOLE_PID" ]; then sudo kill $CONSOLE_PID; fi
sleep 2
if [ ! -z "$CONSOLE_CONTAINER" ]; then docker stop $CONSOLE_CONTAINER; docker rm $CONSOLE_CONTAINER; fi
docker rmi -f quay.io/openshift/origin-console:latest || true
docker system prune -af --volumes || true
sudo podman system prune -af --volumes || true
sudo rm -rf ~/.local/share/containers/storage/overlay/* || true
sudo journalctl --vacuum-size=50M || true
set -e  # Re-enable exit on error
echo "=== Disk space after cleanup ==="
df -h
echo "=== Container storage usage ==="
du -sh /var/lib/containers/* 2>/dev/null || true
