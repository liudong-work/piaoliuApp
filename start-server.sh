#!/bin/bash

echo "🎉 APK下载二维码生成器"
echo ""

# 获取本机IP
IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
if [ -z "$IP" ]; then
    IP="localhost"
fi

echo "📱 APK文件信息："
echo "文件：piaoliuapp.apk"
echo "大小：$(ls -lh piaoliuapp.apk | awk '{print $5}')"
echo ""

echo "🌐 下载地址："
echo "1. 二维码下载页面："
echo "   http://$IP:8080/download.html"
echo ""
echo "2. 直接APK下载："
echo "   http://$IP:8080/piaoliuapp.apk"
echo ""

echo "📱 使用方法："
echo "1. 在手机上打开浏览器"
echo "2. 访问：http://$IP:8080/download.html"
echo "3. 扫描二维码或点击下载按钮"
echo "4. 下载APK文件并安装"
echo ""

echo "🚀 启动服务器..."
echo "如果服务器启动失败，请手动运行："
echo "python3 -m http.server 8080"
echo ""

# 尝试启动服务器
python3 -m http.server 8080 &
SERVER_PID=$!

# 等待2秒检查服务器状态
sleep 2

# 检查服务器是否启动成功
if curl -s http://localhost:8080/download.html > /dev/null 2>&1; then
    echo "✅ 服务器启动成功！"
    echo "📱 访问地址：http://$IP:8080/download.html"
    echo ""
    echo "🛑 按 Ctrl+C 停止服务器"
    
    # 等待用户中断
    trap "echo ''; echo '🛑 停止服务器...'; kill $SERVER_PID 2>/dev/null; exit 0" INT
    wait
else
    echo "❌ 服务器启动失败"
    echo "请手动运行：python3 -m http.server 8080"
    kill $SERVER_PID 2>/dev/null
fi
