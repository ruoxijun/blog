---
title: ssm 整合
date: 2020-10-06 16:31:14
categories: SpringBoot
tags: 
    - spring
    - springmvc
    - mybatis
    - ssm
---

# SSM 整合

### 依赖归纳与资源过滤：

#### 1.依赖：*更新于：2020年8月29日16:56:27*

```xml
<dependencies>
    <!-- Spring springmvc -->
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-webmvc</artifactId>
        <version>5.2.8.RELEASE</version>
    </dependency>
    <!-- spring-jdbc -->
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-jdbc</artifactId>
        <version>5.2.8.RELEASE</version>
    </dependency>
    <!-- spring aop切面编程 -->
    <dependency>
        <groupId>org.aspectj</groupId>
        <artifactId>aspectjweaver</artifactId>
        <version>1.9.6</version>
        <scope>runtime</scope>
    </dependency>

    <!-- Mybatis -->
    <dependency>
        <groupId>org.mybatis</groupId>
        <artifactId>mybatis</artifactId>
        <version>3.5.5</version>
    </dependency>
    <!-- mybatis整合spring的适配包 -->
    <dependency>
        <groupId>org.mybatis</groupId>
        <artifactId>mybatis-spring</artifactId>
        <version>2.0.5</version>
    </dependency>

    <!-- 数据库驱动 -->
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>8.0.21</version>
    </dependency>
    <!-- 数据库连接池 -->
    <dependency>
        <groupId>com.mchange</groupId>
        <artifactId>c3p0</artifactId>
        <version>0.9.5.5</version>
    </dependency>

    <!-- servlet 与 jsp -->
    <dependency>
        <groupId>javax.servlet</groupId>
        <artifactId>javax.servlet-api</artifactId>
        <version>4.0.1</version>
        <scope>provided</scope>
    </dependency>
    <dependency>
        <groupId>javax.servlet.jsp</groupId>
        <artifactId>javax.servlet.jsp-api</artifactId>
        <version>2.3.3</version>
        <scope>provided</scope>
    </dependency>
    <dependency>
        <groupId>jstl</groupId>
        <artifactId>jstl</artifactId>
        <version>1.2</version>
    </dependency>

    <!-- 测试 -->
    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.13</version>
        <scope>test</scope>
    </dependency>
    <!-- lombok -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <version>1.18.12</version>
    </dependency>
    <!-- jackson -->
    <dependency>
      <groupId>com.fasterxml.jackson.core</groupId>
      <artifactId>jackson-databind</artifactId>
      <version>2.11.2</version>
    </dependency>
</dependencies>
```

#### 2. pom.xml中Maven资源过滤设置：

```xml
<build>
   <resources>
       <resource>
           <directory>src/main/java</directory>
           <includes>
               <include>**/*.properties</include>
               <include>**/*.xml</include>
           </includes>
           <filtering>false</filtering>
       </resource>
       <resource>
           <directory>src/main/resources</directory>
           <includes>
               <include>**/*.properties</include>
               <include>**/*.xml</include>
           </includes>
           <filtering>false</filtering>
       </resource>
   </resources>
</build>
```

#### 3. 基本包结构：

- pojo
- mapper（dao）
- service
- controller

---



### Mybatis 层：

#### 1. 在resources中新建database.properties文件，准备连接数据库的数据（数据源）：

为了不引起配置混乱与数据源有关的配置都会添加 **jdbc**  的前缀。主要原因是**username**为Spring的key中的一个关键字（系统用户名）。

```properties
jdbc.driver=com.mysql.cj.jdbc.Driver
jdbc.url=jdbc:mysql://localhost:3306/test?useSSL=false&useUnicode=true&characterEncoding=utf8&serverTimezone=GMT%2B8
jdbc.username=root
jdbc.password=88888888
```

#### 2. resources中新建mybatis-config.xml配置mybatis：

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <!-- 设置 -->
    <settings>
        <!-- 开启驼峰命名自动映射 -->
        <setting name="mapUnderscoreToCamelCase" value="true"/>
    </settings>
    <!-- 给pojo包的所有类取别名 -->
    <typeAliases>
        <package name="ruoxijun.pojo"/>
    </typeAliases>
    <!-- 注册Mapper.xml -->
    <mappers>
        <mapper class="ruoxijun.mapper.BookMapper"/>
    </mappers>
</configuration>
```

#### 3. 为数据库表编写pojo类。

#### 4. 编写Mapper接口和Mapper.xml书写数据语句。

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="绑定接口">
</mapper>
```

#### 5. 编写service层：

首先需要定义service接口，接口中定义与Mapper接口对应的方法。再编写ServiceImpl类（service接口的实现类），类中关联Mapper对象（定义一个Mapper成员变量，并添加set方法）实现方法中利用Mapper调用具体方法。

---



### Spring 层：

