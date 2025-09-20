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

export default function HomeScreen() {
  const [user, setUser] = useState(null);
  const [showThrowModal, setShowThrowModal] = useState(false);
  const [bottleContent, setBottleContent] = useState('');
  const [pickedBottle, setPickedBottle] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    loadUser();
  }, []);

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

  const throwBottle = async () => {
    if (!bottleContent.trim()) {
      Alert.alert('提示', '请输入瓶子内容');
      return;
    }

    if (bottleContent.length > 500) {
      Alert.alert('提示', '瓶子内容不能超过500字');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/bottle/throw`, {
        userId: user.id,
        content: bottleContent.trim(),
      });

      if (response.data.success) {
        Alert.alert('成功', '瓶子已扔出！愿它能找到有缘人 🌊', [
          {
            text: '确定',
            onPress: () => {
              setBottleContent('');
              setShowThrowModal(false);
            }
          }
        ]);
      }
    } catch (error) {
      console.error('扔瓶子错误:', error);
      Alert.alert('错误', '扔瓶子失败，请检查网络连接后重试');
    }
  };

  const pickBottle = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/bottle/pick?userId=${user.id}`);

      if (response.data.success) {
        setPickedBottle(response.data.bottle);
      } else {
        Alert.alert('提示', response.data.message);
      }
    } catch (error) {
      Alert.alert('错误', '捡瓶子失败，请重试');
    }
  };

  const sendReply = async () => {
    if (!replyContent.trim()) {
      Alert.alert('提示', '请输入回复内容');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/message/send`, {
        bottleId: pickedBottle.id,
        senderId: user.id,
        content: replyContent,
      });

      if (response.data.success) {
        Alert.alert('成功', '回复已发送！');
        setReplyContent('');
        setShowReplyModal(false);
        setPickedBottle(null);
      }
    } catch (error) {
      Alert.alert('错误', '发送回复失败，请重试');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>漂流瓶</Text>
        <Text style={styles.subtitle}>欢迎，{user?.nickname}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.pickButton} onPress={pickBottle}>
          <Text style={styles.buttonText}>捡瓶子</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.throwButton} onPress={() => setShowThrowModal(true)}>
          <Text style={styles.buttonText}>🌊 扔瓶子</Text>
        </TouchableOpacity>
      </View>

      {/* 扔瓶子模态框 */}
      <Modal visible={showThrowModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🌊 扔瓶子</Text>
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
                <Text style={styles.confirmButtonText}>🌊 扔出瓶子</Text>
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
                onPress={() => setPickedBottle(null)}
              >
                <Text style={styles.cancelButtonText}>关闭</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={() => setShowReplyModal(true)}
              >
                <Text style={styles.confirmButtonText}>回复</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 回复模态框 */}
      <Modal visible={showReplyModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>回复瓶子</Text>
            <TextInput
              style={styles.textArea}
              placeholder="写下你的回复..."
              value={replyContent}
              onChangeText={setReplyContent}
              multiline
              numberOfLines={6}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowReplyModal(false)}
              >
                <Text style={styles.cancelButtonText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={sendReply}
              >
                <Text style={styles.confirmButtonText}>发送</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
