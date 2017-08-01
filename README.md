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

## 钱包主要界面预览
* 创建钱包
![image.png](http://upload-images.jianshu.io/upload_images/812760-e98513db92990326.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
* 钱包资金
![钱包资金截图](http://upload-images.jianshu.io/upload_images/812760-e22b7c50c3f57617.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
* 转账付款
![转账付款截图](http://upload-images.jianshu.io/upload_images/812760-9e0e5a93826964fc.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
* 交易市场
![交易市场截图](http://upload-images.jianshu.io/upload_images/812760-bad8bdbbe6a1eb43.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
* 提现
![提现截图](http://upload-images.jianshu.io/upload_images/812760-1fd57b754d40c8b9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
* 充值
![充值截图](http://upload-images.jianshu.io/upload_images/812760-7c330bb43edda27b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
