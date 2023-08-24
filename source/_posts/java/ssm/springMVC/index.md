---
title:  SpringMVC基础
date: 2020-08-19 21:03:09
categories: SpringBoot
tags: 
    - springmvc
---

# Spring MVC 入门

## MVC 简介：

MVC是模型(Model)、视图(View)、控制器(Controller)的简写，是一种软件设计规范：

* **Model（模型）：**数据模型，提供要展示的数据，因此包含数据和行为，可以认为是领域模型或JavaBean组件（包含数据和行为），不过现在一般都分离开来：Value Object（数据Dao） 和 服务层（行为Service）。也就是模型提供了模型数据查询和模型数据的状态更新等功能，包括数据和业务。

* **View（视图）：**负责进行模型的展示，一般就是我们见到的用户界面，客户想看到的东西。

* **Controller（控制器）：**接收用户请求，委托给模型进行处理（状态改变），处理完毕后把返回的模型数据返回给视图，由视图负责展示。也就是说控制器做了个调度员的工作。

## Spring MVC 简单实例：

### 1. 导入所需依赖：

```xml
<!-- 测试 -->
<dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>4.13</version>
    <scope>test</scope>
</dependency>
<!-- springmvc核心 -->
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-webmvc</artifactId>
    <version>5.2.8.RELEASE</version>
</dependency>
<!-- 可能会使用servlet -->
<dependency>
    <groupId>javax.servlet</groupId>
    <artifactId>javax.servlet-api</artifactId>
    <version>4.0.1</version>
    <scope>provided</scope>
</dependency>
<!-- 还有可能使用jsp -->
<dependency>
    <groupId>javax.servlet.jsp</groupId>
    <artifactId>javax.servlet.jsp-api</artifactId>
    <version>2.3.3</version>
    <scope>provided</scope>
</dependency>
```

servlet 的 maven 依赖分为 `javax.servlet-api` 和 `servlet-api` 带 **javax** 前缀表示最新版本。

### 2. 配置web.xml ：

