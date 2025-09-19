# 🧪 漂流瓶应用 - 后端API测试指南

## ✅ 项目状态
- ✅ 后端服务已创建并可以启动
- ✅ 前端代码已编写完成
- ✅ 依赖已安装

## 🚀 快速测试后端API

### 1. 启动后端服务
```bash
cd /Users/liudong/Desktop/myGitProgect/piaoLiuApp/backend
node server.js
```

### 2. 测试API接口

#### 测试用户注册
```bash
curl -X POST http://localhost:3000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{"nickname":"测试用户","gender":"男","age":25}'
```

#### 测试扔瓶子
```bash
curl -X POST http://localhost:3000/api/bottle/throw \
  -H "Content-Type: application/json" \
  -d '{"userId":"test-user-id","content":"这是一个测试瓶子"}'
```

#### 测试捡瓶子
```bash
curl http://localhost:3000/api/bottle/pick?userId=test-user-id
```

#### 测试发送消息
```bash
curl -X POST http://localhost:3000/api/message/send \
  -H "Content-Type: application/json" \
  -d '{"bottleId":"bottle-id","senderId":"sender-id","content":"回复消息"}'
```

#### 测试获取消息
```bash
curl http://localhost:3000/api/messages/user-id
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

## 🔧 故障排除

### 后端问题
- 检查端口3000是否被占用：`lsof -i :3000`
- 确保Node.js版本 >= 16：`node --version`
- 检查依赖是否正确安装：`cd backend && npm list`

### 前端问题
- 清理Metro缓存：`yarn start --reset-cache`
- 重新安装依赖：`rm -rf node_modules yarn.lock && yarn install`
- 检查React Native环境：`npx react-native doctor`

### 网络问题
- 检查API地址：`http://localhost:3000`
- 确保网络权限已配置
- 检查防火墙设置

## 🎯 完整测试流程

### 1. 后端测试
1. 启动后端服务
2. 测试所有API接口
3. 验证数据存储

### 2. 前端测试
1. 启动React Native应用
2. 注册用户
3. 扔瓶子
4. 捡瓶子
5. 回复消息
6. 查看消息

## 📊 预期结果

### 后端API响应
- 用户注册：返回用户信息
- 扔瓶子：返回瓶子信息
- 捡瓶子：返回随机瓶子
- 发送消息：返回消息信息
- 获取消息：返回消息列表

### 前端功能
- 登录页面正常显示
- 主页可以扔瓶子和捡瓶子
- 消息页面显示回复
- 个人资料页面可以编辑

## 🎉 成功标志

当你看到以下内容时，说明应用运行成功：
- 后端：`服务器运行在 http://localhost:3000`
- 前端：应用在模拟器中正常显示
- 功能：可以注册、扔瓶子、捡瓶子、回复消息

**项目已经完全可以运行了！** 🎊
