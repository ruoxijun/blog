---
title: spring 基础
date: 2020-08-14 8:55:10
categories: SpringBoot
tags: 
    - spring
    - ioc
    - 工厂模式
    - 动态工厂
---

# Spring 入门

>   框架：对高通用性可重用代码进行高质量抽取的一种设计，形成多个可重用的模块集合后而组成对某个领域整体的解决方案。
>
>   框架编程流程：导包、编写配置、测试、编写业务。

## Spring 简介：

* Spring 是一个开源免费，轻量级，非入侵式的框架
* 重点核心：控制反转（ **IOC** )，面向切面编程（ **AOP** ） 
* 支持事务的处理，对其他框架整合支持
* **弊端** ：配置十分繁琐，人称 “配置地狱”

## Spring组成：

Spring 框架是一个分层架构，由 7 个定义良好的模块组成。

![Spring 框架是一个分层架构，由 7 个定义良好的模块组成。](/images/java/spring_framework.gif)

### 添加 Spring 依赖：

由上可知Spring分为许多模块，在使用Spring时我们选择导入 **`spring-webmvc`** 依赖。此包中包含了多数我们需要使用的模块。

```xml
<!-- https://mvnrepository.com/artifact/org.springframework/spring-webmvc -->
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-webmvc</artifactId>
    <version>5.2.8.RELEASE</version>
</dependency>
```

## IOC（控制反转）：

>   IOC：Inversion Of Control 控制反转

控制反转将对象的创建交给了IOC容器，**IoC是有专门一个容器来创建这些对象，即由Ioc容器来控制对象的创建**。

Spring在初始化时先读取配置文件，根据配置文件创建对象并存入**IOC容器**，根据使用再从**IOC容器**中取出需要的对象，即获取对象的方式反转了。

## 简单入门实例：

### 1. 定义两个类：

```java
@Data //使用了 lombok 注解快速生成了必要方法
@AllArgsConstructor
@NoArgsConstructor
public class Hello {
    private String str; // 一个字符串
    private Hi hi; // 一个对象
}
```

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Hi {
    private String str;
}

```

### 2. 在 resources 文件夹中创将 Bean 配置文件：

在 resources 文件夹下创建 **`applicationContext.xml`** （推荐命名，也可以自定义命名）文件，此文件也称之为 **bean** 文件因为其内部的一个`bean`标签就表示一个对象。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!-- bean文件的文件头标签与申明 -->
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd">
    <!-- bean：对象配置标签
         id：唯一标识符
         class：对象的全限定名 -->
    <bean id="hi1" class="io.github.ruoxijun.pojo.Hi"/>
    <bean id="hi2" class="io.github.ruoxijun.pojo.Hi">
        <!-- property：属性赋值，该成员变量必须有set方法(set注入)
             name：对应对象的某一属性（根据set方法决定，
             与类中属性的名无关，它是set后首字母小写相关联）
             value：为该属性赋值（只能是基本类型或String值） -->
        <property name="str" value="World"/>
    </bean>

    <!-- name：当前对象别名，且可使用“,”逗号“;”分号或者空格三种分隔符取多个别名 -->
    <bean id="hello" class="io.github.ruoxijun.pojo.Hello" name="Hello">
        <property name="str" value="property"/>
        <!-- ref：为成员对象引用bean对象，值为bean的id或别名 -->
        <property name="hi" ref="hi2"/>
    </bean>

    <!-- 给bean（对象）取别名，不常用
         name：需要取别名bean的id
         alias：别名 -->
    <alias name="hello" alias="helloAlias"/>
</beans>
```

### 3. 编写测试类：

spring 中有一个接口 **ApplicationContext** 它就代表 IOC 容器接口，它的实现类可以帮我们来获取对象。

xml 配置对象（bean），可以通过 **ClassPathXmlApplicationContext** 类来获取。它会获取resources文件夹下指定的xml配置文件，所以传入参数时请以resources为根目录传入bean文件的完整路径名。