SpringMVC 思想是用一个前端控制器能拦截所有请求，并智能派发。这个前端控制器是一个 servlet 需要在 web.xml 中进行配置。它提供的前端控制器叫 **DispatcherServlet 它继承自 HttpServlet** 。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee
         http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">
    <!-- DispatcherServlet SpringMvc 的请求拦截分发器(前端控制器) -->
    <servlet>
        <servlet-name>dispatcherServlet</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <init-param> <!-- 指定SpringMVC配置文件位置 -->
            <!-- 当没有指定配置文件时，会默认寻找：/WEB-INF/前端控制器名-servlet.xml 文件
            即 /WEB-INF/dispatcherServlet-servlet.xml 文件
             就是你配置的前端控制器servlet的名字为前缀的文件 -->
            <param-name>contextConfigLocation</param-name>
            <param-value>classpath:spring-mvc.xml</param-value>
        </init-param>
        <!-- servlet启动加载：
             servlet 原本是第一次访问时创建对象。
             springmvc 中服务器启动时创建对象，值越小优先级越高 -->
        <load-on-startup>1</load-on-startup>
    </servlet>
    <servlet-mapping>
        <!-- /  ：拦截所有 url 路径请求,一般使用此拦截方式
             /* ：拦截到所有请求，路径请求和后缀请求（如*.jsp|*.html|*.js...） -->
        <servlet-name>dispatcherServlet</servlet-name>
        <url-pattern>/</url-pattern>
    </servlet-mapping>
</web-app>
```

### 3. springmvc 配置文件：

在 **resources** 文件夹中新建 springmvc-servlet.xml (推荐名，可自定义) 配置文件。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd">

    <!-- 1.添加处理器映射器 -->
    <bean class="org.springframework.web.servlet.handler.BeanNameUrlHandlerMapping"/>
    <!-- 2.添加处理器适配器 -->
    <bean class="org.springframework.web.servlet.mvc.SimpleControllerHandlerAdapter"/>
    <!-- 3.添加视图解析器:拼接目标地址字符串 -->
    <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <!--前缀-->
        <property name="prefix" value="/WEB-INF/jsp/"/>
        <!--后缀-->
        <property name="suffix" value=".jsp"/>
    </bean>
</beans>
```

这里的 **处理器映射器和处理器适配器** 是使用了显示的方式去指定，实际1、2也可 **省略 ** springmvc会采用默认的 **处理器映射器和处理器适配器** 。

### 4. 编写 Controller 类：

```java
// 实现 org.springframework.web.servlet.mvc.Controller 接口
public class HelloController implements Controller {
    @Override // springmvc方法中允许我们传入原生的API
    public ModelAndView handleRequest(HttpServletRequest request,
                                      HttpServletResponse response) throws Exception {
        // ModelAndView 模型和视图类
        ModelAndView mv = new ModelAndView();
        // 封装对象，放在ModelAndView中。
        mv.addObject("msg","HelloSpringMVC!");
        // 封装要跳转的视图，放在ModelAndView中
        mv.setViewName("hello"); //: /WEB-INF/jsp/hello.jsp
        return mv;
    }
}
```

ModelAndView 的 `setViewName` 方法和配置文件中的视图解析器，决定了要跳转的视图和视图的具体位置（通过拼接字符串）。如上表示跳转到 /WEB-INF/jsp/hello.jsp 视图（页面）。hello.jsp中的内容为：

```html
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
    <head><title>hello</title></head>
    <body>${msg}</body>
</html>
```

### 5. Controller 加入IOC容器：

在 springmvc-servlet.xml 中，注册我们刚刚书写的 HelloController 类。

```xml
<!-- 注意此处的id表示访问时的url后缀，”/“ 不能舍去 -->
<bean id="/hello" class="io.ruoxijun.HelloController"/>
```

到此启动项目浏览器中输入： **localhost:8080/springmvc_demo01/hello** 访问，浏览器显示 **HelloSpringMVC!** 的字样表示成功了。

## 实例改写注解开发：

### 1. springmvc-servlet.xml 配置：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:mvc="http://www.springframework.org/schema/mvc"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/context
       https://www.springframework.org/schema/context/spring-context.xsd
       http://www.springframework.org/schema/mvc
       https://www.springframework.org/schema/mvc/spring-mvc.xsd">
    <!-- 自动扫描包，让指定包下的注解生效,由IOC容器统一管理 -->
    <context:component-scan base-package="io.ruoxijun"/>
    <!-- 让Spring MVC不处理静态资源(如.css、.js等)
         除我们添加的映射请求，其它请求交给Tomcat处理 -->
    <mvc:default-servlet-handler />
    <!-- 添加静态处理后我们映射的动态请求也会被Tomcat静态处理，需要加上此句 
        在spring中一般采用@RequestMapping注解来完成映射关系，要想使@RequestMapping注解生效
        必须向上下文中注册DefaultAnnotationHandlerMapping
        和一个AnnotationMethodHandlerAdapter实例
        这两个实例分别在类级别和方法级别处理，而annotation-driven配置帮助我们自动完成上述两个实例的注入
        省略了手动注册以上两个bean的实例的步骤 -->
    <mvc:annotation-driven />
    <!-- 视图解析器 -->
    <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <!-- 可指定视图类型 -->
        <property name="viewClass" value="org.springframework.web.servlet.view.JstlView"/>
        <!-- 前缀 -->
        <property name="prefix" value="/WEB-INF/jsp/" />
        <!-- 后缀 -->
        <property name="suffix" value=".jsp" />
    </bean>
</beans>
```

### 2. 注解实现 Controller ：

**`@Controller `** 注解的类中使用 **`@RequestMapping`** 注解的方法就相当于一个 handleRequest 方法。被注解类中的所有方法如果返回值为 **String** ，并且有具体的页面可以跳转那么就会被视图解析器解析。

```java
// 使用Controller注解不用再继承Controller接口
@Controller // 实现Controller接口是一种较老的方法，推荐使用注解实现
// 可在类上再加一层请求路径的映射,也可省略
@RequestMapping("/controller")
public class HelloController {
    // 映射请求路径
    @RequestMapping("/hello") // 请求：项目路径/controller/hello
    public String hello(Model model){ // 参数可自定义，此处的Model存储传递数据
        // 向模型存入数据
        model.addAttribute("msg","hello springmvc");
        // 返回的字符串表示视图：/WEB-INF/jsp/hello.jsp
        return "hello";
        // 如果没有配置视图解析器，返回 "/WEB-INF/jsp/hello.jsp" 也能达到效果
    }
}
```

一个类中可以配置多个 RequestMapping 方法，同时它还可以作用在类上相当于为类中所有的请求路径之前加了一层请求的路径映射。

## RequestMapping 属性：

### 常规方式传参：

首先定义一个需要接收两个参数的方法：

```java
@RequestMapping("/add") // "/" 可省略（使用时自动添加）
public String add(int a,int b,Model model){ // 需要接受ab两个参数
    model.addAttribute("msg","两数和为："+(a+b));
    return "hello";
}
```

访问：

**localhost:8080/springmvc_demo02/add** ：直接访问add方法，不传入参数报 **500错误**。

**localhost:8080/springmvc_demo02/add?a=1&b=2** ：正确访问方式，使用常规的get方式传参。

### 1. 模糊匹配(Ant 风格 URL)：

```java
// ? 匹配单个任意字符（0个或多个字符都会导致404）
@RequestMapping(value = "/hello?")
// * 匹配多个字符(可0个)或一层路径，hello? 与 hello* 同时存在优先访问精确度高的
@RequestMapping(value = "/*/hello*")
// ** 可匹配多层路径
@RequestMapping(value = "/**/hello")
```

### 2. RestFul 与 PathVariable：

```java
/**
 * 大括号声明路径变量值在 url 中映射的位置，
 * 路径变量在url中的位置和个数可以随意更改（/add/{a}/{b}/{a}：a值为最后一个a值），
 * 但必须给所有路径变量声明并赋值
 */
