#!/bin/bash

# 停止漂流瓶应用的所有服务
echo "🛑 停止漂流瓶应用服务..."

# 进入项目目录
cd "$(dirname "$0")"

# 停止API服务器
if [ -f "logs/api-server.pid" ]; then
    API_PID=$(cat logs/api-server.pid)
    if kill -0 $API_PID 2>/dev/null; then
        echo "🛑 停止API服务器 (PID: $API_PID)..."
        kill $API_PID
        rm logs/api-server.pid
    else
        echo "⚠️  API服务器进程不存在"
    fi
else
    echo "⚠️  未找到API服务器PID文件"
fi

# 停止信令服务器
if [ -f "logs/signaling-server.pid" ]; then
    SIGNALING_PID=$(cat logs/signaling-server.pid)
    if kill -0 $SIGNALING_PID 2>/dev/null; then
        echo "🛑 停止信令服务器 (PID: $SIGNALING_PID)..."
        kill $SIGNALING_PID
        rm logs/signaling-server.pid
    else
        echo "⚠️  信令服务器进程不存在"
    fi
else
    echo "⚠️  未找到信令服务器PID文件"
fi

# 强制停止所有相关进程
echo "🔍 查找并停止所有相关进程..."
pkill -f "node.*server.js" 2>/dev/null || true
pkill -f "node.*signaling-server.js" 2>/dev/null || true

echo "✅ 所有服务已停止"
