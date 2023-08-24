---
title: Axios 基础
date: 2020-05-25 13:44:27
categories: HTML
tags: 
    - axios
---

# Axios 简单入门

> ### ajax 与 axios

下面是一段 javascript 原生 ajax 发送一个简单的请求：

```javascript
let ajax=new XMLHttpRequest();
    ajax.open('get','1.txt',true);
    ajax.send();
    ajax.onreadystatechange=()=>{
        let con=ajax.responseText;
        alert(con);
    }
```

axios 的简单使用：

```javascript
axios({
    url:'1.txt',
    method:'get'
}).then(res=>{
    console.log(res.data);
});
```

可以看出 axios 对 ajax 进行了封装，比原生 ajax 使用更加简洁方便。注意 axios 需要在服务端使用，不合适本地请求。
axios 中需要传入一个对象，此对象有许多属性其中 `url` 是请求对象, `method` 为请求方式(get,post)不写时默认 get。这样就发送了请求，再调用 `then` 方法接受响应，它需要传入一个函数，函数需要一个参数。此参数就是接受响应消息的对象，建议取名为 `res` 。

除使用 url 添加传参 `url:'1.txt?id=1&name=haha'` 外，axios 还能使用 `params` 属性(原理就是将参数拼接在 url 后)，将需要的参数插入它管理的对象中。

```javascript
axios({
    url:'1.txt',
    method:'get',
    params:{
        id:'1',
        name:'haha'
    }
}).then(res=>{
    console.log(res);
});
```

post 传参时除 `params` 外，还可以通过 `data` 属性它会将参数转为 json 对象传给服务器，需要服务器解析。无特殊要求建议使用 `params` 。

> ### 使用方法方式传参

-   **_get:_**
    `.get` 表示 get 方式发送请求，参 1 为请求即 url，不使用 url 传参时可使用参 2 需要传入一个对象作为参数，对象中使用 `parmas` 属性方式封装请求的参数。 `.catch` 表示请求错误时方法，需要传入一个方法它接收一个参数就是错误信息建议命名为 `err` 。

```javascript
axios.get("1.txt",{
        parmas:{
            name : 'haha'
        }}).then(res=>{
            console.log(res);
        }).catch(err=>{
            console.log(err);
        });
```

-   **_post:_**
    `.post` 以 post 方式发送请求，除可采用 get 同等方式传参以外还可使用字符串 `key=value` 方式传参。此也可外参 2 传入对象 `{name:'haha'}` 方式是以 `data` 属性传参的需要服务器解析。

```javascript
axios.post("1.txt", "id=1&name=haha").then(res=>{
            console.log(res);
        }).catch(err=>{
            console.log(err);
        });
```

-   all 并发请求(多请求)：

`.all` 中传入一个数组，数组的元素都是 `axios` 请求。
再通过 `then` 中方法的参数以数组的方式返回响应。

```javascript
axios.all([
    axios.get("xx"),
    axios.get("servlet")
]).then(res=>{
    for (let i in res){
        console.log(res[i].data);
    }
}).catch(err=>{
    console.log(err);
});
```
`then` 通过 `axios.spread` 传入方法，以参数的方式返回响应。

```javascript
axios.all([
    axios.get("xx"),
    axios.get("servlet")
]).then(
    axios.spread((res1,res2)=>{
    console.log(res1.data);
    console.log(res2.data);
    })
).catch(err=>{
    console.log(err);
});
```