@RequestMapping("/add/{a}/{b}")
// @PathVariable 默认将路径变量名与参数名匹配，也可value属性值来指定
public String add(@PathVariable int a, // 基本数据类型建议使用封装类型接收
                  @PathVariable("b") int b,
                  // 支持将所有的路径变量 k,v 都封装在一个 Map<String,String> 中
                  @PathVariable Map<String,String> pv, 
                  Model model){
    model.addAttribute("msg","两数和为："+(a-b));
    return "hello";
}
```

访问：

**localhost:8080/springmvc_demo02/add?a=1&b=2**：使用常规的get方式传参，报404错误。

**localhost:8080/springmvc_demo02/add/2/1**：正确访问方式，RestFul 风格传参。

#### RestFul 风格 URL：

1.   常规 URL 请求设计方式：

```java
// 以书籍管理的 URL 请求为例
/getBook?id=1    // 获取书籍
/deleteBook?id=1 // 删除书籍
/addBook         // 添加书籍
/updateBook?id=1 // 更新书籍
```

2.   Rest 风格 URL 请求设计方式：以简洁的 URL 提交请求，以请求方式来区分对资源的操作。

```java
// restRul：资源名/资源标识
/book/1  // GET    请求：获取书籍
/book/1  // DELETE 请求：删除书籍
/book    // POST   请求：保存或新增书籍
/book/1  // PUT    请求：更新书籍
```

#### Sring 对 Rest 请求的支持：

1.   浏览器中一般只支持 get、post 请求，springmvc 提供了将普通请求转化为规定请求的 **Filter** ：

`org.springframework.web.filter.HiddenHttpMethodFilter` 首先在 web.xml 配置此 Filter 。

```xml
<filter>
    <filter-name>hiddenHttpMethodFilter</filter-name>
    <filter-class>org.springframework.web.filter.HiddenHttpMethodFilter</filter-class>
