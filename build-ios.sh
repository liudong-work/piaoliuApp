#!/bin/bash

echo "🍎 开始打包iOS应用..."

# 检查环境
if ! command -v xcodebuild &> /dev/null; then
    echo "❌ 请先安装Xcode"
    exit 1
fi

if ! command -v pod &> /dev/null; then
    echo "❌ 请先安装CocoaPods"
    exit 1
fi

# 进入iOS目录
cd ios

# 安装依赖
echo "📦 安装iOS依赖..."
pod install

# 清理之前的构建
echo "🧹 清理之前的构建..."
xcodebuild clean -workspace piaoliuapp.xcworkspace -scheme piaoliuapp

# 构建Archive
echo "📦 构建Archive..."
xcodebuild archive \
    -workspace piaoliuapp.xcworkspace \
    -scheme piaoliuapp \
    -configuration Release \
    -archivePath piaoliuapp.xcarchive \
    CODE_SIGN_IDENTITY="" \
    CODE_SIGNING_REQUIRED=NO

# 导出IPA
echo "📱 导出IPA..."
xcodebuild -exportArchive \
    -archivePath piaoliuapp.xcarchive \
    -exportPath ./build \
    -exportOptionsPlist ExportOptions.plist

# 检查构建结果
if [ -f "build/piaoliuapp.ipa" ]; then
    echo "✅ IPA构建成功！"
    echo "📱 IPA文件位置: ios/build/piaoliuapp.ipa"
    
    # 复制到项目根目录
    cp build/piaoliuapp.ipa ../piaoliuapp.ipa
    echo "📱 IPA已复制到: piaoliuapp.ipa"
    
    # 显示IPA信息
    echo "📊 IPA信息:"
    ls -lh ../piaoliuapp.ipa
else
    echo "❌ IPA构建失败"
    exit 1
fi

echo "🎉 iOS IPA打包完成！"
