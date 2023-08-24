---
title: Vue3
date: 2022-02-12 17:20:00
categories: Vue
tags: 
    - npm
    - vue3
    - axios
    - es6
    - webpack
    - vuex
    - vueRouter
feature: true
---

# Vue3

## Npm

>   *   npm （全称 Node Package Manager，即node 包管理器）
>
>   *   Node.js 默认使用 npm 作为软件包管理系统（安装 nodejs 即会默认安装 npm）

### 1. npm(nodejs) 安装：

#### 安装：

*   [Node.js 下载地址 (nodejs.cn)](http://nodejs.cn/)

下载 nodejs 安装（安装过程直接默认下一步即可）。

#### npm 配置修改：

*   `npm install cnpm -g` ：安装 cnpm 淘宝镜像（不建议使用，使用易出错）
*   `npm config set registry https://registry.npm.taobao.org/` ：npm 使用淘宝镜像路径（**推荐**）
*   `npm config get registry` ：查看镜像配置
*   npm 依赖缓存位置修改：
    *   `npm get cache` 或 `npm get prefix` ：查看缓存或保存模块地址
    *   `npm config set cache "E:\myfile\nodejs\data\node_cache"` ：缓存地址
    *   `npm config set prefix "E:\myfile\nodejs\data\node_global"` ：全局模块地址
        *   注意由于 node 全局模块大多需要命令访问因此，应在系统环境变量 **PATH** 中添加 node 的全局模块保存地址。

#### 常用命令：

*   `node -v`： 查看 nodejs 版本(检查是否安装成功)
*   `npm -v` ：查看 npm 版本
*   `npm install npm -g` ：npm 更新与全局安装
*   `npm install jquery` ：npm 安装软件包命令，在当前文件夹下安装（这里以jquery为例，在后面加上 -g 表示全局安装）
    *   如需指定版本 `npm install jquery@3.0.0 `（ ‘软件名@版本号’ ），且它会自动清理当前项目之前安装的版本使用你指定的版本
    *   `npm install bootstrap -save-dev` ：表示开发环境使用

*   `npm list -g` ：查看全局安装的软件包（去除 -g 查看当前文件夹项目下安装的所有软件包）
*   `npm list jquery` ：查看某个软件包的版本

### 2. Package.json：

*   `npm init` ：为当前项目生成 package.json 文件（可初始化 npm 项目）
*   `npm run 配置命令` ：运行 package.json 文件 scripts 配置中的命令
*   `npm install` ：根据 package.json 文件 dependencies 与 devDependencies 配置为项目安装软件包
*   **"jquery": "^3.0.0"** ：版本配置 **'^'** 符号表示 3 的大版本不会改变，后面两位数的版本自动更新。去除该符号则版本不会自动更新。此外使用 **'~'** 符号表示最后一位数版本自动更新。
*   **"main": "index.js"** ：配置当前项目的主入口文件，一般默认为当前项目 **src** 目录下的 **index.js** 文件。

## Webpack

>   webpack 是一个模块打包器（构建工具）。它主要目标是将 JavaScript 文件打包在一起，打包后的文件用于浏览器中使用，其次它还能 **转换、打包、包裹** 任何资源（默认只能打包 js 文件，对其它资源打包需要使用到插件）。

webpack 官网：[webpack](https://webpack.js.org/)

### 1. 概念：

*   树结构：在一个入口文件中引入所有资源，形成树状依赖关系。
*   模块：对于 webpack 来说所有的资源都称之为模块（.js，.css...）
*   chunk：打包过程中被操作的模块文件被称之为 chunk。
*   bundel：最终打包完成的文件。可能和 chunk 一样，大部分情况下它是多个 chunk 的集合。

### 2. 安装与使用：

`npm install webpack -g` ：安装 webpack 软件包。
`npm install webpack-cli -g`：安装 webpack 脚手架，即命令行执行程序。

`npm install webpack webpack-cli -g`：两个包同时安装命令。

`npm i webpack webpack-cli -D`：不全局安装仅为当前项目安装（i -> install，d -> 开发环境）

#### 打包 js 文件：

1.   在空项目中初始化 npm `npm init -y` 。
2.   创建 **src** 目录与 **index.js** 主文件（npm 中有介绍默认寻找 src 目录下 index.js），再根据需要创建其它的 JS 文件或者目录，但必须以 ./src/index.js 文件为主文件与其它文件相关联形成树状关系。
3.   打包 `webpack --mode=development` （开发环境），`webpack --mode=production` （生产环境）
4.   打包成功以后会在项目下生成 **dist** 目录，目录中的 **main.js** 就是打包成功后的 JS 文件。

### 3. 核心配置：

在 webpack 项目中新建 **webpack.config.js** （webpack 默认会按此文件配置打包）。

#### 1. 配置选项：

```javascript
const {resolve} = require('path'); // 使用 nodejs 来定位项目目录

// 所有的配置都是可选的
module.exports = {
    // 以哪个文件作为入口开始打包（默认 ./src/index.js）
    entry: './src/index.js',
    // 打包后的资源输出到哪里以及如何命名
    output: {
        filename: "build.js", // 打包后的文件名
        path: resolve(__dirname,'build') // 保存的目录
    },
    // 配置处理非 js 资源
    module: {
        rules: []
    },
    // 插件
    plugins: [],
    // 指示 webpack 使用相应模式的配置（development开发，production生产）
    mode: 'production', 
}
```

#### 2. 多入口多出口：

*   entry 为数组类型：多个入口文件打包形成一个 chunk 并最后输出一个文件

```javascript
entry: ['./src/index.js','./src/main.js'],
output: {
    filename: "build.js", // 打包后的文件名
    path: resolve(__dirname,'build') // 保存的目录
},
```

*   entry 为对象类型：多个入口文件打包形成多个 chunk 并最后输出多个文件（如下生成 one.js、two.js）

```javascript
entry: {
    one: './src/index.js',
    two: './src/main.js'
},
output: {
    filename: "[name].js", // 对象的 key 为文件名输出
    path: resolve(__dirname,'build') // 保存的目录
},
```

*   混合模式：对象中使用数组

```javascript
entry: {
    one: './src/index.js',
    two: ['./src/index.js','./src/main.js'],
},
output: {
    filename: "[name].js", // 对象的 key 为文件名输出
    path: resolve(__dirname,'build') // 保存的目录
},
```

#### 3. 打包 HTML 文件：

*   安装打包插件（仅开发环境使用）： `npm i html-webpack-plugin -D`

```javascript
const htmlWebpackPlugin = require('html-webpack-plugin'); // 引入 html-webpack-plugin

// 在 module.exports 中配置 plugins
plugins: [
    // 使用插件，参数为空时默认将生成一个空的模板 index.html 打包的 js/css 在此文件的 body 中引入
    new htmlWebpackPlugin(),
    // 打包多个 html 可配置多个
    new htmlWebpackPlugin({
        // 指定 html 模板最后打包 js/css 文件在此模板 body 最后引入
        template: './src/index.html',
        filename: 'main.html', // 打包后的文件名
        chunks: ['one','two'], // 此 html 中需要引入的 js,entry 配置的 key
        minify: {
            collapseWhitespace: true, // 移除空格
            removeComments: true // 移除注释
        }
    }),
],
```

#### 4. 打包 CSS 文件：

安装 css-loader 和 style-loader ，css-loader 打包单个文件并处理 @import 和 URL 等外部资源。style-loader 在 head 标签中插入 style 标签并将打包的 css 样式利用 js 嵌入其中（只是单纯打包 css 文件可以忽略此插件）。

安装命令： `npm i css-loader style-loader -D`

```javascript
require('./style.css'); // 在 js 文件中引入 css

// 配置文件中配置
module: {
    rules: [{
        test: /\.css$/, // 规则
        // 遵循从右到左从下到上，因此注意'style-loader','css-loader'的顺序
        use: ['style-loader','css-loader'],
    }]
},
```

#### 5. 打包图片、字体图标，eslint js语法检查(略)：

[webpack打包详解](https://zhuanlan.zhihu.com/p/355825312)

#### 6. DevServer：

*   安装： `npm i webpack-dev-server -D`

*   开启服务： `webpack serve`

*   webpack5 支持自动刷新需要在 webpack.config.js 中 module.exports 内添加属性（修改配置文件后需要重启服务）：

`target: "web"`

*   修改访问端口： `webpack serve --port 8081`

*   除向像上方使用命令修改 devserver 配置外，也能在 webpack.config.js 配置：

```json
devServer: {
    port: 8081,
    compress: true, // 编译时压缩
    open: true, // 自动开启浏览器
    // 自动刷新默认是重新加载所有的文件，开启热替换只重新加载修改的文件
    hot: true
}
```

#### 7. 去除无用的 js、css (略)：

## ES6 语法

### 1. let、const ：

`var` ： 可以重复声明、无法限制修改、没有块级作用域。

`let` ： 不能重复声明、拥有块级作用域。

`const` ： 与 let 类似但仅作为常量使用。

### 2. 箭头函数与 this 指向：

1.   箭头函数返回对象问题：

```javascript
var o = ()=>{name:'hello',num:1};
console.log(o()); // 报错：VM387:1 Uncaught SyntaxError: Unexpected token ':'

var o = ()=>{return {name:'hello'}}; // 使用 return 返回对象
console.log(o); // ()=>{return {name:'hello'}}
var o = ()=>({name:'hello',num:1}); // 使用括号包裹对象
console.log(o()); // {name: 'hello', num: 1}
```

2.   普通函数 this 指向它的调用者。
3.   箭头函数 this 指向它定义时所处位置的外层 this 。

### 3. 数组方法：

map 映射： `arr.map(function(values,index,array){})` 函数返回值为映射数组元素的值。

filter 过滤： `arr.filter(function(values){})` 函数返回值 true 表示保留当前数组元素。

forEach ： `arr.forEach(function(values){})` 迭代器遍历。

reduce 汇总：`arr.reduce((newValue,nextValue,index)=>{},?initialValue)`

```javascript
var array = [2,3,4];
array.reduce((newValue,nextValue)=>{
    console.log(newValue,nextValue); // 0 2, 2 3, 5 4, 最后返回值为 9
    return newValue+nextValue;
}, 0); // 参2 指定 函数参1 初始化值
array.reduce((newValue,nextValue)=>{
    console.log(newValue,nextValue); // 2 3, 5 4, 最后返回值为 9
    return newValue+nextValue;
}); // 注意 未指定参2 时循环次数少 1
```

### 4. Module 模块化：

注意模块化必须在服务器中使用，本地无效。vscode 可以使用 **Live Server** ，idea 直接点击浏览器图标即可。

#### 1. main.html 中引入主 main.js ：

```html
<script src="main.js" type="module"></script>
```

#### 2. export 和 import ：

*   js1.js 中：

```javascript
let a = 1;
function b(){
    console.log("js1.js b()");
}
export {a,b}; // 集体导出
```

*   js2.js 中：

```javascript
export let a = 1; // 单个导出
// 一个 js 只能有一个 export default，可以在我们导入时自定义名字
export default function (){
    console.log("js2.js default");
}
```

*   main.js 中：

```javascript
import {a as a1,b} from "./js1.js"; // 指定导入(as 重命名)
// import * as o from "./js1.js"; // 导入所有，并都放入 o 对象中
import {a} from "./js2.js"; // 必须使用{}，否则 a 为 default 的导出
import def from "./js2.js"; // 导入 default 的方法

console.log(a1,a);
b();
def();
// o.b();
```

## Axios

### 1. ES6 Promise：

> * 主要用于异步计算
> * 可以将异步操作队列化，按照期望的顺序执行，返回符合预期的结果
> * 可以在对象之间传递和操作 promise，帮助我们处理队列

**基本用法：**

```javascript
/* promise 承诺 resolve 解决 reject 拒绝 then 然后 catch 抓住 */
new Promise((resolve,reject)=>{
    console.log("执行方法 promise1");
    // 表示执行成功，参数为你需要返回的值（可以是任意类型）
    resolve("方法 promise1 执行完成");
    // return Promise.resolve(""); // 作用同上
    // return ""; // 作用同上
    // 表示执行错误，resolve 与 reject 作用与 return 类似会阻断方法的执行 
    reject("方法 pormise1 执行错误");
    // return Promise.reject(""); // 作用同上
}).then(
    res=>{
        console.log(res);
        return new Promise((resolve,reject)=>{
            console.log("执行方法 promise2");
            reject("方法 promise2 执行错误");
        });
    },err=>{
        console.log(err);
    }).then(res=>{},err=>{
    // 此处执行 promise1 then 中返回的 promise2 then
    console.log(err);
}).catch(err=>{
    /* 上面有错误发生并未处理时在此处统一处理 */
    console.log(err);
});
```

**Promise.all(Promise[]) 并发处理:**

```javascript
Promise.all([
    new Promise(resolve=>{
        resolve("promise1 执行完成");
    }),
    new Promise(resolve=>{
        resolve("promise2 执行完成");
    })
]).then(res=>console.log(res));
// ['promise1 执行完成', 'promise2 执行完成']
```

### 2. 简单使用:

* [Axios 中文文档 | Axios 中文官网 (axios-http.cn)](https://www.axios-http.cn/)

[在 cdnjs 中搜索 axios 引入 js 文件](https://cdnjs.com/) ：

`<script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.27.2/axios.min.js"></script>`

```javascript
// 默认 get 请求
axios('/api').then(res=>{
    console.log(res);
});

// 设置参数
axios({
    rul: '/api',
    method: "POST", // 指定请求方式
    params: { // 注意此参数是将值添加到 URL 路径中
        name: 'ruoxijun',
        age: 18,
    },
    data: { // 值存储在请求体中传递
        name: 'ruoxijun',
        age: 18,
    }
}).then(res=>console.log(res))
    .catch(err=>console.log(err));

axios.get('/api',{
    params: {
        name: 'ruoxijun',
        age: 18,
    },
}).then(res=>console.log(res));
// 如果 post 参数2为字符串，会拼接到 URL 中作为参数。axios.get 不支持
axios.post('/api','name=ruoxijun&age=18').then(res=>console.log(res));
```

**axios 并发请求处理** ：

axios.all 与 Promise.all 方法类似

```javascript
axios.all([
    axios.get('/api'),
    axios.get('/api'),
]).then(res=>console.log(res)) // 请求结果集中到数组返回
    .catch(err=>console.log(err));

axios.all([
    axios.get('/api'),
    axios.get('/api'),
]).then(
    // 将请求结果作为方法参数
    axios.spread((res1,res2)=>{
        console.log(res1,res2);
    })
).catch(err=>console.log(err));
```

### 3. 全局配置与封装：

```javascript
// 全局配置
axios.defaults.baseURL = "http://localhost"; // 请求路径前缀
axios.defaults.timeout = 5000; // 请求超时时间

// 封装（每一个都可以认为是一个单独的 axios）
let git = axios.create({
    baseurl: "https://github.com/",
    timeout: 5000,
});
let local = axios.create({
    baseurl: "https://localhost",
    timeout: 5000,
});

// 使用
git.get("/api").then(res=>console.log(res));
```

### 4. 拦截器：

```javascript
// 请求拦截器
axios.interceptors.request.use(config=>{
    return config; // 放行
},error=>{
    return Promise.reject(error);
});
// 响应拦截器
axios.interceptors.response.use(config=>{
    return config; // 放行
},error=>{
    return Promise.reject(error);
});
```

## Vue3

### 1. 初识 vue3:

* [官网（旧版） Vue.js (vuejs.org)](https://v3.cn.vuejs.org/)
* [最新 Vue3 文档官网 Vue.js (vuejs.org)](https://staging-cn.vuejs.org/)

```javascript
/* // vue2 创建实例与挂载元素
const app = new vue({
    el: '#app',
    data: {
        message: 'hello world'
    }
}); */

// vue3 创建实例与挂载元素
const app = {
    data() {
        return {
            message: 'hello world'
        }
    },
};
const vm = Vue.createApp(app).mount("#app");
// 访问属性
vm.message = 'hello'; // 可直接访问（包括方法）
vm.$data.message = 'world';
```

### 2. vue-cli：

Vue-Cli（Command Line Interface） 是 vue 官方提供的脚手架工具。默认已经帮我们搭建好了一套利用 Webpack 管理 vue 的项目结构。

#### 1. 命令须知：

* 安装命令： `npm install -g @vue/cli`
* 检查版本： `vue -version` 或 `vue -V`
* 创建项目： `vue create 项目名称`
* 卸载命令： `npm uninstall -g vue-cli`

#### 2. 项目创建：

1. 执行 `vue create vue3-demo1` 命令开始创建项目：

![vue项目创建](/images/vue/vue3/vuecreate.png)

此处使用上下键加回车进行选择，前两个选项表示创建默认的 **vue3** 或 **vue2** 项目。默认创建的项目中包含两个插件：

**babel** : 检查 es6转es5

**eslint** : 检查 es 语法与修复

第三个选项 `Manually select features` 表示手动创建项目，建议使用。

2. 默认的 vue3 项目结构：

![vue项目创建](/images/vue/vue3/vueproject.png)

3. 手动创建项目：

![vue项目创建](/images/vue/vue3/manuallyselect.png)

选择 `Manually select features` 后进入上界面，通过上下键与空格选择或取消，选择完成后回车进入下一步。

之后对项目以及插件进行配置操作如下：

![vue项目创建](/images/vue/vue3/vueprojectconfig.png)

如果最后对项目配置进行了保存删除 `C:\当前用户文件夹\.vuerc` 文件中可以去除保存的配置。

#### 3. vue.config.js:

当我们需要对 webpack 或插件进行配置时只需要在项目的根路径下新建 `vue.config.js` ，vue-cli 提供了方便的配置方法，我们也可以选择使用 webpack 原生的配置方法进行配置。

[配置详情请参照： Configuration Reference | Vue CLI (vuejs.org)](https://cli.vuejs.org/config/)

```javascript
module.exports = {
    // 设置项目编译后的文件夹（vue-cli 提供的配置方法）
    outputDir: 'build',
    configureWebpack: { // 使用 webpack 原生方法配置
        plugins: []
    }
}
```

### 3. Vue3 语法：

#### 1. 基础语法：

1. 插值表达式： `{{msg}}` 注意只接受表达式，不能使用语句
2. 简单指令 `v-指令` :
    * `v-pre` ：不解析该标签中的 vue 语法
    * `v-once` ：该标签中的 vue 语法只解析一次
    * `v-text` ：向该标签中插入文本
    * `v-html` ：向改标签中插入 html（v-html="不能在此直接书写html"）
    * `v-show` ：是否显示该标签
    * `v-if , v-else , v-else-if` ：是否渲染该标签
    * `v-cloak` ：防止弱网络环境下渲染闪烁问题

#### 2. v-bind：

1. 简单使用：

`v-bind:属性名` 主要对标签的属性进行绑定,除此它还有一种简写的方式 `:属性名` 。

2. 绑定 style：

```javascript
 // 绑定的样式与原有的样式会根据先后顺序以及优先级关系覆盖（如下宽200被宽100覆盖）
<div :style="['font-size:22px','width:200px',fontcolor,styles]"
    style="width:100px;" > div 1 </div>
<div :style="{color:'red','font-size':'18px'}"> div 3 </div>
/* javascript */
data() {
    return {
        fontcolor: 'color:red', // 字体颜色
        styles: {backgroundColor: '#123'}, // 背景
    }
}
```

3. 绑定 class：

style 与 class 的属性绑定都支持 **字符串、数组、对象（常用）、方法** 。

```javascript
<div :class="one"> div 3 </div>
<div :class="{one:isone,istwo}"> div 4 </div>
/* javascript */
data() {
    return {
        one: 'one',
        isone: true,
        istwo: true
    }
}
/* style */    
.one {color: blue;}
.istwo {font-size:18px;}
```

#### 3. computed：

* html：

```html
<h1>插值方式： {{name + msg}}</h1>
<h1>方法返回： {{getTitle()}}</h1>
<h1>计算属性： {{title}}</h1>
<h1>使用 set： {{setTitle()}}</h1>
```

* javascript：

```javascript
data() {
  return {
    name: 'hello',
    msg: 'world',
  }
},
methods: {
  getTitle() {
    return this.name + this.msg;
  },
  setTitle() {
    // return ’hi‘ set 方法会返回设置的值
    this.title2='hi';
    return this.title2;
  }
},
computed: {
  title() { // 为方法是默认为计算属性的 get 方法
    return this.name + this.msg;
  },
  title2:{ // 使用对象为属性添加 set、get 方法
    get() {
      return this.name + this.msg;
    },
    set(newVla) {
      this.msg = newVla;
    }
  }
}
```

计算属性只有在 get 方法中 vue 的属性值发生改变时，才会重新计算否则都将使用缓存的数据。而普通方法看你在页面中调用了多少次则运行多少次。

#### 4. v-on：

* `v-on:click` ：绑定一个点击事件，简写 `@click`

当调用事件方法时没有传入参数，且声明方法时只有一个参数，默认该参数的值就是事件 `event` 对象。当有多个参数且我们需要事件对象时 `$event` 作为参数它就代表了当前事件对象（`@click="click(val,$event)"`）； 

**事件修饰符：**

* `stop` ：阻止事件冒泡
* `self` ：当前事件由该元素本身触发时才执行
* `capture` ：事件捕获模式（如点击事件触发且冒泡时，会优先执行添加该修饰符的外层）
* `prevent` ：阻止默认事件
* `once` ：事件只触发一次

#### 5. v-for：

`v-for` 可以循环渲染标签

* `v-for="(item, [index]) in arr"` ：循环数组
* `v-for="(val, [key], [index]) in obj"` ：循环对象

vue 对于循环的标签提供了一个 `:key` 唯一标识符属性，当循环的数组或者对象改变时它会去对比这个 key 值，只重新渲染改变了的数据,而不去影响未改变的数据增加渲染效率。

`<div v-for="(v,i) in arr" :key="i"></div>` ：使用唯一标识符的循环

* 在 vue3 中 `v-if` 优先级大于 `v-for` ，vue2 反之。

#### 6. v-model：

* `<input v-model="val" />` ：

**修饰符：**

* `lazy` ：懒加载
* `number` ：让绑定值（默认 string）转换为 number 类型
* `trim` ：去除绑定值两端的空格

**单选框与多选框：**

```html
<div>性别：{{sex}}</div>
男：<input type="radio" value="男" v-model="sex"> <br/>
女：<input type="radio" value="女" v-model="sex"> <br/>

协议：<input type="checkbox" value="yes" v-model="type"> {{type}} <br/>

<div>爱好：{{like}}</div>
java：<input type="checkbox" value="java" v-model="like"> <br/>
html：<input type="checkbox" value="html" v-model="like"> <br/>
php：<input type="checkbox" value="php" v-model="like"> <br/>

<select v-model="select">
    <option value="1">1</option>
    <option value="2">2</option>
</select><br/>

<select v-model="selects" multiple>
    <option value="1">1</option>
    <option value="2">2</option>
</select>
```

这里 `v-model` 就代表了它们的 name 属性同时与 value 绑定。

radio 需要默认选中时将绑定的变量设置为你需要的 value 即可。

checkbox 单个时绑定的属性为值为 true/false 表示它是否选中。多个时绑定一个数组，数组的值可以设置为需要默认选中的 value 数组值。

select 标签使用上同理多选绑定数组即可。

#### 7. watch:

```javascript
watch:{ // 属性监听
    message(newVal, oldVal){}, // 监听 data 中 message 的变化
    obj: { // 监听 data 中 obj 属性的变化
        handler(newVal, oldVal){}, // 触发方法
        immediate: true, // 初始化是否执行一次
        deep: true, // 开启深度监听
    }
}
```

#### 8. Teleport：

```html
<!-- 将内容传送到指定 dom 节点，不受父级影响，disabled 是否传送默认true -->
<Teleport :disabled="true" to="body"> <!-- 类：.main , id：#main -->
  <div> Hello from the modal! </div>
</Teleport>
```

#### 9. component：

```html
<script>
import Foo from './Foo.vue';
import Bar from './Bar.vue';

export default {
  components: { Foo, Bar }, // 注册组件
  data() {
    return {
      view: 'Foo' // 组件名
    }
  }
}
</script>

<!-- 绑定组件名 -->
<component :is="view" />
<!-- 直接绑定组件（直接绑定组件 is 可以不需要 v-bind） -->
<component :is="Foo" />
```

### 4. 组件化开发：

#### 1. 创建组件：

我在 components 文件夹中创建了一个名为 MyComponent.vue 文件，这是组件化开发一个组件的基本格式。

``` html
<template>
  <div v-text="msg"></div>
</template>

<script>
export default {
  name: "Demo",
  data(){
    return {
      msg: "this is MyComponent",
    }
  }
}
</script>

<style scoped lang="scss">
    <!-- style 中的样式一般子组件也能使用 -->
    <!-- scoped 表示此 style 中的样式只允许当前组件中使用，该组件中的子组件不能使用 -->
</style>
```

[关于 lang="scss" 使用：学习Scss-看这篇就够了 - SegmentFault 思否](https://segmentfault.com/a/1190000041314876)

#### 2. 引用组件：

在 App.vue 中引用 MyComponent.vue 。

```html
<template>
  <div>
    <!-- 使用组件，以下两种方式均可使用 -->
    <MyComponent class=“my-style”></MyComponent> <!-- 当组件只有一个根节点时样式会作用到该根节点上 -->
    <my-component></my-component> <!-- 推荐使用小写加横杠方式 -->
  </div>
</template>

<script>
import MyComponent from '@/components/MyComponent'; // 引入要使用的组件
export default {
  name: 'App',
  components: {
    MyComponent, // 注册组件
  }
}
</script>
```

#### 3. props（父传子）：

1. props 数组定义组件属性：

```html
<!-- 在子组件中 -->
<template>
    <div>接收的父类消息: {{parentMsg}}</div>
</template>
<script>
export default {
  props: ['parentMsg', ], // 定义属性方便父组件传递数据
}
</script>

<!-- 在父组件中 -->
<my-component :parent-msg='msg'></my-component>
<!-- 将 msg 绑定到该属性上，可以绑定任意值（如字符串、对象等） -->
```

2. props 对象定义组件属性并添加验证：

```javascript
props: {
  // 基础的类型检查 (`null` 和 `undefined` 会通过任何类型验证)
  propA: Number, // 给组件定义了一个 prop-a 属性
  // 多个可能的类型
  propB: [String, Number],
  // 必填的字符串
  propC: {
    type: String,
    required: true
  },
  // 带有默认值的数字
  propD: {
    type: Number,
    default: 100
  },
  // 带有默认值的对象
  propE: {
    type: Object,
    default: { message: 'hello' },
    // 在 vue2 时对象或数组默认值必须从一个工厂函数获取
    // default: function () {
    //   return { message: 'hello' }
    // }
  },
  // 自定义验证函数
  propF: {
    validator: function (value) {
      // 这个值必须匹配下列字符串中的一个
      return ['success', 'warning', 'danger'].indexOf(value) !== -1
    }
  }
}
```

type 可以是如下类型，type 也可以是一个自定义构造器，使用 instanceof 检测：

- `String`
- `Number`
- `Boolean`
- `Array`
- `Object`
- `Date`
- `Function`
- `Symbol`

#### 4. $emit（子传父）：

* 子组件无法直接改变 props 接收到的数据，可以通过向父组件传递数据方式通知父组件来改变数据。
* 官方建议：强烈建议使用 `emits` 记录每个组件所触发的所有事件（与 props 属性类似）。

1. 在子组件中：

```html
<template>
  <div>
    <div>接收的父类数据: {{number}}</div>
    <button @click="addNumber(2)">+</button>
  </div>
</template>
<script>
export default {
  props: ['number'],
  // emits 不是必须的，但是建议使用
  emits: ['addNumber'], // 可以使用对象 {addNumber: val=>val>0} 并添加验证
  methods: {
    addNumber(num) {
      // 为此组件定义了一个方法供父组件使用，并向该方法返回数据（可以为任意类型数据）
      this.$emit('addNumber',num);
    }
  },
}
</script>
```

2. 在父组件中：

```html
<template>
  <div>
    {{number}}
    <my-component :number="number" @add-number="addNumber"></my-component>
  </div>
</template>

<script>
import MyComponent from '@/components/MyComponent';
export default {
  components: {
    MyComponent,
  },
  data() {
    return {
      number: 0,
    }
  },
  methods: {
    addNumber(num) { // 该方法与子组件绑定，并接收子组件返回的数据
      this.number += num;
    }
  },
}
</script>
```

#### 5. 父子间直接访问：

* `$parent` ：在子组件中使用该属性可直接调用父组件的方法或属性
* `$root` ：直接访问根组件中的属性（一般是 App.vue）
* `$children` ：vue2 中使用该属性访问子组件属性（vue3 已**弃用**）
* `$refs` ： 访问子组件属性或获取 dom 元素:

```html
<!-- 使用 ref 绑定子组件 -->
<my-component ref="com1"></my-component>
<my-component ref="com2"></my-component>

<!-- $refs 通过 ref 的值来访问指定的子组件 -->
this.$refs.com1.msg="msg1";
this.$refs.com2.msg="msg2";
```

`ref` 作用在普通 html 标签中时获取到的是标签 dom 元素。

* `ref` 与 `v-for` 一同使用时，vue2 时 `$refs` 会返回循环的 dom/组件 数组，vue3 中为了效率需要给 `ref` 绑定一个函数处理 `ref` 。

```html
<div v-for="i in 10" :ref="setItemRef"> {{ i }} </div>

setItemRef(el) { // 参1为循环得到的 dom/组件
  this.divArr.push(el);
}
```

#### 6. slot 插槽：

1. 基本使用：

```html
<template>
  <div class="child">
    <slot><span>缺省内容（默认内容）</span></slot>
  </div>
</template>
```

**slot** 标签表示一个插槽，当使用该组件未插入任何内容时，会将 **slot** 标签中的内容作为默认内容显示。

2. 具名插槽：

```html
<!-- 在子组件中 -->
<template>
  <div class="child">
    <!-- 为 slot 添加name属性 -->
    <div><slot name="one">1</slot></div>
    <div><slot name="two">2</slot></div>
    <!-- 未添加 name 属性的 slot -->
    <div><slot>3</slot></div>
  </div>
</templat>

<!-- 在父组件中 -->
<my-component>
  <!-- 使用 template 标签写入要插入的内容，v-slot 指定要插入的插槽 -->
  <template v-slot:one>
    <span>插入 one 中</span>
  </template>
  <!-- # 简写方式等于 v-slot (不建议使用简写) -->
  <template #two>
    <span>插入 two 中</span>
  </template>
  <!-- default 表示没有 name 属性值的插槽 -->
  <template v-slot:default>
    <span>插入 default 中</span>
  </template>
</my-component>
```

当子组件中有多个插槽时，插入的内容默认会插入所有没有 `name` 属性值的插槽中（`name=""` 不会）。

3. 插槽传值：

```html
<!-- 在子组件中 -->
<template>
  <div class="child">
    <slot :val="msg">使用 v-bind 定义 val 属性绑定 msg，可以定义多个属性，绑定任意值</slot>
  </div>
</template>
<script>
export default {
  data() {
    return {
      msg: "this is child msg"
    }
  },
}
</script>

<!-- 在父组件中 -->
<my-component>
    <!-- 给传递的属性定义一个接收的对象，并使用插槽属性传递的值 -->
    <template v-slot:default="child_val"> <!-- 具名插槽同理 -->
        <span>插入 default 中 - {{child_val.val}}</span>
    </template>
</my-component>
```

4. 动态插槽：

```html
<my-component>
    <!-- 通过切换 slotName 属性值来动态切换插槽 -->
    <template #[slotName]> {{ slotName }} </template>
</my-component>

<script>
export default {
  data() {
    return { slotName: "one" }
  },
}
</script>
```

#### 7. keep-alive：

**官方解释：** 

`<keep-alive>` 包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们。和 `<transition>` 相似，`<keep-alive>` 是一个抽象组件：它自身不会渲染一个 DOM 元素，也不会出现在组件的父组件链中。

当组件在 `<keep-alive>` 内被切换时，它的 `mounted` 和 `unmounted` 生命周期钩子不会被调用，取而代之的是 `activated` 和 `deactivated`。(这会运用在 `<keep-alive>` 的直接子节点及其所有子孙节点。)

主要用于保留组件状态或避免重新渲染。

```html
<keep-alive>
  <component :is="view"></component>
</keep-alive>
```

* `include` / `exclude` （包含/排除）：

```html
<!-- 以英文逗号分隔的字符串(标签名或组件名)，max 通过算法缓存指定个数内常用的组件 -->
<KeepAlive include="a,b" :max="10">
  <component :is="view" />
</KeepAlive>

<!-- 正则表达式 (需使用 `v-bind`) -->
<KeepAlive :include="/a|b/">
  <component :is="view" />
</KeepAlive>

<!-- 数组 (需使用 `v-bind` ，可以是字符串与正则表达式混合数组) -->
<KeepAlive :include="['a', 'b']">
  <component :is="view" />
</KeepAlive>
```

#### 8. 组件生命周期函数：

##### 1. 组件生命周期图：

![vue3 组件生命周期函数](/images/vue/vue3/lifecycle.svg)

##### 2. 组件生命周期方法：

```javascript
beforeCreate() {
  console.log("实例刚刚被创建");
},
created() {
  console.log("实例已经创建完成");
},
beforeMount() {
  console.log("模板编译之前");
},
mounted() {
  console.log("模板编译完成");
},
beforeUpdate() {
  console.log("数据更新之前");
},
updated() {
  console.log("数据更新完成");
},
activated() {
  console.log("keep-alive 缓存的组件激活时");
},
deactivated() {
  console.log("keep-alive 缓存的组件停用时");
},
beforeUnmount() {
  console.log("实例销毁之前");
},
unmounted() {
  console.log("实例销毁完成");
}
```
##### 3. $nexTick ：

**官方解释：**将回调推迟到下一个 DOM 更新周期之后执行。在更改了一些数据以等待 DOM 更新后立即使用它。

```javascript
this.$nextTick(function() {
    // 操作更新后的 Dom
})
```

* 例如在 **created** 中 Dom 还未创建完成，这时我们可以使用 **$nexTick** 写入即将对 Dom 进行的操作，等待 Dom 更新创建完成后将执行该操作。
* 列如一个很大的数组做了很大的改动你需要 Dom 更新完成之后做些什么，这时你可以在数组操作完的下一句使用 `$nextTick` 它会在 Dom 改动且渲染完成后做出操作。

## Axios 与 Vue

### 1. Vue 中使用 Axios：

* 项目中安装 Axios：`npm i axios -S`
* 在组件中直接使用：

```javascript
// 在需要 axios 的组件中导入
import axios from "axios";
```

* 新建 js 文件封装 axios（以 src 下新建 @/utils/request.js 文件为例）：

```javascript
import axios from 'axios' // 引入 axios

// 创建 axios 实例
const request = axios.create({
    // config
})
/* 创建其它实例或实例配置等... */
// 导出需要使用的实例或者方法等...
export default request
```

在组件中直接引入使用即可： `import {request} from "@/utils/request"`

### 2. Vue 封装 Axios 模板：

**内容展示省略（TODO）**

## VueRouter

### 1. 认识路由：

* [官网 Vue Router (vuejs.org)](https://router.vuejs.org/zh/)
* 安装 axios： `npm install vue-router@4`

#### 1. 基础使用：

1. vue 中使用路由参照 vue-cli 创建路由项目（src 下 **router/index.js**）：

```java
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
```

路由中导入组件 `import from` 方式打包时会将所有组件与路由打包到同一个 js 中。

`() => import('组件')` 会将组件打包为单个 js 文件实现懒加载，推荐使用。

2. 在 **main.js** 中注册路由：

```javascript
import router from './router'
createApp(App).use(router).mount('#app')
```

3. 在 **App.vue** 中使用路由：

```html
<template>
    <!-- 路由跳转地址（与 a 标签作用类似，不建议使用a标签） -->
    <router-link to="/">Home</router-link>
    <router-link to="/about">About</router-link>
    <router-view/><!-- 路由视图展示 -->
</template>

<style>
    /* 当前所在路由对应 router-link 激活的样式 */
    a.router-link-exact-active {
        color: #42b983; /* 如当前在首页时 Home 展示此样式 */
    }
</style>
```

#### 2. 路由模式：

`Hash` ：使用 URL 的 hash值来作为路由，且 URL 中会带有 **# 号**。

`History` ：历史模式借助 HTML5 History API 实现。

切换 Hash 模式：

```javascript
import { createRouter, createWebHistory, createWebHashHistory} from 'vue-router'
const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL), // 历史模式
  history: createWebHashHistory(process.env.BASE_URL), // Hash 模式（默认）
  routes
})
```

#### 3. 重定向与别名：

```javascript
{
  path: '/',
  name: 'home',
  component: ()=> import('../views/HomeView.vue'),
},{
  path: '/index',
  // alias: '/home', // 别名
  alias: ['/index.html','/home'],
  // alias: ['/home:id'] // 当此路径有使用 params 传参时，别名也需要将参数带上（params 传参下方有介绍）

  redirect: '/', // 重定向
  // redirect: {name:'home'}, // 也可以使用 path 路径方式
  /* 函数返回一个对象，函数参数就是 $route
  redirect: route=>{
    return {path:'/',query:{id:route.params.id}} // query 传参下方有介绍
  } */
},
```

### 2. router-link：

* 为路由激活状态的 router-link 设置 class:

```html
<!-- active-class 指点激活样式 class，target="_blank" 重新打开一个网页到首页 -->
<router-link to="/" active-class="active" target="_blank">Home</router-link>
```

* 自定义路由方式与常用 API：

```html
<!-- 使用插槽方式 -->
<router-link to="/about">
    <button>About</button> <!-- 替换 a 标签 -->
</router-link>
<!-- 访问新的页面并添加历史记录 -->
<button @click="$router.push('/user')">个人中心</button>
<!-- 访问新页面并直接替换当前记录 -->
<button @click="$router.replace('/about')">关于我们</button> 
<!-- 返回上一页面 -->
<button @click="$router.go(-1)">返回</button>
<!-- 当前路由路径（注意这里是 route 不是 router） -->
<h3>{{$route.path}}</h3>
```

* 使用命名视图（了解）：

可以为 router-view 设置 **name** 属性：

```html
<!-- 展示默认组件 -->
<router-view></router-view>
<!-- 展示相应名称组件 -->
<router-view name="home"></router-view>
<router-view name="about"></router-view>
```

配置路由时使用 components 对象：

```javascript
{
  path: '/',
  name: 'home',
  // component: ()=> import('../views/HomeView.vue'),
  components: {
    default: ()=> import('../views/HomeView.vue'), // 没有对应命名视图时默认显示组件
    home: ()=> import('../views/HomeView.vue'), // name 为 home 的视图展示该组件
    about: ()=> import('../views/AboutView.vue'),
  }
},
```

### 3. 嵌套路由：

1. 路由中定义子路由：

```javascript
{
  path: '/about',
  component: () => import('../views/AboutView.vue'),
  // redirect: '/about/Children1', // 重定向
  children: [ // children 数组定义子路由
    { 
      path:'', // 相当于设置 '/about' 路径时默认显示的组件（优先与重定向）
      component: ()=> import('../components/Children1.vue')
    },{
      path: 'children1', // 子路由路径不需要 '/'
      component: ()=> import('../components/Children1.vue')
    },{
      path: 'children2',
      component: ()=> import('../components/Children2.vue')
    }
  ]
},
```

2. 使用子路由（这里是 AboutView.vue 中）：

```html
<router-link to="/about/children1">Children1</router-link> <!-- to 需要写全路径 -->
<router-link to="/about/children2">Children1</router-link>
<router-view></router-view>
```

注意 **父级路由** 不能设置 **name** 属性。

### 4. 动态路由与参数传递：

#### 1. params 与 query 传参：

1. 路由定义：

```javascript
{
  path: 'children1/:msg',
  component: ()=> import('../components/Children1.vue')
},{
  path: 'children2',
  name: 'children2', // 定义路由名
  component: ()=> import('../components/Children2.vue')
}
```

2. 使用路由并传递参数：

```html
<!-- router4 版本 params 方式不传参会报错 No match found for location with path -->
<router-link to="/about/children1/1">子路由页面 - 1</router-link>
<!-- query 不传参不会报错 -->
<router-link to="/about/children2?name=user&age=18">子路由页面 - 2</router-link>
<router-link :to="{path:'/about/children2',query:{name:'user',age:18}}">子路由页面 - 2</router-link>
<router-link :to="{name:'children2',query:{name:'user',age:18}}">子路由页面 - 2</router-link>
```

3. 在对应组件中接收参数值：

* params：参数接收方式： `$route.params.id`

* query 参数接收方式： `$route.query.name`

#### 2. props 传参：

[将 props 传递给路由组件 | Vue Router (vuejs.org)](https://router.vuejs.org/zh/guide/essentials/passing-props.html)

1. 在 params 传参基础之上定义路由时添加 `props: true` 属性值。

```javascript
{
  path: '/user/:id', // 定义一个路径参数变量名为 id
  name: 'user',
  props: true, // 使用 props 传参
  component: ()=> import('../views/UserView.vue'),
}
```

2. 在此对应路由组件 **props** 属性中定义一个与路径变量名同名的属性类接收此参数值。

```html
<script>
export default {
  props: ['id'], // 保证名称与变量名一致
}
</script>
```

### 5. 导航守卫：

* 扩展路由 meta 原信息:

```javascript
{
  path: '/',
  component: ()=> import('../views/HomeView.vue'),
  meta: { // 路由原信息（可以存储任意信息）
    title: '首页',
  }
}
```

#### 1. 全局守卫：

```javascript
// 全局前置守卫，to 准备跳转的路由，from 当前路由（next 参数3支持但不建议使用）
router.beforeEach((to, from)=>{
  // path 路由路径，fullPath 完整路径（包括 query 参数） 
  console.log(to.path,from.fullPath);
  // return '/login'; // 重定向
  // return {name: "Login"};
  // return false; // 取消导航
  /* 注意添加 next 参数后必须由 next 控制跳转，
  return 将不起作用，且不 next() 时也不能默认跳转下一页面 */
});

// 全局解析守卫（每次导航时都会触发）
router.beforeResolve(to=> {
  // return false;
});

// 全局后置钩子，to 调转到的路由，from 之前的路由，failure 导航是否成功（不支持 next 参数）
router.afterEach((to, from, failure)=>{
  // 将页面标题更改为 meta.title 属性的值
  document.title = to.meta.title;
});
```

#### 2. 路由守卫：

```javascript
{
  path: '/user/:id',
  component: ()=> import('../views/UserView.vue'),
  // 路由守卫，同一路由只有 params、query 改变时不会触发
  beforeEnter: (to, from) => {
    // return false
  },
  // 也可以是函数数组
  // beforeEnter: [removeQueryParams, removeHash],
}
```

#### 3. 组件守卫：

```javascript
<script> 
export default {
  beforeRouteEnter(to, from, next) {
    // 在渲染该组件的对应路由被验证前调用
    // 不能获取组件实例 `this`，因为当守卫执行时，组件实例还没被创建
    // 可以使用 next 的 vm 参数方位实例（仅 beforeRouteEnter 可使用）
    next(vm => {
      // 通过 `vm` 访问组件实例
    });
  },
  beforeRouteUpdate(to, from) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 `/users/:id`，在 `/users/1` 和 `/users/2` 之间跳转的时候，
  },
  beforeRouteLeave(to, from) {
    // 在导航离开该组件的对应路由时调用
  },
}
</script>
```

#### 4. 导航流程：

1. 导航被触发。
2. 在失活的组件里调用 `beforeRouteLeave` 守卫。
3. 调用全局的 `beforeEach` 守卫。
4. 在重用的组件里调用 `beforeRouteUpdate` 守卫(2.2+)。
5. 在路由配置里调用 `beforeEnter`。
6. 解析异步路由组件。
7. 在被激活的组件里调用 `beforeRouteEnter`。
8. 调用全局的 `beforeResolve` 守卫(2.5+)。
9. 导航被确认。
10. 调用全局的 `afterEach` 钩子。
11. 触发 DOM 更新。
12. 调用 `beforeRouteEnter` 守卫中传给 `next` 的回调函数，创建好的组件实例会作为回调函数的参数传入。

### 6. keep-alive 与 transition：

* vue2 时可以直接使用 `transition` 或 `keep-alive` 包裹组件。
* vue3 需使用下方式：

```html
<router-view v-slot="{ Component }">
  <transition>
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </transition>
</router-view>
```

## Vuex

### 1. 认识 Vuex：

* [Vuex 官网 (vuejs.org)](https://vuex.vuejs.org/zh/index.html)
* [Pinia 官网](https://pinia.vuejs.org/)
* [Pinia 中文文档 (web3doc.top)](https://pinia.web3doc.top/)
* 安装： `npm install vuex@next --save`

#### 工作原理：

![Vuex 工作原理图](/images/vue/vue3/vuex.png)

#### 引入方式：

1. 在 **src/store** 目录下新建 **index.js** 内容如下：

```javascript
import { createStore } from 'vuex'

export default createStore({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
});
```

2. 在 **main.js** 中注册 Vuex ：

```javascript
import store from './store'
createApp(App).use(store).mount('#app'); // 注册 Vuex
```

### 2.核心概念：

#### 1. State（状态）：

* 在 Vuex 的 state（*src/store/index.js*）中可以存储记录任意属性值，因此也被称之为 Vuex 的状态。

```javascript
export default createStore({
  state: {
    name: 'ruoxijun', // 这里声明了一个那么属性值
  },
})
```

* 在组件中读取状态值：

```html
<template>
  <div>{{$store.state.name}} - {{name}}</div> <!-- 访问 Vuex 状态中的属性 -->
</template>

<script>
  export default {
    data() {
      return {
        name: this.$store.state.name, // 已经注册在 vue 中，vue 的属性必须用 this 访问
      }
    },
  }
</script>
```

#### 2. Mutation（改变）:

组件中使用 `$store.state` 访问状态属性，也可以直接修改属性值，但并不推荐。官方推荐我们使用 **mutations** 搭配 **$store.commit** 的方式来修改状态。

```javascript
/*********** Vuex 中 ************/
mutations: {
  /**
   * 默认会将 state 作为第一个参数传入你的方法中
   * 参数2来接收用户传入的数据（payload 官方称之为载荷，并表示其应该是一个对象）
   */
  setStateName(state, payload) {
    state.name = payload; // 修改状态
  },
}

/*********** 组件中 ************/
methods: {
  setStateName() {
    /**
      * 使用 commit 来修改 Vuex 状态
      * 参数1为在 mutations 中需要被调用的方法名
      * 参数2为你需要传递的参数值（有多个值需要传递时使用对象或数组）
      */
    this.$store.commit('setStateName',this.name);
  }
},
```

使用对象风格 commit：

```javascript
/*********** 组件中 ************/
this.$store.commit({
    type: 'setStateName', // 使用 type 属性指定方法名称
    name: this.name // 参数值（属性名可以自定义）
});

/*********** Vuex 中 ************/
setStateName(state, payload) {
    // 注意接收到的参数值作为对象在参2中
    state.name = payload.name;
},
```

#### 3. Getter（属性）:

* Vuex 中 getters 与 vue 中的计算属性类似：

```javascript
getters: {
    // 默认会将 state、getters 分别传入参1、2中
    nameAndNum(state, getters){
        // 可以使用参2（getters）调用 getters 中的其它方法
        return state.name + state.loginUser.number;
    }
},
```

* 组件中使用 `$store.getters` 进行访问：

```html
<div> geteer：{{$store.getters.nameAndNum}} </div>
```

* 传参技巧：

```javascript
functionName(state, getters){
    // 返回带参的函数，调用时传入参数即可
    return parameter => {/* ... */};
}
```

#### 4. Action（异步）:

Action 可以包含任意异步操作，常用做异步请求之类操作。

```javascript
actions: {
  // 参数1是 Vuex 上下文对象
  action1(context){
    setTimeout(()=>console.log(context),1500);
  },
  // 基本使用与 mutations 中类似（除参1不同）
  action2({state, commit, getters, dispatch}, payload){
    /* context 解构大概有这几个属性 */
    // state.name // 访问状态
    // commit('setStateName', payload) // 依然推荐使用 commit 方式修改数据
    // getters.nameAndNum // 访问 getters 属性
    // dispatch('action1', payload) // 调用 actions 中的其它方法
  }
},
```

组件中使用 `$store.dispatch` 调用方法：`this.$store.dispatch("action1")`

使用大致与 `commit` 类似，它的参2也用来接收参数（同样支持对象风格的 dispatch）

**context** 中还包含了 `rootState` 和 `rootGetters` 两个属性，这是在下面模块中需要用到的。

#### 5. Module（模块）:

Vuex 允许我们将 store 分割成 **模块（module）**，每个模块拥有自己的 state、mutation、action、getter、甚至是嵌套子模块。

1. state（子模块状态）：

注册一个子模块 module1 ： `modules: { module1 }`

```javascript
const module1 = {
    state: ()=>{ // 与组件类似，子模块的state需要使用函数封装
        return {
            // $store.state.module1.module1Name 组件中访问方式
            module1Name: 'module1Name'
        }
    },
}
```

2. getters、mutations、actions：

**默认** 情况下，**模块内部** 的 **getters、mutations、actions** 仍然是注册在 **全局命名空间** 的——这样使得多个模块能够对同一个 getters、mutations、actions 作出响应。

```javascript
mutations: {
  // $store.commit('setName',payload) // 默认全局注册
  setName(state, payload){
    // state 只能访问子模块状态
    state.module1Name = payload;
  }
},
getters: {
  /**
   * @param state       默认子模块中的 state 只能访问子模块的状态
   * @param getters     只能访问模块的 getters
   * @param rootState   访问根模块的状态
   * @param rootGetters 访问根模块的 getters
   * 组件访问方式：$store.getters.getModule1Name // 默认全局
   */
  getModule1Name(state, getters, rootState, rootGetters){
    return module1Name + rootState.name; // 访问根组件的状态属性
  }
},
actions: {
  /**
   * actions 参1 context 中除根节点介绍过的属性外，
   * 还有 rootState、rootGetters 来访问根节点。
   * 组件访问方式：$store.dispatch("module1Actions", payload) // 默认全局
   */
  module1Actions({rootState, rootGetters}, payload){}
},
modules: { /* 嵌套子模块 */ }
```

3. 命名空间：

getters、mutations、actions 默认是与根模块整合的（同名属性根模块优先），如果希望你的模块具有更高的封装度和复用性，你可以通过添加 `namespaced: true` 的方式使其成为带命名空间的模块。

```javascript
const module1 = {
  namespaced: true, // 开启命名空间
  // 嵌套子模块
  modules: {
    myPage: { // 继承父模块的命名空间
      getters: {
        profile () {} // -> getters['module1/profile']
      }
    },
    posts: {
      namespaced: true, // 进一步嵌套命名空间
      getters: {
        popular () {} // -> getters['module1/posts/popular']
      }
    }
  }
}
```

访问方式(state 自带命名空间)：

```javascript
$store.getters['module1/getModule1Name']
$store.commit('module1/setName', payload)
$store.dispatch("module1/setName", payload)
```

4. Vuex 模块化编程：

将 getters、mutations、actions、modules 抽取出来形成单独的 JS 文件，使用 `export default` 导出并在 Vuex 主文件导入。

```javascript
import { createStore } from 'vuex';

// Vuex 核心概念
import getters from './getters'; // 不需要 js 的后缀
import mutations from './mutations';
import actions from './actions';
// 模块（可以根据不同的模块来细分）
import module1 from './module/module1';

const state = {/* 状态 */}

export default createStore({
  state,
  getters,
  mutations,
  actions,
  modules: {
    module1,
  }
})
```

## Composition API

### 1. setup：

**setup** 函数是一个新的组件选项，作为组件中组合式 API 的入口，函数在 **beforeCreate** 生命周期钩子执行之前执行，实例还没生成，***没有 this***。

setup 有两个可选参数 **props** 与 **context** ，props 是访问组件 props 属性值的对象。context 包含 4 个属性 **attrs、slots、emit、expose**。

* 父组件中：

```html
<com-a-p-i name="hello" title="home" @comfun="comfun">
    <template #a>
        <h3>slot</h3>
    </template>
</com-a-p-i>
```

* 实例组件中：

```html
<template>
  <div>{{count}} <slot name="a"></slot> </div>
</template>

<script>
export default {
  props: {
    name: String,
  },
  setup(props, { attrs, slots, emit, expose }) {
    console.log("setup");
    console.log("props", props.name); // 访问组件 props
    // 访问组件标签属性(props 定义的属性无法访问)
    console.log("attrs", attrs.title);
    console.log("slots", slots.a()); // 拿到具名插槽内容对象（default() 默认插槽对象）
    emit("comfun", "向父组件传递数据");
    
    return { count:1 };
  },
  beforeCreate() {
    console.log("beforeCreate"); // 在 setup 之后
  }
}
</script>
```

* context 的 expose 能显式地限制该组件暴露出的 property，当父组件通过 [模板 ref](https://staging-cn.vuejs.org/guide/essentials/template-refs.html#ref-on-component) 访问该组件的实例时，将仅能访问 `expose` 函数暴露出的内容。
* setup 发返回值为一个对象，该对象中的属性值是暴露给组件访问的。属性值只有是 composition api 创建的响应式对象才能够像 data 中的属性一样响应式的改变。

### 2. 常用 API：

```javascript
// Composition API 都必须导入才能使用
import { ref, reactive, toRef, toRefs, readonly, isRef, computed } from 'vue';

export default {
  setup() {
    let num = 1; // 基本类型
    
    // ref 为单个数据提供响应式代理
    const count = ref(0);
    // ref 定义的对象在 setup 中必须使用 value 访问或修改（视图中可以直接访问）
    count.value++;
    
    // reactive 只能为对象或数组提供响应式代理
    const user = reactive({ name:"hi", age:18 });
    user.age++; // 正常使用
    
    // toRef 从对象响应式数据中提取单个数据作为响应式数据
    const name = toRef(user,"name");
    name.value = "ha"; // user.name 或 name 改变双方都会发生改变
    
    // toRefs 对象响应式数据转普通对象，但属性只修改为响应式数据
    const { age } = toRefs(user); // age 为响应式数据
    
    // readonly 响应式数据类型转普通数据类型
    // const user2 = readonly(user);
    
    // isRef 判断某属性是否是响应式对象
    const userIsRef = isRef(user);
    
    // 定义方法
    let add = ()=> count.value++;
    
    /* 计算属性 */
    // let nameNum = computed(()=> user.name + count.value); // 返回一个不可修改的 ref （只有 get）
    let nameNum = computed({
      get: ()=> user.name + count.value,
      set: val=> user.name + count.value + val // 添加 set 方法后该属性可以修改
    });
    nameNum.value = 1; // 计算属性返回的是一个 ref 对象
    
    return {
      num, // 返回原生数据是无法响应式的改变的
      count, // 响应式数据
      // user, // 对象类型响应式数据
      ...toRefs(user), // 响应式对象解构为单个的响应式数据
      add, // 与 methods 中方法一样
      nameNum, // 暴露计算属性
    }
  },
}
```

### 3. watch 与 watchEffect：

1. 监听属性值变化：

监听属性方法同样需要导入：`import { watch, watchEffect } from 'vue';`

如下两方法初始时都会默认执行一次，且当方法内的某个属性发生改变时就会执行一次

```javascript
watch(()=>{
    console.log("watch", count.value);
});
// watchEffect 只能默认监听方法中使用到的数据变化局限性大
const stop = watchEffect((oninvalidate)=>{
    console.log("watchEffect", count.value);
    oninvalidate(()=>{ // 回调函数
      console.log("before"); // 在上面代码之前执行
    });
},{ /* 可选配置参数与 watch 相同 */ });
stop(); // 返回的函数执行将停止监听
```

2. 指定监听：

* watch 参数1 指定要监听的响应式数据
* 参数2 监听方法，newV 监听的新值, oldV 旧值（默认初始化时为 undefined）
* 参数3 为监听配置对象，指定监听后默认初始化是不会执行一次的 immediate 为 true 时可以使监听方法初始化时执行一次。

```javascript
const a = ref(9);
// 监听 a 数据变化（注意这里不需要使用 value）
watch(a, (newV, oldV)=>{
    console.log("watch", count.value); // count 变化无影响
}, { immediate: true }); // 参数3 中的 immediate 默认为 false

// 监听多个属性时使用数组
watch([a,count],
    // 监听方法中，第一个数组为新值，第二个数组为旧值
    ([newA, newCount], [oldA, oldCount])=>{
        console.log("watch", newA, oldA, newCount, oldCount);
}, { immediate: true });
```

* 监听对象响应式数据的某个属性或想监听响应式数据的 value 时需要使用函数方式返回：

```javascript
// 监听 a 和 user 的 name 变化（监听 user 整个对象则无需使用函数方式）
watch([()=>a.value,()=>user.name], ([newA, newName], [oldA, oldName])=>{
    console.log("watch", newA, oldA, newName, oldName);
}, { immediate: true });
```

* 如果监听 ref 且 ref.value 是深层次对象时需要配置 `deep: true` 开启深层次监听，而 reactive 默认开启：

```javascript
watch(refV, (newV, oldV)=>{
    // 且对象（引用类型）属性值监听它的 newV, oldV 都一样
}, {
    deep: true, // 开启深层次监听
    flush: "pre" // 默认 pre 组件更新前调用，sync 同步执行，post 更新之后
});
```

### 4. 生命周期：

注意使用以下生命周期 API 也需要导入如：`import { onMounted } from 'vue'`

| 选项式 API        | Hook inside `setup` |                           |
| ----------------- | ------------------- | ------------------------- |
| `beforeCreate`    | Not needed*(setup)  |                           |
| `created`         | Not needed*(setup)  |                           |
| `beforeMount`     | `onBeforeMount`     | 创建之前                  |
| `mounted`         | `onMounted`         | 创建完成                  |
| `beforeUpdate`    | `onBeforeUpdate`    | 更新之前                  |
| `updated`         | `onUpdated`         | 更新完成                  |
| `beforeUnmount`   | `onBeforeUnmount`   | 卸载（销毁）之前          |
| `unmounted`       | `onUnmounted`       | 卸载完成                  |
| `errorCaptured`   | `onErrorCaptured`   |                           |
| `renderTracked`   | `onRenderTracked`   |                           |
| `renderTriggered` | `onRenderTriggered` |                           |
| `activated`       | `onActivated`       | keep-alive 缓存的组件激活 |
| `deactivated`     | `onDeactivated`     | keep-alive 缓存的组件停用 |

当选项 API 与组合式 API 生命周期同时存在时会先执行 setup 中的，也就是先执行组合式 API 生命周期方法。

#### nextTick：

`$nextTick` 在 setup 中使用 `nextTick` 代替：

```vue
import { nextTick } from "vue";

const change = async ()=>{
  await nextTick(); // 同步调用
}
```

### 5. provide 与 inject：

* provide、inject 是 vue 让父组件给子组件提供数据访问的一种方式，使多层子组件（如孙子组件）下依然可以访问到父组件的属性值。

#### 1. 选项式 API：

1. 如 App.vue 中：

```javascript
data() {
  return {
    msg: "this is App msg"
  }
},
provide() {
  return {
    msg: this.msg, // 提供 msg 属性
  }
}
```

2. 在第 3 层的子组件中：

```javascript
export default {
  // 与 props 类似，接收的数据不是响应式的（this.msg = "xx" App.vue 中无变化）
  inject: ['msg'], // 注入父组件的属性（this.msg 或 {{msg}} 访问）
}
```

#### 2. 组合式 API：

1. App.vue 中：

```javascript
import { ref, provide } from 'vue'; // 引入 provide

export default {
  setup() {
    let msg = ref("this is App msg");
    provide('msgStr', msg); // 将 msg 提供出去
    // 多个数据使用多个 provide 方法
    return {msg}
  }
}
```

2. 子组件中：

```javascript
import { inject } from 'vue'; // 引入 inject

export default {
  const msgStr = inject('msgStr'); // 注入（参数二可设置默认值）
  // 需要注入多个使用多个 inject
  return {msgStr}
}
```

* 组合式 API 使用 provide、inject 注入的父属性是 **响应式** 的，即我们在这里修改 msgStr 的值父组件 msg 也会相应改变。

### 6. VueRouter：

[Vue Router 和 组合式 API | Vue Router (vuejs.org)](https://router.vuejs.org/zh/guide/advanced/composition-api.html)

* `this.$router` 与 `this.$route` 在 setup 中无法直接访问，因此 VueRouter 提供了 `useRouter` 和 `useRoute` 函数

```javascript
import { useRoute, useRouter, onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router';
export default {
  setup() {
    // 注意必须在 setup 最外层获取路由对象
    const route = useRoute(); // 当前路由对象
    const router = useRouter(); // 全局路由对象
    // 监听路由参数变化
    watch(()=>route.params, (newId, oldId)=>{
      console.log(newId.id);
    });

    // 导航守卫函数
    onBeforeRouteLeave((to, from)=> {});
    onBeforeRouteUpdate(async (to, from)=> {});
  }
}
```

* 注意 useRoute、useRouter（包括 Vuex 的 useStore） 等方法获取对象必须在 setup 中的最外层，如果在方法中使用 useRouter() 会是 undefined。

### 7. Vuex：

[组合式API | Vuex (vuejs.org)](https://vuex.vuejs.org/zh/guide/composition-api.html)

* 对于 `this.$store` Vuex 提供了 `useStore` 函数
* 为了访问 **state** 和 **getter**，需要创建 `computed` 引用以保留响应性，这与在选项式 API 中创建计算属性等效

```- javascript
import { computed } from 'vue';
import { useStore } from 'vuex'; // 引入 useStore

export default {
  setup () {
    const store = useStore(); // 必须在 setup 最外层获取对象
    // store.commit('increment') store.dispatch('asyncIncrement')
    return {
      // 在 computed 函数中访问 state
      count: computed(() => store.state.count),
      // 在 computed 函数中访问 getter
      double: computed(() => store.getters.double)
    }
  }
}
```

## Vite + TS

### 创建项目：

* [Vite 官网地址（vitejs.dev）](https://vitejs.dev/)
* npm 创建 Vite 项目：

```
npm init vite@latest
```

* 创建 Vite vue3 项目：

```
npm init vue@latest
```

### Ref 全家桶：

* `ref` 、 `Ref` 、 `isRef` ：

```javascript
import { ref, Ref, isRef } from 'vue'

type T = {name: string}
// 当值是一个复杂类型时使用 Ref 指定类型
const name:Ref<T> = ref({name: 'ruoxijun'});
console.log(isRef(name)); // 判断是否是 Ref 对象

// ref 获取 dom 元素
const myDiv = ref<HTMLDivElement>(); // <div ref="myDiv"></div> ref 值与变量名保持一致
myDiv.value // 因为此时 dom 还未被渲染因此获取不到
onMounted(()=>{
  myDiv.value.innerText = "myDiv";
});
```

* `shallowRef` 与 `triggerRef`：

shallowRef 只支持 **浅层次** 数据响应，注意 ref 底层有调用 triggerRef（如同一方法中同时更改 ref 与 shallowRef 的值时，shallowRef 视图也会被更新）。

```javascript
import { shallowRef, triggerRef } from 'vue'

const o = shallowRef({name: "haha"});
o.value.name = "xx"; // 实际值改变，但页面视图不会更新
triggerRef(o); // 强制更新
o.value = { name: "oo" }; // 视图更新
```

### Reactive 全家桶：

* `reactive` 与 `readonly` ：

```java
import { reactive, readonly } from 'vue'

type T = string[] // 与 ref 一样可指定类型
const o = reactive<T>([]);
o.push("hh");

const read = readonly(o);
// read 只读，但它会收原始对象的 o 的影响，如修改 o 时它的值也改变
```

* `shallowReactive` ：

它与 `shallowRef` 类似提供浅层数据响应，且会被 `ref` 与 `reactive` 影响（每次对 ref 或者 reactive 的更改都会将所有的组件模板渲染更新为最新数据）。

```javascript
import { shallowReactive } from 'vue'

const obj = shallowReactive({one: {two: "two"}});
obj.one.two = "hh"; // 视图无变化
obj.one = {two: "xx"} // 视图更新
```

### To 全家桶：

* `toRef` 将响应式对象属性提取为 ref：

```javascript
import { reactive, toRef } from 'vue'

const o = reactive({name: "ruoxijun", age: 18});
const name = toRef(o, "name"); // 提取响应式对象的某个 key 为 ref
name.value = "haha"; // o.name 值同时改变
o.name = "xx"; // name.value 值同时改变
```

* `toRefs` 将响应式对象的每个属性都转为 ref 对象并解构：

```javascript
import { reactive, toRefs } from 'vue'

const o = reactive({name: "ruoxijun", age: 18});
const {name, age} = toRefs(o);
```

* `toRaw` 为响应式对象生成一个普通对象：

```javascript
import { reactive, toRaw } from 'vue'

const o = reactive({name: "ruoxijun", age: 18});
const obj = toRaw(o);
```

### computed：

* `computed` 计算属性：

```javascript
import { ref, Ref, computed } from 'vue'

const count: Ref<number> = ref(0);
const con = computed<number>(()=>{
  return count.value + 1; // 当 count 属性值变化时 con 的值改变
});
```

### less：

1. 安装 less 到开发环境：

```
npm install less less-loader -D
```

2. 在 style 标签上添加 `lang="less"` ：

```vue
<style lang="less" scoped></style>
```

### 组件传值：

#### 父传子：

```typescript
/* 非 TypeScript
const prop = defineProps({
  msg:{
    type: String,
    default: "",
  }
});
prop.msg // 值可以直接在模板中使用 {{ msg }}
*/

// const prop = defineProps<{ msg: string }>();

// TypeScript 也提供了设置默认值的方式
withDefaults(defineProps<{ msg: string }>(),{
  msg: ()=> "默认值" // 如果是复杂类型需要使用函数返回方式
});
```

#### 子传父：

* 父组件中：

```vue
<script setup lang="ts">
// 定义接收参数的方法
const send = (msg:string)=> {
  console.log(msg);
}
</script>

<template> <!-- 绑定子组件的传参事件 -->
  <HelloWorld @on-click="send" msg="Vite + Vue" />
</template>
```

* 子组件中：

```typescript
// 定义组件传参事件名
// const emit = defineEmits(['on-click']);
const emit = defineEmits<{ // TypeScript 方式定义
  (e: "on-click", msg: String):void
}>();
const send = ()=>{
  // 向指定事件传递参数
  emit("on-click", "传参值"); // 可多个参数
}
```

#### 暴露组件属性：

* 子组件中：

```javascript
// 暴露组件的属性
defineExpose({
  count,
  send
});
```

* 父组件中：

```typescript
// <HelloWorld ref="hello"/>
const hello = ref();
onMounted(()=> {
  console.log(hello.value.count); // 获取使用组件中的属性
  hello.value.send();
});
```

#### 递归组件：

1. 使用递归组件：

```vue
<script setup lang="ts">
import { reactive } from "vue";
import Tree from "./components/Tree.vue"; // 引入递归组件

interface Tree { // 定义递归数据类型
  name: string;
  checked: boolean;
  children?: Tree[];
}
const data = reactive<Tree[]>([ // 递归数据
  {
    name: "1",
    checked: false,
    children: [
      {
        name: "1-1",
        checked: true,
        children: [],
      },
    ],
  },
  {
    name: "2",
    checked: false,
    children: [],
  },
  {
    name: "3",
    checked: true,
    children: [
      {
        name: "3-1",
        checked: false,
        children: [
          {
            name: "3-1-1",
            checked: true,
            children: [],
          },
        ],
      },
    ],
  },
]);
</script>

<template>
  <div> <!-- 使用递归组件并传入递归数据 -->
    <Tree :data="data"></Tree>
  </div>
</template>
```

2. 实现递归组件 Tree.vue ：

```vue
<template>
  <div v-for="item in data" @click.stop="treeClick($event)" class="tree">
    <input type="checkbox" v-model="item.checked"><span>{{ item.name }}</span>
    <!-- 当前组件递归，v-if 停止递归条件 -->
    <Tree v-if="item?.children?.length" :data="item?.children"></Tree>
  </div>
</template>

<script setup lang="ts">
  interface Tree { // 递归数据类型
    name: string;
    checked: boolean;
    children?: Tree[];
  }
  const props = defineProps<{
    data?: Tree[] // 接收递归数据
  }>();
  
  const treeClick = (e: Event)=> {
    console.log(e.currentTarget);
  }
</script>

<script lang="ts">
export default {
  name: "Tree" // 默认使用文件名作为组件名
}
</script>
<style scoped>
.tree{
  margin-left: 25px;
}
</style>
```

* 可选链操作符：

```javascript
({}).a // undefined
({}).a.b // 报错
({})?.a?.b // undefined
(null || undefined) ?? [] // [] （只针对 null、undefined）
```

#### v-model:

1. 父组件中：

```vue
<script setup lang="ts">
import A from "./components/A.vue";

const isShow = ref<boolean>(true);
const text = ref<string>("hello");
</script>

<template>
  <div> 父组件 - isShow:{{isShow}} - text:{{text}} </div>
  <div> <button @click="isShow = !isShow"> 开关 </button> </div>
  <A v-model="isShow" v-model:textVal="text"></A>
</template>
```

2. 子组件中：

```vue
<template>
  <div v-if="modelValue">
    <div> A - isShow:{{modelValue}}</div>
    <input :value="textVal" @input="textValChange">
    <button @click="close"> 关闭 </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean, // v-model 默认为 modelValue 接收
  textVal: string // 接收 v-model:textVal
}>();

const emits = defineEmits(['update:modelValue', 'update:textVal']);
const close = ()=>{
  emits('update:modelValue', false);
}
const textValChange = (e:Event)=>{
  // e.target 默认 EventTarget 类型需要断言为 HTMLInputElement 才能获取到 value 值
  const el = e.target as HTMLInputElement;
  emits('update:textVal', el.value);
}
</script>
```

3. 自定义修饰符：

```javascript
const props = defineProps<{
  modelValue: boolean, // v-model 默认为 modelValue 接收
  textVal: string // 接收 v-model:textVal
  textValModifiers?:{ // v-model: 后面的名字+Modifiers
    isAdd: boolean // 自定义修饰符名
  }
}>();
```

组件上 `v-model:textVal.isAdd="text"` ，组件内 `props?.textValModifiers?.isAdd` 有使用修饰符值为 true 。

### 动态组件：

#### 使用方式：

1. 对象方式实现动态组件：

* 如果使用 `ref` 或者 `reactive` 包装组件 vue 会代理组件属性监听变化，而这会耗费性能且 vue 会在控制台给出警告。因此建议在对象中使用 `markRaw` 包裹组件而普通变量使用 `shallowRef` 包裹组件。

```vue
<script setup lang="ts">
import { ref, reactive, markRaw, shallowRef } from "vue";
import A from "./components/A.vue";
import B from "./components/B.vue";
import C from "./components/C.vue";
interface o { name: string; com: any; }

const comIndex = ref(0);
const componentId = shallowRef(A); // 不建议使用 ref
const data = reactive<o[]>([
  { name: "A", com: markRaw(A), }, // 使用 markRaw 包裹
  { name: "B", com: markRaw(B), },
  { name: "C", com: markRaw(C), },
]);
const swTab = (com: any, index: number)=>{
  componentId.value = com;
  comIndex.value = index;
}
</script>

<template>
  <div class="tab">
    <div :class="{ active: comIndex === index }" class="tab_item"
      @click="swTab(item.com, index)"
      v-for="(item, index) in data" >
      {{ item.name }}
    </div>
  </div>
  <component :is="componentId"></component>
</template>
```

2. 字符串方式实现动态组件：

```vue
<script setup lang="ts">
import { ref, reactive } from "vue";
interface o { name: string; com: any; }

const comIndex = ref(0);
const componentId = ref("A"); // 使用组件字符串名
const data = reactive<o[]>([
  { name: "A", com: "A", },
  { name: "B", com: "B", },
  { name: "C", com: "C", },
]);
const swTab = (com: any, index: number)=>{
  componentId.value = com;
  comIndex.value = index;
}
</script>

<script lang="ts">
import A from "./components/A.vue";
import B from "./components/B.vue";
import C from "./components/C.vue";

export default {
  components:{ A, B, C }// 注册组件
}
</script>
```

#### 异步组件：

* 异步导入组件：

```javascript
// import A from "./components/A.vue";
const A = defineAsyncComponent(()=> import("./components/A.vue"));
```

### transition：

#### 基础使用：

1. 使用 `transition` 标签包裹需要添加动画的元素， **name** 的值是定义动画 class 的前缀：

```html
<transition name="fade">
  <component :is="componentId"></component>
</transition>
```

2. 定义动画：

```css
/* 显示 */
.fade-enter-from{ opacity: 0; } /* 进入之前 */
.fade-enter-active{ transition: all .5s ease; } /* 过度曲线 */
.fade-enter-to{ opacity: 1; } /* 结束 */
/* 隐藏 */
.fade-leave-from{ opacity: 1; }
.fade-leave-active{ transition: all .5s ease; }
.fade-leave-to{ opacity: 0; }
```

#### animate.css：

* `transition` 也支持指定动画的 class 名：

```html
<transition
    enter-active-class=""
    enter-from-class=""
    enter-to-class=""
    leave-active-class=""
    leave-from-class=""
    leave-to-class=""
  >
    <component :is="componentId"></component>
  </transition>
```

1. 安装 animate.css：

[Animate.css 官网](https://animate.style/)

```
npm install animate.css
```

2. 在组件中引入 animate.css：

```
import "animate.css";
```

3. 使用：

新版中都需要添加 animate__animated 类， `duration` 属性可以指定执行时间（毫秒），还可通过对象属性方式单独设置显示和隐藏的动画时间 `{enter: 500, leave: 500}` 。

```html
<transition
  :duration="500"
  enter-active-class="animate__animated animate__rubberBand"
  leave-active-class="animate__animated animate__swing"
>
  <component :is="componentId"></component>
</transition>
```

#### 生命周期：

| 生命周期方法     | 对应 Class         | 时期           |
| ---------------- | ------------------ | -------------- |
| @before-enter    | enter-from-class   | 显示动画之前   |
| @enter           | enter-active-class | 显示过度       |
| @after-enter     | enter-to-class     | 显示结束       |
| @enter-cancelled |                    | 显示过度被打断 |
| @before-leave    | leave-from-class   | 隐藏动画之前   |
| @leave           | leave-active-class | 隐藏过度       |
| @after-leave     | leave-to-class     | 隐藏结束       |
| @leave-cancelled |                    | 隐藏过度被打断 |

* 所有生命周期方法参数 1 是动画元素对象，而 **过度方法** 接收参数 **2** 它是过度回调代表过度执行完成，默认它在动画结束后自动执行。

```javascript
const enterActive = (el: Element, done: Function)=>{
  done(); // 过度完成
}
```

#### appear：

* appear 页面初次加载效果，只在页面初始化后执行一次：

```html
<transition
    appear-from-class=""
    appear-active-class=""
    appear-to-class=""
  >
    <component :is="componentId"></component>
  </transition>
```

#### TransitionGroup：

* 为列表添加动画属性，使用方式与 transition 大体一致。
* 默认不会给列表多包装一层，可使用 `tag` 属性指定包装一层元素。
* 列表必须添加 `key` 属性。

```html
<transition-group
  tag="div"
  enter-active-class="animate__animated animate__wobble"
  leave-active-class="animate__animated animate__rubberBand"
  move-class="列表元素平移动画（元素位置改变）"
>
  <div class="list" v-for="item in list" key="item">{{ item }}</div>
</transition-group>
```

#### gsap.js：

* 安装：

```
npm install gsap
```

* 使用：

```vue
<script setup lang="ts">
import gsap from "gsap";
const number = reactive({
  numberVal: 0,
  showNumber: 0
});
const numberChange = (n: number)=>{
  gsap.to(number, {
    duration: 0.3, // 过度时间
    showNumber: n // 注意该属性名与显示动画的属性值名要相同
  });
}
</script>
<template>
  <input type="number" v-model="number.numberVal" @input="numberChange(number.numberVal)" >
  <span>{{ number.showNumber.toFixed(0) }}</span>
</template>
```

### Mitt:

* vue 中 `import` 第一次加载文件时执行 js 并将获取到的内容放入缓存中，之后 import 文件都是从缓存中获取，因此 import 获取的对象实例都是 **单例** 。

1. 安装 mitt：

Vue2 使用 EventBus 进行组件通信，而 Vue3 推荐使用 mitt 。

```
npm install mitt -S
```

2. main.ts 中全局挂载：

```javascript
import mitt from 'mitt'; // 引入

const app = createApp(App);

const Mitt = mitt(); // 执行
// TypeScript 类型注册，才能获得提示
declare module "vue" {
  export interface ComponentCustomProperties {
    $Bus: typeof Mitt;
  }
}
// vue3 挂载全局 API
app.config.globalProperties.$Bus = Mitt;

app.mount('#app');
```

3. 组件中使用：

```javascript
/* A.vue 中 */
import { getCurrentInstance } from "vue";
const instance = getCurrentInstance();
const emit = ()=>{
  // emit(自定义事件, ...参数);
  instance?.proxy?.$Bus.emit("on-emit", "传递参数值（可多个）");
}

/* B.vue 中 */
import { getCurrentInstance } from "vue";
const instance = getCurrentInstance();
// on(监听事件, 回调函数(接收参数));
instance?.proxy?.$Bus.on("on-emit",(data)=>{
  console.log(data);
});
// 监听所有事件，回调函数参数 1 是事件类型，之后参数为接收的参数值
instance?.proxy?.$Bus.on("*",(type,data)=>{
  console.log(type, data);
});
// instance?.proxy?.$Bus.off("on-emit", function); // 删除某监听事件
// instance?.proxy?.$Bus.all.clear(); // 删除所有监听事件
```

### unplugin-auto-import：

[antfu/unplugin-auto-import](https://github.com/antfu/unplugin-auto-import)

1. 安装：

```
npm i -D unplugin-auto-import
```

2. 配置 vite.config.ts ：

```javascript
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  plugins: [vue(), AutoImport({
    imports: ['vue'], // 自动导入项
    dts: 'src/auto-import.d.ts' // 声明文件位置
  }),]
})
```

3. 不用 import 在组件中直接使用 ref 等。

### 自定义指令:

```vue
<script setup lang="ts">
import { Directive, DirectiveBinding, ref } from "vue";
import A from "./components/A.vue";

type Dir = { val: string }
// 自定义指令 v-my,赋值函数方式是 mounted 与 updated 同时触发相同行为的简写
const vMy:Directive = (el, binding:DirectiveBinding<Dir>)=> {
  console.log(binding.value.val);
}
/* 完整写法与生命周期：
const vMy:Directive = {
  created(){},
  beforeMount(){},
  mounted(){},
  beforeUpdate(){},
  updated(){},
  beforeUnmount(){},
  unmounted(){},
} */
</script>

<template>
  <A v-my="{val: 'hello'}"></A>
</template>
```

### Hooks：

#### Mixins:

在 vue2 中常使用 Mixins 抽取公共属性，mixins 中的属性会被组件中的同名属性覆盖，mixins 中的生命周期函数会比组件中同名生命周期函数先执行（不会覆盖）。

* mixins.js （名称可自定义）中：

```javascript
export default{
    data(){
        return{...}
    },
    methods:{}
}
```

* 组件中使用：

```vue
<script>
import mixin from './mixins'; // 引入 mixins.js
export default {
    mixins:[mixin], // mixins 数组，属性自动注入组件中
}
</script>
```

#### Hooks：

在 vue3 中推荐使用 Hooks 使用函数导出与引入的方式。

* hooks/index.ts （名称可自定义）中：

```typescript
import { Ref, ref } from "vue"; // 与组件中一样可引入属性

export default function():Ref<string>{
  const hello = ref("hello");
  return hello;
}
```

* 在组件中：

```javascript
import hook from "./hooks"; // 引入

const hello = hook(); // 使用
```

### 定义全局变量：

#### vue2：

```javascript
Vue.prototype.$my = "hello";
```

#### vue3：

* main.ts 中：

```typescript
const app = createApp(App);

// TypeScript 类型注册，才能获得提示，且编辑器不报错
declare module "vue" {
  export interface ComponentCustomProperties {
    $My: string,
    $MyFun: Function
  }
}
// vue3 定义全局变量或函数
app.config.globalProperties.$My = "hello";
app.config.globalProperties.$MyFun = ()=>{}

app.mount('#app');
```

* 组件中：

```vue
<script setup lang="ts">
import { getCurrentInstance } from "vue";
const app = getCurrentInstance(); // 获取当前实例
app?.proxy?.$MyFun();
</script>

<template>
  <div> 直接调用 - {{ $My }} </div>
</template>
```

### 样式穿透：

* vue2 中使用 `/deep/` ：

```css
/deep/.el-switch__core{
  background-color: black;
}
```

* vue3 推荐使用 `:deep()` ：

```css
:deep(.el-switch__core) {
  background-color: black;
}
```

* `:slotted()` 插槽选择器
* `:global()` 全局选择器

* 动态 css：

```vue
<script lang="ts" setup>
import { ref } from 'vue'
const color = ref<string>("red");
const style = ref({ color: "red" });
</script>

<style lang="less" scoped>
div{
  color: v-bind(color);
  background-color: v-bind('style.color'); // 对象需要引号方式包裹
}
</style>
```

## Pinia

### 安装使用：

Pinia 官网地址：[Pinia (vuejs.org)](https://pinia.vuejs.org/)

1. 安装 Pinia：

```
npm install pinia -S
```

2. 在 main.ts 中注册引入：

```typescript
import { createPinia } from 'pinia'; // 引入 Pinia

const store = createPinia(); // 创建

const app = createApp(App);

app.use(store); // 注册 Pinia

app.mount('#app');
```

3. 在 store\index.ts 内：

```typescript
import { defineStore } from "pinia";

export const useStore = defineStore('main', {
  state: ()=>({
    // 如 data
    name: 'haha'
  }),
  getters: {
    // 如 computed
  },
  actions: {
    // 如 methods ， 主要提交 state（同步异步均可）
  }
});
```

4. 组件中使用：

```typescript
import { useStore } from './store';

const store = useStore();
console.log(store.name);
```

### state:

#### 1. 直接修改：

```javascript
store.name = "ruoxijun";
```

#### 2. $patch（推荐）：

```typescript
// 对象方式 $patch({})
store.$patch({
  name: "aaa"
});
// 函数方式 $patch(state=>{}) 推荐
store.$patch((state:any)=>{
  state.name = "ooo";
});
```

#### 3. $state：

此方式需要修改 state 中的所有属性，才能使用。

```javascript
store.$state = { name: "ccc" }
```

#### 4. actions（推荐）：

1. 在 store 的 actions 中定义方法：

```typescript
export const useStore = defineStore('main', {
  state: ()=>({ name: "haha" }),
  actions: {
    // 使用方法修改 state 中的属性
    setName(name: string): void{
      this.name = name;
    }
  }
});
```

2. 在组件中使用方法：

```javascript
store.setName("ddd");
```

#### 5. storeToRefs：

store 可以直接解构出 state 中的属性但不具有响应式，因此 Pinia 提供了 storeToRefs：

```javascript
import { storeToRefs } from 'pinia';

const { name } = storeToRefs(store);
name.value = "yyy";
```

### getters、actions：

getters、actions 中定义的方法可以使用 this 调用 store 中的属性或方法。

### API：

#### $reset：

```javascript
store.$reset(); // 重置 state
```

#### $subscribe：

```javascript
// 监听 state 变化，有属性值改变时触发
store.$subscribe((mutations, state)=>{
  console.log(mutations, state);
}, { detached: true });  // 参数 2 （可选）表示组件销毁后，依然执行此监听
```

#### $onAction：

```javascript
// 监听 actions 调用
store.$onAction((context)=>{
  console.log(context);
}, true); // 参数 2 （可选）表示组件销毁后，依然执行此监听
```

### 持久化存储：



























