# 易俊臣 · 个人介绍网站

> 计算机科学与技术（四川传媒学院 · 智慧广电学院）· 2024 级 · 课程项目
> 一个**纯手写静态**的个人主页，同时当作**大四求职作品集**来长期维护。
> 不用框架、不用构建工具、不用数据库；一个文件夹，双击就能打开，丢到云服务器就能上线。

- 在线访问：`http://<你的服务器 IP>/`（部署步骤见 [docs/deployment-guide.md](docs/deployment-guide.md)）
- 网站截图：见 [docs/images/](docs/images/)（`docs/images/screenshot.ps1` 可一键生成）
- 当前版本：**v1.0.0**

> 说明：文档文件名统一用英文（如 `deployment-guide.md`），是为了在 Git、网址链接和不同系统之间不乱码；
> **文档内容是中文**，Git 提交信息也用中文，老师读起来没有障碍。

---

## 一、这是什么

它不是一张“网上抄来的模板”，而是在一份已有页面基础上**逐页改造**出来的个人站点：

| 原来 | 现在 | 为什么改 |
| --- | --- | --- |
| 兴趣主页（健身、骑行、猫咪、设计） | **求职作品集**（首页即简历） | 老师要求大四找工作时用得上 |
| 没有课程页 | `courses.html` 课程清单 | 面试官会关心你学过什么 |
| 没有项目页 | `projects.html` 项目经历 | 求职时最重要的一页 |
| 证书只有一句话 | `certificates.html` 获奖 / 培训 / 技能证书 | 证书要能被核对 |
| 只能在文件夹里双击打开 | Nginx 部署到云服务器，公网可访问 | 学会最基本的服务器部署 |
| 只有一个 txt 说明书 | 全部文档改为 Markdown | 老师要求 |

保留的是原来的**视觉风格**（暖白纸感、橘色点缀、大字号标题），改掉的是**内容结构和求职用途**。

---

## 二、页面清单

| 页面 | 文件 | 内容 | 求职用途 |
| --- | --- | --- | --- |
| 首页 | `index.html` | 首屏简历、一屏速览、自我介绍、在校经历、技能 | ✅ 最重要 |
| 项目经历 | `projects.html` | 个人网站、大广赛作品、建模项目等 | ✅ 最重要 |
| 上过的课程 | `courses.html` | 按学期整理的课程与成绩，可筛选排序 | ✅ |
| 证书与获奖 | `certificates.html` | 获奖、培训证书、技能证书、计划考取 | ✅ |
| 设计作品 | `design.html` | 广告设计、3D 建模作品图 | ✅（设计/新媒体岗） |
| 关于我 | `about.html` | 自我介绍、求职定位、成长时间线、歌单 | 补充 |
| 联系我 | `contact.html` | 邮箱 / 电话 / 微信、PDF 简历入口 | ✅ |
| 健身日常 | `fitness.html` | 训练安排、作息 | 个性展示 |
| 骑行记录 | `cycling.html` | 骑行数据、骑行服拍摄 | 个性展示 |
| 我家的两只猫 | `cats.html` | 十一和芝麻 | 个性展示 |
| 404 | `404.html` | 找不到页面时的提示 | — |

> **小提示**：健身房和猫是加分项，不是重点。HR 通常只花 30 秒看首页，
> 所以首页的第一屏放的是学校、专业、获奖、项目和联系方式。

---

## 三、目录结构

```
yijunchen-portfolio/
├── index.html              首页（简历版）
├── projects.html           项目经历
├── courses.html            上过的课程
├── certificates.html       证书与获奖
├── design.html             设计作品集
├── about.html              关于我
├── contact.html            联系我
├── fitness.html            健身日常
├── cycling.html            骑行记录
├── cats.html               我家的两只猫
├── 404.html                错误页
├── assets/
│   ├── style.css           全站样式（含手机适配、打印样式）
│   ├── main.js             全站脚本（导航、动画、课程筛选排序、打印）
│   └── photos/             ← 把图片放在这里（命名见该目录下的说明）
├── deploy/
│   ├── nginx.conf          Nginx 服务器配置
│   ├── upload.ps1          Windows 一键上传脚本
│   └── upload.sh           服务器端同步脚本（git pull 后使用）
├── docs/
│   ├── project-report.md      项目说明：设计思路、技术实现、答辩要点
│   ├── content-checklist.md   资料填写清单：所有“待补充”内容 + 照片命名表
│   ├── dev-log.md             开发日志：每一步改了什么、为什么
│   ├── git-guide.md           Git 常用命令与提交规范
│   ├── deployment-guide.md    云服务器 / 免费平台部署全流程
│   ├── project-template.md    以后写新项目用的模板
│   └── images/                截图归档（screenshot.ps1 可一键截图）
├── robots.txt / sitemap.xml  搜索引擎收录配置
└── README.md               本文件
```

