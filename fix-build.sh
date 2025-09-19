#!/bin/bash

echo "🔧 诊断和修复构建问题..."

# 检查环境
echo "🔍 检查环境..."

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 请先安装Node.js"
    exit 1
fi

echo "✅ Node.js版本: $(node --version)"

# 检查npm
if ! command -v npm &> /dev/null; then
    echo "❌ 请先安装npm"
    exit 1
fi

echo "✅ npm版本: $(npm --version)"

# 检查Android环境
echo "🤖 检查Android环境..."
if [ -z "$ANDROID_HOME" ]; then
    echo "⚠️  ANDROID_HOME未设置，尝试使用默认路径"
    export ANDROID_HOME="$HOME/Library/Android/sdk"
fi

echo "✅ ANDROID_HOME: $ANDROID_HOME"

# 检查ADB
if ! command -v adb &> /dev/null; then
    echo "❌ 未找到ADB，请安装Android SDK"
    exit 1
fi

echo "✅ ADB版本: $(adb version)"

# 检查设备
echo "📱 检查Android设备..."
adb devices

# 清理构建缓存
echo "🧹 清理构建缓存..."
rm -rf node_modules
rm -rf android/app/build
rm -rf android/.gradle

# 重新安装依赖
echo "📦 重新安装依赖..."
npm install

# 清理Metro缓存
echo "🧹 清理Metro缓存..."
npx react-native start --reset-cache &
METRO_PID=$!

# 等待Metro启动
sleep 5

# 构建Android应用
echo "🚀 构建Android应用..."
npx react-native run-android

# 停止Metro
kill $METRO_PID 2>/dev/null || true

echo "🎉 构建完成！"