```java
/**
 * 1. 通过bean文件(xml)获取Spring上下文对象，可传入多个bean文件用“,”分隔。
 * 2. 容器启动前所有的bean实例化为对象，后存入容器了，等待被调用（getBean）。
 * 3. new FileSystemXmlApplicationContext("绝对路径");//配置文件在其它位置时可使用此类
 */
ApplicationContext context = new ClassPathXmlApplicationContext("bean.xml");
// 上方代码执行后 bean.xml 内的 bean 对象已创建完成。

// 通过 getBean 方法取出对象，并且返回的是Object类型
System.out.println(context.getBean("hi1"));

// getBean 传入bean的id（或则别名）作为参数，获取对应的对象
Hello hello1 = (Hello) context.getBean("hello"); // id 获取

//类型获取，只能存在一个该类型的bean时才能成功。否则报错
// User user = context.getBean(User.class); //类型获取

// 参2传入对象对应类型的类对象，将返回对应类型(参1也可以是id)
Hello hello2 =context.getBean("Hello",Hello.class); // 别名获取
System.out.println(hello1+"\n"+hello2);

// getBean同一个bean拿到的是同一个对象（spring默认是单例的）
System.out.println(hello1==hello2);
```

测试结果：

```java
Hello(str=property, hi=Hi(str=World))
Hello(str=property, hi=Hi(str=World))
true
```

###  4. import 关联配置文件：

此外我们在了解一下**bean文件导入**。如我们将入门案例中bean的 `hi1` 与 `hi2` 对象（标签）移到新建名为**`hi.xml`**的bean文件中再回到**`applicationContext.xml`**添加如下配置引入`hi.xml`。不改变其它内容你会发现程序一切正常，这说明我们将`hi.xml`中的bean成功引入到了**`applicationContext.xml`**中：

```xml
<!-- import：导入其他的bean文件，resource：文件的相对路径
    当有多个bean文件时，可在一个主bean文件中，使用import导入合并其它需要的bean。
    当多个bean的id或者别名重名时后导入的会覆盖先导入的。 -->
<import resource="hi.xml"/>
```

## DI（依赖注入，反射赋值）：

>   DI：Dependency Injection 依赖注入

### 1.构造器注入：

使用有参构造器创建对象则需要在 **bean** 中需要使用 **`constructor-arg`** 标签，根据属性不同分为三种方式。

*  利用下标：

```xml
<bean id="hello" class="io.github.ruoxijun.pojo.Hello" name="Hello">
    <!-- 通过构造方法构造对象，下标锁定
          index下标值从0开始，即构造函数参数的下标 -->
    <constructor-arg index="0" value="constructor-arg-index"/>
    <constructor-arg index="1" value="h2"/>
</bean>
```

* 利用类型：

```xml
<bean id="hello" class="io.github.ruoxijun.pojo.Hello" name="Hello">
    <!-- 类型锁定：type除基本类型，其它类型均写全限定名
          通过构造器参数的类型并赋值，来指定构造器创建对象 -->
    <constructor-arg type="java.lang.String" value="constructor-arg-type"/>
    <constructor-arg type="io.github.ruoxijun.pojo.Hi" value="h2"/>
</bean>
```

* 利用参数名称（常用）：

```xml
<bean id="hello" class="io.github.ruoxijun.pojo.Hello" name="Hello">
    <!-- 参数名锁定：name利用构造器参数的变量名称来锁定构造器，创建对象 -->
    <constructor-arg name="str" value="constructor-arg-name"/>
    <constructor-arg name="hi" ref="hi2"/>
</bean>
```

* 了解直接赋值，此方式需严格按照构造器参数顺序赋值：

```xml
<bean id="hello" class="io.github.ruoxijun.pojo.Hello" name="Hello">
    <!-- 按顺序给构造器属性赋值，也可以搭配index，type等属性来辅助赋值 -->
    <constructor-arg value="constructor-arg-name"/>
    <constructor-arg ref="hi2"/>
</bean>
```

