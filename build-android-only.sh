#!/bin/bash

echo "🤖 开始构建Android APK..."

# 进入Android目录
cd android

# 检查Gradle wrapper
if [ ! -f "gradlew" ]; then
    echo "❌ 未找到Gradle wrapper"
    exit 1
fi

# 给gradlew执行权限
chmod +x gradlew

# 清理之前的构建
echo "🧹 清理之前的构建..."
./gradlew clean

# 构建Debug APK（不需要签名）
echo "📦 构建Debug APK..."
./gradlew assembleDebug

# 检查构建结果
if [ -f "app/build/outputs/apk/debug/app-debug.apk" ]; then
    echo "✅ APK构建成功！"
    echo "📱 APK文件位置: android/app/build/outputs/apk/debug/app-debug.apk"
    
    # 复制到项目根目录
    cp app/build/outputs/apk/debug/app-debug.apk ../piaoliuapp-debug.apk
    echo "📱 APK已复制到: piaoliuapp-debug.apk"
    
    # 显示APK信息
    echo "📊 APK信息:"
    ls -lh ../piaoliuapp-debug.apk
    
    echo ""
    echo "🎉 Android APK构建完成！"
    echo "📱 可以直接安装到Android设备"
else
    echo "❌ APK构建失败"
    exit 1
fi
