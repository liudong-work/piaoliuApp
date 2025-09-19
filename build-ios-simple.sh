#!/bin/bash

echo "🍎 开始构建iOS应用..."

# 检查Xcode
if ! command -v xcodebuild &> /dev/null; then
    echo "❌ 未找到Xcode，请先安装Xcode"
    exit 1
fi

# 进入iOS目录
cd ios

# 检查Podfile
if [ ! -f "Podfile" ]; then
    echo "❌ 未找到Podfile"
    exit 1
fi

# 安装CocoaPods依赖
echo "📦 安装CocoaPods依赖..."
if command -v pod &> /dev/null; then
    pod install
else
    echo "⚠️  未找到CocoaPods，跳过依赖安装"
fi

# 检查workspace
if [ ! -f "piaoliuapp.xcworkspace" ]; then
    echo "❌ 未找到Xcode workspace"
    exit 1
fi

# 构建应用
echo "📦 构建iOS应用..."
xcodebuild -workspace piaoliuapp.xcworkspace -scheme piaoliuapp -configuration Debug -sdk iphonesimulator -destination 'platform=iOS Simulator,name=iPhone 14' build

# 检查构建结果
if [ -d "build" ]; then
    echo "✅ iOS应用构建成功！"
    echo "📱 应用位置: ios/build/"
    
    # 显示构建信息
    echo "📊 构建信息:"
    ls -la build/
else
    echo "❌ iOS应用构建失败"
    exit 1
fi

echo "🎉 iOS应用构建完成！"
