---
title: jsp 基础使用
date: 2020-05-19 06:53:44
categories: Java
tags: 
    - jsp
    - javaweb
    - jstl
    - cookie
    - session
---

# JSP

> -   负责与用户的交互，将最终界面呈现给用户。是 HTML + js + Css + java 的混合文件。
>
> -   JSP 文件最终转换为一个 java 文件，之后编译为 class 文件。java 中将页面整个 **_`write`_** 输出。本质上是一个 **_`servlet`_** 。
> -   请求常见状态码：404 资源找不到，400 请求类型不匹配，500 java 程序异常

### JSP 编码问题：

```php
<%@ page contentType="text/html; charset=utf-8" %>
<%--这里的utf-8是指服务器发送给客服端时的内容编码 --%>

<%@ page pageEncoding="utf-8"%>
<%--这里的utf-8是指 .jsp文件本身的内容编码 --%>
```

### JSP 的 HTML 中嵌入 Java 程序：

1. JSP 脚本
   注意：只能写 java 逻辑代码，不能定义方法
   `<% java代码(不常用也不不建议) %>`

```java
<body>
<%//这些代码本质上相当于就写在了servlet的service中
    String str = "java代码嵌入html";
    //此页面被访问时java控制台输出
    System.out.println(str);

%>
<%  //还可使用内置对象out写入浏览器
    out.write(str);
%>
</body>
```

2. 声明（嵌入 java 方法）

```java
<%!//在jsp的HTML中
    public static String test(){
    return "嵌入方法";
    }
    //只能定义方法不能使用
%>
<%//使用方法还是通过此不带感叹号的标签
    System.out.println(test());
%>
```

3.JSP 表达式
把 java 对象直接输出在 HTML 中
`<%= java变量 %>`

```java
<%
    String str = "java代码嵌入html";
%>
<%--通过后面加等号直接输出java变量,
    此处是JSP的HTML中的注释--%>
<%=str%>
```

4. java 代码与 HTML 的混合使用

HTML 标签写在 java 语句块中，标签也会被代码控制。

```xml
<table border="1">
    <tr><th>num</th></tr>
    <% for (int i = 0; i < 5; i++) { %>
        <tr><td>i</td></tr>
    <% } %>
</table>
```

### JSP 内置对象：

> -   request：表示一次请求，属于 HttpServletRequest 类
> -   response：表示一次响应，HttpServletResponse
> -   pageContext：页面上下文可获取页面信息，PageContext
> -   session：表示一次回话，保存用户信息，HttpSession
> -   application：web 应用全局对象，保存所有用户共享信息，ServletContext
> -   config：当前 jsp 对应 servlet 的 ServletConfig 对象，获取当前 Servlet 的信息
> -   out：向浏览器输出数据，JspWriter
> -   page：当前 Jsp 对应的 Servlet 对象，pageContext
> -   exception：表示 jsp 页面发生的异常，Exception

常用 request，response，session，application，pagecontext
下面这些对象使用的方法即是它们所属类的方法，在 servlet 中取得同类型对象可使用。

#### request 常用方法

1. `String getParameter(String key)`
   如在浏览器中访问并传值：`http://localhost:8080/?value=haha`
   此为 get 传值，url 后跟 `?` 传值使用 `key=value` 格式，多个值用 `&` 隔开。

```java
<%//内置对象使用与在servlet中使用一样
    String value=request.getParameter("value");
%>
<%--浏览器中输出：haha--%>
<%=value%>
```

2. `void setAttribute(String key,Object value);` 通过键值对形式保存数据
   `Object getAttribute(String key);`通过 key 取出 value

-   两方法一般用于将客户端拿到的数据 set 存储起来，完成服务端内数据传输通过 get 获取。
-   页面跳转：`RequestDispatcher getRequestDispatcher(String path)`方法和该对象的`forward(request,response)`方法使用，此方法可用于登录

*   它可让浏览器访问到**WEB-INF**(客户端无法直接访问，只有服务端可以访问。直接访问会引起 404 错误，也可用**映射**访问)文件夹下的文件,此方法可用于用户登录

在被访问的 jsp 中：