#### 1. resources中新建spring-dao.xml配置Spring整合Mybatis：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/context https://www.springframework.org/schema/context/spring-context.xsd">
    <!-- 1.关联数据库配置文件 -->
    <context:property-placeholder location="classpath:database.properties" />
    <!-- 2.连接池，这里使用c3p0。
        spring文章中使用了spring原生数据源 -->
    <bean id="dataSource" class="com.mchange.v2.c3p0.ComboPooledDataSource">
        <property name="driverClass" value="${jdbc.driver}" />
        <property name="jdbcUrl" value="${jdbc.url}" />
        <property name="user" value="${jdbc.username}" />
        <property name="password" value="${jdbc.password}" />
        <!-- c3p0连接池的私有属性 -->
        <property name="maxPoolSize" value="30"/>
        <property name="minPoolSize" value="10"/>
        <!-- 关闭连接后不自动commit -->
        <property name="autoCommitOnClose" value="false"/>
        <!-- 获取连接超时时间 -->
        <property name="checkoutTimeout" value="10000"/>
        <!-- 当获取连接失败重试次数 -->
        <property name="acquireRetryAttempts" value="2"/>
    </bean>
    <!-- 3.sqlSessionFactory -->
    <bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
        <!-- 注入数据库连接池 -->
        <property name="dataSource" ref="dataSource"/>
        <!-- 配置MyBaties全局配置文件:mybatis-config.xml -->
        <property name="configLocation" value="classpath:mybatis-config.xml"/>
    </bean>
    <!-- 4.配置扫描Dao包，动态实现Mapper接口的实现注入到spring容器中 -->
    <bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
        <!-- 注入sqlSessionFactory -->
        <property name="sqlSessionFactoryBeanName" value="sqlSessionFactory"/>
        <!-- 扫描Mapper接口的实现，并注入到ioc容器中 -->
        <property name="basePackage" value="ruoxijun.mapper"/>
    </bean>
</beans>
```

之前spring的文章中整合mybatis时需要新建类MapperImpl实现Mapper接口，这里的第 **4** 步扫描包便是帮我们做好了此步。也可以选择手动实现。

#### 2. resources中新建spring-service.xml配置service层：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
   http://www.springframework.org/schema/beans/spring-beans.xsd
   http://www.springframework.org/schema/context
   http://www.springframework.org/schema/context/spring-context.xsd">
    <!-- 扫描service相关的bean -->
    <context:component-scan base-package="ruoxijun.service" />
    <!--BookServiceImpl注入到IOC容器中-->
    <bean id="bookServiceImpl" class="ruoxijun.service.BookServiceImpl">
        <property name="bookMapper" ref="bookMapper"/>
    </bean>
    <!-- 配置事务管理器 -->
    <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <!-- 控制数据源 -->
        <property name="dataSource" ref="dataSource" />
    </bean>
</beans>
```

---



### Spring MVC 层：

#### 1. resources中新建spring-mvc.xml配置mvc：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:mvc="http://www.springframework.org/schema/mvc"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
   http://www.springframework.org/schema/beans/spring-beans.xsd
   http://www.springframework.org/schema/context
   http://www.springframework.org/schema/context/spring-context.xsd
   http://www.springframework.org/schema/mvc
   https://www.springframework.org/schema/mvc/spring-mvc.xsd">
    <!-- 1.开启SpringMVC注解驱动 -->
    <mvc:annotation-driven />
    <!-- 2.静态资源默认servlet配置-->
    <mvc:default-servlet-handler/>
    <!-- 3.扫描web相关的bean -->
    <context:component-scan base-package="ruoxijun.controller" />
    <!-- 4.配置jsp 显示ViewResolver视图解析器 -->
    <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <!-- JstlView可以解析jsp页面中的JSTL标签 -->
        <property name="viewClass" value="org.springframework.web.servlet.view.JstlView" />
        <property name="prefix" value="/WEB-INF/jsp/" />
        <property name="suffix" value=".jsp" />
    </bean>
</beans>
```

#### 2. resources中新建applicationContext.xml配置Spring整合文件：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd">
    <import resource="classpath:spring-dao.xml"/>
    <import resource="classpath:spring-service.xml"/>
    <import resource="classpath:spring-mvc.xml"/>
</beans>
```

#### 3. 配置web.xml：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">
    <!-- springmvc控制器，拦截请求 -->
    <servlet>
        <servlet-name>dispatcherServlet</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <!-- 启动spring容器 -->
        <init-param>
            <param-name>contextConfigLocation</param-name>
            <!-- 载入spring总配置文件 -->
            <param-value>classpath:applicationContext.xml</param-value>
        </init-param>
        <!-- 启动级别 -->
        <load-on-startup>1</load-on-startup>
    </servlet>
    <!-- 配置拦截所有的请求 -->
    <servlet-mapping>
        <servlet-name>dispatcherServlet</servlet-name>
        <url-pattern>/</url-pattern>
    </servlet-mapping>

    <!-- 字符编码过滤器，必须放在所有过滤器之前 -->
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
</web-app>
```

对于springmvc控制器中的**启动spring容器**配置可单独分离出来配置(不推荐)：

```xml
<context-param><!-- 设置配置文件位置 -->
    <param-name>contextConfigLocation</param-name>
    <param-value>classpath:applicationContext.xml</param-value>
</context-param>
<listener><!-- 配置spring监听器，默认加载WEB-INF目录下的applicationContext.xml -->
    <listener-class>
        org.springframework.web.context.ContextLoaderListener
    </listener-class>
</listener>
```