对于重载的构造器需要可能需要使用多个属性来进行指定赋值，最方便的方式就是通过 **name** 属性赋值。

### 2. Set 注入（重点）：

之前我们已经学过了两种类型的Set注入：

```xml
<bean id="address" class="io.github.ruoxijun.pojo.Address">
    <property name="address" value="values"/>
</bean>

<bean id="user" class="io.github.ruoxijun.pojo.User">
    <!-- 1.基本类型与String类型利用 value 注入 -->
    <property name="name" value="若惜君"/>
    <!-- 2.bean创建的对象利用 ref 引用bean，值为bean对象的id -->
    <property name="address" ref="address"/>
    <!-- 除 ref 引用外，还可以利用内部 bean 实现对象注入(了解) -->
    <property name="address">
        <!-- 注意：内部bean只能在内部使用，外部无法引用该bean -->
        <bean class="io.github.ruoxijun.pojo.Address"></bean>
    </property>
</bean>
```

其它类型的Set注入( **除字符串和基本类型以外其它所有的复杂类型都在 property 标签内进行** )：

```xml
<bean id="user" class="io.github.ruoxijun.pojo.User">
    <!-- 3.array标签数组注入，value为每一项的值 -->
    <property name="arrs">
        <array>
            <value>index0</value>
            <value>index1</value>
        </array>
    </property>
    
    <!-- 4.list标签list集合注入，value为每一项的值 -->
    <property name="list">
        <list>
            <value>listValue</value>
            <!-- 如需对象可使用bean，<ref bean="beanId"/>等标签 -->
        </list>
    </property>
    
    <!-- 5.map标签map集合注入，entry中有key和value属性添加值 -->
    <property name="map">
        <map>
            <entry key="key" value="value"/>
            <!-- value-ref（key-ref）属性可引用bean对象，也可使用内部bean。 -->
        </map>
    </property>
    
    <!-- 6.set标签set集合注入，一个value为一项元素 -->
    <property name="set">
        <set>
            <value>setValue</value>
        </set>
    </property>
    
    <!-- 7.property -->
    <property name="pro">
        <props>
            <prop key="key">value</prop>
        </props>
    </property>
    
    <!-- 8.空字符串和null值 -->
    <!-- 空字符串值：<property name="empty" value=""/> -->
    <property name="empty">
        <null/>
    </property>
    
    <!-- 级联属性赋值（了解） -->
    <bean id="user" class="ruoxijun.pojo.User">
        <property name="book" ref="book"/><!-- 引用对象 -->
        <property name="book.name" value="myBook"/><!-- 改变引用对象属性的值 -->
    </bean>
    
    <!-- 配置信息重用，内容基本一致只有少部分属性需要修改 -->
    <bean id="user2" class="ruoxijun.pojo.User" parent="user">
        <!-- 在此配置需要修改的属性即可 -->
    </bean>
    <!-- 还可配置设置模板，bean中使用 abstract="true" 属性，
         表示这个配置是抽象的不能获取实例。其它的bean通过parent属性即可使用该模板 -->
    
    <!-- bean对象默认是根据配置文件中的先后顺序创建的，如我们有些类想指定在某些类
         创建之后创建可以通过 depends-on="id,id2" 属性，即指定的bean创建后该bean
         才会被创建。 -->
</bean>
```

### 3. p 命名和 c 命名空间注入：

p和c命名空间实则就是对 `property` 和 `constructor-arg` 标签的简化使用，同时它们的作用还能防止出现标签重复。

* **p命名空间属性注入**：

要使用**p命名空间注入**需要在bean文件的头标签（beans）中添加如下属性值（IDEA中可自动生成）：

```xml
xmlns:p="http://www.springframework.org/schema/p"
```

之前注入是利用`property`对应的name和values属性：

```xml
<bean id="address" class="io.github.ruoxijun.pojo.Address">
    <property name="address" value="values"/>
</bean>
```

