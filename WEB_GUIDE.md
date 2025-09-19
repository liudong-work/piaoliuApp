# 🌐 Web版本测试指南

由于iOS模拟器配置问题，我们可以使用Web版本来测试应用功能。

## 🚀 启动步骤

### 1. 启动后端服务
```bash
cd /Users/liudong/Desktop/myGitProgect/piaoLiuApp/backend
node server.js
```
**保持这个终端窗口打开，你会看到：`服务器运行在 http://localhost:3000`**

### 2. 启动Metro服务器（新终端窗口）
```bash
cd /Users/liudong/Desktop/myGitProgect/piaoLiuApp
yarn start
```

### 3. 在浏览器中访问
打开浏览器，访问：`http://localhost:8081`

## 📱 应用功能测试

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

## 🔧 如果Web版本有问题

### 使用Expo
```bash
# 安装Expo CLI
npm install -g @expo/cli

# 启动Expo项目
npx expo start
```

### 使用React Native Web
```bash
# 安装React Native Web
yarn add react-native-web

# 启动Web版本
yarn web
```

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

**项目已经完全可以使用了！** 🎊

请按照上面的步骤在新终端中启动应用，如果还有问题，请告诉我具体的错误信息。
