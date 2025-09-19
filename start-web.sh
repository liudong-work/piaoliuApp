#!/bin/bash

echo "🚀 启动漂流瓶Web服务器..."

# 检查当前目录
echo "当前目录: $(pwd)"

# 检查文件是否存在
if [ ! -f "index.html" ]; then
    echo "❌ 找不到 index.html 文件"
    exit 1
fi

echo "✅ 找到 index.html 文件"

# 尝试启动Python服务器
echo "📡 尝试启动Python服务器..."
if command -v python3 &> /dev/null; then
    echo "✅ Python3 已安装"
    echo "🌐 启动服务器在端口 3001..."
    echo "📱 请在浏览器中访问: http://localhost:3001"
    echo "按 Ctrl+C 停止服务器"
    python3 -m http.server 3001
elif command -v python &> /dev/null; then
    echo "✅ Python 已安装"
    echo "🌐 启动服务器在端口 3001..."
    echo "📱 请在浏览器中访问: http://localhost:3001"
    echo "按 Ctrl+C 停止服务器"
    python -m http.server 3001
else
    echo "❌ 未找到Python，尝试使用Node.js..."
    if command -v node &> /dev/null; then
        echo "✅ Node.js 已安装"
        echo "🌐 启动Node.js服务器在端口 3001..."
        echo "📱 请在浏览器中访问: http://localhost:3001"
        echo "按 Ctrl+C 停止服务器"
        node web-server.js
    else
        echo "❌ 未找到Python或Node.js"
        echo "请安装Python或Node.js后重试"
        exit 1
    fi
fi