</filter>
<filter-mapping>
    <filter-name>hiddenHttpMethodFilter</filter-name>
    <url-pattern>/*</url-pattern>
</filter-mapping>
```

2.   实现方式：

创建 post 请求，在请求数据中携带一个名为 **`_method`** 的参数， **`_method`** 的值就是你想要的请求方式，如：

```jsp
<%-- 指定要请求的 rest 风格路径，发送请求方式为 post --%>
<form action="/book/1" method="post">
    <%-- 指定 _method 参数值，表示 springmvc 要将此 post 请求转化为 DELETE --%>
    <input name="_method" value="DELETE">
    <input type="submit" value="删除图书">
</form>
```

3.   高版本 tomcat 的 Rest 请求方法中不支持返回 jsp页面：

tomcat 8 以上返回 Rest 的请求方法返回 jsp 页面时会报 405 的错误，可以在 jsp 页面的头部添加：

 `<%@page isErrorPage="true" %>` 在 jsp page标签中添加 isErrorPage 为 true 让 jsp 将错误封装起来。

### 3. MatrixVariable 矩阵变量：

`@MatrixVariable` ：SpringBoot 默认禁用了矩阵变量功能，需要手动开启，矩阵变量必须有url路径变量的支持。

### 4. method 请求方式：

http 规定的请求方式有 GET、HEAD、POST、PUT、PATCH、DELETE、OPTIONS、TRACE ，而我们可以通过 method 属性来指定某个请求的具体请求方式。

```java
// RequestMapping 中可以通过给method赋值指定请求方式（非指定方式请求将会报错）
@RequestMapping(value = "/add/{a}/{b}",method = RequestMethod.POST)
```

```java
// springmvc 也提供了具体请求方式的注解，它们是RequestMapping的快捷方式使用方法类似
@GetMapping
@PostMapping
@PutMapping
@DeleteMapping
@PatchMapping
```

### 5. params 指定 URL 参数:

params 设置 URL 请求中是否必须包含或不能包含某些参数，不符合是 404 错误：

```java
@RequestMapping(value="hello02",params={"name"}) // 必须包含name参数
@RequestMapping(value="hello03",params={"!name"}) // 不能包含name参数
@RequestMapping(value="hello04",params={"name=4"}) // 指定参数且指定值
// 指定参数不能为某指定值(可以为空或参数不存在)
@RequestMapping(value="hello04",params={"name!=4"})
@RequestMapping(value="hello05",params={"name!=5","age"}) // 添加多个参数条件
```

### 6. headers 请求头参数:

使用规则与 params 属性设置的表达式类似，针对请求头的参数：

```java
// Windows 浏览器中访问时请求头中有个参数： sec-ch-ua-platform: "Windows"
headers = {"sec-ch-ua-platform=Windows"} // 表示只能 win 访问
```

### 7. consumes 与 produces：

*   consumes：只接受内容类型为指定值的请求，即规定请求头中的 `Content-type`
*   produces：告诉浏览器返回的内容类型，即为响应头添加 `Content-type:text/html;charset=utf-8` 类似属性值。

## 转发与重定向：

### 1. 使用 servlet API ：

```java
@RequestMapping("/hello")
public void hello(HttpServletRequest req,HttpServletResponse rsp) 
    throws ServletException, IOException {
    // 重定向
    // rsp.sendRedirect("index.jsp");
    // 转发
    req.setAttribute("msg","hello springmvc");
    req.getRequestDispatcher("/WEB-INF/jsp/hello.jsp").forward(req,rsp);
}
```

### 2. 使用 springMVC：

带有 forward 和 redirect 关键字的前缀的字符串不会被视图解析器解析。

```java
@RequestMapping("/hello")
public String hello() {
    // 转发方式一：默认就是转发方式
    // return "hello";
    // return "../../index"; // return 中允许使用相对路径
    
    // 转发方式二：使用关键字forward，将不会自动拼接前后缀
    // return "forward:/index.jsp"; // 必须有 / ,不加就是相对路径
    
    /**
     * 重定向：使用关键字redirect，且有视图解析器时重定向也能正常使用
     * 重定向本质就是重新请求所以不一定要返回路径也可以是一个新请求
     * 不会自动拼接前后缀
     */
    return "redirect:/index.jsp";
}
```

## 请求处理：

### 1. 简单数据：

* @RequestParam：

添加 @RequestParam 注解的变量默认该参数是必须的(可以为空字符串：&password=)，参数不存在时报 404。

RequestParam 属性： `defaultValue` 为变量设置默认值， `required` 为 false 表示不是必须的(默认true)

```java
/** 请求为：localhost:8080/springmvc_demo03/hello?user=test&password=111&pets=cat&pets=pig
 * @param user 请求中参数名与变量名一致时自动赋值，不存在时值为 null
 * @param pass 当请求中参数名与变量名冲突时，在变量前使用 @RequestParam 指定要接收的参数
 */
@RequestMapping("/hello")
// 未接受到值的变量为该java类型的默认值
public String hello(String user,
                    @RequestParam("password")int pass, // 根据 key 获取指定参数
                    @RequestParam("pets")List<String> pets, // 一个 key 有多个值时可以封装为一个集合
                    // 拿到当前所有的参数(想拿到 pets 所有值使用 SpringMvc 工具类 MultiValueMap 替换 Map)
                    @RequestParam Map<String,String> params,
                    Model model) {
    String msg="用户名："+user+"，密码："+pass;
    model.addAttribute("msg",msg);
    return "hello";
}
```

了解：[POST、GET、@RequestBody 和 @RequestParam 区别](https://blog.csdn.net/weixin_38004638/article/details/99655322)

* @RequestHeader：

```java
// 获取请求头中的信息，可设置属性同上
public String hello04(
    @RequestHeader("User-Agent")String userAgent, // 根据 key 来获取请求头的信息
    @RequestHeader Map<String,String> header ){} // 获取所有的 header 信息
```

* @CookieValue：

```java
// 获取 cookie 中的值，可设置属性同上
public String hello04(@CookieValue("JSESSIONID")String jId,
                      @CookieValue("JSESSIONID") Cookie cookie){
    // 可以将 cookie 封装在 Cookie 对象中
    System.out.println(cookie.getName()+"===>"+cookie.getValue());
}
```

* 接受指定时间格式类型：

```java
@DateTimeFormat(pattern = "yyyy-MM--dd")
private Date date; // 某pojo类中的Date成员属性
```

### 2. 映射对象：

首先建一个pojo类：

```java
// 省略get set方法
public class User {
    private String name;
    private int pass;
    private Book book; // 关联Book类
}
// 省略get set方法
class Book{ private String name; }
```

添加接受对象参数的方法：

```java
/** 请求为：localhost:8080/springmvc_demo03/hello?name=test&pass=111&book.name=mybook
 * @param user 请求中的参数与该类中有set方法的成员（基本类型和String）名一致时，
 *             将给该成员变量赋值，无映射的成员变量为该java类型的默认值
 * @param name 同样参数与变量名一致时还会给该变量赋值
 */
