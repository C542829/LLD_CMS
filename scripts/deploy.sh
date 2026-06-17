#!/bin/bash
# 自动部署脚本
# 用法: ./scripts/deploy.sh [部署目录] [分支名]

set -e

PROJECT_DIR="/opt/lld_cms"
NGINX_DIR=${1:-"/www/wwwroot/front/pos-test"}
BRANCH=${2:-"dev"}
LOG_DIR="/var/log/lld_cms"
BACKUP_DIR="/var/log/lld_cms/backups"

# 创建日志目录和备份目录
mkdir -p "$LOG_DIR" "$BACKUP_DIR"
LOG_FILE="$LOG_DIR/deploy-$(date +%Y%m%d-%H%M%S).log"

exec > >(tee -a "$LOG_FILE") 2>&1

echo "=== 开始部署 ==="
echo "部署目录: $NGINX_DIR"
echo "目标分支: $BRANCH"
echo "时间: $(date)"
echo "日志: $LOG_FILE"

cd "$PROJECT_DIR"

# 拉取最新代码（处理冲突）
echo ">>> 拉取最新代码..."
git fetch origin
# 如果本地有未提交改动，先 stash
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "检测到本地改动，执行 git stash..."
  git stash
fi
git checkout "$BRANCH"
git pull origin "$BRANCH" || {
  echo ">>> 拉取失败，尝试重置到远程分支..."
  git reset --hard "origin/$BRANCH"
}

# 安装依赖（NODE_ENV=development 确保 devDependencies 被安装，构建需要）
echo ">>> 安装依赖..."
NODE_ENV=development pnpm install --frozen-lockfile --ignore-scripts || {
  echo ">>> frozen-lockfile 失败，尝试普通安装..."
  NODE_ENV=development pnpm install --ignore-scripts
}

# 构建生产版本
echo ">>> 构建生产版本..."
NODE_ENV=production pnpm vite build

# 备份旧版本并部署（回滚机制）
echo ">>> 备份旧版本..."
BACKUP_NAME="backup-$(date +%Y%m%d-%H%M%S)"
if [ -d "$NGINX_DIR" ] && [ "$(ls -A "$NGINX_DIR" 2>/dev/null)" ]; then
  cp -r "$NGINX_DIR" "$BACKUP_DIR/$BACKUP_NAME"
  echo "旧版本已备份到: $BACKUP_DIR/$BACKUP_NAME"
  # 只保留最近 5 个备份
  BACKUP_COUNT=$(ls -1dt "$BACKUP_DIR"/backup-* 2>/dev/null | wc -l)
  if [ "$BACKUP_COUNT" -gt 5 ]; then
    ls -1dt "$BACKUP_DIR"/backup-* | tail -n +6 | xargs rm -rf
    echo "已清理旧备份，保留最近 5 个"
  fi
fi

# 部署到 Nginx 目录
echo ">>> 部署到 Nginx..."
mkdir -p "$NGINX_DIR"
rm -rf "${NGINX_DIR:?}"/*
cp -r dist/* "$NGINX_DIR/"

echo "=== 部署完成 ==="
echo "时间: $(date)"
echo "如需回滚，执行: cp -r $BACKUP_DIR/$BACKUP_NAME/* $NGINX_DIR/"
