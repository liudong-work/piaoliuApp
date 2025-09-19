# 🎉 漂流瓶应用 - 最终启动指南

## 🚀 快速启动方法

### 方法1：使用一键启动脚本
```bash
cd /Users/liudong/Desktop/myGitProgect/piaoLiuApp
./start-web.sh
```

### 方法2：分步启动

#### 1. 清理所有进程
```bash
pkill -f "node server.js"
pkill -f "metro"
pkill -f "react-native"
```

#### 2. 启动后端服务（新终端窗口）
```bash
cd /Users/liudong/Desktop/myGitProgect/piaoLiuApp/backend
node server.js
```
**保持这个终端窗口打开，你会看到：`服务器运行在 http://localhost:3000`**

#### 3. 启动Metro服务器（新终端窗口）
```bash
cd /Users/liudong/Desktop/myGitProgect/piaoLiuApp
yarn start --reset-cache
```

#### 4. 在浏览器中访问
打开浏览器，访问：`http://localhost:8081`

## 📱 应用功能

### 1. 登录页面
- 填写昵称、性别、年龄
- 点击"开始漂流"进入应用

### 2. 主页
- **扔瓶子**：点击"扔瓶子"按钮，输入内容后扔出
- **捡瓶子**：点击"捡瓶子"按钮，随机捡取其他用户的瓶子
- **回复瓶子**：捡到瓶子后可以回复

### 3. 消息页面
- 查看别人回复你瓶子的消息
- 下拉刷新获取最新消息

### 4. 个人资料页面
- 查看和编辑个人信息
- 更换头像
- 退出登录

## 🔧 故障排除

### 端口占用问题
```bash
# 检查端口占用
lsof -i :3000  # 后端端口
lsof -i :8081  # Metro端口

# 杀死占用进程
kill -9 <进程ID>
```

### 清理缓存
```bash
# 清理Metro缓存
yarn start --reset-cache

# 清理所有缓存
rm -rf node_modules yarn.lock
yarn install
```

### 网络问题
- 确保后端服务运行在 `http://localhost:3000`
- 确保Metro服务运行在 `http://localhost:8081`
- 检查防火墙设置

## 🎯 成功标志

当你看到以下内容时，说明应用运行成功：
- ✅ 后端：`服务器运行在 http://localhost:3000`
- ✅ Metro：`Metro服务器运行在 http://localhost:8081`
- ✅ 浏览器：应用在浏览器中正常显示
- ✅ 功能：可以注册、扔瓶子、捡瓶子、回复消息

## 📋 测试流程

1. **启动后端**：看到 "服务器运行在 http://localhost:3000"
2. **启动Metro**：看到 Metro 欢迎界面
3. **访问浏览器**：应用在浏览器中打开
4. **注册用户**：填写个人信息
5. **扔瓶子**：输入内容并扔出
6. **捡瓶子**：随机捡取瓶子
7. **回复消息**：对捡到的瓶子进行回复
8. **查看消息**：在消息页面查看回复

## 🎉 项目状态

- ✅ 后端服务已创建并可以启动
- ✅ 前端代码已编写完成
- ✅ 所有功能代码已编写完成
- ✅ 依赖已安装
- ✅ 启动脚本已创建

**项目已经完全可以使用了！** 🎊

请按照上面的步骤在新终端中启动应用，如果还有问题，请告诉我具体的错误信息。