开启p命名空间后bean中会多出一种p属性，“:”后面跟上此类中可set注入的属性名进行赋值：

```xml
<bean id="address" class="io.github.ruoxijun.pojo.Address" p:address="value" p:**="***"/>
<!-- 可存在多个p属性值，根据bean类的属性而定。对象引用bean对象需要使用 p:属性名-ref="bean的id" -->
```

* **c命名空间构造器注入**：

同理需要在bean文件的头标签（beans）中添加开启**c命名空间注入**的属性值：

```xml
xmlns:c="http://www.springframework.org/schema/c"
```

使用同理：

```xml
<bean id="address" class="io.github.ruoxijun.pojo.Address" c:address="value"/>
```

## bean 作用域：

之前 **`getBean` 同一个 bean 时拿到的是同一个对象** ，这是因为 **bean作用域** 问题。bean的 **scope** 属性默认值为 **singleton** 也就是 **单例模式** ，所有我们拿到的对象始终是同一个的原因。

```xml
<bean id="hi" class="io.github.ruoxijun.pojo.Hi" scope="singleton"/>
```

我们通过改变**scope**属性值来改变bean的作用域，它的值有一下几种：

```java
singleton // 单例模式，Spring默认模式（容器启动完成之前创建对象存入容器）
prototype // 原型模式，每一次getBean创建一个对象
// 以下不常用
request // 同一次请求，创建一个bean
session // 同一次回话，创建一个bean
application
websocket
```

## Spring与工厂模式：

>   *   工厂模式：创建一个类的实例需要配置许多繁杂的属性时，我们可以通过工厂模式来完成类的创建并通过工厂的方法来获取该类的实例。在工厂类中对每个实例做了默认配置，我们只需修改我们需要的属性即可。
>   *   静态工厂：不用创建工厂本身对象，通过静态方法调用获取对象实例
>       *   对象=工厂类.获取实例静态方法名();
>   *   动态工厂：需要创建工厂本身对象，调用工厂方法获取对象实例
>       *   工厂类对象=new 工厂类(); 对象=工厂类对象.获取实例方法名();

### 1. 静态工厂：

```xml
<!-- 静态工厂：
    class：指定工厂类
    factory-method：指定工厂中获取实例的方法
    利用constructor-arg给方法传递参数，只有一个参数时无需name属性
    该工厂bean获取到的对象为实例对象 -->
<bean id="staticFactory" class="ruoxijun.pojo.AirPlaneStaticFactory"
      factory-method="getAirPlane">
    <constructor-arg name="jz" value="李四"/>
</bean>
```

### 2. 动态工厂：

```xml
<!-- 动态工厂（实例工厂）
     1. 先注册实例工厂bean，
     2. 再注册工厂对应的实例bean，
        class：工厂生产的对象的class
        factory-bean：指定使用的工厂bean
        factory-method：指定工厂中获取实例的方法
        如方法需传参利用constructor-arg传递 -->
<bean id="instanceFactory" class="ruoxijun.pojo.AirPlaneInstanceFactory"/>
<!-- 该bean获取到的对象为上工厂bean指针的实例对象 -->
<bean id="airPlane" class="ruoxijun.pojo.AirPlane"
      factory-bean="instanceFactory" factory-method="getAirPlane">
    <constructor-arg name="jz" value="王五"/>
</bean>
```

### 3. FactoryBean：

Spring中实现了 **FactoryBean接口** 的类spring会自动识别为工厂类，spring会自动调用工厂方法创建实例。 **FactoryBean泛型** 为你需要创建的对象

```java
// FactoryBean<AirPlane> 中的泛型为你需要此工厂类为你创建实例的类型
public class AirPlaneFactoryBean implements FactoryBean<AirPlane> {
    @Override // 返回创建对象
    public AirPlane getObject() throws Exception {
        return new AirPlane();
    }
    @Override // 返回创建对象的类型
    public Class<AirPlane> getObjectType() {
        return AirPlane.class;
    }
    @Override // 是否为单例模式
    public boolean isSingleton() {
        return false;
    }
}
```

