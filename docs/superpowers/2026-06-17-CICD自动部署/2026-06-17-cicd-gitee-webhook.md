# CI/CD 自动部署方案 - Gitee Webhook

## Context

项目当前采用完全手动部署方式：本地 `pnpm build` → 手动上传 `dist/` 到服务器。需要实现自动化部署，通过 Gitee Webhook 触发服务器上的部署脚本，实现 push 代码后自动构建和部署。

## 方案概述

```
代码 push → Gitee Webhook → 服务器部署服务 → git pull → pnpm install → pnpm build → 部署到 Nginx
```

## 服务器环境准备

需要在两台服务器上配置：

- 测试服务器：`39.107.119.113`（阿里云）
- 生产服务器：`82.156.232.52`（腾讯云）

每台服务器需要安装：

- Git
- Node.js（v18+）
- pnpm
- Nginx

## 实现步骤

### 1. 创建部署脚本 `scripts/deploy.sh`

路径：项目根目录 `scripts/deploy.sh`

```bash
#!/bin/bash
# 自动部署脚本
# 用法: ./scripts/deploy.sh [test|production]

set -e

ENV=${1:-test}
PROJECT_DIR="/opt/lld_cms"
BRANCH="dev"

if [ "$ENV" = "production" ]; then
  BRANCH="master"
fi

echo "=== 开始部署 $ENV 环境 ==="
echo "分支: $BRANCH"

cd "$PROJECT_DIR"

# 拉取最新代码
echo ">>> 拉取最新代码..."
git fetch origin
git checkout "$BRANCH"
git pull origin "$BRANCH"

# 安装依赖
echo ">>> 安装依赖..."
pnpm install --frozen-lockfile

# 构建
echo ">>> 构建..."
if [ "$ENV" = "production" ]; then
  pnpm build:pro
else
  pnpm build:test
fi

# 部署到 Nginx 目录
echo ">>> 部署到 Nginx..."
NGINX_DIR="/var/www/lld_cms"
rm -rf "$NGINX_DIR"/*
cp -r dist/* "$NGINX_DIR/"

echo "=== 部署完成 ==="
echo "时间: $(date)"
```

### 2. 创建 Webhook 接收服务 `scripts/webhook-server.js`

路径：项目根目录 `scripts/webhook-server.js`

一个轻量的 Node.js HTTP 服务，监听 Gitee Webhook 请求：

- 监听端口：9000（可配置）
- 验证 Gitee Webhook 签名（Secret）
- 匹配分支名，执行对应的部署脚本
- 返回部署状态

### 3. 使用 PM2 管理 Webhook 服务

```bash
pm2 start scripts/webhook-server.js --name "lld-webhook"
pm2 save
pm2 startup  # 开机自启
```

### 4. 配置 Gitee Webhook

在 Gitee 仓库 → 管理 → WebHooks 中添加：

- URL: `http://服务器IP:9000/webhook`
- Secret: 自定义密钥
- 触发事件: Push Events
- SSL 验证: 根据情况选择

### 5. 分支与环境映射

| 分支     | 环境 | 服务器         | 构建命令          |
| -------- | ---- | -------------- | ----------------- |
| `dev`    | 测试 | 39.107.119.113 | `pnpm build:test` |
| `master` | 生产 | 82.156.232.52  | `pnpm build:pro`  |

### 6. Nginx 配置参考

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/lld_cms;
    index index.html;

    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 代理
    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 静态资源缓存
    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 需要创建的文件

1. `scripts/deploy.sh` - 部署脚本
2. `scripts/webhook-server.js` - Webhook 接收服务
3. `scripts/ecosystem.config.js` - PM2 配置文件（可选）

## 部署流程

### 首次部署到服务器

1. SSH 登录服务器
2. 克隆项目：`git clone https://gitee.com/caihaocc/lld_cms.git /opt/lld_cms`
3. 安装依赖：`cd /opt/lld_cms && pnpm install`
4. 配置 Nginx
5. 启动 Webhook 服务
6. 在 Gitee 配置 Webhook

### 日常开发流程

1. 本地开发完成，push 到 `dev` 分支
2. Gitee 自动触发 Webhook
3. 测试服务器自动拉取、构建、部署
4. 测试通过后，合并到 `master`
5. 生产服务器自动拉取、构建、部署

## 验证方式

1. 本地 push 代码到 `dev` 分支
2. 检查测试服务器是否自动部署
3. 访问测试环境 URL 验证页面更新
4. 检查 PM2 日志：`pm2 logs lld-webhook`
5. 检查部署日志输出