```java
<%//将数据存储起来，并将请求转发给其它jsp
    String value=request.getParameter("value");
    request.setAttribute("value",value);
    //需要表明传输地址，还需要将此页面的请求和响应对象传入
    request.getRequestDispatcher("/WEB-INF/values.jsp")
            .forward(request,response);
    //它会让浏览器自动跳转至接收的页面
%>
```

在接收的 jsp 中(页面会跳转至此 jsp，但浏览器地址栏不会改变)：

```java
<%//获取数据并转型
    String value=(String)request.getAttribute("value");
%>
<%=value%>
```

1. `String[] values=request.getParameterValues(String key)`

当浏览器传值时有多个同名的 key，那么 `getParameter` 只取第一个，而此方法能将所有同名 key 的值组成一个数组返回。适用于接收复选框的值。

#### response 常用方法

`void sendRedirect(String path)` 重定向：

-   相等于浏览器直接发生请求访问，因此方法无法访问到**WEB-INF**下的文件
-   此方法可用于登录后的退出
    如：
    `<%response.sendRedirect("test.jsp");%>`

#### Session 常用方法

-   属于同一次回话(一个浏览器或服务器的关闭标识一次会话结束)的请求都有一个相同的标识符，sessionID：**`String id=session.getId()`**。

`void setMaxInactiveInterval(int)`：设置 session 失效时间，单位为秒。
`int getMaxInactiveInterval()`：获取当前 id 失效时间
`void invalidate()`：设置 session 立即失效
`void setAttribute(String key,Object value)`：通过键值对的形式来存储数据，key 相同的数据将被覆盖
`Object getAttribute(String key)`：通过键获取对应的数据
`void removeAttribute(String key)`：通过键删除对应的数据

在**servlet**中获取 session：

```java
public class TestServlet extends HttpServlet {
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        //HttpServletRequest中提供了获取session的方法
        HttpSession session=req.getSession();
        //这样我们就获取到了session且可以正常使用
    }
}
```

HttpServletRequest是ServletRequest的子类，在参数非HttpServletRequest的方法中我们可以通过转型得到HttpSession（session）：
`((HttpServletRequest)servletRequest).getSession();`

### 浏览器存储数据 Cookie：

> -   cookie 在浏览器是以键值对方式存放数据，同名 key 的值将被覆盖。每一对键值对用等号隔开 **' = '** ，每一组数据用分号 **' ; '** 隔开。
> -   浏览器发送请求时会把现有的 Cookie 数据**传递**给服务器，服务器可以对 Cookie 做操作，响应时又自动**返回**Cookie，浏览器将本地 Cookie**更新**为服务器返回的 Cookie。

java 中 Cookie 是一个类，每一个 cookie 对象保存一对键值对。在 jsp 和 servlet 中都可使用 Cookie，HttpServletRequest 和 HttpServletResponse 分别提供了获取浏览器的 Cookie 和给 Cookie 添加新值的方法。
_以 jsp 中为例：_

```java
<%
    //获取浏览器发来的cookie，返回cookie数组
    Cookie[] cookies=request.getCookies();
    //获取每一个cookie对象的key和value
    for (Cookie cookie : cookies){
    System.out.println(cookie.getName()
            +"="+cookie.getValue());
    }
    //创建一个新的cookie(一组键值对数据)
    Cookie cookie=new Cookie("key","value");
    //添加到总Cookie中
    response.addCookie(cookie);
%>
```

设置 cookie 有效时间方法：

```java
//设置cookie有效时间，单位为秒
cookie.setMaxAge(int);//默认-1浏览器关闭销毁，设为0表示删除
//获取cookie的有效时间
int cookie.getMaxAge();
```

session 与 cookie 区别：
session|cookie
-|-
数据时 object|数据时 string
保存在服务器，会话结束时销毁|长期保存在浏览器
保存重要信息|不重要信息

### 内置对象(_域对象_)作用域：

我们主要探讨 4 个内置对象的作用域。他们都有一些这两个存储数据的方法，根据它们作用域不同，数据存储的作用域也不同。

```java
//储存数据
void 内置对象.setAttribute(String key,Object value);
//取出数据(取不存在的key返回null，不报错)
Object 内置对象.getAttribute(String key);
```

| 内置对象    | 作用域              |
| ----------- | ------------------- |
| pageContext | 当前页面有效        |
| request     | 一次请求内有效      |
| session     | 一次会话内有效      |
| application | 整 web 应用(服务器) |

