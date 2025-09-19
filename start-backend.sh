#!/bin/bash

echo "🚀 启动漂流瓶后端服务..."

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 请先安装Node.js"
    exit 1
fi

# 检查npm是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ 请先安装npm"
    exit 1
fi

# 进入后端目录
cd backend

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装后端依赖..."
    npm install
fi

# 创建uploads目录
mkdir -p uploads/avatars

# 启动后端服务
echo "🔧 启动后端服务..."
echo "📱 后端服务将在 http://localhost:3000 启动"
echo "按 Ctrl+C 停止服务"

npm start
