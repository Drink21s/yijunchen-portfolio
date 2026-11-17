# 部署指南：让网站在公网上能被访问

> 目标：别人用手机、电脑，在任何地方输入一个网址，就能打开你的网站。
>
> 本指南按难度分三部分，**建议按顺序来**：
>
> 1. 【免费、5 分钟】GitHub Pages —— 今天就能拿到一个公网链接，交作业先用这个；
> 2. 【免费、10 分钟】Vercel —— 国内访问速度一般更好，支持自定义域名；
> 3. 【重点、1–2 小时】阿里云 / 腾讯云 + Nginx —— 老师要求掌握的服务器部署，也是大四简历上的加分项。
>
> 每一步都写了**怎么验证成功**和**打不开怎么查**，照着做就行。

---

## 第 0 部分：部署之前

先完成《资料填写清单》里必须填的信息，把网站本地跑通：

```powershell
# 在项目根目录打开 PowerShell
python -m http.server 8080
# 然后浏览器访问 http://localhost:8080
```

确认 10 个页面都能打开、图片显示正常、手机模式排版没问题，再往下做。

---

## 第 1 部分：GitHub Pages（免费，5 分钟）

### 1.1 把代码传到 GitHub

1. 注册 <https://github.com>，新建仓库，名字用 `yijunchen-portfolio`，**Public**。
2. 本地执行：

```bash
git remote add origin https://github.com/你的用户名/yijunchen-portfolio.git
git branch -M main
git push -u origin main
```

### 1.2 开启 Pages

1. 仓库页面 → **Settings** → 左侧 **Pages**；
2. **Source** 选 `Deploy from a branch`，分支选 `main`，目录选 `/ (root)`，点 **Save**；
3. 等 1–2 分钟，页面上方会出现地址：`https://你的用户名.github.io/yijunchen-portfolio/`

### 1.3 验证

打开上面那个地址，能看到首页就算成功。

> `.nojekyll` 文件已经加在仓库里了，它的作用是告诉 GitHub 不要用 Jekyll 处理这个仓库，
> 保证 `.md` 文件、下划线开头的文件名都原样输出。

**常见问题**

| 现象 | 原因 / 解决 |
| --- | --- |
| 打开是 GitHub 的 404 | 分支名不是 `main`（检查 `git branch`），或目录选错了 |
| 页面没样式 | 这是 1–2 分钟后才生效，刷新；或路径写成绝对路径了 |
| 图片 404 | 检查文件名大小写，`Avatar.JPG` ≠ `avatar.jpg` |

---

## 第 2 部分：Vercel（免费）

1. 打开 <https://vercel.com>，用 GitHub 账号登录；
2. **Add New → Project → Import** 你的 `yijunchen-portfolio` 仓库；
3. Framework Preset 选 **Other**，Build Command 留空，Output Directory 留空；
4. 点 **Deploy**，约 30 秒后会得到一个 `https://xxx.vercel.app` 地址。

以后每次 `git push`，Vercel 都会自动重新部署，**不用手动上传**。
（如果访问慢，可以在 Vercel 里绑定自己的域名，见第 6 部分。）

---

## 第 3 部分：云服务器 + Nginx（老师要求的重点）

> 演示用的操作系统是 **Ubuntu 22.04 / 24.04**，其他发行版命令略有不同。
> 下面 `1.2.3.4` 代表你的服务器公网 IP，请替换成自己的。

### 3.1 买服务器

学生优惠渠道（都需要学生认证）：

- 阿里云：「阿里云高校计划」→ 云服务器 ECS，学生价通常几十块钱一年；
- 腾讯云：「腾讯云校园」→ 轻量应用服务器。

**选配置：**

| 项目 | 建议 |
| --- | --- |
| 地域 | 成都 / 重庆（离学校近，延迟低） |
| 系统 | Ubuntu 22.04 LTS（64 位） |
| 配置 | 2 核 2G 就够，静态网站 1 核 1G 也行 |
| 时长 | 1 年 |

> **省钱提醒**：服务器是按年计费的，到期不续会关机。学生购买一般会有优惠，注意看清自动续费选项。

### 3.2 打开端口（安全组）

这是新手**最容易卡住**的一步：服务器没问题，但浏览器打不开，99% 是端口没放行。

**阿里云 ECS**：实例 → 安全组 → 配置规则 → 入方向 → 手动添加
**腾讯云轻量**：防火墙 → 添加规则

添加下面几条：

