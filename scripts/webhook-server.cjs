const http = require('http');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
  port: process.env.WEBHOOK_PORT || 54280,
  password: process.env.WEBHOOK_PASSWORD || '',
  deployScript: path.join(__dirname, 'deploy.sh'),
  logDir: '/var/log/lld_cms',
};

// 分支与部署目录映射
const BRANCH_DIR_MAP = {
  dev: '/www/wwwroot/front/pos-test',
  master: '/www/wwwroot/front/pos',
};

// 部署状态
let isDeploying = false;
let lastDeployTime = null;

// 确保日志目录存在
if (!fs.existsSync(CONFIG.logDir)) {
  fs.mkdirSync(CONFIG.logDir, { recursive: true });
}

// 验证 Gitee Webhook 密码
function verifyPassword(req) {
  if (!CONFIG.password) return true;
  const token = req.headers['x-gitee-token'] || '';
  return token === CONFIG.password;
}

// 执行部署
function deploy(nginxDir) {
  return new Promise((resolve, reject) => {
    const logFile = path.join(CONFIG.logDir, `deploy-${Date.now()}.log`);
    const startTime = new Date();

    console.log(`[${startTime.toISOString()}] 开始部署到 ${nginxDir}`);

    try {
      const output = execSync(`bash ${CONFIG.deployScript} ${nginxDir}`, {
        encoding: 'utf8',
        timeout: 600000,
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      const endTime = new Date();
      const duration = ((endTime - startTime) / 1000).toFixed(2);

      fs.writeFileSync(logFile, output);

      console.log(`[${endTime.toISOString()}] 部署完成，耗时 ${duration}s`);
      resolve({ success: true, duration, logFile });
    } catch (error) {
      const endTime = new Date();
      console.error(`[${endTime.toISOString()}] 部署失败:`, error.message);

      fs.writeFileSync(logFile, error.stdout || error.message);

      reject({ success: false, error: error.message, logFile });
    }
  });
}

// 处理 Webhook 请求
async function handleWebhook(req, res) {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  let body = '';
  req.on('data', (chunk) => (body += chunk));
  req.on('end', async () => {
    try {
      if (!verifyPassword(req)) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid password' }));
        return;
      }

      const payload = JSON.parse(body);
      const eventType = req.headers['x-gitee-event'] || req.headers['x-github-event'];

      if (eventType !== 'Push Hook' && eventType !== 'push') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Event ignored', event: eventType }));
        return;
      }

      // 获取分支名
      const ref = payload.ref || '';
      const branch = ref.replace('refs/heads/', '');

      // 检查分支是否需要部署
      const nginxDir = BRANCH_DIR_MAP[branch];
      if (!nginxDir) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Branch ignored', branch }));
        return;
      }

      if (isDeploying) {
        res.writeHead(409, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Deployment in progress' }));
        return;
      }

      isDeploying = true;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Deployment started', branch, target: nginxDir }));

      deploy(nginxDir)
        .then((result) => {
          lastDeployTime = new Date();
          console.log('部署成功:', result);
        })
        .catch((error) => {
          console.error('部署失败:', error);
        })
        .finally(() => {
          isDeploying = false;
        });
    } catch (error) {
      console.error('处理请求失败:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  });
}

function handleStatus(req, res) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(
    JSON.stringify({
      status: 'running',
      isDeploying,
      lastDeployTime,
      uptime: process.uptime(),
    }),
  );
}

const server = http.createServer((req, res) => {
  if (req.url === '/webhook' && req.method === 'POST') {
    handleWebhook(req, res);
  } else if (req.url === '/status' && req.method === 'GET') {
    handleStatus(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(CONFIG.port, () => {
  console.log(`Webhook 服务已启动，监听端口: ${CONFIG.port}`);
  console.log(`Webhook URL: http://0.0.0.0:${CONFIG.port}/webhook`);
  console.log(`状态查询: http://0.0.0.0:${CONFIG.port}/status`);
  console.log('分支映射: dev -> pos-test, master -> pos');
});

process.on('SIGTERM', () => {
  console.log('收到 SIGTERM 信号，正在关闭...');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('收到 SIGINT 信号，正在关闭...');
  server.close(() => process.exit(0));
});
