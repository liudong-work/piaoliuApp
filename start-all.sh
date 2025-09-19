#!/bin/bash

echo "🚀 启动漂流瓶应用..."

# 检查当前目录
echo "当前目录: $(pwd)"

# 启动后端服务
echo "📡 启动后端服务..."
cd backend
node server.js &
BACKEND_PID=$!
echo "后端服务PID: $BACKEND_PID"

# 等待后端启动
sleep 3

# 启动Metro服务器
echo "📱 启动Metro服务器..."
cd ..
yarn start &
METRO_PID=$!
echo "Metro服务器PID: $METRO_PID"

# 等待Metro启动
sleep 5

# 启动Android应用
echo "🤖 启动Android应用..."
yarn android &
ANDROID_PID=$!
echo "Android应用PID: $ANDROID_PID"

echo "✅ 所有服务已启动！"
echo "📱 后端服务: http://localhost:3000"
echo "📱 Metro服务: http://localhost:8081"
echo ""
echo "按 Ctrl+C 停止所有服务"

# 等待用户中断
trap "echo '🛑 停止服务...'; kill $BACKEND_PID $METRO_PID $ANDROID_PID 2>/dev/null; exit" INT
wait
