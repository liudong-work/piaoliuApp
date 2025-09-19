import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  TextInput,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

export default function ProfileScreen() {
  const [user, setUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editNickname, setEditNickname] = useState('');
  const [editAge, setEditAge] = useState('');
  const [editGender, setEditGender] = useState('');

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const userInfo = JSON.parse(userData);
        setUser(userInfo);
        setEditNickname(userInfo.nickname);
        setEditAge(userInfo.age.toString());
        setEditGender(userInfo.gender);
      }
    } catch (error) {
      console.error('加载用户信息失败:', error);
    }
  };

  const selectAvatar = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 300,
      maxHeight: 300,
    };

    launchImageLibrary(options, async (response) => {
      if (response.assets && response.assets[0]) {
        const formData = new FormData();
        formData.append('avatar', {
          uri: response.assets[0].uri,
          type: response.assets[0].type,
          name: response.assets[0].fileName || 'avatar.jpg',
        });
        formData.append('userId', user.id);

        try {
          const uploadResponse = await axios.post(
            `${API_BASE_URL}/user/upload-avatar`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );

          if (uploadResponse.data.success) {
            const updatedUser = uploadResponse.data.user;
            setUser(updatedUser);
            await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
            Alert.alert('成功', '头像更新成功');
          }
        } catch (error) {
          Alert.alert('错误', '头像上传失败');
        }
      }
    });
  };

  const updateProfile = async () => {
    if (!editNickname || !editAge || !editGender) {
      Alert.alert('提示', '请填写完整信息');
      return;
    }

    try {
      const updatedUser = {
        ...user,
        nickname: editNickname,
        age: parseInt(editAge),
        gender: editGender,
      };

      setUser(updatedUser);
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setShowEditModal(false);
      Alert.alert('成功', '个人信息更新成功');
    } catch (error) {
      Alert.alert('错误', '更新失败，请重试');
    }
  };

  const logout = async () => {
    Alert.alert(
      '确认退出',
      '确定要退出登录吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          onPress: async () => {
            await AsyncStorage.removeItem('user');
            // 这里应该导航到登录页面
          },
        },
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>加载中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>个人资料</Text>
      </View>

      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={selectAvatar} style={styles.avatarContainer}>
          {user.avatar ? (
            <Image source={{ uri: `http://localhost:3000${user.avatar}` }} style={styles.avatar} />
          ) : (
            <View style={styles.defaultAvatar}>
              <Text style={styles.defaultAvatarText}>{user.nickname.charAt(0)}</Text>
            </View>
          )}
          <Text style={styles.changeAvatarText}>点击更换头像</Text>
        </TouchableOpacity>

        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>昵称</Text>
            <Text style={styles.infoValue}>{user.nickname}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>性别</Text>
            <Text style={styles.infoValue}>{user.gender}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>年龄</Text>
            <Text style={styles.infoValue}>{user.age}岁</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setShowEditModal(true)}
        >
          <Text style={styles.editButtonText}>编辑资料</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>退出登录</Text>
        </TouchableOpacity>
      </View>

      {/* 编辑资料模态框 */}
      <Modal visible={showEditModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>编辑资料</Text>
            
            <TextInput
              style={styles.input}
              placeholder="昵称"
              value={editNickname}
              onChangeText={setEditNickname}
            />

            <View style={styles.genderContainer}>
              <Text style={styles.label}>性别：</Text>
              <TouchableOpacity
                style={[styles.genderButton, editGender === '男' && styles.genderButtonActive]}
                onPress={() => setEditGender('男')}
              >
                <Text style={[styles.genderText, editGender === '男' && styles.genderTextActive]}>男</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.genderButton, editGender === '女' && styles.genderButtonActive]}
                onPress={() => setEditGender('女')}
              >
                <Text style={[styles.genderText, editGender === '女' && styles.genderTextActive]}>女</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="年龄"
              value={editAge}
              onChangeText={setEditAge}
              keyboardType="numeric"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.cancelButtonText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={updateProfile}
              >
                <Text style={styles.confirmButtonText}>保存</Text>
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
  profileContainer: {
    flex: 1,
    padding: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  defaultAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  defaultAvatarText: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
  },
  changeAvatarText: {
    color: '#2196F3',
    fontSize: 14,
  },
  infoContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  editButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  logoutButtonText: {
    color: '#666',
    fontSize: 16,
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
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  genderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginRight: 10,
  },
  genderButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
  },
  genderButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  genderText: {
    fontSize: 16,
    color: '#666',
  },
  genderTextActive: {
    color: 'white',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
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
    backgroundColor: '#2196F3',
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
});
