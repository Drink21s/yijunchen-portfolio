#!/usr/bin/env bash
# ============================================================
# 易俊臣个人网站 · 服务器一键初始化脚本
# 作用：在全新 Ubuntu 服务器上，从零搭建 Nginx + 部署网站
#
# 用法（在服务器上，以 root 运行）：
#   sudo bash setup-server.sh
#
# 前置：服务器安全组/防火墙已放行 22、80、443 端口
# 支持：Ubuntu 20.04 / 22.04 / 24.04
# ============================================================
set -euo pipefail

# ---------- 可配置项 ----------
GIT_REPO="https://github.com/你的用户名/yijunchen-portfolio.git"   # TODO: 改成你的真实仓库地址
WEB_DIR="/var/www/yijunchen"
SITE_CONF="/etc/nginx/sites-available/yijunchen"
# ------------------------------

echo "=============================================="
echo " 易俊臣个人网站 · 服务器初始化"
echo "=============================================="

# 0. 校验 root 权限
if [[ "$(id -u)" -ne 0 ]]; then
  echo "✗ 请用 root 运行：sudo bash setup-server.sh"
  exit 1
fi

# 1. 更新软件源
echo "==> [1/6] 更新软件源 ..."
apt update -y && apt upgrade -y

# 2. 安装 Nginx + Git
echo "==> [2/6] 安装 Nginx 与 Git ..."
apt install -y nginx git rsync

# 3. 拉取网站代码
echo "==> [3/6] 拉取网站代码 ..."
if [[ -d "$WEB_DIR/.git" ]]; then
  echo "    仓库已存在，改为 git pull"
  git -C "$WEB_DIR" pull --ff-only || true
else
  git clone "$GIT_REPO" "$WEB_DIR"
fi

# 4. 配置 Nginx 站点（优先用仓库里的 deploy/nginx.conf）
echo "==> [4/6] 配置 Nginx 站点 ..."
if [[ -f "$WEB_DIR/deploy/nginx.conf" ]]; then
  cp "$WEB_DIR/deploy/nginx.conf" "$SITE_CONF"
else
  echo "    ⚠ 未找到 deploy/nginx.conf，请手动编写站点配置"
fi

# 5. 启用站点、移除默认站点
echo "==> [5/6] 启用站点 ..."
ln -sf "$SITE_CONF" /etc/nginx/sites-enabled/yijunchen
rm -f /etc/nginx/sites-enabled/default

# 6. 校验并重载
echo "==> [6/6] 校验配置并启动 Nginx ..."
nginx -t
systemctl enable --now nginx
systemctl reload nginx

# 7. 放行防火墙（如果 ufw 在运行）
if command -v ufw >/dev/null 2>&1 && ufw status | grep -q "Status: active"; then
  echo "==> 放行 ufw 防火墙 80/443 ..."
  ufw allow 'Nginx Full' || true
fi

IP=$(hostname -I | awk '{print $1}')
echo ""
echo "=============================================="
echo " ✅ 初始化完成！"
echo "    访问地址： http://$IP/"
echo "    如打不开，请检查云控制台的「安全组/防火墙」是否放行 80 端口。"
echo "=============================================="
