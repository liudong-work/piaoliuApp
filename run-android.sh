#!/bin/bash

echo "🚀 开始构建和运行Android应用..."

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

# 安装依赖
echo "📦 安装依赖..."
npm install

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

# 启动Android应用
echo "🚀 启动Android应用..."
npx react-native run-android

# 检查构建结果
if [ $? -eq 0 ]; then
    echo "✅ Android应用启动成功！"
    echo "📱 应用已在模拟器/设备上运行"
else
    echo "❌ Android应用启动失败"
    echo "💡 请检查错误信息并重试"
fi

echo "🎉 构建完成！"
