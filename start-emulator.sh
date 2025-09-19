#!/bin/bash

echo "🤖 启动Android模拟器..."

# 检查Android SDK
if [ -z "$ANDROID_HOME" ]; then
    echo "❌ 请设置ANDROID_HOME环境变量"
    exit 1
fi

echo "✅ ANDROID_HOME: $ANDROID_HOME"

# 检查模拟器
echo "📱 检查可用的模拟器..."
emulator -list-avds

# 启动第一个可用的模拟器
AVD_NAME=$(emulator -list-avds | head -n 1)
if [ -z "$AVD_NAME" ]; then
    echo "❌ 未找到可用的模拟器"
    echo "💡 请先创建Android模拟器"
    exit 1
fi

echo "🚀 启动模拟器: $AVD_NAME"
emulator -avd "$AVD_NAME" &

# 等待模拟器启动
echo "⏳ 等待模拟器启动..."
sleep 10

# 检查设备连接
echo "📱 检查设备连接..."
adb devices

echo "✅ Android模拟器启动完成！"
