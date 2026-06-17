const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// 加载 .env 文件
const envFile = path.join(__dirname, '..', '.env');
if (fs.existsSync(envFile)) {
  const envContent = fs.readFileSync(envFile, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

// 配置
const CONFIG = {
  port: process.env.WEBHOOK_PORT || 54280,
  password: process.env.WEBHOOK_PASSWORD || '',
  deployScript: path.join(__dirname, 'deploy.sh'),
  logDir: '/var/log/lld_cms',
  maxBodySize: 1024 * 1024, // 请求体最大 1MB，防止 DoS
  deployTimeout: 600000, // 部署超时 10 分钟
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

/**
 * 验证 Gitee Webhook 密码
 */
function verifyPassword(req) {
  if (!CONFIG.password) return true;
  const token = req.headers['x-gitee-token'] || '';
  // 使用恒定时间比较，防止时序攻击
  if (token.length !== CONFIG.password.length) return false;
  let result = 0;
  for (let i = 0; i < token.length; i++) {
    result |= token.charCodeAt(i) ^ CONFIG.password.charCodeAt(i);
  }
  return result === 0;
}

/**
 * 校验部署目录是否在白名单中，防止命令注入
 */
function validateDeployDir(nginxDir) {
  const allowedDirs = Object.values(BRANCH_DIR_MAP);
  return allowedDirs.includes(nginxDir);
}

/**
 * 异步执行部署脚本
 */
function deploy(nginxDir, branch) {
  return new Promise((resolve, reject) => {
    const logFile = path.join(CONFIG.logDir, `deploy-${Date.now()}.log`);
    const startTime = new Date();

    console.log(`[${startTime.toISOString()}] 开始部署到 ${nginxDir}，分支: ${branch}`);

    const child = spawn('bash', [CONFIG.deployScript, nginxDir, branch], {
      env: { ...process.env },
    });

    let stdout = '';
    let stderr = '';
    let killed = false;

    const timer = setTimeout(() => {
      killed = true;
      child.kill('SIGTERM');
      reject(new Error('部署超时'));
    }, CONFIG.deployTimeout);

    child.stdout.on('data', (data) => {
      const output = data.toString();
      stdout += output;
      process.stdout.write(output);
    });

    child.stderr.on('data', (data) => {
      const output = data.toString();
      stderr += output;
      process.stderr.write(output);
    });

    child.on('close', (code) => {
      clearTimeout(timer);
      if (killed) return;

      const endTime = new Date();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      const logContent = `=== STDOUT ===\n${stdout}\n=== STDERR ===\n${stderr}`;

      fs.promises.writeFile(logFile, logContent).catch((err) => {
        console.error('写入部署日志失败:', err.message);
      });

      if (code === 0) {
        console.log(`[${endTime.toISOString()}] 部署完成，耗时 ${duration}s`);
        resolve({ success: true, duration, logFile });
      } else {
        const errorMsg = `部署进程退出码: ${code}\n${stderr}`;
        console.error(`[${endTime.toISOString()}] 部署失败: ${errorMsg}`);
        reject(new Error(errorMsg));
      }
    });

    child.on('error', (error) => {
      clearTimeout(timer);
      if (killed) return;

      const endTime = new Date();
      console.error(`[${endTime.toISOString()}] 部署进程异常:`, error.message);
      reject(new Error(`部署进程异常: ${error.message}`));
    });
  });
}

/**
 * 读取请求体（带大小限制）
 */
function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    let bodySize = 0;

    req.on('data', (chunk) => {
      bodySize += chunk.length;
      if (bodySize > CONFIG.maxBodySize) {
        req.destroy();
        reject(new Error('Request body too large'));
        return;
      }
      body += chunk;
    });

    req.on('end', () => resolve(body));

    req.on('error', reject);
  });
}

/**
 * 处理 Webhook 请求
 */
async function handleWebhook(req, res) {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  try {
    const body = await readBody(req);

    if (!verifyPassword(req)) {
      res.writeHead(403, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid password' }));
      return;
    }

    let payload;
    try {
      payload = JSON.parse(body);
    } catch {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid JSON body' }));
      return;
    }

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

    // 校验部署目录
    if (!validateDeployDir(nginxDir)) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid deploy directory' }));
      return;
    }

    isDeploying = true;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Deployment started', branch, target: nginxDir }));

    deploy(nginxDir, branch)
      .then((result) => {
        lastDeployTime = new Date();
        console.log('部署成功:', result);
      })
      .catch((error) => {
        console.error('部署失败:', error.message);
      })
      .finally(() => {
        isDeploying = false;
      });
  } catch (error) {
    console.error('处理请求失败:', error);
    if (!res.headersSent) {
      const status = error.message === 'Request body too large' ? 413 : 500;
      res.writeHead(status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
    }
  }
}

/**
 * 处理状态查询
 */
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
  // 设置请求超时 30 秒
  req.setTimeout(30000, () => {
    if (!res.headersSent) {
      res.writeHead(408, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Request timeout' }));
    }
    req.destroy();
  });

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
  if (!CONFIG.password) {
    console.warn('[警告] WEBHOOK_PASSWORD 未配置，Webhook 接口无认证保护，请尽快设置环境变量');
  }
});

process.on('SIGTERM', () => {
  console.log('收到 SIGTERM 信号，正在关闭...');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('收到 SIGINT 信号，正在关闭...');
  server.close(() => process.exit(0));
});
