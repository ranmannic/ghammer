#!/usr/bin/env bash
# 在服务器上执行，用于 Git 拉取后更新站点
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/ghammerwinery}"
cd "$APP_DIR"

echo "==> 拉取最新代码"
git pull --ff-only

echo "==> 安装依赖"
npm ci --omit=dev

if [[ -f .env.production ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env.production
  set +a
fi

echo "==> 构建"
npm run build

echo "==> 重启应用"
if pm2 describe ghammerwinery >/dev/null 2>&1; then
  pm2 restart ghammerwinery
else
  pm2 start ecosystem.config.cjs
fi

pm2 save

echo "==> 部署完成: https://channel.ghammerwinery.com"
