#!/bin/bash

# 启动漂流瓶应用的完整服务
echo "🚀 启动漂流瓶应用服务..."

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    exit 1
fi

# 检查npm是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装，请先安装 npm"
    exit 1
fi

# 进入项目目录
cd "$(dirname "$0")"

echo "📁 项目目录: $(pwd)"

# 检查依赖是否安装
if [ ! -d "node_modules" ]; then
    echo "📦 安装前端依赖..."
    npm install
fi

if [ ! -d "backend/node_modules" ]; then
    echo "📦 安装后端依赖..."
    cd backend
    npm install
    cd ..
fi

# 启动后端API服务器
echo "🌐 启动后端API服务器 (端口 3000)..."
cd backend
nohup node server.js > ../logs/api-server.log 2>&1 &
API_PID=$!
cd ..

# 等待API服务器启动
sleep 2

# 启动信令服务器
echo "📡 启动信令服务器 (端口 3001)..."
cd backend
nohup node signaling-server.js > ../logs/signaling-server.log 2>&1 &
SIGNALING_PID=$!
cd ..

# 等待信令服务器启动
sleep 2

# 创建日志目录
mkdir -p logs

# 保存进程ID
echo $API_PID > logs/api-server.pid
echo $SIGNALING_PID > logs/signaling-server.pid

echo "✅ 服务启动完成！"
echo "📊 服务状态:"
echo "   - API服务器: http://localhost:3000 (PID: $API_PID)"
echo "   - 信令服务器: http://localhost:3001 (PID: $SIGNALING_PID)"
echo ""
echo "📝 日志文件:"
echo "   - API服务器: logs/api-server.log"
echo "   - 信令服务器: logs/signaling-server.log"
echo ""
echo "🛑 停止服务: ./stop-services.sh"
echo ""

# 检查服务是否正常运行
echo "🔍 检查服务状态..."

# 检查API服务器
if curl -s http://localhost:3000/api/users > /dev/null; then
    echo "✅ API服务器运行正常"
else
    echo "❌ API服务器启动失败"
fi

# 检查信令服务器
if curl -s http://localhost:3001/api/signaling/status > /dev/null; then
    echo "✅ 信令服务器运行正常"
else
    echo "❌ 信令服务器启动失败"
fi

echo ""
echo "🎉 所有服务已启动，可以开始使用漂流瓶应用了！"
echo ""
echo "📱 下一步:"
echo "   1. 运行 iOS 模拟器"
echo "   2. 构建并安装应用"
echo "   3. 测试语音/视频通话功能"
