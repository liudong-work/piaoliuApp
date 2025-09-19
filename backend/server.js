const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

// 配置文件上传
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/avatars';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });

// 模拟数据库
let users = [];
let bottles = [];
let messages = [];

// 用户相关API
app.post('/api/user/register', (req, res) => {
  const { nickname, gender, age } = req.body;
  const userId = uuidv4();
  
  const user = {
    id: userId,
    nickname,
    gender,
    age,
    avatar: null,
    createdAt: new Date().toISOString()
  };
  
  users.push(user);
  res.json({ success: true, user });
});

app.post('/api/user/upload-avatar', upload.single('avatar'), (req, res) => {
  const { userId } = req.body;
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ success: false, message: '用户不存在' });
  }
  
  if (req.file) {
    user.avatar = `/uploads/avatars/${req.file.filename}`;
  }
  
  res.json({ success: true, user });
});

app.get('/api/user/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: '用户不存在' });
  }
  res.json({ success: true, user });
});

// 漂流瓶相关API
app.post('/api/bottle/throw', (req, res) => {
  const { userId, content } = req.body;
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ success: false, message: '用户不存在' });
  }
  
  const bottle = {
    id: uuidv4(),
    userId,
    content,
    createdAt: new Date().toISOString(),
    isPicked: false,
    pickedBy: null
  };
  
  bottles.push(bottle);
  res.json({ success: true, bottle });
});

app.get('/api/bottle/pick', (req, res) => {
  const { userId } = req.query;
  const availableBottles = bottles.filter(b => !b.isPicked && b.userId !== userId);
  
  if (availableBottles.length === 0) {
    return res.json({ success: false, message: '暂时没有可捡的瓶子' });
  }
  
  const randomBottle = availableBottles[Math.floor(Math.random() * availableBottles.length)];
  randomBottle.isPicked = true;
  randomBottle.pickedBy = userId;
  
  // 获取瓶子作者信息
  const author = users.find(u => u.id === randomBottle.userId);
  
  res.json({ 
    success: true, 
    bottle: {
      ...randomBottle,
      author: {
        nickname: author.nickname,
        avatar: author.avatar,
        gender: author.gender,
        age: author.age
      }
    }
  });
});

// 消息相关API
app.post('/api/message/send', (req, res) => {
  const { bottleId, senderId, content } = req.body;
  const bottle = bottles.find(b => b.id === bottleId);
  
  if (!bottle) {
    return res.status(404).json({ success: false, message: '瓶子不存在' });
  }
  
  const message = {
    id: uuidv4(),
    bottleId,
    senderId,
    receiverId: bottle.userId,
    content,
    createdAt: new Date().toISOString(),
    isRead: false
  };
  
  messages.push(message);
  res.json({ success: true, message });
});

app.get('/api/messages/:userId', (req, res) => {
  const userId = req.params.userId;
  const userMessages = messages.filter(m => m.receiverId === userId);
  
  // 获取发送者信息
  const messagesWithSender = userMessages.map(msg => {
    const sender = users.find(u => u.id === msg.senderId);
    return {
      ...msg,
      sender: {
        nickname: sender.nickname,
        avatar: sender.avatar
      }
    };
  });
  
  res.json({ success: true, messages: messagesWithSender });
});

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
