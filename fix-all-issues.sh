#!/bin/bash

echo "🔧 解决构建问题..."

# 1. 解决端口8081占用问题
echo "🚪 解决端口8081占用问题..."
lsof -ti:8081 | xargs kill -9 2>/dev/null || echo "端口8081未被占用"

# 2. 设置Android环境变量
echo "🤖 设置Android环境变量..."
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin

echo "✅ ANDROID_HOME: $ANDROID_HOME"

# 3. 检查Android SDK
echo "📱 检查Android SDK..."
if [ -d "$ANDROID_HOME" ]; then
    echo "✅ Android SDK已安装"
    ls -la "$ANDROID_HOME"
else
    echo "❌ Android SDK未安装"
    echo "💡 请安装Android Studio和Android SDK"
    exit 1
fi

# 4. 检查ADB
echo "🔧 检查ADB..."
if command -v adb &> /dev/null; then
    echo "✅ ADB已找到"
    adb version
else
    echo "❌ ADB未找到"
    echo "💡 请确保Android SDK已正确安装"
    exit 1
fi

# 5. 检查模拟器
echo "📱 检查Android模拟器..."
emulator -list-avds

# 6. 修复npm安全漏洞
echo "🔒 修复npm安全漏洞..."
npm audit fix --force

# 7. 启动Metro服务器
echo "🚇 启动Metro服务器..."
npx react-native start --reset-cache &
METRO_PID=$!

# 等待Metro启动
sleep 5

# 8. 构建Android应用
echo "🚀 构建Android应用..."
npx react-native run-android

# 停止Metro
kill $METRO_PID 2>/dev/null || true

echo "🎉 构建完成！"
