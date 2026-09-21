# Assignment 2 中文运行指南

## 1. 软件要求

- Node.js 20 LTS（建议不要使用过新的实验版本）
- pnpm 10.2.0
- Git

在 PowerShell 中检查：

```powershell
node -v
pnpm -v
git --version
```

如果没有 pnpm：

```powershell
corepack enable
corepack prepare pnpm@10.2.0 --activate
```

本项目已经把 Turbo 安装为开发依赖，因此不必全局安装；统一使用 `pnpm turbo`。

## 2. 打开正确的项目目录

解压项目后，在包含 `package.json`、`turbo.json`、`apps` 和 `packages` 的根目录打开 PowerShell：

```powershell
cd "你的路径\assignment-2-1-a-blog-client-kai"
```

确认位置：

```powershell
Get-ChildItem
```

## 3. 安装依赖

```powershell
pnpm install
pnpm --dir tests/playwright exec playwright install chromium
```

## 4. 配置环境变量

在项目根目录执行：

```powershell
Copy-Item packages/db/.env.example packages/db/.env -Force
Copy-Item apps/admin/.env.example apps/admin/.env -Force
```

`packages/db/.env`：

```env
DATABASE_URL="file:./dev.db"
```

`apps/admin/.env`：

```env
PASSWORD=123
JWT_SECRET=replace-this-with-a-long-random-secret
CLOUDINARY_CLOUD_NAME=abc
CLOUDINARY_API_KEY=abc
CLOUDINARY_API_SECRET=abc
```

Cloudinary 三项只有图片上传测试需要真实值；普通博客、登录、创建和修改功能可先使用占位值。

## 5. 创建数据库

```powershell
pnpm --filter @repo/db db:generate
pnpm --filter @repo/db db:push
pnpm --filter @repo/db db:seed
```

## 6. 启动项目

```powershell
pnpm turbo dev
```

- Client：http://localhost:3001
- Admin：http://localhost:3002
- Admin 密码：`123`

停止服务：在终端按 `Ctrl + C`。

## 7. 运行测试

先启动 Client 和 Admin，再新开一个 PowerShell，进入同一个项目根目录：

```powershell
pnpm turbo test-1
pnpm turbo test-2
pnpm turbo test-3
```

运行全部测试：

```powershell
pnpm turbo all:test
```

仅列出 Playwright 能发现的测试（排查 `No tests found`）：

```powershell
pnpm --dir tests/playwright playwright test --list
```

如果出现 `No tests found`，请先确认当前路径是项目根目录，并确认以下文件存在：

```powershell
Test-Path tests/playwright/tests/web/home-screen.spec.ts
Test-Path tests/playwright/tests/admin/home-screen.spec.ts
```

两个命令都应返回 `True`。

## 8. 常见问题

### pnpm 无法识别

关闭并重新打开 PowerShell，然后执行：

```powershell
corepack enable
corepack prepare pnpm@10.2.0 --activate
```

### PowerShell 禁止运行脚本

只为当前账户设置：

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

重新打开 PowerShell 后再运行安装命令。

### 端口被占用

```powershell
Get-NetTCPConnection -LocalPort 3001,3002 -ErrorAction SilentlyContinue
```

关闭之前运行的 Node/Next 终端，或在任务管理器结束对应进程。

### 数据混乱或测试互相影响

测试会自动重新 seed。手动恢复也可以运行：

```powershell
pnpm --filter @repo/db db:seed
```