---

## 四、本地怎么打开

三种方式，选一种：

1. **最简单**：双击 `index.html`。所有功能都能用（打印简历也可以）。
2. **更接近线上**：在项目目录打开 PowerShell，执行 `python -m http.server 8080`，
   然后访问 <http://localhost:8080>。（需要装了 Python）
3. **用 VS Code**：安装 `Live Server` 插件 → 右键 `index.html` → `Open with Live Server`。

> 修改后如果页面没变化，按 `Ctrl + F5` 强制刷新，清掉浏览器缓存。

---

## 五、怎么修改内容（最常用）

所有文字都直接写在 `.html` 文件里，用记事本或 VS Code 打开就能改。

| 想改什么 | 打开哪个文件 | 找什么 |
| --- | --- | --- |
| 姓名、学校、联系方式 | `index.html` / `contact.html` | 搜索“易俊臣”、邮箱、电话 |
| 课程、成绩 | `courses.html` | `<tbody>` 里一行一条课程 |
| 项目 | `projects.html` | 每个 `<div class="project">` 是一整个项目 |
| 证书 | `certificates.html` | `<article class="card cert">` |
| 颜色 | `assets/style.css` | 最上面的 `--accent`（主题色）、`--bg`（底色） |
| 照片 | `assets/photos/` | 文件名对照 `assets/photos/README.md` |

所有标着 **【待补充】** 或 **“待补充”** 的地方，都对应 [docs/content-checklist.md](docs/content-checklist.md) 里的一条，
照着填完，这个网站就可以正式拿出去用了。

> 改文字时只改中文，不要动 `< >` 里面的内容——那是网页结构。

---

## 六、把这个网站变成 PDF 简历

打开首页 → 点「打印 / 存为 PDF 简历」（或按 `Ctrl + P`）→ 目标打印机选 **“另存为 PDF”** → 保存。

打印样式已经调好：导航栏、滚动字幕、按钮都会自动隐藏，只留下学校和经历。
把生成的 PDF 发到自己邮箱里，投简历时直接用。

---

## 七、技术要点（写在简历 / 答辩里可以用）

- **纯静态**：HTML5 + CSS3 + 原生 JavaScript（ES5 语法，老浏览器也能跑），零依赖、零构建。
- **组件化思路**：10 个页面共用 1 个 CSS + 1 个 JS；导航栏由 JS 统一渲染，加页面只改一处。
- **响应式**：用 CSS Grid + `clamp()` 实现流式字号与布局，手机、平板、桌面自适应。
- **可访问性与性能**：
  - 每张照片有 `alt`；交互元素有 `aria-label` / `aria-pressed`；
  - 支持 `prefers-reduced-motion`（系统开启“减少动态效果”时自动关闭动画）；
  - **图片懒加载**（`loading="lazy"`，首屏图片除外）+ Nginx 开启 gzip 与缓存；总代码量约 50 KB。
- **交互**：滚动淡入、技能条动画、课程表筛选与排序、下拉导航、打印样式。
- **工程化**：Git 分支与规范化提交（见 [docs/git-guide.md](docs/git-guide.md)），Nginx 部署到 Linux 云服务器。

---

## 八、接下来的路线图

| 时间 | 目标 |
| --- | --- |
| 大三上（现在） | 网站上线；把 [资料填写清单](docs/content-checklist.md) 全部填完；开始投前端 / 设计方向实习 |
| 大三下 | 给网站加一个**动态功能**（如留言板），把静态站升级成前后端项目；考过四级 |
| 大四上 | 用这个网站投简历；把实习经历补进 `projects.html` |
| 大四下 | 补毕业设计项目，定稿作品集，导出 PDF 简历 |

---

## 九、文档索引

- [项目说明](docs/project-report.md) —— 需求分析、设计思路、技术实现、如何满足老师的要求
- [资料填写清单](docs/content-checklist.md) —— 「待补充」清单 + 照片命名表
- [开发日志](docs/dev-log.md) —— 每一版改了什么
- [Git 使用指南](docs/git-guide.md) —— 提交规范与常用命令
- [部署指南](docs/deployment-guide.md) —— 免费平台 + 云服务器 + Nginx + HTTPS

---

© 2026 易俊臣 · 四川传媒学院 智慧广电学院
