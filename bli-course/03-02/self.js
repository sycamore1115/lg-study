/**
读 vue 源码

1. vue 源码的下载和目录
项目地址：https://github.com/vuejs/vue
项目中最重要的就是 src 目录中的内容
src
├─compiler 编译相关，把 template 转换为 render 函数
├─core Vue 核心库
  ├─components 定义了 Vue 中自带的 keep-alive 组件
  ├─global-api 定义了 Vue 中的静态方法
  ├─instance 创建 Vue 实例的位置，定义了 Vue 中的构造函数、初始化以及生命周期钩子函数
  ├─observer 响应式机制实例的位置
  ├─util 公共方法
  ├─vdom 虚拟 DOM，重写了 snabbdom，增加了组件的机制
├─platforms 平台相关代码
  ├─web 浏览器
  ├─weex 移动端
├─server SSR，服务端渲染
├─sfc single file component，将 .vue 单文件编译为 js 对象
└─shared 公共的代码

vue2 中引入了 flow 进行类型检测，自己在官网学习

2. vue 源码的打包和调试 

打包工具：Rollup
Webpack 会把所有文件当作模块处理，而 Rollup 只处理 js。
开发项目适合使用 Webpack，开发库适合使用 Rollup。

注意切换到 dev 分支然后再 npm i 下载依赖

运行命令
"dev": "rollup -w -c scripts/config.js --sourcemap --environment TARGET:web-full-dev"
-w: watch 监视源码的变化，当源码变化时立即重新打包
-c: 设置配置文件，后面跟的 scripts/config.js 就是配置文件了
--environment: 设置环境变量，用于打包生成不同版本的 vue
+ --sourcemap: 开启代码地图

dist 目录下有很多 js 文件，这些 js 文件就是不同版本的 vue，此时并没有 .map 文件
我们先删除 dist 目录
运行 npm run dev
会发现重新生成了 dist 目录，且目录下生成 vue.js 和 vue.js.map 文件
.map 文件记录了 src 中的源码和我们打包生成的 vue.js 之间的关系
其他版本的 vue 需要通过 npm run build 命令生成

调试：
打开 examples\grid\index.html 文件，其中引入的是 ../../dist/vue.min.js 文件，我们要改成 ../../dist/vue.js
 */