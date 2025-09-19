#!/bin/bash

echo "🚀 开始构建漂流瓶应用..."

# 检查环境
echo "🔍 检查环境..."

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 请先安装Node.js"
    exit 1
fi

# 检查React Native CLI
if ! command -v npx &> /dev/null; then
    echo "❌ 请先安装npm"
    exit 1
fi

# 安装依赖
echo "📦 安装依赖..."
yarn install

# 启动后端服务（后台运行）
echo "📡 启动后端服务..."
cd backend
node server.js &
BACKEND_PID=$!
cd ..

# 等待后端启动
sleep 3

# 构建Android APK
echo "🤖 开始构建Android APK..."
if [ -d "android" ]; then
    cd android
    chmod +x gradlew
    ./gradlew assembleDebug
    if [ $? -eq 0 ]; then
        echo "✅ Android APK构建成功！"
        if [ -f "app/build/outputs/apk/debug/app-debug.apk" ]; then
            cp app/build/outputs/apk/debug/app-debug.apk ../piaoliuapp-debug.apk
            echo "📱 APK已复制到: piaoliuapp-debug.apk"
            ls -lh ../piaoliuapp-debug.apk
        fi
    else
        echo "❌ Android APK构建失败"
    fi
    cd ..
else
    echo "⚠️  未找到Android目录，跳过Android构建"
fi

# 停止后端服务
echo "🛑 停止后端服务..."
kill $BACKEND_PID 2>/dev/null

# 显示结果
echo "🎉 构建完成！"
echo "📱 生成的文件："
ls -lh *.apk 2>/dev/null || echo "未找到APK文件"

echo "📋 使用说明："
echo "1. Android APK: 可以直接安装到Android设备"
echo "2. 或者使用Web版本: 直接打开index.html"
