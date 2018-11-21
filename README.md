# soa-hotel-service

## 项目结构
```
.
├── build // 构建工具
│   ├── koa
│   ├── setup-dev-server.js
│   ├── webpack.base.config.js
│   ├── webpack.client.config.js
│   └── webpack.server.config.js
├── client // 客户端项目
│   ├── App.vue
│   ├── app.js // 客户端入口
│   ├── components // 组件集
│   ├── entry-client.js
│   ├── entry-server.js
│   ├── index.template.html // 根模板
│   ├── router
│   ├── store
│   ├── utils // 工具集
│   └── views // 业务视图
├── package.json // 项目依赖
├── server 服务端项目
│   ├── app.js // 服务端入口
│   ├── ignite // 项目点火工具
│   ├── middleware // Koa中间件
│   ├── router.js
│   └── utils // 工具集
└── server.js // 应用入口

```
## NodeJS版本
8.9.4

如果本地需要使用不同版本的NodeJS进行开发，推荐使用NVM(Node Version Manager)进行NodeJS版本管理，详情请参考[这里](https://github.com/creationix/nvm)
## 本地调试
推荐使用nodemon，可以支持热更新
### DEV
```
npm run dev
```
### PROD
```
npm run build
npm start
```
### 使用VSCode Debug
在VSCode Debug功能下的`launch.json`配置如下:
```
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
        "type": "node",
        "request": "launch",
        "name": "nodemon",
        "runtimeExecutable": "${env:HOME}/.nvm/versions/node/v8.9.4/bin/nodemon", // 如果使用了nvm，可以这样配置。如果没有，直接配置"nodemon"即可
        "skipFiles": [
            "${workspaceFolder}/node_modules/**/*.js",
        ],
        "program": "${workspaceFolder}/server.js",
        "protocol": "inspector",
        "restart": true,
        "console": "integratedTerminal",
        "internalConsoleOptions": "neverOpen"
    }, ]
}
```
