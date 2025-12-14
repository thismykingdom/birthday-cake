# 🚀 GitHub Pages 部署教程

> 让您的生日蛋糕网站在线可访问！

---

## 📋 前置准备

### 1. 安装 Git

**检查是否已安装：**
```bash
git --version
```

**如果未安装，下载安装：**
- Windows: https://git-scm.com/download/win
- 安装时一路默认即可

### 2. 注册 GitHub 账号

如果还没有账号，前往 https://github.com 注册（免费）

---

## 🎯 部署步骤（跟着做即可）

### 第一步：在 GitHub 创建仓库

1. 登录 GitHub
2. 点击右上角 `+` → `New repository`
3. 填写信息：
   - **Repository name**: `birthday-cake` （或您喜欢的名字）
   - **Description**: `生日蛋糕粒子特效网站`
   - **Public** 选项（必须选Public才能用GitHub Pages）
   - ⚠️ **不要勾选** "Initialize this repository with a README"
4. 点击 `Create repository`

### 第二步：在电脑上打开命令行

**Windows 用户：**
1. 按 `Win + R`
2. 输入 `cmd` 或 `powershell`
3. 回车

### 第三步：进入项目文件夹

复制并运行以下命令：

```bash
cd d:\CODE2026\HTML
```

### 第四步：初始化 Git 仓库

复制并**逐行运行**以下命令：

```bash
# 初始化Git仓库
git init

# 添加所有文件
git add .

# 提交文件
git commit -m "初始提交：生日蛋糕网站"
```

### 第五步：连接到 GitHub

⚠️ **重要**：将下面命令中的 `你的GitHub用户名` 和 `birthday-cake` 替换为实际值！

```bash
# 连接远程仓库（记得替换用户名！）
git remote add origin https://github.com/你的GitHub用户名/birthday-cake.git

# 设置主分支
git branch -M main

# 推送到GitHub
git push -u origin main
```

> 💡 **提示**：第一次推送时会要求登录GitHub，输入账号密码即可

### 第六步：配置 GitHub Pages

1. 回到 GitHub 仓库页面
2. 点击 `Settings`（设置）
3. 左侧菜单找到 `Pages`
4. 在 **Source** 下：
   - Branch: 选择 `main`
   - Folder: 选择 `/ (root)`
5. 点击 `Save`（保存）

### 第七步：等待部署完成

⏱️ 等待 **1-2分钟**，页面会显示：

```
✅ Your site is live at https://你的用户名.github.io/birthday-cake/
```

点击这个链接，您的网站就上线了！🎉

---

## 🎊 成功验证清单

访问您的网站后，检查以下功能：

- ✅ 页面标题显示 "杜智艳，生日快乐！"
- ✅ 粒子从四面八方凝聚成蛋糕（开场3秒动画）
- ✅ 背景有持续飘动的粒子
- ✅ 点击屏幕会放烟花并显示祝福语
- ✅ 点击蜡烛可以吹灭/点燃
- ✅ 拖动可以旋转蛋糕
- ✅ 滚轮可以缩放
- ✅ 音乐可以播放

---

## 🔧 常见问题

### Q1: 推送时要求输入密码？

**解决方案**：GitHub 已不支持密码登录，需要使用 **Personal Access Token**

1. 前往 GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. 点击 `Generate new token (classic)`
3. 勾选 `repo` 权限
4. 生成后复制 token（只显示一次！）
5. 推送时用这个 token 代替密码

### Q2: 网站显示 404？

**可能原因**：
- 等待时间不够（再等1-2分钟）
- Pages 配置错误（检查 Settings → Pages 是否选择了 main 分支）
- 仓库必须是 Public

### Q3: 音乐无法播放？

这是浏览器安全策略，用户需要先点击页面任意位置才能播放音乐。

### Q4: 想修改网站内容怎么办？

修改本地文件后，运行：
```bash
cd d:\CODE2026\HTML
git add .
git commit -m "更新说明"
git push
```

等待1-2分钟，网站会自动更新！

---

## 📱 分享您的网站

部署成功后，您可以：

1. **复制链接**：`https://你的用户名.github.io/birthday-cake/`
2. **发送给朋友**：通过微信、QQ等
3. **生成二维码**：使用草料二维码等工具
4. **在社交媒体分享**

---

## 💝 恭喜！

您的生日蛋糕网站已经成功上线，全世界都可以访问了！🎂✨

如有任何问题，随时询问！
