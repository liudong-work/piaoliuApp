import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  StatusBar,
} from 'react-native';
import { RTCView } from 'react-native-webrtc';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

const CallScreen = ({
  callType = 'audio', // 'audio' | 'video'
  remoteUser = null,
  isIncoming = false,
  onEndCall,
  onAcceptCall,
  onRejectCall,
  localStream = null,
  remoteStream = null,
  callState = 'idle',
  isMuted = false,
  isCameraOff = false,
  onToggleMute,
  onToggleCamera,
  onSwitchCamera,
}) => {
  const [callDuration, setCallDuration] = useState(0);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const intervalRef = useRef(null);

  // 通话计时器
  useEffect(() => {
    if (callState === 'connected') {
      intervalRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setCallDuration(0);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [callState]);

  // 格式化时间
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 获取状态栏样式
  const getStatusBarStyle = () => {
    if (callState === 'connected') {
      return 'light-content';
    }
    return 'dark-content';
  };

  // 获取背景颜色
  const getBackgroundColor = () => {
    switch (callState) {
      case 'calling':
        return '#FF6B6B';
      case 'ringing':
        return '#4ECDC4';
      case 'connected':
        return '#45B7D1';
      case 'ended':
        return '#96CEB4';
      default:
        return '#F5F5F5';
    }
  };

  // 获取状态文本
  const getStatusText = () => {
    switch (callState) {
      case 'calling':
        return '正在呼叫...';
      case 'ringing':
        return isIncoming ? '来电' : '对方响铃中...';
      case 'connected':
        return formatTime(callDuration);
      case 'ended':
        return '通话结束';
      default:
        return '准备中...';
    }
  };

  // 渲染视频视图
  const renderVideoViews = () => {
    if (callType !== 'video') return null;

    return (
      <View style={styles.videoContainer}>
        {/* 远程视频 */}
        {remoteStream && (
          <RTCView
            style={styles.remoteVideo}
            streamURL={remoteStream.toURL()}
            objectFit="cover"
          />
        )}
        
        {/* 本地视频 */}
        {localStream && (
          <RTCView
            style={styles.localVideo}
            streamURL={localStream.toURL()}
            objectFit="cover"
            mirror={true}
          />
        )}
        
        {/* 视频占位符 */}
        {!remoteStream && (
          <View style={styles.videoPlaceholder}>
            <Icon name="videocam-off" size={60} color="rgba(255,255,255,0.6)" />
            <Text style={styles.placeholderText}>等待对方开启摄像头</Text>
          </View>
        )}
      </View>
    );
  };

  // 渲染音频界面
  const renderAudioInterface = () => {
    if (callType !== 'audio') return null;

    return (
      <View style={styles.audioContainer}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Icon name="person" size={80} color="rgba(255,255,255,0.8)" />
          </View>
        </View>
        
        <Text style={styles.userName}>
          {remoteUser?.nickname || '未知用户'}
        </Text>
        
        <Text style={styles.statusText}>
          {getStatusText()}
        </Text>
      </View>
    );
  };

  // 渲染控制按钮
  const renderControlButtons = () => {
    const isConnected = callState === 'connected';
    const isCalling = callState === 'calling' || callState === 'ringing';

    return (
      <View style={styles.controlContainer}>
        {/* 接听/拒绝按钮 (仅来电时显示) */}
        {isIncoming && callState === 'ringing' && (
          <>
            <TouchableOpacity
              style={[styles.controlButton, styles.rejectButton]}
              onPress={onRejectCall}
            >
              <Icon name="call-end" size={30} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.controlButton, styles.acceptButton]}
              onPress={onAcceptCall}
            >
              <Icon name="call" size={30} color="white" />
            </TouchableOpacity>
          </>
        )}

        {/* 通话中控制按钮 */}
        {isConnected && (
          <>
            {/* 静音按钮 */}
            <TouchableOpacity
              style={[styles.controlButton, styles.secondaryButton, isMuted && styles.activeButton]}
              onPress={onToggleMute}
            >
              <Icon name={isMuted ? "mic-off" : "mic"} size={24} color="white" />
            </TouchableOpacity>

            {/* 扬声器按钮 */}
            <TouchableOpacity
              style={[styles.controlButton, styles.secondaryButton, isSpeakerOn && styles.activeButton]}
              onPress={() => setIsSpeakerOn(!isSpeakerOn)}
            >
              <Icon name={isSpeakerOn ? "volume-up" : "volume-down"} size={24} color="white" />
            </TouchableOpacity>

            {/* 摄像头按钮 (仅视频通话) */}
            {callType === 'video' && (
              <TouchableOpacity
                style={[styles.controlButton, styles.secondaryButton, isCameraOff && styles.activeButton]}
                onPress={onToggleCamera}
              >
                <Icon name={isCameraOff ? "videocam-off" : "videocam"} size={24} color="white" />
              </TouchableOpacity>
            )}

            {/* 切换摄像头按钮 (仅视频通话) */}
            {callType === 'video' && !isCameraOff && (
              <TouchableOpacity
                style={[styles.controlButton, styles.secondaryButton]}
                onPress={onSwitchCamera}
              >
                <Icon name="flip-camera-ios" size={24} color="white" />
              </TouchableOpacity>
            )}

            {/* 挂断按钮 */}
            <TouchableOpacity
              style={[styles.controlButton, styles.endButton]}
              onPress={onEndCall}
            >
              <Icon name="call-end" size={30} color="white" />
            </TouchableOpacity>
          </>
        )}

        {/* 取消按钮 (仅呼叫时显示) */}
        {!isIncoming && isCalling && (
          <TouchableOpacity
            style={[styles.controlButton, styles.endButton]}
            onPress={onEndCall}
          >
            <Icon name="call-end" size={30} color="white" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
      <StatusBar barStyle={getStatusBarStyle()} backgroundColor={getBackgroundColor()} />
      
      {/* 视频界面 */}
      {renderVideoViews()}
      
      {/* 音频界面 */}
      {renderAudioInterface()}
      
      {/* 控制按钮 */}
      {renderControlButtons()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  remoteVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  localVideo: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 120,
    height: 160,
    borderRadius: 10,
    overflow: 'hidden',
  },
  videoPlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  placeholderText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    marginTop: 20,
  },
  audioContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  avatarContainer: {
    marginBottom: 30,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  statusText: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  controlContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 50,
    gap: 20,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  activeButton: {
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  endButton: {
    backgroundColor: '#F44336',
  },
});

export default CallScreen;
