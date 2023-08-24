---
title: jQuery 基础
date: 2020-06-05 10:29:36
categories: HTML
tags: 
    - jquery
---

# jQuery 常用总结

## 入口函数：

我们先看一下原生 js 的入口函数：

```javascript
// 原生js写法
window.onload = () => {
    console.log("onload");
};
```

jq 的入口函数后 4 种：

```javascript
jQuery(document).ready(function () {
    console.log("jQuery_ready");
});
jQuery(function () {
    console.log("jQuery");
});

// 在某元素加载完成后执行，这里表示在document加载完毕后
$(document).ready(function () {
    console.log("$_ready");
});
//常用推荐
$(function () {
    console.log("$");
});
```

## 解决冲突(\$符号的使用)：

释放'\$'的使用权和自定义访问符：

-   `jQuery.noConflict();` 表示释放\$符的使用权，之后不能再使用\$符调用函数或方法(可用 jQuery 代替)。注意此句需在 jquery 使用之前使用才有效。
-   自定义

```javascript
//将$的释放语句赋值给定义的变量
var jq = jQuery.noConflict();
jq(() => {
    //jq代替了 '$'
    console.log("jq");
});
```

## 核心函数 `$()`:

它能接受 3 中参数：

1. 传入函数，表示它是一个入口函数

```javascript
$(() => {
    //code
});
```

2. 字符串

-   可像 css 选择器一样选择元素。
-   也可是一个标签字符串，会自动转为 jquery 对象。

```javascript
$(() => {
    //选择器简单使用
    let div = $("#main div"); //拿到id为main下的所有div并返回一个jquery集合对象
    console.log(div[0]); // 集合中具体的某一个元素为js元素
    
    div = $("div > ul"); // 拿到div下紧邻的所有的子ul
    
    div = $("div + li"); // 拿到div同级上下紧挨着的且是li的元素
    
    div = $("div ~ li"); // 拿到div同级所有是li的元素

    //标签串
    let li = $("<li>5</li>"); //转为一个标签并组成jquery的对象
    $("ul").append(li);
});
```

3.接受一个 DOM 变量(如原生 js 获取的元素节点)

```javascript
let div = document.getElementsByTagName("div")[0];
//转换为一个jquery对象并返回
console.log($(div));
```

## 常用方法：

-   数组方法：
    首先要知道 jq 一般获取到的元素节点对象都是伪数组(有 0 到 length-1 的属性，和 length 属性)

each(与原生 each 类似)：可遍历数组，也可遍历伪数组

```javascript
//模拟一个伪数组
let arr = { 0: "a", 1: "b", 2: "c", length: 3 };
$.each(arr, (index, value) => {
    console.log(index + "--" + value);
});
```

map(与原生 map 类似)：也可遍历伪数组

```javascript
let a = $.map(arr, (value, index) => {
    console.log(index + "--" + value);
    if (value > "a") {
        return true;
    }
    return false;
});
console.log(a);
```

-   `$.isWindow(window)` ：是否是 js 的 window 对象
-   `$.isArray(arr)`：是否是一个数组(伪数组不算)
-   `$.isFunction(()=>{})`：是否是一个函数

*   `$.holdReady(true||false);`：jq 入口函数默认在 DOM 加载完成时执行，我们可以通过 `holdReady` 控制它的执行，true 关闭(确认关闭)，false 执行(取消关闭)。

## 元素选择器：

```javascript
// empty 即没有文本也没有子标签元素的元素
let empty = $("div:empty");
// parent 有文本或有子标签元素的元素
let parent = $("div:parent");
// contains 包含指定文本或标签的元素
let contains = $("div:contains('1')");
// has 子元素包含某标签的元素
let has = $("div:has('li')");
// 组合选择器 将多个需要选中的元素或条件使用逗号隔开
let sum = $("div,span,img");
```

## 元素筛选与遍历：

通常在元素选择器之后使用：

```javascript
// 1.父类筛选
$("#app").parent(); // 方法返回被选元素的直接父元素
$("#app").parents(); // 返回被选元素的所有祖先元素
// 2.子类筛选
$("#app").children(); // 返回被选元素的所有直接子元素
$("#app").find('p'); // 查找后代元素中符合条件的元素
// 3.兄弟筛选
$("#app").siblings(); // 返回被选元素的 所有兄弟
$("#app").prev(); // 返回被选元素的 上一个 兄弟
$("#app").prevAll(); // 返回被选元素的 前面的所有 兄弟
$("#app").next(); // 返回被选元素的 下一个 兄弟
$("#app").nextAll(); // 返回被选元素的 后面的所有 兄弟
// 其它筛选
$("#app").first(); // 获取当前选中的元素中的第一个
$("#app").last(); // 获取当前选中的元素中的最后一个
$("#app").eq(index); // 从当前选中的元素中获取指定位置上的元素（0开始）
$("#app").filter(".middle"); // 在选中的元素中筛选

$("#app").not(); // 排除选中的某些元素
$("#app").add("p"); // 向当前选中的元素集合中添加新的元素集合
$(selector).each(function(index,element)); // 遍历选择器中的所有元素
```

## 对标签属性的操作：

有两个方法 `attr` 和 `prop` 它们类似也有不同。

```javascript
//获取标签节点属性
console.log($("input").attr("value"));
//设置标签节点属性(不存在将自动添加)
$("input").attr("value", "text");
//移除标签某属性
$("input").removeAttr("value");
```

