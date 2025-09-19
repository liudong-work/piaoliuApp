# 漂流瓶应用

一个基于React Native开发的漂流瓶应用，支持Android和iOS平台。

## 功能特性

- 🏠 **主页功能**：捡瓶子和扔瓶子
- 👤 **个人资料**：维护性别、年龄、昵称、头像
- 💬 **消息中心**：查看回复的消息
- 📱 **跨平台**：支持Android和iOS

## 技术栈

### 前端
- React Native 0.72.6
- React Navigation 6
- TypeScript
- AsyncStorage
- React Native Image Picker
- React Native Vector Icons

### 后端
- Node.js
- Express.js
- Multer (文件上传)
- CORS
- UUID

## 项目结构

```
piaoLiuApp/
├── src/
│   └── screens/
│       ├── LoginScreen.tsx      # 登录/注册页面
│       ├── HomeScreen.tsx       # 主页（捡/扔瓶子）
│       ├── ProfileScreen.tsx    # 个人资料页面
│       └── MessagesScreen.tsx   # 消息页面
├── backend/
│   ├── server.js               # 后端服务器
│   └── package.json           # 后端依赖
├── android/                   # Android配置
├── ios/                      # iOS配置
└── App.tsx                   # 主应用入口
```

## 安装和运行

### 1. 安装依赖

```bash
# 安装前端依赖
npm install

# 安装后端依赖
cd backend
npm install
```

### 2. 启动后端服务

```bash
cd backend
npm start
```

后端服务将在 `http://localhost:3000` 启动

### 3. 启动React Native应用

#### Android
```bash
# 确保Android模拟器或设备已连接
npm run android
```

#### iOS
```bash
# 确保Xcode已安装
npm run ios
```

## API接口

### 用户相关
- `POST /api/user/register` - 用户注册
- `POST /api/user/upload-avatar` - 上传头像
- `GET /api/user/:id` - 获取用户信息

### 漂流瓶相关
- `POST /api/bottle/throw` - 扔瓶子
- `GET /api/bottle/pick` - 捡瓶子

### 消息相关
- `POST /api/message/send` - 发送回复
- `GET /api/messages/:userId` - 获取用户消息

## 开发说明

### 数据存储
- 用户信息使用AsyncStorage本地存储
- 后端使用内存存储（生产环境建议使用数据库）

### 图片上传
- 支持从相册选择头像
- 图片存储在 `backend/uploads/avatars/` 目录

### 网络配置
- 开发环境API地址：`http://localhost:3000`
- 生产环境需要修改API_BASE_URL

## 打包发布

### Android
```bash
cd android
./gradlew assembleRelease
```

### iOS
使用Xcode打开 `ios/piaoliuapp.xcworkspace` 进行打包

## 注意事项

1. 确保React Native开发环境已正确配置
2. Android需要配置网络权限
3. iOS需要配置相册访问权限
4. 生产环境建议使用真实数据库替换内存存储

## 后续功能规划

- [ ] 用户认证和登录
- [ ] 瓶子分类和标签
- [ ] 地理位置功能
- [ ] 推送通知
- [ ] 用户关注和好友系统
- [ ] 瓶子收藏功能
# piaoliuApp
