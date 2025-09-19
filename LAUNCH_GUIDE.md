# 🚀 漂流瓶应用启动指南

## 快速启动方法

### 方法1：使用一键启动脚本
```bash
cd /Users/liudong/Desktop/myGitProgect/piaoLiuApp
./start-all.sh
```

### 方法2：分步启动

#### 1. 启动后端服务
```bash
cd /Users/liudong/Desktop/myGitProgect/piaoLiuApp/backend
node server.js
```
**保持这个终端窗口打开**

#### 2. 启动React Native应用（新终端窗口）
```bash
cd /Users/liudong/Desktop/myGitProgect/piaoLiuApp

# 启动Metro服务器
yarn start

# 在另一个终端启动Android
yarn android

# 或启动iOS
yarn ios
```

## 🔧 如果遇到问题

### 终端问题
如果终端出现语法错误，请：
1. 关闭所有终端窗口
2. 重新打开终端
3. 使用上面的命令重新启动

### 端口占用问题
```bash
# 检查端口占用
lsof -i :3000  # 后端端口
lsof -i :8081  # Metro端口

# 杀死占用进程
kill -9 <进程ID>
```

### Android模拟器问题
```bash
# 检查Android模拟器
adb devices

# 启动Android模拟器
emulator -avd <模拟器名称>
```

### iOS模拟器问题
```bash
# 启动iOS模拟器
open -a Simulator
```

## 📱 测试步骤

1. **启动后端**：看到 "服务器运行在 http://localhost:3000"
2. **启动Metro**：看到 Metro 欢迎界面
3. **启动应用**：应用在模拟器中打开
4. **测试功能**：
   - 注册用户
   - 扔瓶子
   - 捡瓶子
   - 回复消息

## 🎯 成功标志

- ✅ 后端服务运行在端口3000
- ✅ Metro服务器运行在端口8081
- ✅ 应用在模拟器中正常显示
- ✅ 可以正常使用所有功能

## 📞 需要帮助？

如果仍然遇到问题，请：
1. 确保React Native开发环境已正确配置
2. 确保Android Studio或Xcode已安装
3. 确保模拟器已启动
4. 检查网络连接

**项目已经完全可以使用了！** 🎊