`prop` 的使用与 `attr` 相同，官方推荐当属性值为 true 和 false 时使用 `prop` 方法。其它使用 `attr` 。

## 标签的 class 属性：

-   `$("div").addClass("class");` 添加 class(多个 class 用空格隔开)。
-   `$("div").removeClass("class");` 删除 class
-   `$("div").toggleClass("class");` 切换 class，存在就删除，不存在则添加。

## 标签内容：

-   `html`：

```javascript
console.log($("div").html()); //获取
$("div").html("<p>value</p>"); //设置
```

-   `text`：

```javascript
console.log($("div").text()); //获取
$("div").text("<p>value</p>"); //设置
```

*   `val` ：针对带value属性值的元素

```javascript
console.log($("#input").val()); //获取
$("#input").val("hello"); //设置
```

## css 设置属性值：

```javascript
//获取某属性
console.log($("div").css("background"));
//设置属性，可链式添加
$("div").css("background", "red").css("width", "300px");
//对象方式设置属性
$("div").css({
    background: "blue",
    width: "200px",
    height: "200px",
});
```

## 元素创建添加与删除：

```javascript
// 在元素内部最前面添加元素（参数可以是字符串也可以是元素）
$("#container").prepend("<div>子级最前<div/>");
// 在元素内部最后面添加元素（参数可以是字符串也可以是元素）
$("#container").append("<div>子级最后<div/>");
// 在该元素之前追加（同级）元素
$("#container").before("<div>同级前<div/>");
// 在该元素之后追加（同级）元素
$("#container").after("<div>同级后<div/>");

$("#container").empty(); // 清空元素内的内容
$("#container").remove(); // 删除元素
```

## 元素事件：

### 1.鼠标事件

`click` :单击事件
`dblclick` :双击事件
`mouseenter` :当鼠标指针进入所选元素时触发
`mouseleave` :当鼠标离开所选元素时触发
`mouseover` :当鼠标在所选元素上方悬停时触发

### 2.键盘事件

`keydown` :当按下键盘按键时会触发
`keyup` :当按键被释放时会触发
`keypress` :当按下并抬起同一个按键会触发

### 3.表单事件

`submit `:提交表单时会触发
`change` :当表单元素的值发生改变时会触发
`focus `:当表单元素获得焦点时触发
`blur` :当表单元素失去焦点时会触发

### 4.文件事件

`ready` :当DOM加载完成以后触发
`resize `:当浏览器窗口大小改变时触发
`scroll` :当用户在指定的元素中滚动滚轮条时触发

### 5. 事件绑定

1.   直接绑定事件：使用 `元素.事件名称(函数)` 如 `$("#app").click(function(event){});` 。
2.   on 绑定事件： `元素.on(‘事件名称,...’,函数)` on方法可以一次绑定多个事件，事件名称之间使用逗号隔开即可。
3.   off 删除事件： `元素.off("事件名称")` 关闭元素的某个事件。

## 动画处理：

```javascript
// 可添加参数，参数1 为完成的总毫秒时间，参数2 为回调函数
$("#app").hide() // 隐藏被选元素
$("#app").show() // 显示被选元素
$("#app").toggle() // 隐藏和显示之间切换

$("#app").fadeIn() // 淡入被选元素
$("#app").fadeOut() // 淡出被选元素
$("#app").fadeToggle() // 淡入淡出切换

$("#app").slideUp() // 上滑动被选元素
$("#app").slideDown() // 下滑动被选元素
$("#app").slideToggle() // 上下滑动切换

// 自定义动画 参数1 改变的属性，参数2 动画的时间，参数3 回调函数(可选)
$("#app").animate({width:"200px",height:"200px"},2000)
            .animate({width:"-=200px",height:"+=200px"},2000) // 可进行运算
            .animate({width:"100px",height:"200px"},2000); // 多个动画依次执行

/** 以上的动画被一个一个添加到元素的动画队列中，可使用stop停止动画
 * 不带参停止元素队列中当前正在执行的动画，队列中还有动画则执行下一个
 * 参数1 是否清除队列中所有的动画，参数2 是否立即完成当前动画
 */
$("#app").stop(); // 后面可级联其它动画与操作
```

## ajax（jQuery）:

### 获取表单数据：

```javascript
$('#form-box').serialize(); // 将表单数据序列化为字符串（name=1&type=1）
$('#form-box').serializeArray();// 将表单数据提取为对象形势（{"name":"1","type":"1"}）
$("#form-box").submit(); // 提交表单

$("form").submit(function (e) {
    e.preventDefault(); // 阻止默认行为,阻止表单默认提交行为
    // return false; // 也可阻止表单提交,也可在提交表单按钮的点击事件中return false
    // e.stopPropagation(); // 阻止事件冒泡
});
```

### ajax发送请求：

```javascript
$.ajax({
    url: "/greet",
    data: {name: 'jenny'},
    type: "GET",
    dataType: "json",
    success: function(data) {
        //data = jQuery.parseJSON(data); //dataType指明了返回数据为json类型，故不需要再反序列化
    }
});
```

### post请求：

```javascript
$.post({
    // 请求地址
    url:"${pageContext.request.contextPath}/allBook",
    // 携带数据
    data:{"mgs":$("#mgs").val()},
    // 请求成功函数，data参数为请求响应的数据
    success:function(data){
        console.log(data);
    },
    // 请求失败
    error:function (){
        console.log("error");
    }
});
```