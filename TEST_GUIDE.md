# 🚀 漂流瓶应用 - 快速测试指南

## ✅ 当前状态
- ✅ 后端服务已安装并可以启动
- ✅ 前端依赖已安装完成
- ✅ 项目代码完整

## 🧪 先测试后端功能

### 1. 启动后端服务
```bash
cd /Users/liudong/Desktop/myGitProgect/piaoLiuApp/backend
node server.js
```

### 2. 测试API接口
打开浏览器或使用curl测试：

```bash
# 测试用户注册
curl -X POST http://localhost:3000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{"nickname":"测试用户","gender":"男","age":25}'

# 测试扔瓶子
curl -X POST http://localhost:3000/api/bottle/throw \
  -H "Content-Type: application/json" \
  -d '{"userId":"test-user-id","content":"这是一个测试瓶子"}'

# 测试捡瓶子
curl http://localhost:3000/api/bottle/pick?userId=test-user-id
```

## 📱 移动端测试

### Android测试
```bash
# 确保Android模拟器已启动
adb devices

# 启动React Native应用
yarn android
```

### iOS测试
```bash
# 确保iOS模拟器已启动
# 启动React Native应用
yarn ios
```

## 🔧 常见问题解决

### 1. Android构建问题
```bash
# 清理Android构建缓存
cd android
./gradlew clean
cd ..

# 重新构建
yarn android
```

### 2. iOS构建问题
```bash
# 安装iOS依赖
cd ios
pod install
cd ..

# 重新构建
yarn ios
```

### 3. Metro服务器问题
```bash
# 清理Metro缓存
yarn start --reset-cache

# 或者
npx react-native start --reset-cache
```

## 🎯 测试流程

### 完整功能测试
1. **启动后端**：`cd backend && node server.js`
2. **启动前端**：`yarn android` 或 `yarn ios`
3. **注册用户**：填写昵称、性别、年龄
4. **扔瓶子**：输入内容并扔出
5. **捡瓶子**：随机捡取瓶子
6. **回复消息**：对捡到的瓶子进行回复
7. **查看消息**：在消息页面查看回复

## 📞 如果遇到问题

### 后端问题
- 检查端口3000是否被占用
- 确保Node.js版本 >= 16
- 检查依赖是否正确安装

### 前端问题
- 确保React Native开发环境已配置
- 检查Android Studio或Xcode是否安装
- 确保模拟器已启动

### 网络问题
- 检查API地址是否正确
- 确保网络权限已配置
- 检查防火墙设置

## 🎉 成功标志

当你看到以下内容时，说明应用运行成功：
- 后端：`服务器运行在 http://localhost:3000`
- 前端：应用在模拟器中正常显示
- 功能：可以注册、扔瓶子、捡瓶子、回复消息

**项目已经完全可以运行了！** 🎊
