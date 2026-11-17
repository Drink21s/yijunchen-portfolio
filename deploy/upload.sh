#!/usr/bin/env bash
# ============================================================
# 一键上传网站到云服务器（在服务器上 git pull 之后运行）
# 适用于：服务器上已经 git clone 了本仓库到 /var/www/yijunchen
#
# 用法： bash deploy/upload.sh
# 作用： git 拉最新代码 → 把网页文件同步到 Nginx 目录 → 重载 Nginx
# ============================================================
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
WEB_DIR="${WEB_DIR:-/var/www/yijunchen}"

echo "==> 仓库目录：$REPO_DIR"
echo "==> 网站目录：$WEB_DIR"

cd "$REPO_DIR"
git pull --ff-only

sudo mkdir -p "$WEB_DIR"
# --delete 会删掉服务器上已经不存在于仓库的文件，保持和仓库一致
sudo rsync -av --delete \
  --exclude '.git' \
  --exclude 'docs' \
  --exclude 'deploy' \
  ./ "$WEB_DIR/"

sudo nginx -t
sudo systemctl reload nginx

echo "==> 部署完成。访问 http://$(hostname -I | awk '{print $1}')/"
