# 漂流瓶应用 - 安装运行指南

## 🚀 快速开始

### 1. 环境准备
确保已安装以下工具：
- Node.js (版本 >= 16)
- React Native CLI
- Android Studio (Android开发)
- Xcode (iOS开发)

### 2. 安装依赖

#### 前端依赖
```bash
# 清理缓存
npm cache clean --force

# 安装依赖
npm install

# 如果npm有问题，可以尝试yarn
yarn install
```

#### 后端依赖
```bash
cd backend
npm install
cd ..
```

### 3. 启动服务

#### 启动后端服务
```bash
cd backend
npm start
```
后端将在 http://localhost:3000 运行

#### 启动React Native应用
```bash
# 新开一个终端窗口
npm run android  # Android
# 或
npm run ios      # iOS
```

### 4. 使用一键启动脚本
```bash
chmod +x start.sh
./start.sh
```

## 📱 功能说明

### 登录页面
- 首次使用需要填写昵称、性别、年龄
- 点击"开始漂流"进入主应用

### 主页
- **扔瓶子**：点击"扔瓶子"按钮，输入内容后扔出
- **捡瓶子**：点击"捡瓶子"按钮，随机捡取其他用户的瓶子
- **回复瓶子**：捡到瓶子后可以回复

### 消息页面
- 查看别人回复你瓶子的消息
- 下拉刷新获取最新消息

### 个人资料页面
- 查看和编辑个人信息
- 更换头像
- 退出登录

## 🔧 故障排除

### 依赖安装问题
```bash
# 清理所有缓存和依赖
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### 后端服务问题
- 确保端口3000没有被占用
- 检查Node.js版本 >= 16

### React Native连接问题
- 确保后端服务正在运行
- 检查网络权限配置
- Android需要配置网络安全策略

### 图片上传问题
- 确保相册访问权限
- 检查后端uploads目录权限

## 📋 开发说明

- 数据存储：使用AsyncStorage本地存储用户信息
- 后端存储：开发环境使用内存存储，重启后数据丢失
- API地址：开发环境为 http://localhost:3000
- 生产环境需要修改API地址和数据库配置

## 🎯 下一步开发

- [ ] 添加用户认证系统
- [ ] 集成真实数据库
- [ ] 添加地理位置功能
- [ ] 实现推送通知
- [ ] 添加用户关注功能
- [ ] 优化UI和用户体验
