#!/bin/bash

echo "🚀 启动漂流瓶应用..."

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

# 修复npm安全漏洞
echo "🔒 修复npm安全漏洞..."
npm audit fix --force

# 启动后端服务
echo "📡 启动后端服务..."
cd backend
npm install
node server.js &
BACKEND_PID=$!
cd ..

# 等待后端启动
echo "⏳ 等待后端启动..."
sleep 3

# 启动Web版本
echo "🌐 启动Web版本..."
echo "📱 应用将在浏览器中打开"
echo "🔗 访问地址: http://localhost:3001"
echo ""

# 启动Web服务器
python3 -m http.server 3001 &
WEB_PID=$!

# 等待Web服务器启动
sleep 2

# 打开浏览器
echo "🚀 正在打开浏览器..."
open http://localhost:3001

echo ""
echo "🎉 应用启动完成！"
echo "📱 漂流瓶应用已在浏览器中运行"
echo "🛑 按 Ctrl+C 停止服务"

# 等待用户中断
trap 'echo "🛑 停止服务..."; kill $BACKEND_PID $WEB_PID 2>/dev/null; exit' INT

# 保持运行
while true; do
    sleep 1
done