@RequestMapping("/hello")
public String hello(User user,String name, Model model) {
    model.addAttribute("msg",user+",name="+name);
    return "hello";
}
```

### 3. 原生 API :

springmvc 中允许直接在方法参数中添加原生的 API 参数：

```java
@RequestMapping("/add")
public String add(HttpServletRequest request, 
                  HttpServletResponse response,
                  HttpSession session){}
```

除上3个常用 api 以外还有一下 api 可用：

* java.security.Principal ：与 https 安全相关
* Locale ：国际化相关

## 数据回显：

### 1. 提供 AIP 参数：

在 springmvc 中除使用原生 API 将数据传递给页面以外，springmvc 中提供了 **Map** 、 **Model** 、 **ModelMap** 。springmvc 允许将它们添加在请求方法的参数列表中给我们使用：

```java
@RequestMapping("/test")
public String test(Map<String,Object> map,
                   Model model, ModelMap modelMap){
    map.put("key","val");
    model.addAttribute("key","val");
    modelMap.addAttribute("key","val");
    return "success";
}
```

它们添加的数据都被保存在 **请求域(requestScope)** 中，如在 jsp 页面我们通过 `${requestScope.key}` 获取到数据。它们3都是利用了 **BindingAwareModelMap** 来实现数据的保存。

### 2. ModelAndView 返回值：

springmvc 中还提供了一种不在方法中添加参数，而是通过方法返回值返回 `RequestMapping` 对象的方式来传递数据。它的数据也一样被保存在 **请求域(requestScope)** 中。

```java
@RequestMapping("/test")
public ModelAndView test(){
    // new ModelAndView("index"); // 构造函数允许指定视图(页面)
    ModelAndView mv = new ModelAndView();
    mv.setViewName("index"); // 设置视图
    mv.addObject("key","val"); // 添加数据
    return mv;
}
```

### 3. 为 session 域添加数据：

SessionAttributes 将上方 Model 等保存的数据同时在 **session域(sessionScope)** 中保存，建议使用原生 API(HttpSession)。

```java
// 给model存储数据时key等于value数组中值的数据，将同时在 session 域中存储一份
// types 将model中同类型的数据在session中储存一份
@SessionAttributes(value = {"msg","key"} , types = {String.class}) // 在类上使用此注解
```

### 4.  其它：

#### 1. @ModelAttribute：

*   基本不用了。

#### 2. @RequestAttribute：

*   `RequestAttribute` 获取请求域中的信息：

```java
@GetMapping("/goToPage")
public String goToPage(HttpServletRequest request){
    // 通过原生 API 在 request 域中保存信息
    request.setAttribute("msg","request msg");
    return "forward:/success"; // 转发请求
}
@ResponseBody
@GetMapping("/success")
public String success(
    @RequestAttribute("msg")String msg){ // 获取到 request 域中的 msg 信息
    // @RequestAttribute(value="msg", required=false) // required 参数是否必须存在（默认 true）
    return msg;
}
```

## 乱码问题：

在 web.xml 中添加过滤器即可，springmvc 提供了字符编码过滤器，也可使用自定义的过滤器：

```xml
<!-- 字符编码过滤器，必须放在所有过滤器(Filter)之前 -->
<filter>
    <filter-name>characterEncodingFilter</filter-name>
    <filter-class>
        org.springframework.web.filter.CharacterEncodingFilter
    </filter-class>
    <!-- 指定要使用的字符编码级 -->
    <init-param>
        <param-name>encoding</param-name>
        <param-value>utf-8</param-value>
    </init-param>
    <!-- 请求编码格式 -->
    <init-param>
        <param-name>forceRequestEncoding</param-name>
        <param-value>true</param-value>
    </init-param>
    <!-- 响应编码格式 -->
    <init-param>
        <param-name>forceResponseEncoding</param-name>
        <param-value>true</param-value>
    </init-param>
</filter>
<!-- 拦截所有请求设置编码格式 -->
<filter-mapping>
    <filter-name>characterEncodingFilter</filter-name>
    <url-pattern>/*</url-pattern>
</filter-mapping>
```

