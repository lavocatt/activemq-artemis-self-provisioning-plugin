#!/bin/bash
echo "=== Initial cleanup before test ==="
sudo journalctl --vacuum-time=1s || true
sudo rm -rf /tmp/* || true
npm cache clean --force || true
echo "=== Disk space before test ==="
df -h
du -sh /var/lib/containers/* 2>/dev/null || true
du -sh ~/.local/share/containers/* 2>/dev/null || true
sudo kill $(sudo lsof -t -i:9000) || true
sleep 5
