import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

export default function LoginScreen({ navigation }) {
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');

  const handleRegister = async () => {
    if (!nickname || !gender || !age) {
      Alert.alert('提示', '请填写完整信息');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/user/register`, {
        nickname,
        gender,
        age: parseInt(age),
      });

      if (response.data.success) {
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
        navigation.replace('Main');
      }
    } catch (error) {
      Alert.alert('错误', '注册失败，请重试');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>漂流瓶</Text>
        <Text style={styles.subtitle}>开始你的漂流之旅</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="昵称"
          value={nickname}
          onChangeText={setNickname}
        />

        <View style={styles.genderContainer}>
          <Text style={styles.label}>性别：</Text>
          <TouchableOpacity
            style={[styles.genderButton, gender === '男' && styles.genderButtonActive]}
            onPress={() => setGender('男')}
          >
            <Text style={[styles.genderText, gender === '男' && styles.genderTextActive]}>男</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.genderButton, gender === '女' && styles.genderButtonActive]}
            onPress={() => setGender('女')}
          >
            <Text style={[styles.genderText, gender === '女' && styles.genderTextActive]}>女</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="年龄"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>开始漂流</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
