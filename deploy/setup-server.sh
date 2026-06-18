#!/usr/bin/env bash
# 阿里云 Linux 3 一次性环境初始化（root 或 sudo 执行）
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/ghammerwinery}"
REPO_URL="${REPO_URL:-}" # 例如 git@github.com:you/jinchui-wine-website.git

echo "==> 安装系统依赖"
dnf install -y nginx git curl ca-certificates
systemctl enable nginx
systemctl start nginx

echo "==> 安装 Node.js 20"
curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
dnf install -y nodejs
node -v
npm -v

echo "==> 安装 PM2"
npm install -g pm2

echo "==> 创建应用目录"
mkdir -p "$APP_DIR"
mkdir -p /var/www/certbot

if [[ -n "$REPO_URL" ]]; then
  if [[ ! -d "$APP_DIR/.git" ]]; then
    git clone "$REPO_URL" "$APP_DIR"
  fi
fi

echo "==> 配置 Nginx"
cp "$APP_DIR/deploy/nginx/channel.ghammerwinery.com.conf" /etc/nginx/conf.d/channel.ghammerwinery.com.conf
nginx -t
systemctl reload nginx

echo ""
echo "后续步骤："
echo "  1. 在阿里云 DNS 添加 A 记录: channel -> ECS 公网 IP"
echo "  2. 安全组放行 80、443"
echo "  3. 在 $APP_DIR 创建 .env.production（AUTH_SECRET=...）"
echo "  4. 首次部署: cd $APP_DIR && bash deploy/deploy.sh"
echo "  5. HTTPS: certbot --nginx -d channel.ghammerwinery.com"
echo "  6. 开机自启: pm2 startup && pm2 save"
