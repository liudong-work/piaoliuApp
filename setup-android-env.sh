#!/bin/bash

echo "🤖 配置Android打包环境..."

# 设置Android环境变量
echo "🔧 设置Android环境变量..."
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin

echo "✅ ANDROID_HOME: $ANDROID_HOME"

# 检查Android SDK
echo "📱 检查Android SDK..."
if [ -d "$ANDROID_HOME" ]; then
    echo "✅ Android SDK已安装"
    ls -la "$ANDROID_HOME"
else
    echo "❌ Android SDK未安装"
    echo "💡 请安装Android Studio和Android SDK"
    echo "📥 下载地址: https://developer.android.com/studio"
    exit 1
fi

# 检查ADB
echo "🔧 检查ADB..."
if command -v adb &> /dev/null; then
    echo "✅ ADB已找到"
    adb version
else
    echo "❌ ADB未找到"
    echo "💡 请确保Android SDK已正确安装"
    exit 1
fi

# 检查Java
echo "☕ 检查Java..."
if command -v java &> /dev/null; then
    echo "✅ Java已安装"
    java -version
else
    echo "❌ Java未安装"
    echo "💡 请安装Java JDK 8或以上版本"
    exit 1
fi

# 检查Gradle
echo "📦 检查Gradle..."
if [ -f "android/gradlew" ]; then
    echo "✅ Gradle wrapper已找到"
    chmod +x android/gradlew
else
    echo "❌ Gradle wrapper未找到"
    echo "💡 请检查Android项目结构"
    exit 1
fi

# 检查模拟器
echo "📱 检查Android模拟器..."
emulator -list-avds

# 如果没有模拟器，提供创建指导
if [ -z "$(emulator -list-avds)" ]; then
    echo "⚠️  未找到Android模拟器"
    echo "💡 请按以下步骤创建模拟器："
    echo "1. 打开Android Studio"
    echo "2. 点击 AVD Manager"
    echo "3. 点击 Create Virtual Device"
    echo "4. 选择设备类型（推荐Pixel 4）"
    echo "5. 选择系统镜像（推荐API 30）"
    echo "6. 点击 Finish"
    exit 1
fi

echo "✅ Android环境配置完成！"
