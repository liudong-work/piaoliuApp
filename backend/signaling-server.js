const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 存储房间和用户信息
const rooms = new Map();
const users = new Map();

// 房间管理类
class Room {
  constructor(id, creator) {
    this.id = id;
    this.creator = creator;
    this.participants = new Map();
    this.createdAt = new Date();
    this.callType = null; // 'audio' | 'video'
  }

  addParticipant(userId, socketId) {
    this.participants.set(userId, {
      socketId,
      joinedAt: new Date(),
      isConnected: true
    });
  }

  removeParticipant(userId) {
    this.participants.delete(userId);
  }

  getParticipants() {
    return Array.from(this.participants.keys());
  }

  isEmpty() {
    return this.participants.size === 0;
  }
}

// Socket.io 连接处理
io.on('connection', (socket) => {
  console.log(`用户连接: ${socket.id}`);

  // 用户加入
  socket.on('join', (data) => {
    const { userId, nickname } = data;
    users.set(socket.id, { userId, nickname, socketId: socket.id });
    console.log(`用户 ${nickname} (${userId}) 加入`);
    
    socket.emit('joined', { success: true });
  });

  // 创建通话房间
  socket.on('create-room', (data) => {
    const { callType, targetUserId } = data;
    const user = users.get(socket.id);
    
    if (!user) {
      socket.emit('error', { message: '用户未登录' });
      return;
    }

    const roomId = uuidv4();
    const room = new Room(roomId, user.userId);
    room.callType = callType;
    
    rooms.set(roomId, room);
    room.addParticipant(user.userId, socket.id);
    
    console.log(`创建房间 ${roomId}, 类型: ${callType}, 创建者: ${user.nickname}`);
    
    socket.emit('room-created', { 
      roomId, 
      callType,
      creator: user.userId 
    });
  });

  // 加入通话房间
  socket.on('join-room', (data) => {
    const { roomId } = data;
    const user = users.get(socket.id);
    
    if (!user) {
      socket.emit('error', { message: '用户未登录' });
      return;
    }

    const room = rooms.get(roomId);
    if (!room) {
      socket.emit('error', { message: '房间不存在' });
      return;
    }

    // 检查房间是否已满（限制2人）
    if (room.participants.size >= 2) {
      socket.emit('error', { message: '房间已满' });
      return;
    }

    room.addParticipant(user.userId, socket.id);
    
    // 通知房间内其他用户
    const otherParticipants = room.getParticipants().filter(id => id !== user.userId);
    otherParticipants.forEach(participantId => {
      const participant = room.participants.get(participantId);
      if (participant) {
        io.to(participant.socketId).emit('user-joined', {
          userId: user.userId,
          nickname: user.nickname,
          roomId
        });
      }
    });

    console.log(`用户 ${user.nickname} 加入房间 ${roomId}`);
    
    socket.emit('room-joined', { 
      roomId,
      callType: room.callType,
      participants: room.getParticipants()
    });
  });

  // WebRTC 信令
  socket.on('offer', (data) => {
    const { roomId, offer, targetUserId } = data;
    const user = users.get(socket.id);
    
    if (!user) {
      socket.emit('error', { message: '用户未登录' });
      return;
    }

    const room = rooms.get(roomId);
    if (!room) {
      socket.emit('error', { message: '房间不存在' });
      return;
    }

    // 转发 offer 给目标用户
    const targetParticipant = room.participants.get(targetUserId);
    if (targetParticipant) {
      io.to(targetParticipant.socketId).emit('offer', {
        offer,
        fromUserId: user.userId,
        fromNickname: user.nickname,
        roomId
      });
    }
  });

  socket.on('answer', (data) => {
    const { roomId, answer, targetUserId } = data;
    const user = users.get(socket.id);
    
    if (!user) {
      socket.emit('error', { message: '用户未登录' });
      return;
    }

    const room = rooms.get(roomId);
    if (!room) {
      socket.emit('error', { message: '房间不存在' });
      return;
    }

    // 转发 answer 给目标用户
    const targetParticipant = room.participants.get(targetUserId);
    if (targetParticipant) {
      io.to(targetParticipant.socketId).emit('answer', {
        answer,
        fromUserId: user.userId,
        roomId
      });
    }
  });

  socket.on('ice-candidate', (data) => {
    const { roomId, candidate, targetUserId } = data;
    const user = users.get(socket.id);
    
    if (!user) {
      socket.emit('error', { message: '用户未登录' });
      return;
    }

    const room = rooms.get(roomId);
    if (!room) {
      socket.emit('error', { message: '房间不存在' });
      return;
    }

    // 转发 ICE candidate 给目标用户
    const targetParticipant = room.participants.get(targetUserId);
    if (targetParticipant) {
      io.to(targetParticipant.socketId).emit('ice-candidate', {
        candidate,
        fromUserId: user.userId,
        roomId
      });
    }
  });

  // 通话状态更新
  socket.on('call-state', (data) => {
    const { roomId, state } = data;
    const user = users.get(socket.id);
    
    if (!user) {
      socket.emit('error', { message: '用户未登录' });
      return;
    }

    const room = rooms.get(roomId);
    if (!room) {
      socket.emit('error', { message: '房间不存在' });
      return;
    }

    // 通知房间内其他用户
    const otherParticipants = room.getParticipants().filter(id => id !== user.userId);
    otherParticipants.forEach(participantId => {
      const participant = room.participants.get(participantId);
      if (participant) {
        io.to(participant.socketId).emit('call-state-update', {
          userId: user.userId,
          state,
          roomId
        });
      }
    });
  });

  // 离开房间
  socket.on('leave-room', (data) => {
    const { roomId } = data;
    const user = users.get(socket.id);
    
    if (!user) {
      return;
    }

    const room = rooms.get(roomId);
    if (room) {
      room.removeParticipant(user.userId);
      
      // 通知房间内其他用户
      const otherParticipants = room.getParticipants();
      otherParticipants.forEach(participantId => {
        const participant = room.participants.get(participantId);
        if (participant) {
          io.to(participant.socketId).emit('user-left', {
            userId: user.userId,
            nickname: user.nickname,
            roomId
          });
        }
      });

      // 如果房间为空，删除房间
      if (room.isEmpty()) {
        rooms.delete(roomId);
        console.log(`房间 ${roomId} 已删除`);
      }
    }
  });

  // 断开连接
  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      console.log(`用户 ${user.nickname} 断开连接`);
      
      // 清理用户的所有房间
      rooms.forEach((room, roomId) => {
        if (room.participants.has(user.userId)) {
          room.removeParticipant(user.userId);
          
          // 通知房间内其他用户
          const otherParticipants = room.getParticipants();
          otherParticipants.forEach(participantId => {
            const participant = room.participants.get(participantId);
            if (participant) {
              io.to(participant.socketId).emit('user-left', {
                userId: user.userId,
                nickname: user.nickname,
                roomId
              });
            }
          });

          // 如果房间为空，删除房间
          if (room.isEmpty()) {
            rooms.delete(roomId);
            console.log(`房间 ${roomId} 已删除`);
          }
        }
      });
      
      users.delete(socket.id);
    }
  });
});

// HTTP API 路由
app.get('/api/signaling/status', (req, res) => {
  res.json({
    status: 'running',
    rooms: rooms.size,
    users: users.size,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/signaling/rooms', (req, res) => {
  const roomList = Array.from(rooms.entries()).map(([id, room]) => ({
    id,
    creator: room.creator,
    participants: room.getParticipants(),
    callType: room.callType,
    createdAt: room.createdAt
  }));
  
  res.json(roomList);
});

// 启动服务器
server.listen(PORT, () => {
  console.log(`🎤 信令服务器运行在端口 ${PORT}`);
  console.log(`📡 WebSocket 服务已启动`);
  console.log(`🌐 访问 http://localhost:${PORT}/api/signaling/status 查看状态`);
});

module.exports = { app, server, io };
