import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  ScrollView,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

interface User {
  id: string;
  nickname: string;
  gender: string;
  age: number;
  avatar?: string;
}

interface Bottle {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
  isPicked: boolean;
  pickedBy?: string;
  author: User;
}

export default function HomeScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [showThrowModal, setShowThrowModal] = useState(false);
  const [bottleContent, setBottleContent] = useState('');
  const [pickedBottle, setPickedBottle] = useState<Bottle | null>(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replyToBottle, setReplyToBottle] = useState<Bottle | null>(null);

  useEffect(() => {
    const initializeUser = async () => {
      await loadUser();
      // 如果加载用户后仍然没有用户，自动创建一个测试用户
      const userData = await AsyncStorage.getItem('user');
      if (!userData) {
        await createTestUser();
      }
    };
    initializeUser();
  }, []);

  useEffect(() => {
    console.log('回复模态框状态变化:', showReplyModal);
    if (showReplyModal) {
      console.log('✅ 回复模态框状态已设置为true，应该显示模态框');
    }
  }, [showReplyModal]);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      console.log('从AsyncStorage加载的用户数据:', userData);
      if (userData) {
        const parsedUser = JSON.parse(userData);
        console.log('解析后的用户数据:', parsedUser);
        setUser(parsedUser);
      } else {
        console.log('没有找到用户数据，用户未登录');
      }
    } catch (error) {
      console.error('加载用户信息失败:', error);
    }
  };

  const createTestUser = async () => {
    try {
      console.log('创建测试用户...');
      const response = await axios.post(`${API_BASE_URL}/user/register`, {
        nickname: `测试用户${Math.floor(Math.random() * 1000)}`,
        gender: Math.random() > 0.5 ? '男' : '女',
        age: Math.floor(Math.random() * 20) + 18, // 18-37岁
      });

      if (response.data.success) {
        console.log('测试用户创建成功:', response.data.user);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('创建测试用户失败:', error);
    }
  };

  const throwBottle = async () => {
    if (!user) {
      Alert.alert('提示', '请先登录');
      return;
    }

    if (!bottleContent.trim()) {
      Alert.alert('提示', '请输入漂流瓶内容');
      return;
    }

    if (bottleContent.length > 500) {
      Alert.alert('提示', '漂流瓶内容不能超过500字');
      return;
    }

    try {
      console.log('扔瓶子请求:', { userId: user.id, content: bottleContent.trim() });
      const response = await axios.post(`${API_BASE_URL}/bottle/throw`, {
        userId: user.id,
        content: bottleContent.trim(),
      });

      console.log('扔瓶子响应:', response.data);
      if (response.data.success) {
        Alert.alert('成功', '漂流瓶已投掷！愿它能漂向有缘人 🌊', [
          {
            text: '确定',
            onPress: () => {
              setBottleContent('');
              setShowThrowModal(false);
            }
          }
        ]);
      } else {
        Alert.alert('错误', response.data.message || '投掷漂流瓶失败');
      }
    } catch (error) {
      console.error('扔瓶子错误:', error);
      Alert.alert('错误', '投掷漂流瓶失败，请检查网络连接后重试');
    }
  };

  const pickBottle = async () => {
    console.log('点击捡瓶子按钮:', { 
      user: user ? { id: user.id, nickname: user.nickname } : null
    });

    if (!user) {
      Alert.alert('提示', '请先登录');
      return;
    }

    try {
      console.log('捡瓶子请求:', { userId: user.id });
      const response = await axios.get(`${API_BASE_URL}/bottle/pick?userId=${user.id}`);

      console.log('捡瓶子响应:', response.data);
      if (response.data.success) {
        setPickedBottle(response.data.bottle);
        console.log('成功捡到瓶子:', response.data.bottle);
      } else {
        Alert.alert('提示', response.data.message);
      }
    } catch (error) {
      console.error('捡瓶子错误:', error);
      Alert.alert('错误', '捡瓶子失败，请重试');
    }
  };

  const sendReply = async () => {
    console.log('发送回复开始:', { 
      user: user ? { id: user.id, nickname: user.nickname } : null,
      replyToBottle: replyToBottle ? { id: replyToBottle.id, content: replyToBottle.content } : null,
      replyContent: replyContent
    });

    if (!user) {
      Alert.alert('提示', '请先登录');
      return;
    }
    
    if (!replyToBottle) {
      Alert.alert('提示', '没有找到瓶子信息');
      return;
    }

    if (!replyContent.trim()) {
      Alert.alert('提示', '请输入回复内容');
      return;
    }

    try {
      console.log('发送回复请求:', {
        bottleId: replyToBottle.id,
        senderId: user.id,
        content: replyContent.trim()
      });

      const response = await axios.post(`${API_BASE_URL}/message/send`, {
        bottleId: replyToBottle.id,
        senderId: user.id,
        content: replyContent.trim(),
      });

      console.log('发送回复响应:', response.data);
      
      if (response.data.success) {
        Alert.alert('成功', '回复已发送！');
        setReplyContent('');
        setShowReplyModal(false);
        setReplyToBottle(null);
        setPickedBottle(null);
      } else {
        Alert.alert('错误', response.data.message || '发送回复失败');
      }
    } catch (error) {
      console.error('发送回复错误:', error);
      Alert.alert('错误', '发送回复失败，请重试');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>漂流瓶</Text>
        <Text style={styles.subtitle}>
          {user ? `欢迎，${user.nickname}` : '请先登录'}
        </Text>
        {user && (
          <Text style={styles.userInfo}>
            用户ID: {user.id} | {user.gender} | {user.age}岁
          </Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.pickButton} onPress={pickBottle}>
          <Text style={styles.buttonText}>捡瓶子</Text>
        </TouchableOpacity>

            <TouchableOpacity style={styles.throwButton} onPress={() => setShowThrowModal(true)}>
              <Text style={styles.buttonText}>🌊 投掷漂流瓶</Text>
            </TouchableOpacity>
      </View>

      {/* 扔瓶子模态框 */}
      <Modal visible={showThrowModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>🌊 投掷漂流瓶</Text>
            <Text style={styles.modalSubtitle}>写下你想说的话，让瓶子带着你的心声漂向远方...</Text>
            <TextInput
              style={styles.textArea}
              placeholder="分享你的心情、故事或想法..."
              value={bottleContent}
              onChangeText={setBottleContent}
              multiline
              numberOfLines={6}
              maxLength={500}
            />
            <Text style={styles.charCount}>
              {bottleContent.length}/500
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setBottleContent('');
                  setShowThrowModal(false);
                }}
              >
                <Text style={styles.cancelButtonText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton, 
                  styles.confirmButton,
                  !bottleContent.trim() && styles.disabledButton
                ]}
                onPress={throwBottle}
                disabled={!bottleContent.trim()}
              >
                    <Text style={styles.confirmButtonText}>🌊 投掷瓶子</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 捡到的瓶子模态框 */}
      <Modal visible={pickedBottle !== null} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>捡到的瓶子</Text>
            {pickedBottle && (
              <View style={styles.bottleContent}>
                <View style={styles.authorInfo}>
                  {pickedBottle.author.avatar ? (
                    <Image source={{ uri: pickedBottle.author.avatar }} style={styles.avatar} />
                  ) : (
                    <View style={styles.defaultAvatar}>
                      <Text style={styles.defaultAvatarText}>
                        {pickedBottle.author.nickname.charAt(0)}
                      </Text>
                    </View>
                  )}
                  <View>
                    <Text style={styles.authorName}>{pickedBottle.author.nickname}</Text>
                    <Text style={styles.authorDetails}>
                      {pickedBottle.author.gender} · {pickedBottle.author.age}岁
                    </Text>
                  </View>
                </View>
                <Text style={styles.bottleText}>{pickedBottle.content}</Text>
              </View>
            )}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  console.log('关闭捡瓶子模态框');
                  setPickedBottle(null);
                }}
              >
                <Text style={styles.cancelButtonText}>关闭</Text>
              </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.confirmButton]}
                    onPress={() => {
                      console.log('=== 回复按钮被点击 ===');
                      
                      if (!user) {
                        Alert.alert('提示', '请先登录');
                        return;
                      }
                      
                      if (!pickedBottle) {
                        Alert.alert('提示', '没有找到瓶子信息');
                        return;
                      }
                      
                      // 先保存瓶子信息，然后关闭捡瓶子模态框，最后显示回复模态框
                      console.log('保存瓶子信息，准备显示回复模态框');
                      setReplyToBottle(pickedBottle); // 保存瓶子信息
                      setPickedBottle(null); // 关闭捡瓶子模态框
                      
                      // 延迟显示回复模态框，确保捡瓶子模态框完全关闭
                      setTimeout(() => {
                        console.log('延迟设置回复模态框为true');
                        setShowReplyModal(true);
                      }, 300);
                    }}
                  >
                <Text style={styles.confirmButtonText}>回复</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 回复模态框 - 使用条件渲染 */}
      {showReplyModal && (
        <Modal 
          visible={true} 
          animationType="slide" 
          transparent={true}
          onRequestClose={() => {
            console.log('回复模态框关闭');
            setShowReplyModal(false);
            setReplyToBottle(null);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>回复瓶子</Text>
                  <Text style={styles.modalSubtitle}>回复给: {replyToBottle?.author?.nickname || '未知用户'}</Text>
              <Text style={{color: 'red', fontSize: 18, textAlign: 'center', marginBottom: 10, fontWeight: 'bold'}}>
                🎉 回复模态框已显示！状态: {showReplyModal.toString()}
              </Text>
              <TextInput
                style={styles.textArea}
                placeholder="写下你的回复..."
                value={replyContent}
                onChangeText={setReplyContent}
                multiline
                numberOfLines={6}
                maxLength={500}
              />
              <Text style={styles.charCount}>
                {replyContent.length}/500
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                      onPress={() => {
                        console.log('取消回复');
                        setReplyContent('');
                        setShowReplyModal(false);
                        setReplyToBottle(null);
                      }}
                >
                  <Text style={styles.cancelButtonText}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.modalButton, 
                    styles.confirmButton,
                    !replyContent.trim() && styles.disabledButton
                  ]}
                  onPress={() => {
                    console.log('点击发送回复按钮');
                    sendReply();
                  }}
                  disabled={!replyContent.trim()}
                >
                  <Text style={styles.confirmButtonText}>发送</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#00BCD4',
    padding: 20,
    paddingTop: 50,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  userInfo: {
    fontSize: 12,
    color: 'white',
    opacity: 0.7,
    marginTop: 5,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  pickButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 25,
    marginBottom: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  throwButton: {
    backgroundColor: '#00BCD4',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#00BCD4',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    textAlignVertical: 'top',
    marginBottom: 10,
    minHeight: 120,
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  confirmButton: {
    backgroundColor: '#00BCD4',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottleContent: {
    marginBottom: 20,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  defaultAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  defaultAvatarText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  authorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  authorDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  bottleText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});
