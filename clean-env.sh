#!/bin/bash

echo "🧹 开始清理环境..."

# 清理Node.js相关
echo "📦 清理Node.js缓存..."
rm -rf node_modules
rm -f package-lock.json
rm -f yarn.lock
npm cache clean --force
yarn cache clean

# 清理Android构建缓存
echo "🤖 清理Android构建缓存..."
rm -rf android/app/build
rm -rf android/.gradle
rm -rf android/build
rm -rf .gradle

# 清理iOS构建缓存
echo "🍎 清理iOS构建缓存..."
rm -rf ios/build
rm -rf ios/Pods
rm -f ios/Podfile.lock

# 清理Metro缓存
echo "🚇 清理Metro缓存..."
rm -rf /tmp/metro-*
rm -rf /tmp/react-*

# 清理其他缓存
echo "🗑️  清理其他缓存..."
rm -rf .expo
rm -rf .idea
rm -rf .vscode
rm -rf .DS_Store

# 清理后端缓存
echo "📡 清理后端缓存..."
rm -rf backend/node_modules
rm -f backend/package-lock.json

echo "✅ 环境清理完成！"
echo ""
echo "📋 下一步："
echo "1. 重新安装依赖: npm install"
echo "2. 安装后端依赖: cd backend && npm install"
echo "3. 重新构建应用: npx react-native run-android"
