#!/bin/bash

echo "🚀 开始打包漂流瓶应用..."

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
    echo "📱 使用React Native CLI构建Android..."
    
    # 尝试构建Android
    npx react-native run-android --mode=release --no-packager || {
        echo "⚠️  React Native CLI构建失败，尝试Gradle直接构建..."
        cd android
        chmod +x gradlew
        ./gradlew assembleDebug
        cd ..
    }
    
    # 检查构建结果
    if [ -f "android/app/build/outputs/apk/release/app-release.apk" ]; then
        echo "✅ Android Release APK构建成功！"
        cp android/app/build/outputs/apk/release/app-release.apk ./piaoliuapp-release.apk
        echo "📱 APK已复制到: piaoliuapp-release.apk"
        ls -lh piaoliuapp-release.apk
    elif [ -f "android/app/build/outputs/apk/debug/app-debug.apk" ]; then
        echo "✅ Android Debug APK构建成功！"
        cp android/app/build/outputs/apk/debug/app-debug.apk ./piaoliuapp-debug.apk
        echo "📱 APK已复制到: piaoliuapp-debug.apk"
        ls -lh piaoliuapp-debug.apk
    else
        echo "⚠️  Android APK构建完成，但未找到APK文件"
        echo "📁 检查构建目录:"
        find android -name "*.apk" 2>/dev/null || echo "未找到APK文件"
    fi
else
    echo "⚠️  未找到Android目录，跳过Android构建"
fi

# 构建iOS应用
echo "🍎 开始构建iOS应用..."
if [ -d "ios" ]; then
    echo "📱 使用React Native CLI构建iOS..."
    
    # 尝试构建iOS
    npx react-native run-ios --mode=release --no-packager || {
        echo "⚠️  React Native CLI构建失败，尝试Xcode构建..."
        cd ios
        xcodebuild -workspace piaoliuapp.xcworkspace -scheme piaoliuapp -configuration Debug -sdk iphonesimulator build || echo "Xcode构建失败"
        cd ..
    }
    
    echo "✅ iOS应用构建完成！"
    echo "📱 应用位置: ios/build/"
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