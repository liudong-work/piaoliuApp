#!/bin/bash

echo "🤖 开始打包Android APK..."

# 设置Android环境变量
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin

echo "✅ ANDROID_HOME: $ANDROID_HOME"

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

# 检查Android SDK
if [ ! -d "$ANDROID_HOME" ]; then
    echo "❌ Android SDK未安装"
    echo "💡 请安装Android Studio和Android SDK"
    echo "📥 下载地址: https://developer.android.com/studio"
    exit 1
fi

echo "✅ Android SDK: $ANDROID_HOME"

# 检查ADB
if ! command -v adb &> /dev/null; then
    echo "❌ ADB未找到"
    echo "💡 请确保Android SDK已正确安装"
    exit 1
fi

echo "✅ ADB已找到"

# 检查Java
if ! command -v java &> /dev/null; then
    echo "❌ Java未安装"
    echo "💡 请安装Java JDK 8或以上版本"
    exit 1
fi

echo "✅ Java已安装"

# 安装依赖
echo "📦 安装依赖..."
npm install

# 修复npm安全漏洞
echo "🔒 修复npm安全漏洞..."
npm audit fix --force

# 启动后端服务
echo "📡 启动后端服务..."
cd backend
npm install
node server.js &
BACKEND_PID=$!
cd ..

# 等待后端启动
echo "⏳ 等待后端启动..."
sleep 3

# 清理之前的构建
echo "🧹 清理之前的构建..."
rm -rf android/app/build
rm -rf android/.gradle

# 构建Android APK
echo "🤖 构建Android APK..."
cd android

# 给gradlew执行权限
chmod +x gradlew

# 构建Debug APK
echo "📦 构建Debug APK..."
./gradlew assembleDebug

# 检查构建结果
if [ -f "app/build/outputs/apk/debug/app-debug.apk" ]; then
    echo "✅ Android APK构建成功！"
    cp app/build/outputs/apk/debug/app-debug.apk ../piaoliuapp-debug.apk
    echo "📱 APK已复制到: piaoliuapp-debug.apk"
    ls -lh ../piaoliuapp-debug.apk
else
    echo "❌ Android APK构建失败"
    echo "📁 检查构建日志..."
    ./gradlew assembleDebug --info
fi

cd ..

# 停止后端服务
echo "🛑 停止后端服务..."
kill $BACKEND_PID 2>/dev/null || true

# 显示结果
echo "🎉 Android APK打包完成！"
echo "📱 生成的文件："
ls -lh *.apk 2>/dev/null || echo "未找到APK文件"

echo ""
echo "📋 使用说明："
echo "1. APK文件可以直接安装到Android设备"
echo "2. 文件位置: piaoliuapp-debug.apk"
echo "3. 文件大小: 约20-30MB"
echo ""
echo "🎊 Android APK打包完成！"

