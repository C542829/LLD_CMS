#!/bin/bash
# 自动部署脚本
# 用法: ./scripts/deploy.sh [test|production]

set -e

ENV=${1:-test}
PROJECT_DIR="/opt/lld_cms"
LOG_DIR="/var/log/lld_cms"
BRANCH="dev"

if [ "$ENV" = "production" ]; then
  BRANCH="master"
  NGINX_DIR="/www/wwwroot/front/pos"
else
  NGINX_DIR="/www/wwwroot/front/pos-test"
fi

# 创建日志目录
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/deploy-$(date +%Y%m%d-%H%M%S).log"

exec > >(tee -a "$LOG_FILE") 2>&1

echo "=== 开始部署 $ENV 环境 ==="
echo "分支: $BRANCH"
echo "时间: $(date)"
echo "日志: $LOG_FILE"

cd "$PROJECT_DIR"

# 拉取最新代码
echo ">>> 拉取最新代码..."
git fetch origin
git checkout "$BRANCH"
git pull origin "$BRANCH"

# 安装依赖
echo ">>> 安装依赖..."
pnpm install --frozen-lockfile --ignore-scripts

# 构建
echo ">>> 构建..."
if [ "$ENV" = "production" ]; then
  pnpm vite build
else
  pnpm vite build
fi

# 部署到 Nginx 目录
echo ">>> 部署到 Nginx..."
mkdir -p "$NGINX_DIR"
rm -rf "$NGINX_DIR"/*
cp -r dist/* "$NGINX_DIR/"

echo "=== 部署完成 ==="
echo "时间: $(date)"
