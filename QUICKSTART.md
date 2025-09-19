# 快速开始指南

## 环境要求

- Node.js >= 16
- React Native 开发环境
- Android Studio (Android开发)
- Xcode (iOS开发)

## 快速启动

### 方法1：使用启动脚本
```bash
./start.sh
```

### 方法2：手动启动

1. **安装依赖**
```bash
# 前端依赖
npm install

# 后端依赖
cd backend
npm install
cd ..
```

2. **启动后端服务**
```bash
cd backend
npm start
```

3. **启动React Native应用**
```bash
# 新开一个终端窗口
npm run android  # Android
# 或
npm run ios      # iOS
```

## 功能说明

### 1. 用户注册
- 首次打开应用需要填写昵称、性别、年龄
- 可以上传头像

### 2. 主页功能
- **扔瓶子**：写下想说的话，扔到海里
- **捡瓶子**：随机捡取其他用户扔的瓶子

### 3. 消息中心
- 查看别人回复你瓶子的消息
- 支持下拉刷新

### 4. 个人资料
- 编辑个人信息
- 更换头像
- 退出登录

## 注意事项

1. 确保后端服务运行在 `http://localhost:3000`
2. Android模拟器需要配置网络权限
3. iOS模拟器需要配置相册访问权限
4. 开发环境使用内存存储，重启服务数据会丢失

## 故障排除

### 后端服务无法启动
- 检查端口3000是否被占用
- 确保Node.js版本 >= 16

### React Native应用无法连接后端
- 检查网络权限配置
- 确保后端服务正在运行
- Android需要配置网络安全策略

### 图片上传失败
- 检查相册访问权限
- 确保后端uploads目录存在
