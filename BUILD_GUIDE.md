# 📱 漂流瓶应用打包指南

## 🚀 一键打包（推荐）

### 打包所有平台
```bash
cd /Users/liudong/Desktop/myGitProgect/piaoLiuApp
./build-all.sh
```

### 单独打包Android
```bash
./build-android.sh
```

### 单独打包iOS
```bash
./build-ios.sh
```

## 🔧 环境要求

### Android打包要求
- ✅ **Java JDK**：版本8或以上
- ✅ **Android SDK**：已安装并配置环境变量
- ✅ **Android Studio**：用于生成签名密钥

### iOS打包要求
- ✅ **Xcode**：最新版本
- ✅ **CocoaPods**：`sudo gem install cocoapods`
- ✅ **Apple开发者账号**：用于签名和分发

## 📦 打包步骤

### 1. Android APK打包

#### 步骤1：生成签名密钥
```bash
cd android/app
keytool -genkey -v -keystore release.keystore -alias piaoliuapp -keyalg RSA -keysize 2048 -validity 10000
```

#### 步骤2：构建APK
```bash
cd android
./gradlew assembleRelease
```

#### 步骤3：获取APK
APK文件位置：`android/app/build/outputs/apk/release/app-release.apk`

### 2. iOS IPA打包

#### 步骤1：安装依赖
```bash
cd ios
pod install
```

#### 步骤2：构建Archive
```bash
xcodebuild archive -workspace piaoliuapp.xcworkspace -scheme piaoliuapp -configuration Release
```

#### 步骤3：导出IPA
```bash
xcodebuild -exportArchive -archivePath piaoliuapp.xcarchive -exportPath ./build
```

## 🎯 打包结果

### Android APK
- **文件位置**：`piaoliuapp-release.apk`
- **安装方式**：直接安装到Android设备
- **文件大小**：约20-30MB

### iOS IPA
- **文件位置**：`piaoliuapp.ipa`
- **安装方式**：需要开发者证书
- **文件大小**：约30-40MB

## 🔧 故障排除

### Android打包问题
```bash
# 清理构建缓存
cd android
./gradlew clean

# 重新构建
./gradlew assembleRelease
```

### iOS打包问题
```bash
# 清理构建缓存
cd ios
xcodebuild clean -workspace piaoliuapp.xcworkspace -scheme piaoliuapp

# 重新安装依赖
pod install
```

### 依赖问题
```bash
# 重新安装依赖
rm -rf node_modules yarn.lock
yarn install
```

## 📱 分发方式

### Android分发
1. **直接安装**：将APK文件发送给用户
2. **应用商店**：上传到Google Play Store
3. **第三方商店**：上传到其他应用商店

### iOS分发
1. **TestFlight**：苹果官方测试平台
2. **App Store**：苹果官方应用商店
3. **企业分发**：企业内部应用分发

## 🎊 项目状态

- ✅ **Android配置**：已配置签名和构建
- ✅ **iOS配置**：已配置构建和导出
- ✅ **打包脚本**：已创建自动化脚本
- ✅ **Web版本**：可直接使用

**项目已准备好打包！** 🎉

## 🚀 开始打包

运行以下命令开始打包：
```bash
./build-all.sh
```

这将自动构建Android APK和iOS IPA文件！
