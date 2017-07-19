
### 框架介绍

[Inferno](https://infernojs.org) 框架一款类似react的vDom的框架。

### 组件介绍

该组件包含常规开发需要的一些建议组件，都在plugin/common的文件夹中，运行项目既可以看到组件的文档页面。

### webpack建构

本项目利用[webpack](http://webpack.github.io/)作为基础的建构打包工具

**1、运行项目基本运行**

```
npm install     //安装模块
```

**2、客户端的启动方式**

client端对应的webpack配置文件为 webpack.dev.config.js

```
npm run wp                  //启动webpack client建构

node static_cache_gzip.js   //启动带gzip的静态服务
```

**3、server的同构**

server端对应的webpack的配置文件为 webpack.config.babel.js

```
npm run wpnode      //启动webpack server的建构

cd node_path        //进入server建构完成的目录

node server.js      //启动server端的服务
```

### 同构的设计

