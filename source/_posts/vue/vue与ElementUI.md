---
title: Vue与ElementUI
date: 2021-08-30 12:30:59
categories: Vue
tags: 
    - elementUI
    - vue
    - nodejs
    - vue-cli
    - vue-router
    - vuex
    - webpack
---

# Vue-cli 基本使用

## 1. 环境安装：

>   基础环境：
>
>   *   **Node.js** 官网与下载地址： [下载 | Node.js 中文网 (nodejs.cn)](http://nodejs.cn/download/)
>       *   Node.js版本cmd查看命令： **node -v**
>       *   Node.js安装成功自带npm版本查看命令： **npm -v**
>   *   Node.js **版本更新** 工具：[Kenshin/gnvm: Node.js version manager on Windows by GO (github.com)](https://github.com/Kenshin/gnvm)
>   *   **git** 官网与下载地址： [Git - Downloads (git-scm.com)](https://git-scm.com/downloads)

以下所有命令建议 **以管理员方式打开 cmd 执行** 。

### 1. Node.js 环境配置：

#### 镜像配置：

*   `npm install cnpm -g` ：安装 cnpm 淘宝镜像（不建议使用，使用易出错）
*   `npm install --registry=https://registry.npm.taobao.org` ：注册淘宝镜像加速器（ **推荐** 使用）

查看镜像配置： `npm config get registry`

* 环境变量配置： `E:\myfile\nodejs\`

win 以 **`%`** 开头的环境变量在第一位置会导致查看环境变量时所有环境变量在一行显示，将带盘符的环境变量剪切到最前面即可让环境变量多行显示。

#### npm 依赖缓存位置修改：

因为npm在下载依赖时它会先缓存再下载，因此我们这里需要修改两个配置，一个是用来临时缓存依赖的文件夹一个是保存下载依赖的文件夹。

1.   `npm config set cache "E:\myfile\nodejs\data\cache"`
2.   `npm config set prefix "E:\myfile\nodejs\data\prefix"`

* 还需要配置环境变量： `E:\myfile\nodejs\data\prefix\`

### 2. webpack 安装：

>   [webpack 官方网址](https://webpack.js.org/)
>
>   [安装 | webpack 中文文档 (docschina.org)](https://webpack.docschina.org/guides/installation/)

*   通常需要安装 webpack 和 webpack-cli：

```ABAP
npm install webpack -g
npm install webpack-cli -g
```

*   也可使用一行命令同时安装：`npm install webpack webpack-cli -g`

### 3. vue-cli 安装使用：

>   [Vue CLI (vuejs.org) 中文文档](https://cli.vuejs.org/zh/guide/)

#### 安装与常用命令：

*   vue-cli 安装：`npm install vue-cli -g`
*   vue3安装cli：`npm install -g @vue/cli`
*   查看可使用的模板：`vue list`
*   卸载 vue-cli ：`npm uninstall -g vue-cli`

#### 项目创建：

*   `vue init webpack demo` ：初始化一个vue-cli项目，这里的demo是项目名。

使用上命令后会出现一下几个选项：

![vue项目创建](/images/vue/vue项目创建.png)

上面最后一项我们没有它帮我们在初始化项目时帮我们安装下载依赖，所以我们需要 **`cd`** 到我们的项目文件夹中自己手动安装依赖。

*   `npm install` ：依赖安装。

*   `npm run dev` ：运行当前项目。

#### 项目结构：

![vue项目目录结构](/images/vue/目录结构.png)

#### vue-cli 项目说明：

1.   **.vue文件：**

vue-cli 中项目将页面组件化，一个 **.vue** 文件表示一个vue的 **Vue.component** 即组件。首先看一下vue文件模板：

```vue
<template>
<!-- HTML组件模板书写 -->
</template>

<script>
// 逻辑代码书写
// vue中需要使用import导入其它vue组件
import 定义组件名 from 'vue文件地址(不需要.vue后缀)'
// 相当于 Vue.component 参数二的对象
export default { 
  name: "VueRouterDemo" // 组件名
  // 在此注册的组件，才能在template中使用
  components: { 
    // 导入的组件名(多个用逗号隔开)
  }
}
</script>

<style scoped>
  /* 书写模板的样式（css） */
</style>
```

2.   **main.js：**

```javascript
import Vue from 'vue'
import App from './App'
// 常在这里import引入要使用的依赖

Vue.use(导入的依赖名) // 申明要使用某依赖
// 关闭生产模式下给出的提示
Vue.config.productionTip = false

new Vue({
  // 常在这里注册引入的主配置文件
  el: '#app',
  components: { App },
  template: '<App/>'
})
```



## 2. ES6 知识补充：

### 1. this 指向问题：

```javascript
function fun() {
  console.log(this); // window
}

let obj = {
  fun2:function() {
    console.log(this); // {fun2:f} 当前对象
  }
}

let obj2 = {
  fun3:()=>{
    console.log(this); // window
  }
}
```

*   普通函数：this指向它的调用者，如果没有调用者时默认指向window。
*   箭头函数：this指向它 **定义时所处对象的父级this** 。

### 2. 对象属性简写：

在对象中属性和值一样是可以简写（包括属性名和方法名相同时）。

```javascript
let name = "张三";
let obj = {name:name,fun:function fun(){}}; // 完整写法
obj = {name,fun(){}}; // 简写写法
```

### 3. js 模块化（module）：

#### 案例：

如下有3个js文件，且引入到同一HTML中：

1.   1.js：

```javascript
let a = 1;
function fun(){
    console.log("fun1");
}
```

2.   2.js：

```javascript
let a = 2;
function fun(){
    console.log("fun2");
}
```

3.   main.js：

```javascript
console.log(a);
fun();
```

4.   我直接在HTML中引入3个js文件：

```html
<script src="1.js"></script>
<script src="2.js"></script>
<script src="main.js"></script>
```

HTML在浏览器打开后显示错误，主要是由于变量重复定义来的错误。

#### 解决方案：

1.   只引入main.js且在script标签中使用 `type="module"` 属性，注意只能在运行在服务器中的HTML中使用。

```html
<script src="main.js" type="module"></script>
```

2.   在 1.js 和 2.js 中使用 `export` 导出需要的元素：

```javascript
export let a = 1;
export function fun(){
    console.log("fun1");
}
```

除一个一个导出外，我们也可以用对象一次导出：

```javascript
let a = 2;
function fun(){
    console.log("fun2");
}
export {a,fun as fun2} // 导出多个且为fun取别名
```

3.   最后在 main.js 中引入：

```javascript
// 引入需要的属性，也可以使用 * 代表导入所有
import {a} from "1.js";
// 导入时使用 as 取别名解决命名冲突
import {a as a2,fun} from "2.js";

console.log(a +" "+ a2);
fun();
fun2();
```

#### export default：

*   使用 `export default` 导出的属性可以不定义名字，在引入的时候为它取名字。注意 **一个js文件中只能有一个** `export default` 。

```javascript
// export default {name:"张三"}
export default function(){
    console.log("export default");
}
```

*   引入时：`import 自定义名 from "js文件地址";`

## 3. vue-router ：

>   [Vue Router 官网 (vuejs.org)](https://router.vuejs.org/zh/)

案例准备：在 components 文件夹中新建一个 VueRouterDemo.vue 文件，且在 template 中添加一句 `<h1>VueRouterDemo</h1>` 。我们利用这个文件和项目自带的 HelloWorld.vue 做一个路由案例。



### 1. vue-router 安装：

`npm install vue-router --save-dev` ：在项目中安装 vue-router

### 2. js 中配置 vue-router：

*   在 main.js 显示配置（ **不推荐** ，推荐使用下方方法 ）：

```javascript
import VueRouter from "vue-router";
Vue.use(VueRouter)
```

*   src根目录新建router文件夹新建 **index.js** 作为vue-router配置文件：

```javascript
// 引入vue和vue-router
import Vue from 'vue'
import VueRouter from "vue-router";
// 引入路由跳转的组件
import HelloWorld from "../components/HelloWorld";
import VueRouterDemo from "../components/VueRouterDemo";

Vue.use(VueRouter); // 安装路由

// 配置导出路由对象
export default new VueRouter({
  // 路由配置，它是一个数组，管理多个路由配置对象
  routes:[
    {
      path:'/VueRouterDemo', // 路由路径
      name:'VueRouterDemo',
      component:VueRouterDemo // 路由对应的组件
    },{
      path:'/HelloWorld',
      name:'HelloWorld',
      component:HelloWorld
    }
  ]
});
```

*   在 main.js 中引入配置：

```javascript
import Vue from 'vue'
import App from './App'
import VueRouter from "./router" // 自动扫描里面的路由配置

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router:VueRouter, // router属性注册路由
  components: { App },
  template: '<App/>'
})
```

### 3. 在vue组件中使用router切换视图:

在App.vue中使用 **router-link** 与 **router-view** 实现视图切换（保证它们在App.vue的 `<div id="app"></div>` 中使用）。

```html
<router-link to="/HelloWorld">HelloWorld</router-link>
<router-link to="/VueRouterDemo">VueRouterDemo</router-link>
<router-view></router-view>
```

这里 **router-link** 表示一个a标签， **to** 属性中填入配置好的路由地址。 **router-view** 会根据你点击的link显示对应路由的视图。或者在浏览器中输入相应的地址 **router-view** 也会跳转到响应的视图。

### 4. js 跳转和重定向：

1.   使用 js 代码控制路由跳转： `this.$router.push("/");`
2.   如我们需要用户输入 **根路径** 时自动跳转到 **index** 路由那么就可以使用重定向来完成：

```javascript
path: '/:id', // 跟路径同时添加一个id参数
name: 'Layout',
component: Layout,
redirect: '/user/:id', // 重定向(也可传递同名的参数)
```

### 5. 嵌套路由：

在路由界面内嵌套其它的组件，并向实现这些组件的切换就需要使用到 **嵌套路由** 。嵌套路由是在当前的路由配置中在添加一个 `children` 属性实现。它是一个数组，数组中都是路由配置。

```javascript
// 在路由中添加此属性
children: [ // 嵌套路由
  {
    path: '/user',
    name: 'User',
    component: User,
  }, // 可配置多个
],
```

### 6. 路由传参:

#### 1. 路径传参：

1.   在配置路由时可以在路由的最后添加自定义的参数 `path:'/main/user/:id'` 如我们在 user 路径后定义一个 **id** 的参数。

2.   我们只需在跳转路由时在路径的后面添加上参数需要的值即可，如跳转 user 时我们需要它的参数值即 id 的值为8则跳转的路径就可以这样写： `/main/user/8` 。
3.   这样我们就可通过 `$router.params.id` 来获取到传递过来的值，如需在界面中显示也可以直接使用插值的方式来展示 `{{$router.params.id}}` 。
4.   使用 `{name:'路由的name',params:{id:8}}` 对象的方式也能达到和 `/main/user/8` 同样的效果。 `name` 属性绑定要跳转的路由的name。 `parmas` 对应一个对象里面的属性名对应你定义的参数名，属性值就是你要传递的参数值。如果使用 `<router-view :to="{name:'路由的name',params:{id:8}}"/>` 则需要让 `:to` 绑定这个对象。

#### 2. porps传参：

1.   同上首先路由配置中 `path:'/main/user/:id'` 不用改变，再多添加一个属性 `props:true` 表示使用 **props** 传参。

2.   在跳转的组件中使用 `props` 属性为组件定义一个和参数名相同的属性：

```javascript
export default {
props:['id'], // 定义一个和参数同名的组件属性
name: "user",
}
```

3.   最后我们就可以直接使用这个属性 `{{id}}` 。

### 7. 路由模式与404处理：

在 vue 中访问我们的项目时路径中总是默认带有一个 `#` ，我们可以在路由对象中：

```java
export default new VueRouter({
  mode:'history', // 取消路径中的 # 号
});
```

当用户访问我们没有定义的路由时应当跳转到一个404界面，这时我们就可以使用 `path: '*'` 来显示404组件：

```javascript
{
  path: '*', // 当没有可以匹配的路由时将跳转至此路由
  name: 'NotFound',
  component: NotFound // 自定义404组件
}
```

### 8. 路由钩子函数：

>   路由钩子常搭配 Axios 请求数据 vue 中添加 Axios 请参照： [axios (axios-js.com)](http://www.axios-js.com/docs/vue-axios.html)

路由构造函数可以在路由跳转时我们处理一些信息和管理路由跳转。其中 `beforeRouteEnter` 的 `next` 回调函数中常做 Ajax 请求为跳转的页面准备数据。

```javascript
/**
 * 路由钩子函数有3个可用参数
 * @param to 路由将要跳转的路径信息
 * @param form 路由跳转前的路径信息
 * @param next 路由控制
 * next() 路由执行跳转
 * next(false) 路由取消跳转
 * next('/path') 跳转到指定路由
 * next(vm=>{ //回调函数 }) 仅beforeRouteEnter方法可用，mv表示当前组件实例对象
 */
beforeRouteEnter:(to,form,next)=>{
  console.log("进入路由之前");
  next(vm=>{
    // 在组件 methods 属性中定义一个 getData 方法使用 vm 调用来请求页面所需数据
    vm.getData();
  }); // 执行路由
},
beforeRouteLeave:(to,form,next)=>{
  console.log("离开路由之前");
  next(); // 执行路由
},
```

## 4. 整合 ElementUI：

>   [Element 官方文档地址](https://element.eleme.cn/#/zh-CN/component/installation)

### 1. 引入必要依赖：

```bash
// 安装 ElementUI
npm i element-ui -S
// 安装 SASS 加载器
npm install sass-loader node-sass --save-dev
```

### 2. 配置注册：

在 main.js 中添加如下配置后即可使用 ElementUI。

```javascript
import Vue from 'vue';
import App from './App.vue';

// 引入 ElementUI 关键组件
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 需要sass

Vue.use(ElementUI); // 申明安装使用

new Vue({
  el: '#app',
  render: h => h(App) // ElementUI 提供
});
```

## 5. Vuex：



