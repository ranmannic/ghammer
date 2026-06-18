# 部署指南：channel.ghammerwinery.com

阿里云 Linux ECS · Nginx · Git · PM2 · Next.js 14

---

## 架构

```
channel.ghammerwinery.com (443)
        ↓
      Nginx
        ↓
  Next.js :3000 (PM2)
        ↓
  data/store.json + public/uploads/
```

---

## 第一步：阿里云控制台

### 1.1 DNS 解析

在域名 `ghammerwinery.com` 的 DNS 解析中添加：

| 记录类型 | 主机记录 | 记录值 |
|----------|----------|--------|
| A | channel | ECS 公网 IP |

等待生效（通常几分钟内）。

### 1.2 安全组

入方向放行：

| 端口 | 协议 | 说明 |
|------|------|------|
| 22 | TCP | SSH |
| 80 | TCP | HTTP（证书申请 + 跳转 HTTPS） |
| 443 | TCP | HTTPS |

### 1.3 备案

ECS 在**中国大陆**时，域名需完成 **ICP 备案** 后才能正常访问。

---

## 第二步：SSH 登录服务器

```bash
ssh root@你的ECS公网IP
```

---

## 第三步：一次性环境安装

### 方式 A：使用项目脚本（需先把代码 clone 到服务器）

```bash
export REPO_URL="git@github.com:你的账号/jinchui-wine-website.git"
git clone "$REPO_URL" /var/www/ghammerwinery
cd /var/www/ghammerwinery
chmod +x deploy/*.sh
sudo bash deploy/setup-server.sh
```

### 方式 B：手动安装（Alibaba Cloud Linux 3 / CentOS 系）

```bash
sudo dnf update -y
sudo dnf install -y nginx git curl ca-certificates

curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs

sudo npm install -g pm2

sudo mkdir -p /var/www/ghammerwinery
sudo mkdir -p /var/www/certbot
```

---

## 第四步：Git 部署代码

```bash
cd /var/www/ghammerwinery

# 首次 clone（替换为你的仓库地址）
git clone git@github.com:你的账号/jinchui-wine-website.git .

# 若使用 HTTPS：
# git clone https://github.com/你的账号/jinchui-wine-website.git .
```

### 配置 Git 私钥（推荐）

在服务器生成 SSH 密钥并添加到 GitHub/GitLab：

```bash
ssh-keygen -t ed25519 -C "ecs-ghammer" -f ~/.ssh/id_ed25519 -N ""
cat ~/.ssh/id_ed25519.pub
# 将公钥添加到代码托管平台
```

---

## 第五步：生产环境变量

```bash
cd /var/www/ghammerwinery
cp .env.example .env.production
```

编辑 `.env.production`：

```bash
AUTH_SECRET=用下面命令生成的随机字符串
NODE_ENV=production
PORT=3000
```

生成密钥：

```bash
openssl rand -base64 32
```

**上线后务必修改默认管理员密码**（默认 `admin` / `admin123`）。

---

## 第六步：首次构建与启动

```bash
cd /var/www/ghammerwinery
chmod +x deploy/deploy.sh

# 若无 data/store.json，初始化示例数据
npm run seed

npm ci --omit=dev
npm run build

pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
# 按 pm2 startup 输出的 sudo 命令再执行一次
```

验证本地服务：

```bash
curl -I http://127.0.0.1:3000
```

---

## 第七步：配置 Nginx

```bash
sudo cp /var/www/ghammerwinery/deploy/nginx/channel.ghammerwinery.com.conf \
  /etc/nginx/conf.d/channel.ghammerwinery.com.conf
```

**首次申请证书前**，若 Nginx 因缺少 ssl 证书无法启动，可临时使用 HTTP-only 配置：

```bash
# 临时仅 80 端口（certbot 用）
sudo tee /etc/nginx/conf.d/channel.ghammerwinery.com.conf <<'EOF'
server {
    listen 80;
    server_name channel.ghammerwinery.com;
    location /.well-known/acme-challenge/ { root /var/www/certbot; }
    location /uploads/ { alias /var/www/ghammerwinery/public/uploads/; }
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

sudo nginx -t && sudo systemctl reload nginx
```

---

## 第八步：HTTPS 证书

```bash
sudo dnf install -y certbot python3-certbot-nginx
sudo certbot --nginx -d channel.ghammerwinery.com
```

按提示输入邮箱并同意条款。成功后 certbot 会自动配置 HTTPS。

证书自动续期：

```bash
sudo certbot renew --dry-run
```

若使用**阿里云免费 SSL 证书**，在控制台下载 Nginx 证书，替换配置中的 `ssl_certificate` 路径即可。

证书就绪后，恢复完整 Nginx 配置：

```bash
sudo cp /var/www/ghammerwinery/deploy/nginx/channel.ghammerwinery.com.conf \
  /etc/nginx/conf.d/channel.ghammerwinery.com.conf
sudo nginx -t && sudo systemctl reload nginx
```

---

## 第九步：验证

| 检查项 | 地址 |
|--------|------|
| 首页 | https://channel.ghammerwinery.com |
| 后台 | https://channel.ghammerwinery.com/admin/login |
| PM2 状态 | `pm2 status` |
| Nginx 状态 | `sudo systemctl status nginx` |
| 应用日志 | `pm2 logs ghammerwinery` |

---

## 日常更新（Git 部署）

每次本地 push 后，在服务器执行：

```bash
cd /var/www/ghammerwinery
./deploy/deploy.sh
```

脚本会：`git pull` → `npm ci` → `npm run build` → `pm2 restart`。

---

## 备份

```bash
sudo mkdir -p /backup
sudo tar -czf /backup/ghammer-$(date +%F).tar.gz \
  /var/www/ghammerwinery/data \
  /var/www/ghammerwinery/public/uploads
```

建议定期同步到阿里云 OSS。

---

## 常见问题

### 502 Bad Gateway

```bash
pm2 status          # 确认 ghammerwinery 为 online
curl http://127.0.0.1:3000
pm2 logs ghammerwinery --lines 50
```

### 上传图片失败

确认目录可写：

```bash
ls -la /var/www/ghammerwinery/public/uploads
chmod 755 /var/www/ghammerwinery/public/uploads
```

### 构建内存不足

2G 内存 ECS 若 build 失败，可临时加 swap：

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

---

## 文件说明

| 文件 | 用途 |
|------|------|
| `ecosystem.config.cjs` | PM2 进程配置 |
| `deploy/nginx/channel.ghammerwinery.com.conf` | Nginx 站点配置 |
| `deploy/deploy.sh` | 日常 Git 更新脚本 |
| `deploy/setup-server.sh` | 服务器一次性初始化 |
