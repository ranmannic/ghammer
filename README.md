# 金锤葡萄酒品牌官网

面向渠道伙伴的产品展示网站，包含前台产品目录、多渠道定价展示，以及管理员后台。

## 功能

- **前台**：产品系列筛选、产品详情、技术参数、京东/天猫/拼多多/抖音/美团渠道定价切换
- **后台**：管理员登录、产品增删改、图片上传、SKU 规格与渠道定价配置

## 快速开始

```bash
npm install
npm run dev
```

浏览器打开 [http://localhost:3000](http://localhost:3000)

若页面空白或无法打开，多半是开发缓存损坏或端口被占用，可执行：

```bash
npm run dev:clean
```

这会删除 `.next` 缓存并重新在 3000 端口启动。

### 默认管理员账号

首次访问会自动初始化示例数据：

- 用户名：`admin`
- 密码：`admin123`

生产环境请尽快修改密码（需直接编辑 `data/store.json` 中的密码哈希，或后续扩展改密功能），并设置环境变量：

```bash
cp .env.example .env.local
# 编辑 AUTH_SECRET 为随机长字符串
```

## 脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 开发服务器 |
| `npm run build` | 生产构建 |
| `npm run start` | 生产运行 |
| `npm run seed` | 手动初始化数据库（已有数据时跳过） |

## 数据存储

产品与用户数据保存在 `data/store.json`，上传图片保存在 `public/uploads/`。

## 技术栈

- Next.js 14 · React 18 · TypeScript
- Tailwind CSS
- JSON 文件数据库（无需额外数据库服务）
