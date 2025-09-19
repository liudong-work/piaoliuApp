#!/bin/bash

echo "🤖 简化Android APK构建..."

# 设置环境变量
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools

echo "✅ 环境变量已设置"

# 检查环境
echo "🔍 检查环境..."
node --version
npm --version
echo "Android SDK: $ANDROID_HOME"

# 安装依赖
echo "📦 安装依赖..."
npm install

# 启动后端
echo "📡 启动后端服务..."
cd backend
npm install
node server.js &
BACKEND_PID=$!
cd ..

# 等待后端启动
sleep 3

# 使用React Native CLI构建
echo "🤖 使用React Native CLI构建..."
npx react-native run-android --mode=release --no-packager

# 检查构建结果
if [ -f "android/app/build/outputs/apk/release/app-release.apk" ]; then
    echo "✅ Android APK构建成功！"
    cp android/app/build/outputs/apk/release/app-release.apk ./piaoliuapp-release.apk
    echo "📱 APK已复制到: piaoliuapp-release.apk"
    ls -lh ./piaoliuapp-release.apk
elif [ -f "android/app/build/outputs/apk/debug/app-debug.apk" ]; then
    echo "✅ Android Debug APK构建成功！"
    cp android/app/build/outputs/apk/debug/app-debug.apk ./piaoliuapp-debug.apk
    echo "📱 APK已复制到: piaoliuapp-debug.apk"
    ls -lh ./piaoliuapp-debug.apk
else
    echo "❌ APK构建失败，尝试其他方法..."
    
    # 尝试使用gradle直接构建
    echo "🔧 尝试直接使用gradle构建..."
    cd android
    gradle assembleDebug 2>/dev/null || echo "gradle命令不可用"
    cd ..
    
    # 检查是否有APK文件
    find android -name "*.apk" -type f 2>/dev/null | head -1 | while read apk_file; do
        if [ -n "$apk_file" ]; then
            echo "✅ 找到APK文件: $apk_file"
            cp "$apk_file" ./piaoliuapp.apk
            echo "📱 APK已复制到: piaoliuapp.apk"
            ls -lh ./piaoliuapp.apk
        fi
    done
fi

# 停止后端
echo "🛑 停止后端服务..."
kill $BACKEND_PID 2>/dev/null || true

# 显示结果
echo "🎉 Android APK构建完成！"
echo "📱 生成的文件："
ls -lh *.apk 2>/dev/null || echo "未找到APK文件"

echo ""
echo "📋 使用说明："
echo "1. APK文件可以直接安装到Android设备"
echo "2. 使用命令: adb install *.apk"
echo "3. 或直接传输到手机安装"
echo ""
echo "🎊 Android APK构建完成！"