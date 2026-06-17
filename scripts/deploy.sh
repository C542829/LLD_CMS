#!/bin/bash
# 自动部署脚本
# 用法: ./scripts/deploy.sh [部署目录]

set -e

PROJECT_DIR="/opt/lld_cms"
NGINX_DIR=${1:-"/www/wwwroot/front/pos-test"}
LOG_DIR="/var/log/lld_cms"

# 创建日志目录
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/deploy-$(date +%Y%m%d-%H%M%S).log"

exec > >(tee -a "$LOG_FILE") 2>&1

echo "=== 开始部署 ==="
echo "部署目录: $NGINX_DIR"
echo "时间: $(date)"
echo "日志: $LOG_FILE"

cd "$PROJECT_DIR"

# 拉取最新代码
echo ">>> 拉取最新代码..."
git fetch origin
git pull origin dev

# 安装依赖
echo ">>> 安装依赖..."
NODE_ENV=development pnpm install --frozen-lockfile --ignore-scripts

# 构建
echo ">>> 构建..."
pnpm run build

# 部署到 Nginx 目录
echo ">>> 部署到 Nginx..."
mkdir -p "$NGINX_DIR"
rm -rf "$NGINX_DIR"/*
cp -r dist/* "$NGINX_DIR/"

echo "=== 部署完成 ==="
echo "时间: $(date)"