最终在使用时该bean会自动调用 getObject 方法获取实例对象。

```xml
<bean id="factoryBean" class="ruoxijun.pojo.AirPlaneFactoryBean"/>
```

注意该类 isSingleton 无论是否单例都只会在获取该bean时（getBean）才会 **创建实例对象** 。

## 创建带生命周期方法的bean：

*   在类中定义两个要作为生命周期的方法，方法名和返回值都可以随意，但此方法 **参数必须为空** 。

```java
// 在构造方法之后执行
public void init() { System.out.println("初始化时"); } 
// 单例：ioc容器关闭时 多例：不调用此方法
public void destroy() { System.out.println("销毁时"); }
```

*   配置bean并指定初始和销毁方法

```xml
<!-- init-method：指定初始化时的方法
    destroy-method：指定销毁时的方法 -->
<bean id="classId" class="ruoxijun.pojo.类"
      destroy-method="destroy" init-method="init"></bean>
```

## Spring 后置处理器：

spring中实现 **BeanPostProcessor** 接口的类并注册为bean后被自动识别为后置处理器。该类的两个监控方法会在Spring初始化每一个bean时调用。

```java
public class MyBeanPostProcessor implements BeanPostProcessor {
    @Override // 初始化之前，参1 当前bean对象，参2bean对象name
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        System.out.println("初始化之前");
        return bean;
    }
    @Override // 初始化之后，参1 当前bean对象，参2bean对象name
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        System.out.println("初始化之后");
        return bean;
    }
}
```

### bean 生命周期总结：

`构造器` → `后置处理器before` → `init-method(初始化方法)` → `初始化完成` → `后置处理器after` → `(容器关闭)destroy-method(销毁方法)`

## 自动装配（autowire）：

有如下三个类：

```java
@Data
public class Cat { // 猫
    private String name;
}
@Data
public class Dog { // 狗
    private String name;
}
@Data
public class People { // 人（同时管理猫和狗）
    private Cat cat;
    private Dog dog;
    private String name;
}
```

在bean文件中进行配置：

```xml
<bean id="cat" class="ruoxijun.pojo.Cat" p:name="猫"/>
<bean id="dog" class="ruoxijun.pojo.Dog" p:name="狗"/>
<!-- 配置人和动物类 -->
<bean id="people" class="ruoxijun.pojo.People">
    <property name="name" value="若惜君"/>
    <property name="cat" ref="cat"/>
    <property name="dog" ref="dog"/>
</bean>
```

bean中提供了一种属性 **autowire** 来帮我们管理像上方这种简单的关系：

```xml
<bean id="people" class="ruoxijun.pojo.People" autowire="byName">
    <property name="name" value="若惜君"/>
</bean>
```

这种方式会根据我们选的模式自动匹配对象对应的成员值，这里的 **byName** 模式表示 **根据对象的成员变量名和bean文件中bean的id进行匹配** ，没找到赋值为null， **byName** 要保证变量名与bean的id一致。

此外还有一种模式 **byType** ， **根据对象中成员变量的类型与bean文件中bean的类型进行匹配** ：

```xml
<bean id="people" class="ruoxijun.pojo.People" autowire="byType">
    <property name="name" value="若惜君"/>
</bean>
```

 **byType **模式有必要保证匹配的类型在bean文件中全局 **唯一** ，即需匹配类型在bean文件中有两个同类型的bean时将无法匹配并且 **报错** ，没有时赋值为null。

Spring还提供了 **constructor** 自动赋值利用构造器赋值，它先按照 **类型自动装配** 存在多个时再按照 **id属性名** 装配，不存在赋值为null：

```xml
<bean id="people" class="ruoxijun.pojo.People" autowire="constructor">
    <property name="name" value="若惜君"/>
</bean>
```