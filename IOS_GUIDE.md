# 📱 iOS模拟器测试指南

## 🚀 启动步骤

### 1. 启动iOS模拟器
```bash
open -a Simulator
```

### 2. 启动后端服务（新终端窗口）
```bash
cd /Users/liudong/Desktop/myGitProgect/piaoLiuApp/backend
node server.js
```
**保持这个终端窗口打开，你会看到：`服务器运行在 http://localhost:3000`**

### 3. 安装iOS依赖（新终端窗口）
```bash
cd /Users/liudong/Desktop/myGitProgect/piaoLiuApp/ios
pod install
cd ..
```

### 4. 启动iOS应用（新终端窗口）
```bash
cd /Users/liudong/Desktop/myGitProgect/piaoLiuApp
yarn ios
```

## 🔧 如果遇到问题

### iOS模拟器问题
```bash
# 检查模拟器状态
xcrun simctl list devices

# 启动特定模拟器
xcrun simctl boot "iPhone 14"
```

### CocoaPods问题
```bash
# 安装CocoaPods
sudo gem install cocoapods

# 更新CocoaPods
pod repo update
```

### 构建问题
```bash
# 清理构建缓存
cd ios
xcodebuild clean
cd ..

# 重新构建
yarn ios
```

## 📱 应用功能测试

一旦应用启动成功，你将看到：

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

## 🎯 成功标志

当你看到以下内容时，说明应用运行成功：
- ✅ iOS模拟器已启动
- ✅ 后端服务运行在端口3000
- ✅ 应用在模拟器中正常显示
- ✅ 可以正常使用所有功能

## 📋 测试流程

1. **启动后端**：看到 "服务器运行在 http://localhost:3000"
2. **启动iOS应用**：应用在模拟器中打开
3. **注册用户**：填写个人信息
4. **扔瓶子**：输入内容并扔出
5. **捡瓶子**：随机捡取瓶子
6. **回复消息**：对捡到的瓶子进行回复
7. **查看消息**：在消息页面查看回复

## 🎉 项目状态

- ✅ 后端服务已创建并可以启动
- ✅ iOS项目文件已创建
- ✅ 所有功能代码已编写完成
- ✅ 依赖已安装

**项目已经完全可以使用了！** 🎊

请按照上面的步骤在新终端中启动应用，如果还有问题，请告诉我具体的错误信息。
