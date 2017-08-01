# ripple-wallet
Ripple瑞波本地钱包，支持Linux、MacOS和Windows，安装包下载地址：http://lieefu.com/ripplewallet

## 源代码编译安装方法
### 下载源代码
git clone git@github.com:lieefu/ripple-wallet.git
### 安装依赖库
* 安装nodejs
* 安装angular-cli

`npm install -g @angular/cli`

### 编译客户端
```
cd ripple-wallet/client
npm install
ng build -prod --aot
```
### 启动服务端
```
cd ripple-wallet/server
npm install
npm start
```

在浏览器中访问 http://localhost:3618

## 安装包制作
使用electron打包后，可以制作成客户端独立运行的钱包程序，发布到Linux、MacOS和Windows系统中运行。
