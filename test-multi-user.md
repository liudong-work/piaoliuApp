# 🏖️ 多模拟器测试指南

## 📱 当前状态
- **iPhone 14**: 已启动，进程 ID: 67417
- **iPhone 14 Plus**: 已启动，进程 ID: 70458
- **后端服务器**: 运行中，端口 3000

## 🎯 测试步骤

### 1️⃣ 第一个模拟器 (iPhone 14)
1. 打开应用
2. 注册用户 (昵称: 张三, 性别: 男, 年龄: 25)
3. 点击 "🌊 扔瓶子"
4. 输入内容: "你好，我是张三！"
5. 点击 "🌊 扔出瓶子"

### 2️⃣ 第二个模拟器 (iPhone 14 Plus)
1. 打开应用
2. 注册用户 (昵称: 李四, 性别: 女, 年龄: 23)
3. 点击 "捡瓶子"
4. 应该能看到张三扔的瓶子
5. 点击 "回复" 发送回复

### 3️⃣ 验证功能
- 检查消息页面是否有新消息
- 验证瓶子内容是否正确显示
- 确认用户信息显示正确

## 🔧 技术说明

### API 端点
- `POST /api/user/register` - 注册用户
- `POST /api/bottle/throw` - 扔瓶子
- `GET /api/bottle/pick` - 捡瓶子
- `POST /api/message/send` - 发送回复

### 数据库
- 用户数据存储在内存中
- 瓶子数据包含作者信息
- 消息系统支持回复功能

## 🐛 调试技巧

### 查看控制台日志
```bash
# 查看第一个模拟器日志
xcrun simctl spawn "iPhone 14" log stream --predicate 'process == "piaoliuapp"'

# 查看第二个模拟器日志
xcrun simctl spawn "iPhone 14 Plus" log stream --predicate 'process == "piaoliuapp"'
```

### 检查网络连接
```bash
# 测试API连接
curl -X GET "http://localhost:3000/api/bottle/pick?userId=test"
```

## 🎉 预期结果
- 两个模拟器可以独立注册用户
- 第一个用户扔的瓶子可以被第二个用户捡到
- 第二个用户可以回复第一个用户
- 消息系统正常工作
