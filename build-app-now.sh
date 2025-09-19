#!/bin/bash

echo "🚀 开始打包漂流瓶应用..."

# 设置错误时退出
set -e

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

# 构建Android APK
echo "🤖 开始构建Android APK..."
if [ -d "android" ]; then
    echo "📱 使用Gradle构建Android..."
    
    # 进入Android目录
    cd android
    
    # 给gradlew执行权限
    chmod +x gradlew
    
    # 清理之前的构建
    echo "🧹 清理之前的构建..."
    ./gradlew clean
    
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
    fi
    
    cd ..
else
    echo "⚠️  未找到Android目录，跳过Android构建"
fi

# 构建iOS应用
echo "🍎 开始构建iOS应用..."
if [ -d "ios" ]; then
    echo "📱 使用Xcode构建iOS..."
    
    # 进入iOS目录
    cd ios
    
    # 构建应用
    xcodebuild -workspace piaoliuapp.xcworkspace -scheme piaoliuapp -configuration Debug -sdk iphonesimulator build
    
    echo "✅ iOS应用构建完成！"
    echo "📱 应用位置: ios/build/"
    
    cd ..
else
    echo "⚠️  未找到iOS目录，跳过iOS构建"
fi

# 显示结果
echo "🎉 打包完成！"
echo "📱 生成的文件："
ls -lh *.apk 2>/dev/null || echo "未找到APK文件"

echo ""
echo "📋 使用说明："
echo "1. Android APK: 可以直接安装到Android设备"
echo "2. iOS应用: 在iOS模拟器中运行"
echo "3. Web版本: 直接打开index.html"
echo ""
echo "🎊 漂流瓶应用打包完成！"
