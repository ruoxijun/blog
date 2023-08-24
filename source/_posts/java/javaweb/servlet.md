---
title: servlet
date: 2020-05-18 13:17:35
categories: Java
tags: 
    - javaweb
    - servlet
---

# Servlet

### web基本概念:

* http：超文本传输协议，是一个简单的请求响应协议，它通常运行在TCP之上。（https：安全的）
* 请求方式：get，post，delete，put ...
* 响应状态码：200请求响应成功，3xx请求重定向，4xx找不到资源，5xx服务器错误

### servlet 接口：

> servlet 是负责服务器和客户端通信的接口需要我们自己写一个类实现它的方法。

```java
public interface Servlet {
    //初始化
    void init(ServletConfig var1) throws ServletException;
    //获取servlet信息
    ServletConfig getServletConfig();
    //处理客户端请求并响应(ServletRequest请求对象，ServletResponse响应对象)
    void service(ServletRequest var1, ServletResponse var2) throws ServletException, IOException;
    //返回字符串信息
    String getServletInfo();
    //销毁(释放资源),关闭服务器时
    void destroy();
}
```

实例：

```java
//在此可插入本@WebServlet的注解
public class MyServlet implements Servlet {
    private static int num = 0;
    /**因为浏览器访问servlet是通过反射的方式，
     * 且一般反射为空参构造函数，被浏览器访问此构造函数被执行
     */
    public MyServlet(){
        System.out.println("对象被创建了");
    }
    public void init(ServletConfig servletConfig) throws ServletException {
        //初始化
        System.out.println("初始化了");
        //获取此servlet类的类名
        servletConfig.getServletName();
        //获取映射此文件时设置的默认值(只能在xml配置，代表不能使用注解)
        String init = servletConfig.getInitParameter("name");
        System.out.println(init);
        //拿到所有设置的值,返回Enumeration<String>集合
        servletConfig.getInitParameterNames();
        //拿到servlet上下文(此web全局信息)，返回ServletContext
        ServletContext context=servletConfig.getServletContext();
        context.getInitParameter("name");
    }
    public ServletConfig getServletConfig() {
        //获取servlet信息
        return null;
    }
    public void service(ServletRequest servletRequest, ServletResponse servletResponse) throws ServletException, IOException {
        //客户端提交的数据可能会乱码，设置编码(一定要在读取数据前设置)
        servletRequest.setCharacterEncoding("UTF-8");
        //获取客户端信息，如客户端请求为：localhost:8080/servlet?id=2222
        String value = servletRequest.getParameter("value");//返回id的值
        System.out.println("接收到了客户端的请求"+value);

        //直接给客户端返回消息会乱码还需要如下设置编码
        servletResponse.setContentType("text/html;charset=utf-8");
        //getwriter返回一个PrintWriter流，给客户端写入信息
        servletResponse.getWriter().write("<h1>返回信息成功"+(num++)+"<h1/>");
    }
    public String getServletInfo() {
        //返回字符串信息
        return null;
    }
    public void destroy() {
        //销毁(释放资源),关闭服务器时
        System.out.println("服务器关闭了");
    }
}
```

### 访问（请求）servlet：

在客户端访问 servlet 文件(类.class),会通过 **反射(原理)** 机制建立客户端(浏览器)和服务端的通信。

-   **_映射_**（在 **web.xml** 中 web-app 下配置）：

```xml
<servlet><!--servlet映射文件配置-->
    <!--定义servlet文件被映射名-->
    <servlet-name>myservlet</servlet-name>
    <!--servlet文件，需要写src下的完整路径名-->
    <servlet-class>io.ruoxijun.MyServlet</servlet-class>
    <init-param><!--为此servlet设置默认值，非必要(可配置多个)-->
        <!--ServletConfig可获取这里设置的值-->
        <param-name>name</param-name><!--key-->
        <param-value>user</param-value><!--value-->
    </init-param>
</servlet>

<servlet-mapping><!--URL映射配置-->
    <!--映射名-->
    <servlet-name>myservlet</servlet-name>
    <!--配置映射的URL-->
    <url-pattern>/servlet</url-pattern>
</servlet-mapping>

<context-param><!--定义web全局的初始值-->
    <param-name>user</param-name>
    <param-value>loc</param-value>
</context-param>
```

至此在浏览器下输入配置的网址后加上映射的**URL：** `/servlet` 即可发送请求至此 servlet，servlet 也在**service 方法中** 接受到了消息可处理并返回数据。
客户端可不停的给 servlet 发送消息直到服务器关闭。

-   **_注解_**（脱离 xml 繁琐配置，一句话搞定访问）

每一个 servlet 需要被访问，我们就需要在*web.xml*中配置一次映射，当 servlet 类过多时就过于麻烦。使用产生了基于*注解*的映射。

`@WebServlet("/servlet")`

在对应 servlet 类的上方加上注解，@加上 WebServlet，参数为映射访问此文件时的 URL(必须有 `/` 否则报错)。与 xml 中配置的效果同。

### Servlet 生命周期：
1. 客户端第一次访问服务端接受到请求时利用反射技术加载类，调用无参构造函数创建servlet
2. 调用 init 方法完成初始化。(调用一次)
3. 调用 service 方法完成业务逻辑操作。(会重复执行直到服务器关闭，或离开此页面)
4. 服务器停止，调用 destory 方法释放资源。(调用一次)

当浏览器访问 servlet 时，Tomcat 会查询 Servlet 的实例化对象是否存在，不存在通过反射机制创建。存在直接执行 service 方法

### HttpServlet（建议使用）:

> -   servlet 中任何请求(get,post,put,delete)都由**service**方法处理，httpservlet 中细分了出来，常用的如 `get请求 → 由doGet方法处理`，`post请求 → 由doPost方法处理`
> -   httpservlet 中我们可以只重写需要的方法，但必须**重写一种**对于请求和响应的处理方法如：doGet,doPost。并且重写方法中不能出现 super 否则 405。
> -   **GenericServlet** 中完成了屏蔽 servlet 四个不常用的方法。他们的关系是 **`HttpServlet 继承 GenericServlet 实现 Servlet`**
```java
@WebServlet("/test")//此类映射的URL
public class TestServlet extends HttpServlet {
    //重写的一定要去除方法中的super阻止调用父类方法
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        //客户端提交的数据可能会乱码，设置编码(一定要在读取数据前设置)
        req.setCharacterEncoding("UTF-8");
        //处理get请求
        resp.getWriter().write("GET");
        //获取请求类型
        String get=req.getMethod();
    }
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        //处理post请求
        resp.getWriter().write("POST");
    }
}
```

### ServletContext：

```java
protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
     // servlet上下文，web应用的全局对象
    ServletContext servletContext = this.getServletContext();
    // 存入数据
    servletContext.setAttribute("key","value");
    // 取出数据(在其它servlet中同样可以取出，它们属于同一个web)
    servletContext.getAttribute("key");
    // 转发
    servletContext.getRequestDispatcher("path").forward(req,resp);
}
```