| 端口 | 协议 | 来源 | 用途 |
| --- | --- | --- | --- |
| 22 | TCP | 0.0.0.0/0（或只填你家 / 学校的 IP 更安全） | SSH 远程登录 |
| 80 | TCP | 0.0.0.0/0 | HTTP 网站 |
| 443 | TCP | 0.0.0.0/0 | HTTPS 网站（后面要用） |

### 3.3 登录服务器

Windows 10 / 11 自带 SSH，直接在 PowerShell 里执行：

```powershell
ssh root@1.2.3.4
```

- 第一次连会问 `Are you sure you want to continue connecting?` → 输入 `yes`；
- 然后输入服务器密码（**输入时屏幕上不会显示任何字符，这是正常的**）。

> 腾讯云轻量应用服务器默认用户可能是 `ubuntu` 而不是 `root`，登录后再 `sudo -i` 切换成 root。

### 3.4 安装 Nginx

```bash
# 更新软件源
sudo apt update && sudo apt upgrade -y

# 安装 Nginx
sudo apt install -y nginx

# 启动并设为开机自启
sudo systemctl enable --now nginx

# 检查状态，看到 active (running) 就对了
systemctl status nginx
```

**此时用浏览器访问 `http://1.2.3.4/`，应该能看到 Nginx 的欢迎页（Welcome to nginx!）。**
看到欢迎页，说明“服务器 + 端口 + Nginx”全部通了，再往下传文件。

### 3.5 上传网站文件

**方式 A（推荐，最简单）：在 Windows 本机运行一键脚本**

项目里已经写好了脚本，在项目根目录执行：

```powershell
# 如果 PowerShell 提示“禁止运行脚本”，先执行这一行解除限制
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

.\deploy\upload.ps1 -Server 1.2.3.4 -User root
```

脚本会：本机打包 → 服务器建 `/var/www/yijunchen` 目录 → 上传解压。
成功后会打印服务器上的文件列表。

**方式 B：服务器上从 Git 拉取（大四维护时更好用）**

```bash
# 服务器上
sudo apt install -y git rsync
sudo git clone https://github.com/你的用户名/yijunchen-portfolio.git /var/www/yijunchen
cd /var/www/yijunchen
sudo bash deploy/upload.sh      # 把文件同步到网站目录并重载 Nginx
```

以后更新网站只需要：

```bash
cd /var/www/yijunchen && sudo bash deploy/upload.sh
```

**方式 C：WinSCP 图形界面**

