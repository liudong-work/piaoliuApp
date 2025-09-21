import { RTCPeerConnection, RTCView, mediaDevices } from 'react-native-webrtc';

// WebRTC 配置
const configuration = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302',
    },
    {
      urls: 'stun:stun1.l.google.com:19302',
    },
  ],
};

// 通话状态枚举
export const CallState = {
  IDLE: 'idle',
  CALLING: 'calling',
  RINGING: 'ringing',
  CONNECTED: 'connected',
  ENDED: 'ended',
  ERROR: 'error',
};

// 通话类型枚举
export const CallType = {
  AUDIO: 'audio',
  VIDEO: 'video',
};

class WebRTCCallManager {
  constructor() {
    this.peerConnection = null;
    this.localStream = null;
    this.remoteStream = null;
    this.callState = CallState.IDLE;
    this.callType = CallType.AUDIO;
    this.roomId = null;
    this.targetUserId = null;
    this.socket = null;
    
    // 事件监听器
    this.onCallStateChange = null;
    this.onRemoteStream = null;
    this.onError = null;
  }

  // 设置事件监听器
  setEventListeners({ onCallStateChange, onRemoteStream, onError }) {
    this.onCallStateChange = onCallStateChange;
    this.onRemoteStream = onRemoteStream;
    this.onError = onError;
  }

  // 设置 Socket.io 连接
  setSocket(socket) {
    this.socket = socket;
    this.setupSocketListeners();
  }

  // 设置 Socket.io 事件监听
  setupSocketListeners() {
    if (!this.socket) return;

    this.socket.on('offer', this.handleOffer.bind(this));
    this.socket.on('answer', this.handleAnswer.bind(this));
    this.socket.on('ice-candidate', this.handleIceCandidate.bind(this));
    this.socket.on('user-joined', this.handleUserJoined.bind(this));
    this.socket.on('user-left', this.handleUserLeft.bind(this));
    this.socket.on('call-state-update', this.handleCallStateUpdate.bind(this));
  }

  // 初始化 PeerConnection
  async initializePeerConnection() {
    try {
      this.peerConnection = new RTCPeerConnection(configuration);
      
      // 设置 ICE candidate 处理
      this.peerConnection.onicecandidate = (event) => {
        if (event.candidate && this.socket && this.targetUserId) {
          this.socket.emit('ice-candidate', {
            roomId: this.roomId,
            candidate: event.candidate,
            targetUserId: this.targetUserId,
          });
        }
      };

      // 处理远程流
      this.peerConnection.onaddstream = (event) => {
        console.log('收到远程流:', event.stream);
        this.remoteStream = event.stream;
        if (this.onRemoteStream) {
          this.onRemoteStream(event.stream);
        }
      };

      // 连接状态变化
      this.peerConnection.onconnectionstatechange = () => {
        console.log('连接状态:', this.peerConnection.connectionState);
        if (this.peerConnection.connectionState === 'connected') {
          this.updateCallState(CallState.CONNECTED);
        } else if (this.peerConnection.connectionState === 'disconnected') {
          this.updateCallState(CallState.ENDED);
        }
      };

      return true;
    } catch (error) {
      console.error('初始化 PeerConnection 失败:', error);
      this.handleError(error);
      return false;
    }
  }

  // 获取本地媒体流
  async getLocalStream(callType = CallType.AUDIO) {
    try {
      const constraints = {
        audio: true,
        video: callType === CallType.VIDEO ? {
          width: { min: 640, ideal: 1280, max: 1920 },
          height: { min: 480, ideal: 720, max: 1080 },
          frameRate: { min: 15, ideal: 30, max: 60 },
        } : false,
      };

      this.localStream = await mediaDevices.getUserMedia(constraints);
      this.callType = callType;
      
      console.log('获取本地流成功:', this.localStream);
      return this.localStream;
    } catch (error) {
      console.error('获取本地流失败:', error);
      this.handleError(error);
      return null;
    }
  }

  // 开始通话
  async startCall(targetUserId, callType = CallType.AUDIO) {
    try {
      this.targetUserId = targetUserId;
      this.callType = callType;
      this.updateCallState(CallState.CALLING);

      // 初始化 PeerConnection
      const initialized = await this.initializePeerConnection();
      if (!initialized) {
        throw new Error('PeerConnection 初始化失败');
      }

      // 获取本地流
      const localStream = await this.getLocalStream(callType);
      if (!localStream) {
        throw new Error('获取本地流失败');
      }

      // 添加本地流到 PeerConnection
      this.peerConnection.addStream(localStream);

      // 创建房间
      if (this.socket) {
        this.socket.emit('create-room', {
          callType,
          targetUserId,
        });
      }

      return true;
    } catch (error) {
      console.error('开始通话失败:', error);
      this.handleError(error);
      return false;
    }
  }

