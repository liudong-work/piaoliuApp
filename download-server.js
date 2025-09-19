const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './download.html';
    }
    
    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm',
        '.apk': 'application/vnd.android.package-archive'
    };
    
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - File Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${error.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`🌐 下载服务器已启动！`);
    console.log(`📱 访问地址: http://localhost:${PORT}/download.html`);
    console.log(`📱 APK下载: http://localhost:${PORT}/piaoliuapp.apk`);
    console.log(`🛑 按 Ctrl+C 停止服务器`);
});

// 获取本机IP
const os = require('os');
const networkInterfaces = os.networkInterfaces();
let localIP = 'localhost';

for (const name of Object.keys(networkInterfaces)) {
    for (const net of networkInterfaces[name]) {
        if (net.family === 'IPv4' && !net.internal) {
            localIP = net.address;
            break;
        }
    }
    if (localIP !== 'localhost') break;
}

console.log(`🌐 本机IP: ${localIP}`);
console.log(`📱 手机访问: http://${localIP}:${PORT}/download.html`);
