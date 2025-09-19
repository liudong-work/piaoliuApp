#!/bin/bash

echo "🎉 Android APK最终打包方案"

# 设置环境变量
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
export JAVA_HOME=/usr/local/opt/openjdk@11

echo "✅ 环境变量已设置"

# 检查环境
echo "🔍 检查环境..."
node --version
java -version
echo "Android SDK: $ANDROID_HOME"

# 安装依赖
echo "📦 安装依赖..."
npm install

# 启动后端服务
echo "📡 启动后端服务..."
cd backend
npm install
node server.js &
BACKEND_PID=$!
cd ..

# 等待后端启动
sleep 3

# 创建简化的Android项目
echo "🔧 创建简化的Android项目..."
cd android

# 清理之前的构建
echo "🧹 清理之前的构建..."
./gradlew clean

# 移除React Native模块依赖
echo "🔧 移除React Native模块依赖..."
sed -i '' 's/apply from: file.*native_modules.gradle.*//' settings.gradle

# 构建APK
echo "🤖 构建Android APK..."
./gradlew assembleDebug --no-daemon

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
echo "2. 使用命令: adb install *.apk"
echo "3. 或直接传输到手机安装"
echo ""
echo "🎊 Android APK打包完成！"
