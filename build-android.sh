#!/bin/bash

echo "🤖 开始打包Android APK..."

# 检查环境
if ! command -v java &> /dev/null; then
    echo "❌ 请先安装Java JDK"
    exit 1
fi

if ! command -v android &> /dev/null; then
    echo "❌ 请先安装Android SDK"
    exit 1
fi

# 进入Android目录
cd android

# 清理之前的构建
echo "🧹 清理之前的构建..."
./gradlew clean

# 生成签名密钥（如果不存在）
if [ ! -f "app/release.keystore" ]; then
    echo "🔑 生成签名密钥..."
    keytool -genkey -v -keystore app/release.keystore -alias piaoliuapp -keyalg RSA -keysize 2048 -validity 10000 -storepass piaoliuapp123 -keypass piaoliuapp123 -dname "CN=PiaoLiuApp, OU=Development, O=PiaoLiuApp, L=Beijing, S=Beijing, C=CN"
fi

# 构建Release APK
echo "📦 构建Release APK..."
./gradlew assembleRelease

# 检查构建结果
if [ -f "app/build/outputs/apk/release/app-release.apk" ]; then
    echo "✅ APK构建成功！"
    echo "📱 APK文件位置: android/app/build/outputs/apk/release/app-release.apk"
    
    # 复制到项目根目录
    cp app/build/outputs/apk/release/app-release.apk ../piaoliuapp-release.apk
    echo "📱 APK已复制到: piaoliuapp-release.apk"
    
    # 显示APK信息
    echo "📊 APK信息:"
    ls -lh ../piaoliuapp-release.apk
else
    echo "❌ APK构建失败"
    exit 1
fi

echo "🎉 Android APK打包完成！"
