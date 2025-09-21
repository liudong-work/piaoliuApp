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
  
  // 确定接收者：如果发送者是瓶子作者，则接收者是捡瓶子的人；否则接收者是瓶子作者
  let receiverId;
  if (senderId === bottle.userId) {
    // 发送者是瓶子作者，接收者是捡瓶子的人
    receiverId = bottle.pickedBy;
  } else {
    // 发送者是捡瓶子的人，接收者是瓶子作者
    receiverId = bottle.userId;
  }
  
  const message = {
    id: uuidv4(),
    bottleId,
    senderId,
    receiverId: receiverId,
    content,
    createdAt: new Date().toISOString(),
    isRead: false
  };
  
  messages.push(message);
  res.json({ success: true, message });
});

app.get('/api/messages/:userId', (req, res) => {
  const userId = req.params.userId;
  
  // 获取所有与当前用户相关的消息（作为发送者或接收者）
  const userRelatedMessages = messages.filter(m => 
    m.senderId === userId || m.receiverId === userId
  );
  
  // 按bottleId分组，获取每个对话的最后一条消息
  const conversationMap = new Map();
  
  userRelatedMessages.forEach(msg => {
    const bottleId = msg.bottleId;
    if (!conversationMap.has(bottleId) || 
        new Date(msg.createdAt) > new Date(conversationMap.get(bottleId).createdAt)) {
      conversationMap.set(bottleId, msg);
    }
  });
  
  // 转换为数组并按时间排序（最新的在前）
  const lastMessages = Array.from(conversationMap.values())
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  // 获取发送者信息
  const messagesWithSender = lastMessages.map(msg => {
    const sender = users.find(u => u.id === msg.senderId);
    const receiver = users.find(u => u.id === msg.receiverId);
    
    return {
      ...msg,
      sender: {
        nickname: sender ? sender.nickname : '未知用户',
        avatar: sender ? sender.avatar : null
      },
      receiver: {
        nickname: receiver ? receiver.nickname : '未知用户',
        avatar: receiver ? receiver.avatar : null
      },
      // 添加对话信息
      conversationWith: msg.senderId === userId ? receiver : sender,
      isMyMessage: msg.senderId === userId
    };
  });
  
  res.json({ success: true, messages: messagesWithSender });
});

// 获取聊天记录API
app.get('/api/messages/chat/:bottleId', (req, res) => {
  const bottleId = req.params.bottleId;
  const chatMessages = messages.filter(m => m.bottleId === bottleId);
  
  // 获取发送者信息
  const messagesWithSender = chatMessages.map(msg => {
    const sender = users.find(u => u.id === msg.senderId);
    return {
      ...msg,
      sender: {
        nickname: sender ? sender.nickname : '未知用户',
        avatar: sender ? sender.avatar : null
      }
    };
  });
  
  res.json({ success: true, messages: messagesWithSender });
});

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