  // 接听通话
  async answerCall(roomId, callType = CallType.AUDIO) {
    try {
      this.roomId = roomId;
      this.callType = callType;
      this.updateCallState(CallState.RINGING);

      // 初始化 PeerConnection
      const initialized = await this.initializePeerConnection();
      if (!initialized) {
        throw new Error('PeerConnection 初始化失败');
      }

      // 获取本地流
      const localStream = await this.getLocalStream(callType);
      if (!localStream) {
        throw new Error('获取本地流失败');
      }

      // 添加本地流到 PeerConnection
      this.peerConnection.addStream(localStream);

      // 加入房间
      if (this.socket) {
        this.socket.emit('join-room', { roomId });
      }

      return true;
    } catch (error) {
      console.error('接听通话失败:', error);
      this.handleError(error);
      return false;
    }
  }

  // 处理收到的 Offer
  async handleOffer(data) {
    try {
      const { offer, fromUserId, roomId } = data;
      this.roomId = roomId;
      this.targetUserId = fromUserId;

      console.log('收到 Offer:', offer);

      // 设置远程描述
      await this.peerConnection.setRemoteDescription(offer);

      // 创建 Answer
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);

      // 发送 Answer
      if (this.socket) {
        this.socket.emit('answer', {
          roomId,
          answer,
          targetUserId: fromUserId,
        });
      }

      console.log('发送 Answer 成功');
    } catch (error) {
      console.error('处理 Offer 失败:', error);
      this.handleError(error);
    }
  }

  // 处理收到的 Answer
  async handleAnswer(data) {
    try {
      const { answer } = data;
      console.log('收到 Answer:', answer);

      // 设置远程描述
      await this.peerConnection.setRemoteDescription(answer);
      console.log('设置远程描述成功');
    } catch (error) {
      console.error('处理 Answer 失败:', error);
      this.handleError(error);
    }
  }

  // 处理 ICE Candidate
  async handleIceCandidate(data) {
    try {
      const { candidate } = data;
      console.log('收到 ICE Candidate:', candidate);

      // 添加 ICE Candidate
      await this.peerConnection.addIceCandidate(candidate);
      console.log('添加 ICE Candidate 成功');
    } catch (error) {
      console.error('处理 ICE Candidate 失败:', error);
      this.handleError(error);
    }
  }

  // 处理用户加入
  handleUserJoined(data) {
    console.log('用户加入:', data);
    this.updateCallState(CallState.RINGING);
  }

  // 处理用户离开
  handleUserLeft(data) {
    console.log('用户离开:', data);
    this.updateCallState(CallState.ENDED);
  }

  // 处理通话状态更新
  handleCallStateUpdate(data) {
    console.log('通话状态更新:', data);
    // 可以在这里处理其他用户的通话状态变化
  }

  // 创建 Offer
  async createOffer() {
    try {
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);

      // 发送 Offer
      if (this.socket && this.targetUserId) {
        this.socket.emit('offer', {
          roomId: this.roomId,
          offer,
          targetUserId: this.targetUserId,
        });
      }

      console.log('发送 Offer 成功');
      return offer;
    } catch (error) {
      console.error('创建 Offer 失败:', error);
      this.handleError(error);
      return null;
    }
  }

  // 切换摄像头
  async switchCamera() {
    if (this.localStream && this.callType === CallType.VIDEO) {
      try {
        const videoTrack = this.localStream.getVideoTracks()[0];
        if (videoTrack) {
          await videoTrack._switchCamera();
          console.log('切换摄像头成功');
        }
      } catch (error) {
        console.error('切换摄像头失败:', error);
        this.handleError(error);
      }
    }
  }

  // 静音/取消静音
  toggleMute() {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        console.log('静音状态:', !audioTrack.enabled);
        return !audioTrack.enabled;
      }
    }
    return false;
  }

  // 开启/关闭摄像头
  toggleCamera() {
    if (this.localStream && this.callType === CallType.VIDEO) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        console.log('摄像头状态:', !videoTrack.enabled);
        return !videoTrack.enabled;
      }
    }
    return false;
  }

  // 结束通话
  endCall() {
    try {
      this.updateCallState(CallState.ENDED);

      // 清理 PeerConnection
      if (this.peerConnection) {
        this.peerConnection.close();
        this.peerConnection = null;
      }

      // 清理本地流
      if (this.localStream) {
        this.localStream.getTracks().forEach(track => track.stop());
        this.localStream = null;
      }

      // 清理远程流
      this.remoteStream = null;

      // 离开房间
      if (this.socket && this.roomId) {
        this.socket.emit('leave-room', { roomId: this.roomId });
      }

      // 重置状态
      this.roomId = null;
      this.targetUserId = null;

      console.log('通话结束');
    } catch (error) {
      console.error('结束通话失败:', error);
      this.handleError(error);
    }
  }

  // 更新通话状态
  updateCallState(newState) {
    this.callState = newState;
    if (this.onCallStateChange) {
      this.onCallStateChange(newState);
    }
  }

  // 错误处理
  handleError(error) {
    console.error('WebRTC 错误:', error);
    this.updateCallState(CallState.ERROR);
    if (this.onError) {
      this.onError(error);
    }
  }

  // 获取当前状态
  getState() {
    return {
      callState: this.callState,
      callType: this.callType,
      roomId: this.roomId,
      targetUserId: this.targetUserId,
      hasLocalStream: !!this.localStream,
      hasRemoteStream: !!this.remoteStream,
    };
  }
}

export default WebRTCCallManager;
