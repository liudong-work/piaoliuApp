import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  Modal,
  TextInput,
  Alert,
  AppState,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import io from 'socket.io-client';
// import WebRTCCallManager, { CallState, CallType } from '../utils/WebRTCCallManager';
// import CallScreen from '../components/CallScreen';

const API_BASE_URL = 'http://localhost:3000/api';

interface Message {
  id: string;
  content: string;
  createdAt: string;
  bottleId: string;
  senderId: string;
  receiverId: string;
  sender: {
    nickname: string;
    avatar: string;
  };
  receiver: {
    nickname: string;
    avatar: string;
  };
  conversationWith: {
    nickname: string;
    avatar: string;
  };
  isMyMessage: boolean;
}

interface ChatMessage {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  receiverId: string;
  sender: {
    nickname: string;
    avatar: string;
  };
}

interface User {
  id: string;
  nickname: string;
  gender: string;
  age: number;
  avatar?: string;
}

export default function MessagesScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [replyContent, setReplyContent] = useState('');
  
  // 通话相关状态 (暂时禁用)
  // const [socket, setSocket] = useState<any>(null);
  // const [callManager, setCallManager] = useState<WebRTCCallManager | null>(null);
  // const [showCallScreen, setShowCallScreen] = useState(false);
  // const [callState, setCallState] = useState(CallState.IDLE);
  // const [callType, setCallType] = useState(CallType.AUDIO);
  // const [remoteUser, setRemoteUser] = useState<User | null>(null);
  // const [localStream, setLocalStream] = useState<any>(null);
  // const [remoteStream, setRemoteStream] = useState<any>(null);
  // const [isMuted, setIsMuted] = useState(false);
  // const [isCameraOff, setIsCameraOff] = useState(false);

  useEffect(() => {
    loadUser();
    // initializeCallSystem(); // 暂时禁用
  }, []);

  // 初始化通话系统
  const initializeCallSystem = async () => {
    try {
      // 创建Socket.io连接
      const newSocket = io('http://localhost:3001');
      setSocket(newSocket);

      // 创建WebRTC管理器
      const manager = new WebRTCCallManager();
      manager.setSocket(newSocket);
      manager.setEventListeners({
        onCallStateChange: (state: any) => {
          setCallState(state);
          if (state === CallState.ENDED || state === CallState.ERROR) {
            setShowCallScreen(false);
            setRemoteUser(null);
            setLocalStream(null);
            setRemoteStream(null);
          }
        },
        onRemoteStream: (stream: any) => {
          setRemoteStream(stream);
        },
        onError: (error: any) => {
          console.error('通话错误:', error);
          Alert.alert('通话错误', error.message || '未知错误');
        },
      });
      setCallManager(manager);

      // Socket.io事件监听
      newSocket.on('connect', () => {
        console.log('Socket.io 连接成功');
      });

      newSocket.on('disconnect', () => {
        console.log('Socket.io 连接断开');
      });

      newSocket.on('error', (error) => {
        console.error('Socket.io 错误:', error);
      });

    } catch (error) {
      console.error('初始化通话系统失败:', error);
    }
  };

  useEffect(() => {
    if (user) {
      loadMessages();
      // 用户加入Socket.io房间 (暂时禁用)
      // socket.emit('join', {
      //   userId: user.id,
      //   nickname: user.nickname,
      // });
    }
  }, [user]);

  // 添加定时刷新和焦点刷新
  useEffect(() => {
    if (!user) return;

    // 定时刷新消息列表（每30秒）
    const interval = setInterval(() => {
      loadMessages();
    }, 10000);

    // 页面获得焦点时刷新
    const handleFocus = () => {
      loadMessages();
    };

    // 监听应用状态变化
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        loadMessages();
      }
    });

    return () => {
      clearInterval(interval);
      subscription?.remove();
    };
  }, [user]);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('加载用户信息失败:', error);
    }
  };

  const loadMessages = async () => {
    if (!user) return;
    
    try {
      console.log('加载消息，用户ID:', user.id);
      const response = await axios.get(`${API_BASE_URL}/messages/${user.id}`);
      console.log('消息API响应:', response.data);
      if (response.data.success) {
        setMessages(response.data.messages);
        console.log('消息数量:', response.data.messages.length);
      }
    } catch (error) {
      console.error('加载消息失败:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMessages();
    setRefreshing(false);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return '刚刚';
    } else if (diffInHours < 24) {
      return `${diffInHours}小时前`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}天前`;
    }
  };

  // 通话相关函数 (暂时禁用)
  const startAudioCall = async (message: Message) => {
    Alert.alert('功能暂未开放', '语音通话功能正在开发中，敬请期待！');
  };

  const startVideoCall = async (message: Message) => {
    Alert.alert('功能暂未开放', '视频通话功能正在开发中，敬请期待！');
  };

  const loadChatMessages = async (message: Message) => {
    try {
      // 调用后端API加载聊天记录
      const response = await axios.get(`${API_BASE_URL}/messages/chat/${message.bottleId}`);
      
      if (response.data.success) {
        setChatMessages(response.data.messages);
      } else {
        // 如果API失败，使用模拟数据
        const mockChatMessages: ChatMessage[] = [
          {
            id: message.id,
            content: message.content,
            createdAt: message.createdAt,
            senderId: 'other-user-id', // 设置为其他用户ID，确保显示在左侧
            receiverId: user?.id || '',
            sender: message.sender
          }
        ];
        setChatMessages(mockChatMessages);
      }
    } catch (error) {
      console.error('加载聊天记录失败:', error);
      // 使用模拟数据作为备选
      const mockChatMessages: ChatMessage[] = [
        {
          id: message.id,
          content: message.content,
          createdAt: message.createdAt,
          senderId: 'other-user-id', // 设置为其他用户ID，确保显示在左侧
          receiverId: user?.id || '',
          sender: message.sender
        }
      ];
      setChatMessages(mockChatMessages);
    }
  };

  const sendReply = async () => {
    if (!replyContent.trim()) {
      Alert.alert('提示', '请输入回复内容');
      return;
    }

    if (!user || !selectedMessage) {
      Alert.alert('提示', '用户信息或消息信息缺失');
      return;
    }

    try {
      console.log('发送回复:', {
        bottleId: selectedMessage.bottleId,
        senderId: user.id,
        content: replyContent.trim()
      });

      const response = await axios.post(`${API_BASE_URL}/message/send`, {
        bottleId: selectedMessage.bottleId,
        senderId: user.id,
        content: replyContent.trim(),
      });

      console.log('发送回复响应:', response.data);
      
      if (response.data.success) {
        Alert.alert('成功', '回复已发送！');
        
        // 立即将新消息添加到聊天记录中
        const newMessage: ChatMessage = {
          id: response.data.message.id,
          content: replyContent.trim(),
          createdAt: response.data.message.createdAt,
          senderId: user.id,
          receiverId: selectedMessage.sender.nickname, // 简化处理
          sender: {
            nickname: user.nickname,
            avatar: user.avatar || ''
          }
        };
        
        setChatMessages(prev => [...prev, newMessage]);
        setReplyContent('');
        
        // 重新加载消息列表
        loadMessages();
      } else {
        Alert.alert('错误', response.data.message || '发送回复失败');
      }
    } catch (error) {
      console.error('发送回复失败:', error);
      Alert.alert('错误', '发送回复失败，请重试');
    }
  };

  const handleMessagePress = (message: Message) => {
    console.log('点击消息:', message);
    setSelectedMessage(message);
    setShowChatModal(true);
    loadChatMessages(message);
  };

  // 聊天界面的实时刷新
  useEffect(() => {
    if (!showChatModal || !selectedMessage) return;

    // 定时刷新聊天记录（每10秒）
    const interval = setInterval(() => {
      loadChatMessages(selectedMessage);
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [showChatModal, selectedMessage]);

  const renderMessage = ({ item }: { item: Message }) => (
    <TouchableOpacity 
      style={styles.messageItem}
      onPress={() => handleMessagePress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.messageHeader}>
        {item.conversationWith.avatar ? (
          <Image 
            source={{ uri: `http://localhost:3000${item.conversationWith.avatar}` }} 
            style={styles.avatar} 
          />
        ) : (
          <View style={styles.defaultAvatar}>
            <Text style={styles.defaultAvatarText}>
              {item.conversationWith.nickname.charAt(0)}
            </Text>
          </View>
        )}
        <View style={styles.messageInfo}>
          <Text style={styles.senderName}>
            与 {item.conversationWith.nickname} 的对话
          </Text>
          <Text style={styles.messageTime}>{formatTime(item.createdAt)}</Text>
        </View>
        {item.isMyMessage && (
          <View style={styles.myMessageIndicator}>
            <Text style={styles.myMessageText}>我</Text>
          </View>
        )}
      </View>
      <Text style={styles.messageContent}>
        {item.isMyMessage ? `我: ${item.content}` : `${item.sender.nickname}: ${item.content}`}
      </Text>
    </TouchableOpacity>
  );

  const renderChatMessage = ({ item }: { item: ChatMessage }) => {
    const isMyMessage = item.senderId === user?.id;
    
    return (
      <View style={[
        styles.chatMessageItem,
        isMyMessage ? styles.myMessage : styles.otherMessage
      ]}>
        <View style={[
          styles.chatMessageContainer,
          isMyMessage ? styles.myMessageContainer : styles.otherMessageContainer
        ]}>
          {/* 头像 */}
          <View style={styles.chatAvatarContainer}>
            {item.sender.avatar ? (
              <Image 
                source={{ uri: `http://localhost:3000${item.sender.avatar}` }} 
                style={styles.chatAvatar} 
              />
            ) : (
              <View style={styles.chatDefaultAvatar}>
                <Text style={styles.chatDefaultAvatarText}>
                  {item.sender.nickname.charAt(0)}
                </Text>
              </View>
            )}
          </View>
          
          {/* 消息内容 */}
          <View style={styles.chatMessageContentContainer}>
            <Text style={[
              styles.chatMessageContent,
              isMyMessage ? styles.myMessageContent : styles.otherMessageContent
            ]}>
              {item.content}
            </Text>
            <Text style={styles.chatMessageTime}>{formatTime(item.createdAt)}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>消息</Text>
      </View>

      {messages.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>暂无对话</Text>
          <Text style={styles.emptySubtext}>当你扔瓶子或回复消息时，对话会显示在这里</Text>
        </View>
      ) : (
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messageList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      {/* 聊天模态框 */}
      <Modal
        visible={showChatModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => {
          setShowChatModal(false);
          setSelectedMessage(null);
          setChatMessages([]);
          setReplyContent('');
        }}
      >
        <View style={styles.chatContainer}>
          {/* 聊天头部 */}
          <View style={styles.chatHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                setShowChatModal(false);
                setSelectedMessage(null);
                setChatMessages([]);
                setReplyContent('');
              }}
            >
              <Text style={styles.backButtonText}>← 返回</Text>
            </TouchableOpacity>
            <Text style={styles.chatTitle}>
              与 {selectedMessage?.sender.nickname} 的对话
            </Text>
            
            {/* 通话按钮 */}
            <View style={styles.callButtons}>
              <TouchableOpacity
                style={styles.callButton}
                onPress={() => selectedMessage && startAudioCall(selectedMessage)}
              >
                <Icon name="phone" size={20} color="#007AFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.callButton}
                onPress={() => selectedMessage && startVideoCall(selectedMessage)}
              >
                <Icon name="videocam" size={20} color="#007AFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* 聊天消息列表 */}
          <FlatList
            data={chatMessages}
            renderItem={renderChatMessage}
            keyExtractor={(item) => item.id}
            style={styles.chatMessageList}
            showsVerticalScrollIndicator={false}
          />

          {/* 回复输入框 */}
          <View style={styles.replyContainer}>
            <TextInput
              style={styles.replyInput}
              placeholder="输入回复..."
              value={replyContent}
              onChangeText={setReplyContent}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                !replyContent.trim() && styles.disabledButton
              ]}
              onPress={sendReply}
              disabled={!replyContent.trim()}
            >
              <Text style={styles.sendButtonText}>发送</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 通话界面 (暂时禁用) */}
      {/* {showCallScreen && (
        <CallScreen
          callType={callType}
          remoteUser={remoteUser || undefined}
          isIncoming={false}
          onEndCall={endCall}
          onAcceptCall={acceptCall}
          onRejectCall={rejectCall}
          localStream={localStream}
          remoteStream={remoteStream}
          callState={callState}
          isMuted={isMuted}
          isCameraOff={isCameraOff}
          onToggleMute={toggleMute}
          onToggleCamera={toggleCamera}
          onSwitchCamera={switchCamera}
        />
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 20,
    paddingTop: 50,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  messageList: {
    flex: 1,
    padding: 15,
  },
  messageItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  defaultAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  defaultAvatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageInfo: {
    flex: 1,
  },
  senderName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  messageTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  messageContent: {
    fontSize: 16,
    lineHeight: 22,
    color: '#333',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  // 聊天相关样式
  chatContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  chatHeader: {
    backgroundColor: '#2196F3',
    padding: 15,
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  callButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatMessageList: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  chatMessageItem: {
    marginBottom: 12,
    paddingHorizontal: 15,
  },
  myMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  chatMessageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    maxWidth: '85%',
  },
  myMessageContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-end',
  },
  otherMessageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  chatAvatarContainer: {
    marginHorizontal: 6,
    marginBottom: 2,
  },
  chatAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  chatDefaultAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatDefaultAvatarText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
  },
  chatMessageContentContainer: {
    maxWidth: '80%',
  },
  chatMessageContent: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    fontSize: 15,
    lineHeight: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  myMessageContent: {
    backgroundColor: '#007AFF',
    color: 'white',
    borderBottomRightRadius: 4,
  },
  otherMessageContent: {
    backgroundColor: '#F1F1F1',
    color: '#333',
    borderBottomLeftRadius: 4,
  },
  chatMessageTime: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    textAlign: 'center',
  },
  replyContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'flex-end',
  },
  replyInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // 新增样式
  myMessageIndicator: {
    backgroundColor: '#2196F3',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  myMessageText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
