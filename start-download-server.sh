#!/bin/bash

echo "🎉 生成APK下载二维码"

# 获取本机IP地址
IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
if [ -z "$IP" ]; then
    IP="localhost"
fi

echo "📱 APK文件信息："
echo "文件：piaoliuapp.apk"
echo "大小：$(ls -lh piaoliuapp.apk | awk '{print $5}')"
echo ""

echo "🌐 下载方式："
echo "1. 直接下载链接："
echo "   http://$IP:8080/piaoliuapp.apk"
echo ""
echo "2. 二维码下载页面："
echo "   http://$IP:8080/download.html"
echo ""

echo "📱 使用方法："
echo "1. 在手机上打开浏览器"
echo "2. 访问二维码下载页面"
echo "3. 扫描二维码或点击下载按钮"
echo "4. 下载APK文件并安装"
echo ""

echo "🚀 启动下载服务器..."
python3 -m http.server 8080 &
SERVER_PID=$!

echo "✅ 服务器已启动 (PID: $SERVER_PID)"
echo "📱 访问地址：http://$IP:8080/download.html"
echo ""
echo "按 Ctrl+C 停止服务器"

# 等待用户中断
trap "echo ''; echo '🛑 停止服务器...'; kill $SERVER_PID 2>/dev/null; exit 0" INT

# 保持服务器运行
wait
