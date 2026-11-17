# Git 使用指南（本项目的实操版）

> 只讲这个项目会用到的部分。命令都在**项目根目录**（有 `index.html` 的那一层）执行。

---

## 一、一次性配置

```bash
git config --global user.name  "你的名字"
git config --global user.email "你的邮箱"

# Windows 用户建议关掉自动换行转换，避免出现“整个文件都被改过”的假差异
git config --global core.autocrlf false
```

检查是否配置好：

```bash
git config --list
```

---

## 二、每天最常用的 5 条命令

```bash
git status               # 1. 看哪些文件改了
git add -A               # 2. 把改动放进暂存区
git commit -m "说明"      # 3. 提交，写清楚这次改了什么
git log --oneline        # 4. 看提交历史
git diff                 # （可选）看具体改了哪几行
```

一个完整的日常流程：

```bash
git status                              # 先看现状
# ……改文件……
git diff                                # 看改动
git add -A
git commit -m "content: 补充大一上课程成绩"
git push                                # 如果关联了远程仓库
```

---

## 三、提交信息规范（Conventional Commits）

格式：`类型(范围): 简短说明`

| 类型 | 什么时候用 | 例子 |
| --- | --- | --- |
| `feat` | 新增功能 / 页面 | `feat: 新增项目经历页面` |
| `fix` | 修 bug | `fix: 修复手机上导航溢出` |
| `style` | 样式调整（不改逻辑、不改文案） | `style: 调整卡片阴影` |
| `content` | 内容更新（文案、数据、照片） | `content: 更新大广赛证书信息` |
| `docs` | 文档 | `docs: 补充部署指南` |
| `refactor` | 重构（结构变了，效果不变） | `refactor: 导航改为统一渲染` |
| `build` / `chore` | 配置、依赖、构建相关 | `build: 增加 Nginx 配置文件` |

**好提交 vs 坏提交：**

- ✅ `content: 补充大一下学期 7 门课程与成绩`
- ❌ `update`
- ❌ `修改了一下`

> 原则：**一次提交只做一件事**。改样式和改内容分两次提交，以后回退才好处理。

---

## 四、分支（这个项目已经在用）

```bash
git branch                       # 查看所有分支，* 表示当前分支
git switch -c feature/xxx        # 新建并切换到功能分支
# ……开发、提交……
git switch main                  # 切回主分支
git merge --no-ff feature/xxx    # 把分支合并回来（--no-ff 保留分支记录）
git branch -d feature/xxx        # 删除已合并的分支
```

本项目 v1.0 的改造就是在一个功能分支上完成的，合并后主分支上能看到完整记录：

```bash
git log --oneline --graph --all
```

---

## 五、回退与后悔药

| 想做什么 | 命令 | 说明 |
| --- | --- | --- |
| 改坏了但还没 commit | `git restore 文件名` | 丢弃工作区修改，**不可恢复** |
| 已经 add 了想撤回 | `git restore --staged 文件名` | 只是取消暂存，修改还在 |
| 撤销最近一次提交（保留改动） | `git reset --soft HEAD~1` | 改动回到暂存区 |
| 查看某个文件的历史 | `git log --oneline -- 文件名` | |
| 看某次提交改了什么 | `git show 提交哈希` | |
| 临时存一下当前改动 | `git stash` → `git stash pop` | 切分支前用 |

---

## 六、发布版本号（打标签）

```bash
git tag -a v1.0.0 -m "第一版：求职作品集上线"
git push --tags
```

以后每完成一个大阶段（部署上线、学完一门课、毕业）就打一个标签，方便回顾。

---

## 七、关联远程仓库（GitHub / Gitee）

```bash
git remote add origin https://github.com/你的用户名/yijunchen-portfolio.git
git push -u origin main
```

> 注意：仓库里没有 `.env`、密码、私钥之类的东西，可以直接设为公开。
> 公开仓库本身就是求职加分项——**让 HR 看到你从大一开始写代码的过程**。

如果推送时要输入密码，GitHub 现在需要用 **Personal Access Token** 代替密码，
在 GitHub → Settings → Developer settings → Personal access tokens 生成。

---

## 八、本项目关键提交记录

在项目根目录执行下面这条命令，可以看到完整的历史图：

```bash
git log --oneline --graph --decorate --all
```

提交记录的说明见 [开发日志](dev-log.md)。
