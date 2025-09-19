#!/bin/bash

echo "🚀 开始打包漂流瓶应用..."

# 检查环境
echo "🔍 检查环境..."

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 请先安装Node.js"
    exit 1
fi

# 检查Java（Android需要）
if ! command -v java &> /dev/null; then
    echo "⚠️  未找到Java，Android打包可能失败"
fi

# 检查Xcode（iOS需要）
if ! command -v xcodebuild &> /dev/null; then
    echo "⚠️  未找到Xcode，iOS打包可能失败"
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
    ./build-android.sh
    if [ $? -eq 0 ]; then
        echo "✅ Android APK构建成功！"
    else
        echo "❌ Android APK构建失败"
    fi
else
    echo "⚠️  未找到Android目录，跳过Android构建"
fi

# 构建iOS IPA
echo "🍎 开始构建iOS IPA..."
if [ -d "ios" ]; then
    ./build-ios.sh
    if [ $? -eq 0 ]; then
        echo "✅ iOS IPA构建成功！"
    else
        echo "❌ iOS IPA构建失败"
    fi
else
    echo "⚠️  未找到iOS目录，跳过iOS构建"
fi

# 停止后端服务
echo "🛑 停止后端服务..."
kill $BACKEND_PID 2>/dev/null

# 显示结果
echo "🎉 打包完成！"
echo "📱 生成的文件："
ls -lh *.apk *.ipa 2>/dev/null || echo "未找到APK或IPA文件"

echo "📋 使用说明："
echo "1. Android APK: 可以直接安装到Android设备"
echo "2. iOS IPA: 需要开发者证书才能安装到iOS设备"
echo "3. 或者使用Web版本: 直接打开index.html"
