#!/bin/bash

echo "🚀 启动漂流瓶应用..."

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

# 安装前端依赖
echo "📦 安装前端依赖..."
npm install

# 安装后端依赖
echo "📦 安装后端依赖..."
cd backend
npm install
cd ..

# 启动后端服务
echo "🔧 启动后端服务..."
cd backend
npm start &
BACKEND_PID=$!
cd ..

# 等待后端服务启动
echo "⏳ 等待后端服务启动..."
sleep 3

# 启动React Native Metro
echo "📱 启动React Native Metro..."
npm start &
METRO_PID=$!

echo "✅ 服务已启动！"
echo "📱 后端服务: http://localhost:3000"
echo "📱 Metro服务: http://localhost:8081"
echo ""
echo "运行以下命令启动应用："
echo "  Android: npm run android"
echo "  iOS: npm run ios"
echo ""
echo "按 Ctrl+C 停止所有服务"

# 等待用户中断
trap "echo '🛑 停止服务...'; kill $BACKEND_PID $METRO_PID; exit" INT
wait
