---
title: Vue 基础
date: 2021-08-27 09:17:36
categories: Vue
tags: 
    - vue
    - axios
---

# <center>Vue</center>

## 1. 官方描述：

[Vue.js (vuejs.org)](https://cn.vuejs.org/)

>渐进式 JavaScript 框架
>
>*   **易用**
>
>      已经会了 HTML、CSS、JavaScript？即刻阅读指南开始构建应用！
>
>*   **灵活**
>
>      不断繁荣的生态系统，可以在一个库和一套完整框架之间自如伸缩。
>
>*   **高效**
>
>      20kB min+gzip 运行大小
>      超快虚拟 DOM
>      最省心的优化

## 2. Vue 基础语法：

### 1. 入门demo：

```html
<div id="app"><!-- 需要控制的视图 -->
    {{str}}<!-- 绑定str数据 -->
</div>
<script>
    var app = new Vue({
        el: "#app", // 绑定了id为app的视图
        data: {
            str: "hello world", // 存放str数据
        },
    });
</script>
```

Vue应用以Vue实例对象为基础，它需要传入一个对象。这里我们使用两个重要属性：

 **el：** 绑定视图（element(元素id选择器)）

 **data：** 数据管理，存放数据

### 2. Vue内外数据交互：

```javascript
var datas = {num : 1 , n : 0};
// Object.freeze(datas); // 冻结对象，该对像值将无法修改
var vm = new Vue({
    el : "#app",
    data:datas, //与外在的datas对象形成绑定
});

// Vue中data值发生改变时视图产生响应更新值
datas.num = 2;

//Vue中的属性和方法用"$"区分开来
console.log("同对象?"+ (vm.$data === datas));//true
console.log("同元素?"+ (vm.$el === document.getElementById("app"))); //true
```

### 3. 生命周期：

[Vue.js 生命周期](https://v3.cn.vuejs.org/guide/instance.html#生命周期图示)

```javascript
var vm = new Vue({
    el:"#app",
    beforeCreate:function(){//页面创建之前
        console.log('beforeCreate');
    },
    created:function(){//实例创建完成以后
        console.log('created');
    },
    beforeMount:function(){//挂载之前
        console.log('beforeMount');
    },
    mounted:function(){//挂载成功，el被新创建的vm.$el替换
        // 此函数中常做Ajax请求，请求页面加载完成之后需要暂时的数据
        console.log('mounted');
    },
    beforeUpdate:function(){//数据更新之前
        console.log('beforeUpdate');
    },
    updated:function(){//数据更新完DOM也更新完毕
        console.log('updated');
    }
});
```

### 4. 常用语法和指令：

>   Vue中将 “ **v-** ”前缀的特殊语法称之为指令。

*   **v-once：** 只渲染元素和组件一次，当数据改变时，插值处的内容不会更新。
*   **v-html：** 向元素中插入HTML语句
*   **v-bind：** 元素属性绑定（缩写： **:** ），动态参数的缩写 **:[key]** 。

```html
<style>
    .green{color: blue;}
    .blue{background: green;}
</style>
------------------------------
<div id="app" v-once><!--此标签内的插值只执行一次，数据改变插值不会改变-->
    <!--文本插值:双大括号"{{}}"包裹一个变量，在data中声明属性取值-->
    {{msg+" MyVue"}}<!--支持javascript表达式：三元'？：'，数学计算，基本函数-->
    <p>{{html}}</p><!--以文本方式html语句无法解析-->
        <p v-html="html"></p><!--将此标签中的内容替换成插入的HTML语句-->
    <p v-bind:class="mcolor">{{mcolor}}</p><!--v-bind用于动态改变标签需要的属性-->
    
    <!-- 样式绑定(class)： -->
    <p v-bind:class="{green:isGreen,blue:isBlue}">{样式名:条件}</p>
    <p v-bind:class="['green','blue']">静态绑定：[样式名]</p>
    <p v-bind:class="[isGreen?'green':'blue']">三元条件绑定</p>
</div>
<script>
    var vm = new Vue({
        el:"#app",
        data:{
            msg:"hello world",
            html:"<h1>html h1</h1>",
            mcolor:"blue",
            isGreen:true,
            isBlue:false,
        },
    });
</script>
```

*   **v-show：** 控制渲染后的元素是否显示(与 **if** 效果一样但本质不同，频繁切换推荐 **show** )
*   **v-if，v-else-if，v-else：** 条件控制元素是否渲染
*   **v-for：** 列表渲染，一个参数时为值，两个参数时参一为值 参二为下标

```html
<div id="app">
    <p v-show="if_look">v-show</p>
    
    <p v-if="if_look">{{msg}}</p>
    <p v-else-if="1===1">v-else-if</p>
    <p v-else>v-else</p>
    
    <p v-for="num,index in list">{{index + num}}</p> <!-- index可省略 -->
    <p v-for="value,key in obj">{{key}}->{{value}}</p><!-- 对象遍历 -->
    
    <div @click="click1"><!--@click='function'绑定点击事件-->
        click1
        <!--标签为包含关系时，子标签点击事件完成还会执行再父类点击事件-->
        <!--在该指令后添加'.stop'修饰符，当前点击事件完成后停止-->
        <div @click.stop="click2">
            click2
        </div>
    </div>
</div>
<script>
    var vm = new Vue({
        el:"#app",
        data:{
            msg:"v-if",
            if_look:true,
            list:["一","二","三","四"], // 待遍历数组
            obj:{ naem:'obj', // 待遍历对象
                value:1,},
        },
        methods:{ //methods中用键值对的方式定义方法
            click1 : function(){
                this.msg="onClick1";//用'this.'访问data中的数据
            },
            click2 : function(){
                this.msg="onClick2";
            },
        },
    });
</script>
```

**v-on:事件名：** dom事件绑定（缩写： **@事件名** ），动态参数的缩写 **@[event]** 。

**methods：** 方法逻辑通常定义在该Vue属性中。

```html
<div id="app" v-on:click='msg++'> <!--可使用表达式-->> {{msg}}
    <p @click.stop='count(msg)'>{{add}}</p>

    <!-- 阻止单击事件继续传播 -->
    <a v-on:click.stop="doThis"></a>
    <!-- 提交事件不再重载页面 -->
    <form v-on:submit.prevent="onSubmit"></form>
    <!-- 添加事件监听器时使用事件捕获模式 -->
    <!-- 即内部元素触发的事件先在此处理，然后才交由内部元素进行处理 -->
    <div v-on:click.capture="doThis">...</div>
    <!-- 点击事件将只会触发一次 -->
    <a v-on:click.once="doThis"></a>
</div>
<script>
    var vm = new Vue({
        el:"#app",
        data:{msg:0,
            add:0,},
        methods: { //用来定义存放函数体
            count:function(i){
                this.add+=i;
                console.log(event); //查看$event中的属性
            }
        },
    });
    // vm.$methods.adds();//报错
    vm.count(1); // 可使用Vue对象直接访问方法
</script>
```

**v-model：** 表单数据双向绑定，绑定的表单组件可不使用 **name** 属性分组，绑定同一元素的表单组件为同一组。且它帮我们将表单组件的 **value** 值与元素绑定了起来。

```html
<div id="app">
    <input type="text" v-model='msg'><!--此输入与data中msg相绑定-->
    <p>inputValue: {{msg}}</p>
    <hr/>
    <p>Sex:<!--选中的值与data中radio相绑定，选中的value会赋值给radio-->
        <input type="radio" value="nan" v-model="radio">男
        <input type="radio" value="nv" v-model="radio">女
    <p>radio : {{radio}}</p>
    </p>
<hr/>
<p>Love:<!--与checkBox相绑定它对应的是个数组，复选框值有多个值，选中的值会依次传入绑定的数组-->
    <input type="checkbox" value="qiu" v-model="checkBox">打球
    <input type="checkbox" value="yun" v-model="checkBox">玩游戏
    <input type="checkbox" value="look" v-model="checkBox">看电影
<p>checkbox : {{checkBox}}</p>
</p>
<input type="button" v-on:click="submit" value="提交">
</div>
<script>
    var vm = new Vue({
        el:'#app',
        data:{ //都可以为表单设置默认值
            msg:"hello Vue",
            radio:"nv",
            checkBox:['yun','look'],
        },
        methods: {
            submit:function(){
                var obj = { //提交时建议将数据整理到一个对象提交
                    msg:this.msg,
                    radio:this.radio,
                    checkbox:this.checkBox,
                };
                console.log(obj);
            },
        },
    });
</script>
```

`v-model` ：原理 `v-bind:value="绑定属性"` + `v-on:input="绑定属性 = e.target.value"`

## 3. Vue 组件：

### Vue.component全局注册：

*    **`Vue.component` ：** 全局注册组件在任何Vue实例用可使用
*    **`template` ：** 组件模板
*    **`props` ：** 为模板添加属性，方便外面数据与模板内数据做交互
*    **`<slot></slot>` ：** 插槽，在模板中使用，标记组件中插入值显示位置

#### 1. js：

```java
Vue.component("my-header", { //创建组件，参1表示组件名，参2是个对象用来描述组件
    //props可为组件添加属性多个用','分隔，可利用此属性传递数据
    props:['title'], // 是一个数组
    //data存放组件数据
    data:function(){return {count:0,}},
    //template描述组件模板,模板内也可访问渲染props定义的属性
    template:'<div v-on:click="counts">{{title}} count:{{count}}<slot></slot></div>',
    //模板的最外层只能有一个标签，当模板为多个同级标签时，必须由一个父级标签包裹
    methods: {
        counts:function(){
            this.count++;
            //this.$emit自定义点击事件，参1函数名(不建议有大写字母建议用'-'隔开)
            //参2返回值(自动传入指定函数方法中),多个可继续添加
            this.$emit("click-f",this.count);//在自定义组件中使用
        }
    },
});
var vm = new Vue({
    el:"#app",
    data:{vTitle:"showTitle"},
    methods: {
        click:function(a){//自定义点击属性监听的方法a参数自动传入
            console.log(a);
        },
    },
});
```

#### 2. html：

```html
<div id="app">
    <my-header v-bind:title="vTitle"></my-header><!--调用组件 -->
    <!--复用组件，并且使用自定义的点击事件监听,方法中不能传入参数否则变成普通方法-->
    <my-header v-on:click-f="click"> <!-- 给自定义事件绑定click方法 -->
        <h5>slot插入</h5> <!-- 插入元素 -->
    </my-header>
</div>
```

### components局部注册：

*   **`components`** **：** 局部注册组件，只能在当前Vue对象le管理的元素中使用。

```html
<div id="app"> <textcom></textcom> </div>
<script>
    var vm = new Vue({
        el:"#app",
        components:{ // 在此属性中创建或管理组件
            textcom:{ // 里面的一个对象为一个组件，对象名为组件名
                template:"<h4>components</h4>",
                //除以上区别外与Vue.component(id, obj)的使用方法都一样
            }, // 可添加多个
        }
    });
</script>
```

### 动态组件：

随意定义一个元素在你想要组件显示的地方，为此元素添加 **`v-bind:is`** 属性，再给它绑定一个data中属性。

如果你想要显示的组件中有 `input` 之类的标签在切换组件后你输入的值也会被清空，如果你想要包留就使用 **`keep-alive`** 标签将其包裹，组件将被缓存数据不会丢失。

```html
<keep-alive>
    <div v-bind:is="showComponent"></div>
</keep-alive>
```

当前位置就会显示属性值与之相对应的组件名的组件

```java
// 值为你想显示的组件的组件名
data() {return {showComponent: "Card"}}
```

### 组件细节：

#### 组件中props值：

组件中props定义的属性值是不能直接在组件中修改的。建议使用自定义方法的形式去改变它对于绑定的值，而不是在组件中直接进行修改。

```javascript
Vue.component("my-header", {
    props:['title'],
    methods: {
        counts:function(){
            this.title = "hi"; // 使用后报错
        }
    },
});
```



#### 组件中的data：

>   组件可以重复使用，当一个组件使用多次，就会多次访问一个data数据，从而类似共享复用。如果组件的data属性不是一个函数且返回一个对象，在这种一个组件多次使用的情况下就会共享一个数据。

综上所述组件中的data数据无需共享是建议使用函数（function）方式反还数据。data有以下写法：

```javascript
data:()=>{return {msg:"hello Vue"}} // es6 箭头函数写法
data(){return {msg:"hello Vue"}} // es6，推荐
data:function(){return {msg:"hello Vue"}} // es5，推荐
```

#### 组件slot插槽：

插槽可以使用多个，而且我们还能为插槽设置 `name` 属性。方便给组件插入元素时定位插槽。

```html
<div v-on:click="counts">
    <slot name="slot1"></slot>
    <slot name="slot2"></slot>
</div>
```

使用组件时给插入的元素使用 **`slot`** 属性指定选择插槽插入。

```html
<my-header v-bind:title="vTitle" v-on:click-f="click">
    <h5 slot="slot2">slot2插入</h5>
    <h3 slot="slot1">slot1插入</h3>
</my-header>
```

#### 组件$emit自定义事件：

`this.$emit("自定义方法名",返回值);`

利用 `props` 和 `$emit` 我们可以完成组件间的通信，完成数据间的传递。利用 `$emit` 子组件向传父组件传递数据，利用 `props` 父组件向子组件传递数据。 

## 4. Axios请求：

Vue中常常搭配axios来请求数据，注意data中接收响应数据的对象可以为空不定义参数，但是一旦定义了参数建议参数格式建议与返回的响应数据格式一样。

```html
<div id="app">{{info}}</div>
<script>
    new Vue({
        el:"#app",
        data(){
            return {info:{},}
        },
        mounted() { // 一般在mounted中发送请求
            axios.get("./json.json")
                .then(response=>{
                console.log(response.data);
                this.info = response.data;
            });
        },
    });
</script>
```

## 5. computed计算属性：

>   *   **computed** 与 **methods** 类似都用于存放方法，但是computed它能将计算结果即返回的数据以 **Vue属性** 的形势存储起来，将其行为转换为了静态属性也可称之为缓存。
>
>   *   在computed中定义的方法直接使用方法名调用不需要括号，且Vue的data中不能定义与computed中方法同名的属性否则报错。
>   *   computed中方法执行一次后值就被存储起来不会再改变，只用当方法中所用到的 **属性值** 被改变或刷新后才会重新计数。

```html
<div id="app">
    <p>{{mDate()}}</p>
    <p>{{cDate}}</p>
</div>
<script>
    new Vue({
        el:"#app",
        data:{msg:"1",},
        methods: {
            mDate(){return Date.now();}
        },
        computed:{
            cDate(){
                this.msg="2";
                return Date.now();
            }
        }
    });
</script>
```

如上cDate方法执行一次后值不会再改变，只有当cDate中所用到的属性如msg被改变后，cDate方法才会再次执行重新计算值。