### EL 表达式：

**_域对象_** 存储数据的便捷取值方法： **`${域对象存储数据的key}`**
只能在 **_jsp_** 中使用。

```java
<%  //存储字符串
    pageContext.setAttribute("key","pageContext");
    request.setAttribute("key","request");
    String value =(String) request.getAttribute("key");
%>

<%=value%>
<%--取值原理与上相同--%>
${key}<%--取得pageContext(作用域更小)--%>

<%--key相同，但存储对象不同时，直接取key，
会从作用域底的开始查找，也可指定对象取值，
可提高效率，指定四个域对象的取值方法如下：--%>
pageContext中：${pageScope.key}
request中：${requestScope.key}
session中：${sessionScope.key}
application中：${applicationScope.key}
```

存取**对象**时：

-   对象类中：

```java
public class User {
    private String name;
    private int age;
    public User(String name, int age) {
        this.name = name;
        this.age = age;
    }
    public String getName() { return name; }
    public int getAge() { return age; }

    public void setName(String name) { this.name = name; }
    public void setAge(int age) { this.age = age; }
}
```

-   jsp 中

```php
<%  //存储对象
    request.setAttribute("user", new User("name",99));
%>

<%--取出值为对象时--%>
${user}<%--调用该对象toString方法--%>
${user.name}<%--取出成成功原理：反射技术调用该getName方法--%>
${user["name"]}<%--写法二，效果同上--%>
<%--取对象某一元素时此元素必须有get方法，否则报错--%>
${user.age=10}<%--也能调用set方法(前提：该属性有set方法)--%>
```

关系运算：

```php
<%--EL中还能进行，关系运算(&&,||,><==!=)--%>
${key1 && key2}
${key1 and key2}<%--效果同上(还有or,not)--%>
```

### JSTL:

> -   需要借助 jar 外包 `jstl.jar` 和`standard.jar` 两个包。在 WEB-INF 文件夹中新建 lib 文件夹，将 jar 导入其中。
>
> *   下载地址：[jakarta-taglibs-standard-1.1.2.zip](https://static.runoob.com/download/jakarta-taglibs-standard-1.1.2.tar.gz),解压将 lib 下的两个 jar 文件提取出来。
>
> -   在需要使用的 jsp 中 HTML 标签上方导入核心库 `<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>` ，其中 **c** 是之后在 jsp 中使用该库就需要使用 **c** 来调用。可以自定义但建议用 c 来表示

案例：后端给 jsp 传递一个集合，jsp 需要在页面中遍历出来里面的元素，并显示在页面上。

-   java 文件中：

```java
@WebServlet("/test")
public class TestServlet extends HttpServlet {
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        //创建一个集合
        ArrayList<String> list=new ArrayList<>();
        list.add("1");
        list.add("2");
        list.add("3");
        req.setAttribute("list",list);
        req.getRequestDispatcher("/WEB-INF/test.jsp").forward(req,resp);
    }
}
```

-   jsp 中：

```php
<%--导入jstl库--%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html>
<body>
<%--使用 c 调用forEach标签遍历，items表示需要变量的集合。
var是集合中每一次元素取出来存放的载体，
使用时还是需要用'${}'包裹var中的变量。--%>
    <c:forEach items="${list}" var="str">
        <h2>${str}</h2>
    </c:forEach>

<%--其它属性：begin属性指定开始位置，end结束位置，
step每次走几步，varStatus="sta"
${sta.index} 0开始, ${sta.index} 1 开始--%>
</body>
</html>
```

上面我们使用了 foreach 标签，它还用其它标签如：

```php
<%--set就是setAttribute，scope指定存储在哪一个对象中，默认page--%>
<c:set var="key" value="value" scope="request"></c:set>
<%--上方法不能存储对象，但可以修改对象，不常用--%>

<%--out与${}类似，但某些时候out默认值设置更智能--%>
<%--value需要一个域对象的值，设置default当域对象值不存在时使用该值--%>
<c:out value="${key}" default="未定义"></c:out>

<%--删除域对象中的值，var中直接写值的key。scope表示指定某个对象，默认page--%>
<c:remove var="key" scope="request"></c:remove>

<c:if test="${n1 > n2}">true显示，false不显示</c:if>
```

以上都是 **_核心标签库标签_** 。