下载 [WinSCP](https://winscp.net)，协议选 SFTP，填 IP、root、密码，
把项目里的 `*.html`、`assets/`、`robots.txt` 等拖到 `/var/www/yijunchen/`。
（不要拖 `.git` 和 `docs` 目录。）

### 3.6 配置 Nginx

项目里已经准备好配置文件 `deploy/nginx.conf`，把它放到服务器上：

```bash
# 1. 编辑站点配置（把本地 deploy/nginx.conf 的内容粘进去）
sudo nano /etc/nginx/sites-available/yijunchen

#    nano 里：粘贴 → Ctrl+O 回车保存 → Ctrl+X 退出

# 2. 启用这个配置（创建软链接）
sudo ln -s /etc/nginx/sites-available/yijunchen /etc/nginx/sites-enabled/

# 3. 删除默认站点，避免冲突
sudo rm -f /etc/nginx/sites-enabled/default

# 4. 检查语法：出现 syntax is ok / test is successful 才继续
sudo nginx -t

# 5. 重载 Nginx
sudo systemctl reload nginx
```

**这个配置做了什么？**

| 配置 | 作用 |
| --- | --- |
| `root /var/www/yijunchen;` | 指定网站文件目录 |
| `error_page 404 /404.html;` | 找不到页面时显示我们自己的 404 页 |
| `try_files $uri $uri/ =404;` | 先找同名文件，再找目录，都没有就返回 404 |
| `location ~ /\. { deny all; }` | **禁止访问 `.git` 等隐藏文件**——防止源码被下载 |
| `expires 30d;` | 图片缓存 30 天，再次访问更快 |
| `gzip on;` | 压缩传输，手机流量更省、加载更快 |
| `add_header X-Content-Type-Options nosniff;` | 安全响应头，防止浏览器错误解析文件类型 |

### 3.7 验证

浏览器访问 `http://1.2.3.4/`，能看到自己的网站首页 = 部署成功 🎉

再检查两件事：

1. 访问 `http://1.2.3.4/不存在的页面` → 应该看到自己做的 404 页面；
2. 访问 `http://1.2.3.4/.git/config` → 应该显示 404（被 Nginx 挡住了）。

### 3.8 打不开？按顺序排查

| 排查步骤 | 命令 / 操作 | 说明 |
| --- | --- | --- |
| ① 安全组 | 云控制台 → 安全组 / 防火墙 | 80 端口有没有放行？**最常见的原因** |
| ② Nginx 是否在运行 | `systemctl status nginx` | 没有 `active` 就 `sudo systemctl start nginx` |
| ③ Nginx 配置是否通过 | `sudo nginx -t` | 有报错就按提示行号改 |
| ④ 本机能不能打开 | `curl -I http://127.0.0.1` | 能返回 `200 OK` 说明服务器本身没问题 |
| ⑤ 80 端口有没有被监听 | `sudo ss -tlnp \| grep :80` | 没有输出说明 Nginx 没起来 |
| ⑥ 文件在不在 | `ls -l /var/www/yijunchen` | 应该能看到 `index.html` |
| ⑦ 看错误日志 | `sudo tail -n 50 /var/log/nginx/error.log` | 最后一行往往就是答案 |
| ⑧ 权限 | `sudo chmod -R 755 /var/www/yijunchen` | 目录没权限时 Nginx 返回 403 |

---

## 第 4 部分：日常更新流程

改完网站后：

```powershell
# 本机
git add -A
git commit -m "content: 更新证书信息"
git push

# 上传到服务器（方式 A）
.\deploy\upload.ps1 -Server 1.2.3.4

# 或者（方式 B，服务器上拉取）
ssh root@1.2.3.4 "cd /var/www/yijunchen && git pull && sudo bash deploy/upload.sh"
```

> 提示：用 GitHub Pages / Vercel 的话，`git push` 之后自动生效，不用上传。

---

## 第 5 部分：长期维护建议

1. **服务器到期续费**：设置手机日历提醒，学生机一般一年一续。
2. **改密码 / 换密钥**：在云控制台“重置密码”，不要用 123456 这种。
3. **SELinux / 防火墙**：如果是 CentOS，还要 `sudo firewall-cmd --add-service=http --permanent`；
   Ubuntu 的 ufw 默认不拦截（`sudo ufw allow 'Nginx Full'` 也可以加上）。
4. **定期备份**：整个项目已经在 Git 仓库里，这就是最好的备份；本地仓库再传到 GitHub，双保险。
5. **监控**：阿里云 / 腾讯云控制台有“站点监控”，可以设置每月检查一次网站能否打开。

---

## 第 6 部分：域名与 HTTPS（有域名后做）

### 6.1 买域名

在阿里云 / 腾讯云 / Namecheap 等平台购买 `.com` `.cn` `.top` 域名（学生认证后 `.cn` 很便宜）。
买好后到「域名解析」添加一条 A 记录：

| 主机记录 | 记录类型 | 记录值 |
| --- | --- | --- |
| `@` | A | `1.2.3.4`（你的服务器 IP） |
| `www` | A | `1.2.3.4` |

> 国内服务器 + 国内域名**需要 ICP 备案**才能用域名访问，备案一般 1–3 周，提前办理。

### 6.2 配置 HTTPS（免费证书）

```bash
# 安装 certbot
sudo apt install -y certbot python3-certbot-nginx

# 自动申请并配置 HTTPS（把域名换掉）
sudo certbot --nginx -d yijunchen.com -d www.yijunchen.com
```

按提示输入邮箱、同意协议，Certbot 会自动：

- 申请 Let's Encrypt 免费证书，有效期 90 天；
- 修改 Nginx 配置，把 HTTP 自动跳转到 HTTPS；
- 安装自动续期定时任务。

验证续期：

```bash
sudo certbot renew --dry-run
```

### 6.3 更新站点信息

有域名后，把下面文件里的 `YOUR-DOMAIN` 换成真实域名：

- `robots.txt`
- `sitemap.xml`
- `README.md`、`docs/project-report.md` 里的在线地址

然后提交、重新上传。

---

## 第 7 部分：提交作业用的信息表

| 项目 | 填写 |
| --- | --- |
| 网站访问地址 | `http://____/` |
| 备用地址（GitHub Pages / Vercel） | `https://____` |
| 服务器系统 / 配置 | Ubuntu 22.04 / 2 核 2G |
| Web 服务器 | Nginx |
| Git 仓库地址 | `https://github.com/____/yijunchen-portfolio` |
| 部署完成时间 | 2026.____ |
| 遇到的主要问题和解决方法 | 见第 3.8 节和 [开发日志](dev-log.md) |
