---
title: struts2速览
date: 2021-09-06 20:49:40
categories: Java
tags: 
    - struts2
    - ssh
---

# struts2速览

## 1. 环境搭建：

### 1. 导入Struts依赖：

```xml
<!-- https://mvnrepository.com/artifact/org.apache.struts/struts2-core -->
<dependency>
    <groupId>org.apache.struts</groupId>
    <artifactId>struts2-core</artifactId>
    <version>2.5.26</version>
</dependency>
```

### 2. web.xml配置：

```xml
<!-- struts2 核心过滤器 -->
<filter>
    <filter-name>struts2</filter-name>
    <filter-class>org.apache.struts2.dispatcher.filter.StrutsPrepareAndExecuteFilter</filter-class>
</filter>
<!-- 过滤所有请求 -->
<filter-mapping>
    <filter-name>struts2</filter-name>
    <url-pattern>/*</url-pattern>
</filter-mapping>
```

### 3. action书写类：

在Struts中所有的请求都对应了一个 `action` 的方法，通过方法的返回值映射相应的 `result` 处理请求：

```java
public class HelloAction implements Action {
    @Override
    public String execute() throws Exception {
        System.out.println("action");
        return SUCCESS; // 表示请求成功
    }
}
```

*   在action类中可定义与请求数据中同名的成员来接收请求中的数据。也可定义对象成员变量来接收请求数据，需要请求中的数据是以 `成员对象变量名.属性` 的形势来封装的。最重要的一点是接收数据的成员变量需要有 `set/get` 方法。

*   同理需要接收页面表单数据时只需设置好表单元素的 `name` ，再在action中给接收表单各元素数据的变量设置与表单元素name对应的变量名并添加 set/get 方法，即可自动接收表单数据。

### 4. 核心配置文件struts.xml：

在 `resources` 文件夹中新建 `struts.xml` 文件并如下配置：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!-- struts 文件头 -->
<!DOCTYPE struts PUBLIC
        "-//Apache Software Foundation//DTD Struts Configuration 2.5//EN"
        "http://struts.apache.org/dtds/struts-2.5.dtd">
<struts> <!-- 最外层标签 -->
    <!-- 包裹各种action -->
    <package name="default" extends="struts-default">
        <!-- 设置一个请求 -->
        <action name="index" class="cn.ruoxijun.action.HelloAction">
            <!-- 响应的页面 -->
            <result name="success">/index.jsp</result>
        </action>
    </package>
</struts>
```

访问 `项目路径/index` 或 `项目路径/index.action` 。

## 2. Action 类：

*   Action 是 Struts2的核心业务类，使用Struts2编写action类通常都需要实现 `com.opensymphony.xwork2.Action` 接口并实现它的 `execute` 方法。
*   Struts2 中不需要类实现action接口，可以直接编写一个普通类作为action。只要求业务方法实现一个返回类型为string的无参方法即可。
*   Struts2中不在推荐实现action接口，推荐去继承 `com.opensymphony.xwork2.ActionSupport` 类。 `ActionSupport` 类实现了action接口和许多接口，提供了输入验证，错误信息，国际化等等功能的支持。

action 源码：

```java
public interface Action {
    String SUCCESS = "success"; // 请求成功
    String NONE = "none"; // 找不到结果
    String ERROR = "error"; // 发生异常
    String INPUT = "input"; // 输入参数有误
    String LOGIN = "login"; // 登录

    String execute() throws Exception;
}
```

action是通过配置文件中action标签配置的方法的字符串返回值，对应result标签的name值来找到相应的result处理结果。在action接口中为我们提供5个常用的结果常量。

## 3. Struts.xml 配置：

### 1. constant 常用配置：

```xml
<!-- 设置请求后缀，设置后原来的action后缀和不要后缀的方式就不生效了 -->
<constant name="struts.action.extension" value="do,html,jsp" />
<!-- 设置编码（Struts2 默认utf-8编码） -->
<constant name="struts.i18n.encoding" value="utf-8" />
```

### 2. package ：

```xml
<package name="default" namespace="/" extends="struts-default"></package>
```

*   package：是一种包的概念，将同一业务的action请求集中到一个包中方便管理，并且不同的包是可以被继承的。

    *   name：是包的名字，一个Struts.xml文件中可以有很多个package，这些包通过name来区分。
    *   namespace：命名空间（可以理解为请求添加父路径）。
    *   extends：继承某包，通常继承 `struts-default` 因为它定义了大量的Struts特性。

*   package 中配置默认action，在找不到action时使用此默认action：

    *   ```xml
        <default-action-ref name="default"/>
        <action name="default">
            <result>error.jsp</result>
        </action>
        ```

### 3. action：

```xml
<action name="index" class="cn.ruoxijun.action.HelloAction" method="execute">
    <result name="success">/index.jsp</result>
</action>
```

*   action：配置请求和响应结果。
    *   name：action的请求路径和请求名。
    *   class：处理请求的类，全路径名。不写时默认使用 `ActionSupport` 作为请求处理类。
    *   method：类中处理请求的方法。不写时默认使用 `execute` 作为请求处理方法。
*   result：处理请求结果，标签中的值为要跳转的页面，一个action可以有多个result。
    *   name：action对应类对应方法的字符串返回值，不写时默认使用 `success` 作为值。

### 4. Result：

*   Result 跳转配置：

```xml
<!-- 页面跳转 -->
<!-- 默认 dispatcher 转发 -->
<result name="success" type="dispatcher">/index.jsp</result>
<!-- redirect 重定向 -->
<result name="success" type="redirect">/index.jsp</result>

<!-- action 跳转 -->
<!-- 重定向一个action（填写action地址而不再是页面地址） -->
<result name="success" type="redirectAction">index.action</result>
<!-- 重定向到不同包下的action -->
<result name="success" type="redirectAction">
    <!-- 跳转包的namespace -->
    <param name="namespace">/</param>
    <!-- 跳转的action，如定义了后缀需要 action.后缀 -->
    <param name="actionName">index.action</param>
    <!-- 可自定义name携带参数 -->
    <param name="var">1</param>
</result>
<!-- chain：转发到action，不需要写后缀直接action的name即可 -->
<result name="success" type="chain">index</result>
```

*   动态跳转：

```java
public String toAction; // 添加get/set方法
public String toAction(){
    // 可以根据需求去改变值
    toAction="index"; // 要跳转的页面前缀
    return SUCCESS;
}

<action name="toaction" class="cn.ruoxijun.action.HelloAction" method="toAction">
    <!-- 通过${toAction}来访问toAction的值 -->
    <result name="success">${toAction}.jsp</result>
</action>
```

*   package中配置全局结果

```xml
<global-results>
    <result name="success">/index.jsp</result>
</global-results>
```

所有result中方法返回值和name为success且跳转页面为index.jsp的result不用在action中再配置result。即默认所有action中有一个name为success的result跳转index，配置了的则覆盖此result。

