---
title: SpringBoot
date: 2020-08-29 16:31:14
categories: SpringBoot
tags: 
    - springboot
    - swagger
    - druid
feature: true
---

# SpringBoot

> SpringBoot 简化了 Spring 应用开发，约定大于配置，去繁从简，just run 就能创建一个独立的，产品级别的应用。
>
> SpringBoot2 要求 **java8** 及以上， **maven3.3** 及以上。（查看方式：java -version，mvn -v）
>
> 参考文档：[SpringBoot2 核心技术与响应式编程](https://www.yuque.com/atguigu/springboot)

## 简介

1.  快速创建独立运行的 Spring 项目以及与主流框架集成
2.  使用嵌入式的 Servlet 容器，应用无需打成 war 包
3.  starters 自动依赖与版本控制
4.  自动配置简化开发，无需配置 XML 开箱即用
5.  运行时应用监控与云计算的天然集成等

### 微服务简介

![微服务框架图](http://blog.cuicc.com/images/sketch.png)

*   架构风格（服务微化）
*   一个应用应该是一组小型服务，各个服务之间可以通过HTTP的方式进行互通关联
*   每一个功能元素最终都是一个可独立替换和独立升级的软件单元。

详细请参照：[微服务详解中文版](http://blog.cuicc.com/blog/2015/07/22/microservices/)

## 创建项目

### 1. 官网创建：

官方创建 SpringBoot 项目网址：[https://start.spring.io/](https://start.spring.io/)

![创建spring boot项目步骤](/images/java/springboot_start.jpg)

将下载下来的项目压缩包解压使用 IDEA 打开，我们就初始化成功了一个 spring boot 项目。

### 2. 手动创建：

参考地址：[Getting Started (spring.io)](https://docs.spring.io/spring-boot/docs/current/reference/html/getting-started.html#getting-started.first-application.code)

1.  使用 IDEA 创建一个普通 maven 项目
2.  在 pom.xml 中导入 SpringBoot 依赖

```xml
<parent> <!-- SpringBoot 父依赖 -->
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.7.2</version>
</parent>

<dependencies>
    <dependency> <!-- web 模块依赖 -->
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
</dependencies>
```

3.  编写主程序，启动 Spring Boot 应用：

新建 MainApplication 类作为主程序，类上使用 `SpringBootApplication` 注解表明它是 SpringBoot 的主程序。在类中创建 **main** 方法，并使用 `SpringApplication.run` 方法来启动 SpringBoot 项目。

```java
// 标注主程序类，说明这是一个 SpringBoot 应用
@SpringBootApplication
public class MainApplication {
    public static void main(String[] args) {
        // 启动spring应用，参1表示当前主程序类，参2为 main 方法的可变参数
        SpringApplication.run(MainApplication.class, args);
    }
}
```

4.  编写业务：

新建 controller 包，新建 HelloController 类(注意：SpringBoot 主程序与 controller包同级)

```java
@Controller
public class HelloController {
    @ResponseBody
    @RequestMapping("/hello")
    public String hello() {
        return "hello world";
    }
}
```

5.  运行主程序（MainApplication）的 main 方法启动 spring boot 应用，在浏览器访问 [http://localhost:8080/hello](http://localhost:8080/hello) 可以看到浏览器中返回了 **hello world** 的字样。

### 3. IDEA 创建：

* [Spring Initializr https://start.spring.io/](https://start.spring.io/) 连接不上时可以使用阿里镜像地址 ： [https://start.aliyun.com](https://start.aliyun.com/)

1.  选择初始化 spring 项目：

![选择初始化 spring 项目](/images/java/springboot/springboot01.jpg)

2.  项目配置：

![项目配置](/images/java/springboot/springboot02.jpg)

3.  选择项目依赖（这里选择 spring boot 的 web 模块依赖）

![添加依赖](/images/java/springboot/springboot03.jpg)

4.  点击 finish 创建项目：

![创建项目](/images/java/springboot/springboot04.jpg)

## 自动配置

### 依赖管理：

1. SpringBoot 中我们需要继承一个父项目 `spring-boot-starter-parent` 正是它来管理我们项目中的依赖，它也有一个父项目 `spring-boot-dependencies` 此项目中在 `properties` 内几乎声明了所有开发中常用依赖的所有版本号，这也被称之为 **自动版本仲裁机制** 。

2. 如需自定义依赖版本号需要在我们项目的 **pom.xml** 添加 `<properties></properties>` 配置，在父项目中找到你需要修改依赖的 **key** 重写配置即可。

3. SpringBoot 提供以很多 starter， `spring-boot-starter-*` * 代表了一个具体的场景。[SpringBoot 支持场景 Developing with Spring Boot](https://docs.spring.io/spring-boot/docs/current/reference/html/using.html#using.build-systems.starters)

4. SpringBoot 支持自定义 starter 官方建议取名 `*-spring-boot-starter` ，所以我们看见的此类 starter 一般都是第三方为我们提供的 starter。
5. 所有的 starter 场景都有一个底层依赖：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter</artifactId>
    <version>2.7.2</version>
    <scope>compile</scope>
</dependency>
```

### 初探自动配置：

以 web 场景为例：

1. 为我们引入并配置好了 Tomcat：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-tomcat</artifactId>
    <version>2.7.2</version>
    <scope>compile</scope>
</dependency>
```

2. 自动配置好了 SpringMVC 常用组件，以及 web 常用功能：

```java
@SpringBootApplication // 标记为主程序类
public class MainApplication {
    public static void main(String[] args) {
        // IOC 容器
        ConfigurableApplicationContext run = SpringApplication.run(MainApplication.class, args);
        // 查看容器中的组件
        String[] beanDefinitionNames = run.getBeanDefinitionNames();
        for (String beanDefinitionName : beanDefinitionNames) {
            // 输出组件，可以看见配置了的 springmvc 的常用组件
            System.out.println(beanDefinitionName);
        }
    }
}
```

3. 主程序（@SpringBootApplication）下的包及其子包默认被扫描，无需我们再手动配置包扫描。

```java
// 支持修改扫描包路径
@SpringBootApplication(scanBasePackages = "com.ruoxijun")
```

`@ComponentScan` 也能修改包扫描路径，但不支持与 SpringBootApplication 注解在同一类上。通过 `@SpringBootApplication` 源码可知：

```java
// @SpringBootApplication 由一下 3 个注解组成
@SpringBootConfiguration
@EnableAutoConfiguration
@ComponentScan
```

因此我们可以使用这三个注解来代替 SpringBootApplication 注解，一样可以实现 SpringBoot 功能。

4. 各种配置拥有默认值，且我们配置文件（application.properties）的配置最终都会绑定在某一个类上，这个类对象存储在 IOC 容器中。
5. 所有的自动配置项按需加载，我们引入了那个场景对应场景的自动配置才会开启。在 **spring-boot-starter** 包中引入了一个 **spring-boot-autoconfigure** 包 SpringBoot 所有的自动配置功能都在其中。

### 容器功能：

#### 1. @Configuration：

##### 使用:

* 使用 @Configuration 配置类注册组件：

```java
@Configuration // 标记为配置类(默认 Full 模式)
public class MyConfig {
    @Bean // 给容器中添加组件，以方法名作为组件 id，返回类型就是组件类型
    public User user() {
        // new User(pet()); // 组件依赖，调用方法也会从容器中获取 pet 组件
        return new User();
    }

    @Bean("tom") // 指定组件名
    public Pet pet() {
        return new Pet();
    }
}
```

* 在主程序类中检验并获取组件：

```java
// IOC 容器
ConfigurableApplicationContext run = SpringApplication.run(MainApplication.class, args);
// 获取组件
MyConfig myConfig = run.getBean("myConfig", MyConfig.class); // 配置类本身也是组件
User user = run.getBean("user", User.class); // 默认为单实例
User user1 = myConfig.user(); // user == user1
Pet tom = run.getBean(Pet.class);
```

* `@Configuration(proxyBeanMethods = false)` ：可以获取到单实例组件（Lite 模式）

##### Full 模式：

1. 标注有 `@Configuration` 或 `@Configuration(proxyBeanMethods = true)` 的类被称为Full模式的配置类。
2. 生成 CGLIB 子类，单例组件之间有依赖关系时使用，方便管理。每次都会在容器中查找是否有此组件（没有时创建并加入容器），效率较低。

##### Lite 模式：

1. 类上有 `@Component` 、 `@ComponentScan` 、 `@Import` 、 `@ImportResource` 、 `@Configuration(proxyBeanMethods = false)` 注解或类上没有任何注解，但是类中存在 `@Bean` 方法。
2. 运行时不用生成 CGLIB 子类，提高运行性能，降低启动时间，可以作为普通类使用。不方便管理组件之间的依赖关系。

#### 2. @Import：

* 可以作用在任意组件类的上方导入，值为任意类型组件数组，给容器中自动创建出对应类型的组件，默认组件的名字是全类名。

```java
@Import({User.class, Pet.class})
```

* @Import 高级用法： https://www.bilibili.com/video/BV1gW411W7wy?p=8

#### 3. @Conditional：

`@Conditional` 条件装配注解，当满足条件时装配组件。

```java
@Configuration // 标记为配置类
// 当容器中没有 id 为 tom 的组件时装配该配置类
@ConditionalOnMissingBean(name = "tom")
public class MyConfig {
    // 组件中存在 id 为 tom 的组件时，才装配 user 组件
    @ConditionalOnBean(name = "tom")
    @Bean
    public User user() {
        return new User();
    }

    @Bean("tom")
    public Pet pet() { return new Pet(); }
}
```

在主程序中使用 `run.containsBean("tom");` 检验是否存在某组件。

* 常见条件装配注解如下：

![创建spring boot项目步骤](/images/java/springboot/conditional.png)

#### 4. @ImportResource：

`@ImportResource` 允许我们导入 spring 的 xml 配置文件。

```java
// 在配置类上使用
@ImportResource("classpath:beans.xml") // 导入 resources 中的 beans.xml 配置文件
```

#### 5. 配置绑定：

读取 properties 文件中的内容，并且把它封装到 JavaBean 中。

##### 1. 原生 java 方法：

```java
public class getProperties {
     public static void main(String[] args) throws FileNotFoundException, IOException {
         Properties pps = new Properties();
         pps.load(new FileInputStream("a.properties"));
         Enumeration enum1 = pps.propertyNames();//得到配置文件的名字
         while(enum1.hasMoreElements()) {
             String strKey = (String) enum1.nextElement();
             String strValue = pps.getProperty(strKey);
             System.out.println(strKey + "=" + strValue);
             //封装到JavaBean。
         }
     }
 }
```

##### 2. 类已是组件：

* IDEA 中使用 ConfigurationProperties 编辑器可能会提示 `Spring Boot Configuration Annotation Processor not configured` 未配置 Spring 引导配置注释处理器，引入如下依赖即可：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-configuration-processor</artifactId>
    <optional>true</optional>
</dependency>

 <build>
     <plugins>
         <plugin>
             <groupId>org.springframework.boot</groupId>
             <artifactId>spring-boot-maven-plugin</artifactId>
             <configuration>
                 <excludes>
                     <exclude>
                         <groupId>org.springframework.boot</groupId>
                         <artifactId>spring-boot-configuration-processor</artifactId>
                     </exclude>
                 </excludes>
             </configuration>
         </plugin>
     </plugins>
</build>
```

1. 组件类上：

```java
@Component // 1. 声明为组件注册到容器中
@ConfigurationProperties(prefix = "mycar") // 2. 通过前缀绑定配置
public class Car {
    private String name;
    private int age;
    // 省略 get、set 方法
}
```

2. 配置属性：

```xml
mycar.name = MyCar
mycar.age = 18
```

* 组件中还支持 `@Value(${属性})` 方式注入

##### 3. 在配置类上开启：

1. 为类绑定前缀

```java
@ConfigurationProperties(prefix = "mycar") // 配置属性前缀
public class Car {}
```

2. 在配置类声明开启：

```java
@Configuration // 标记为配置类
// 开启 Car 属性配置功能，并将 Car 组件自动注册到容器中
@EnableConfigurationProperties(Car.class)
public class MyConfig {}
```

### 自动配置原理：

`@SpringBootApplication` 注解有以下 3 个主要注解构成：

```java
@SpringBootConfiguration
@EnableAutoConfiguration
@ComponentScan( // 指定扫描包
    excludeFilters = {@Filter(
    type = FilterType.CUSTOM,
    classes = {TypeExcludeFilter.class}
), @Filter(
    type = FilterType.CUSTOM,
    classes = {AutoConfigurationExcludeFilter.class}
)})
```

#### 1. @SpringBootConfiguration：

主要构成如下：

```java
@Configuration
@Indexed
```

`@SpringBootConfiguration` 表示 `@SpringBootApplication` 标记的类是一个配置类。

#### 2. @EnableAutoConfiguration：

`@EnableAutoConfiguration` 由以下两个注解构成：

```
@AutoConfigurationPackage
@Import({AutoConfigurationImportSelector.class})
```

1. @AutoConfigurationPackage:

自动配置包指定了默认的包规则，查看源码 `@Import({Registrar.class})` 可以发现它导入了一个 `Registrar` 组件，而查看这个组件源码可以发现它有一个方法会给容器注入一系列组件：

```java
public void registerBeanDefinitions(
    AnnotationMetadata metadata, // 注解原信息（注解标记位置、属性值...）
    BeanDefinitionRegistry registry) {
    // 将指定包下的所有组件导入
    AutoConfigurationPackages.register(registry,
        // 拿到项目包名（com.ruxijun），封装到一个字符串数组中
        (String[])(new AutoConfigurationPackages.PackageImports(metadata)).getPackageNames()
        .toArray(new String[0]));
}
```

* 由此可知 `@AutoConfigurationPackage` 作用是利用 `Registrar` 将 **主程序（@SpringBootApplication）** 包以及子包内的组件导入容器中。

2. AutoConfigurationImportSelector.class

查看 `AutoConfigurationImportSelector` 它会批量给容器导入一些组件：

```java
1. 利用 getAutoConfigurationEntry(annotationMetadata) 给容器中批量导入组件
2. 调用 getCandidateConfigurations(annotationMetadata, attributes) 获取到所有需要导入容器中的配置类
3. 利用工厂 SpringFactoriesLoader.loadFactoryNames 最终调用 Map<String, List<String>> loadSpringFactories(ClassLoader classLoader) 方法得到所有配置类
4. 加载文件 classLoader.getResources("META-INF/spring.factories") 默认扫描项目中所有 META-INF/spring.factories 位置文件
核心包 spring-boot-autoconfigure.jar 的 META-INF/spring.factories 文件中配置了项目启动就需要全部加载的不同场景的配置类
```

* 虽然 **一百多** 个场景的所有自动配置类启动的时候默认全部加载（xxxxAutoConfiguration），但它们还受条件装配规则限制（ **@Conditional** ），最终实现 **按需配置** 。

* 目前 2.7.1 版本文件位置： **META-INF/spring/%s.imports**

#### 3. 修改默认配置：

* 注册文件上传解析器组件源码

```java
// 该配置类上 @EnableConfigurationProperties({WebMvcProperties.class}) // 对应的可配置选项

@Bean
@ConditionalOnBean({MultipartResolver.class}) // 容器中有这个类型组件
@ConditionalOnMissingBean(name = {"multipartResolver"}) // 容器中没有此名称的组件
//给 @Bean 标注的方法传入了对象参数，这个参数的值就会从容器中寻找
public MultipartResolver multipartResolver(MultipartResolver resolver) {
    return resolver; // 这个方法防止用户配置的文件上传解析器名称不符合规范
}
```
* 注册字符编码过滤器组件源码

```java
// 该配置类上 @EnableConfigurationProperties({ServerProperties.class}) // 对应的可配置选项

@Bean
@ConditionalOnMissingBean
public CharacterEncodingFilter characterEncodingFilter() {
    // 对字符编码配置后返回对象加入到容器中...
}
```

由上可知 SpringBoot 默认会在底层配好所有的组件，但是如果用户自己配置了以用户的优先。因此我们想修改默认配置或定制化配置方法如下：

1. 在自己的配置文件中 `@bean` 替换需要修改的组件。
2. 通过查看配置类绑定了配置文件的哪些属性，在 properties 中修改配置值。

#### 4. 总结：

- SpringBoot先加载所有的自动配置类 xxxxxAutoConfiguration.class
- 每个自动配置类按照条件进行生效，默认都会绑定配置文件指定的值。 xxxxProperties.class 和配置文件进行了绑定。
- 生效的配置类就会给容器中装配很多相应场景的组件，并帮我们配置好组件相应功能。

## 配置文件

[配置属性文档 Common Application Properties (spring.io)](https://docs.spring.io/spring-boot/docs/current/reference/html/application-properties.html)

### 常用配置：

在 **resource** 文件夹中新建 **`application.properties`** 或者 **`application.yml`** 配置文件。

```properties
# 项目端口
server.port=8081
# 访问项目时的路径前缀
server.servlet.context-path=/bootTest
#数据源配置
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/test?useSSL=false&useUnicode=true&characterEncoding=utf8&serverTimezone=GMT%2B8
spring.datasource.username=root
spring.datasource.password=88888888
```

`properties` 转 `yml` ：[在线yaml与properties互转](https://www.toyaml.com/index.html)

### yml 配置方式：

1. 绑定配置项：

```java
@Component
@ConfigurationProperties(prefix = "user")
public class User {
    private String name;
    private int age;
    private Car car;
    private String[] arr;
    private List<String> list;
    private Set<String> set;
    private Map<String, Object> map;
    // get set toString...
}
```

2. yml 配置方式：

```yaml
user:
  # 如有驼峰命名属性建议使用 ‘-’ 加小写字母
  name: ruoxi # 字符串可不加引号，单引号会转义（\n）双引号不会转义
  age: ${random.int} # 支持表达式
  car: # { name: rouxiCar, age: 1 } # 对象行内写法（map、hash、object）
    name: rouxiCar
    age: 1
  arr: # [ 1, 2 ] # 数组行内写法（array、list、set、queue）
    - 1
    - 2
  list: [ 3, 4 ]
  set: [ 5, 6 ]
  map:
    a: { a: map }
    b: { b: map }
```

### 启动图标：

在线生成字符图标工具：

http://www.network-science.de/ascii/
http://patorjk.com/software/taag/

**推荐** ：

[Spring Boot banner在线生成工具，制作下载banner.txt，修改替换banner.txt文字实现自定义，个性化启动banner-bootschool.net](https://www.bootschool.net/ascii)

我们只需在 *resource* 文件夹下新建一个 **banner.txt** 文件，在该文本文件中粘贴你想要的SpringBoot启动时显示的字符图标就好了。

关闭图标：

```java
SpringApplication app = new SpringApplication(MainApplication.class);
app.setBannerMode(Banner.Mode.OFF);
app.run(args);
```

### 热部署：

>   idea需要的设置：
>
>   1.   file->settings->build->Build project automatically **勾选**
>   2.   file->settings -> Advanced Settings -> Allow auto-make to start even if developed application is currently running **勾选** （这是idea2020.2设置的位置其它版本请上网自查）

#### 1. pom.xml 配置：

```xml
<!-- 1. 添加热部署依赖 -->
<!-- https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-devtools -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <optional>true</optional><!-- 使继承的项目不会继承热部署 -->
</dependency>

<!-- 2. 在SpringBoot的打包插件中配置 -->
<build>
    <plugins>
        <plugin><!--将应用打包为一个可执行的jar包 -->
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <configuration> <!-- 热部署开启 -->
                <fork>true</fork>
            </configuration>
        </plugin>
    </plugins>
</build>
```

#### 2. 主配置文件配置：

```yaml
spring:
  devtools: # 热部署配置
    restart:
      enabled: true # 开启
      # 设置监听的目录
      additional-paths: src/main/java
      # 应付项目自动重启编译后404问题
      poll-interval: 3000
      quiet-period: 1000
```

**热部署快捷键 `Ctrl+F9`** 

### 打包：

#### jar 包：

添加插件将 spring boot 应用打包为可执行 jar 包并运行，pom.xml 中添加如下代码

```xml
<build>
    <plugins>
        <plugin><!-- 默认将应用打包为一个可执行的jar包 -->
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
    </plugins>
</build>
```

在打包的 jar 包位置使用 `java -jar 项目的jar文件名` 命令即可运行。

* 如不能成功请尝试关闭 cmd 快速编辑模式（右击 cmd 窗口点击属性）

#### war 包：

将文件打包为war包，在pom.xml中配置：

```xml
<!-- 设置打包类型为war -->
<packaging>war</packaging>
```

因为 SpringBoot 中默认内置 tomcat 服务器，我们需要将它内置的 tomcat 在打包时忽略掉因此在 pom.xml 的 **dependencies** 配置中添加：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-tomcat</artifactId>
    <scope>provided</scope>
</dependency>
```

最后在 SpringBoot 启动类中继承 `SpringBootServletInitializer` 类重写 `configure` 方法，之后打包即可：

```java
@SpringBootApplication
public class MainApplication extends SpringBootServletInitializer {
    public static void main(String[] args){
        SpringApplication.run(MainApplication.class,args);
    }
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return builder.sources(MainApplication.class);
    }
}
```

### Profile：

#### 环境配置：

* `application.properties` （yaml 同理）表示默认环境配置，SpringBoot 还支持我们开启和配置不同环境的配置文件。
* 自定义环境配置文件 `application-环境名称.yaml` ，常用配置环境名称有 **dev** 开发环境、 **test** 测试环境、 **prod** 生产环境。
* 默认配置文件与环境配置文件同时生效，且同名配置环境配置优先。

* 在 **`application.properties`** 默认配置文件中指定激活某环境配置：

```properties
spring.profiles.active=dev # 激活并使用 application-dev 中的配置
```

* 命令行开启方式 `java -jar 项目.jar --spring.profiles.active=prod  --person.name=haha` ，使用命令行方式修改配置属性（如这里还将 person.name 配置为了 haha）。

* 条件装配 `@Profile("test")` 该注解装配的类或方法在指定环境（如这是 test 环境）下才生效。
* 激活多个配置文件：

```properties
# 激活一组环境
spring.profiles.active= production
# spring.profiles.group.组名[脚标]=环境名
spring.profiles.group.production[0]=proddb
spring.profiles.group.production[1]=prodmq
```

* 配置文件位置(注意 1-5 数越大优先级越高)：

```java
(1) classpath 根路径
(2) classpath 根路径下 config 目录
(3) jar 包当前目录
(4) jar 包当前目录的 config 目录
(5) /config 子目录的直接子目录
```

### 自定义 starter

[原理解析 (https://www.yuque.com/atguigu/springboot/tmvr0e)](https://www.yuque.com/atguigu/springboot/tmvr0e)

## web 开发

### 静态资源：

#### 静态资源使用：

在 SpringBoot 中规定 **resources** 下的 `/META-INF/resources` 、 `/resources` 、 `/static`、 `/public` （同名文件按此优先级）等文件夹都可以存放静态资源我们只需按规定建立文件夹即可。

在配置文件中指定 resources 文件夹中的哪些文件夹为静态资源文件夹：

```yaml
spring:
  web:
    resources:
      # 指定静态资源文件夹，使用逗号分隔多个
      static-locations: classpath:/public/,classpath:/static/,classpath:/staticFile
```

* 访问方式： `项目根路径/资源路径名` （访问时不用加上static等静态文件夹的名作为路径一部分）

*   请求优先由 Controller 处理，没有相关请求时再寻找静态资源。因此静态资源中有与 Controller 相同的请求路径时由 Controller 处理，将不能请求到静态资源。

为静态资源设置访问前缀：

```yaml
spring:
  mvc:
    static-path-pattern: /static/** # 访问所有的静态资源都需要添加此路径前缀
```

*   SpringBoot 中默认静态资源文件夹下的 `index.html` 为首页（不推荐），直接访问项目根路径将访问到此页面（未设置静态资源访问前缀的情况下）。
*   设置网页图标只需在静态资源文件夹中添加名为 `favicon.ico` 的图片即可。

#### 自定义静态资源处理规则：

如我们需要访问指定位置的文件时可以如下配置：

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override // 添加静态资源处理规则
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 请求路径 （访问方式：项目路径/file/文件名）
        registry.addResourceHandler("/file/**")
                // 文件路径（项目 resources 文件夹下使用 class: 前缀）
                .addResourceLocations("file:E:\\myfile\\");
    }
}
```

#### 静态资源配置原理：

##### 1. WebMvcAutoConfiguration:

SpringBoot 启动时自动加载 xxxAutoConfiguration 类，其中 SpringMvc 功能的自动配置类 `WebMvcAutoConfiguration` 加载成功且生效：

```java
@AutoConfiguration(
    after = {DispatcherServletAutoConfiguration.class, TaskExecutionAutoConfiguration.class, ValidationAutoConfiguration.class}
)
@ConditionalOnWebApplication(
    type = Type.SERVLET
)
@ConditionalOnClass({Servlet.class, DispatcherServlet.class, WebMvcConfigurer.class})
@ConditionalOnMissingBean({WebMvcConfigurationSupport.class})
@AutoConfigureOrder(-2147483638)
public class WebMvcAutoConfiguration { ... }
```

##### 2. WebMvcAutoConfigurationAdapter：

在 WebMvcAutoConfiguration 有一个配置类 `WebMvcAutoConfigurationAdapter` ：

```java
@Configuration( proxyBeanMethods = false )
@Import({WebMvcAutoConfiguration.EnableWebMvcConfiguration.class})
@EnableConfigurationProperties({WebMvcProperties.class, WebProperties.class})
@Order(0)
public static class WebMvcAutoConfigurationAdapter implements WebMvcConfigurer, ServletContextAware {...}
```

* 这个类绑定了两个配置属性： WebMvcProperties.class = spring.mvc，WebProperties.class = spring.web
* 且这个配置类只有一个有参构造器，**当配置类只有一个有参构造器时所有的参数都会自动充容器里面找** ：

```java
// webProperties mvcProperties 获取配置绑定值的对象
// ListableBeanFactory beanFactory Spring 的 beanFactory
// HttpMessageConverters 找到所有的 HttpMessageConverters
// ResourceHandlerRegistrationCustomizer 找到 资源处理器的自定义器。=========
// DispatcherServletPath  
// ServletRegistrationBean 给应用注册 Servlet、Filter....
public WebMvcAutoConfigurationAdapter(
    WebProperties webProperties, WebMvcProperties mvcProperties,
    ListableBeanFactory beanFactory,
    ObjectProvider<HttpMessageConverters> messageConvertersProvider,
    ObjectProvider<WebMvcAutoConfiguration.ResourceHandlerRegistrationCustomizer> resourceHandlerRegistrationCustomizerProvider,
    ObjectProvider<DispatcherServletPath> dispatcherServletPath,
    ObjectProvider<ServletRegistrationBean<?>> servletRegistrations) {
    this.resourceProperties = webProperties.getResources();
    this.mvcProperties = mvcProperties;
    this.beanFactory = beanFactory;
    this.messageConvertersProvider = messageConvertersProvider;
    this.resourceHandlerRegistrationCustomizer = (WebMvcAutoConfiguration.ResourceHandlerRegistrationCustomizer)resourceHandlerRegistrationCustomizerProvider.getIfAvailable();
    this.dispatcherServletPath = dispatcherServletPath;
    this.servletRegistrations = servletRegistrations;
    this.mvcProperties.checkConfiguration();
}
```

##### 3. 静态资源处理规则：

在 WebMvcAutoConfigurationAdapter 配置类中有一个 `addResourceHandlers` 方法，它就是静态资源处理的默认规则：

```java
public void addResourceHandlers(ResourceHandlerRegistry registry) {
    // 检查配置 spring.web.resources.add-mappings 默认为true
    if (!this.resourceProperties.isAddMappings()) {
        // spring.web.resources.add-mappings 为 false 时将关闭默认的资源处理
        logger.debug("Default resource handling disabled");
    } else {
        // webjars 规则：对 ‘/webjars’ 的所有请求做处理，classpath 为资源路径
        this.addResourceHandler(registry, "/webjars/**", "classpath:/META-INF/resources/webjars/");
        /* mvcProperties.getStaticPathPattern() 对应配置 spring.mvc.static-path-pattern，
           请求路径默认值 String staticPathPattern = "/**" */
        this.addResourceHandler(registry, this.mvcProperties.getStaticPathPattern(), (registration) -> {
            /* resourceProperties.getStaticLocations() 设置静态资源路径，对应配置 spring.web.resources.static-locations,
               其默认值为 new String[]{"classpath:/META-INF/resources/", "classpath:/resources/", "classpath:/static/", "classpath:/public/"} */
            registration.addResourceLocations(this.resourceProperties.getStaticLocations());
            if (this.servletContext != null) {
                ServletContextResource resource = new ServletContextResource(this.servletContext, "/");
                registration.addResourceLocations(new Resource[]{resource});
            }

        });
    }
}
```

##### 4. 欢迎页处理规则：

在 WebMvcAutoConfiguration 类中有一个 `EnableWebMvcConfiguration` 配置类：

```java
@EnableConfigurationProperties({WebProperties.class})
    public static class EnableWebMvcConfiguration extends DelegatingWebMvcConfiguration implements ResourceLoaderAware {...}
```

其中向容器注册了一个组件 `WelcomePageHandlerMapping` ：

```java
@Bean
public WelcomePageHandlerMapping welcomePageHandlerMapping(ApplicationContext applicationContext, FormattingConversionService mvcConversionService, ResourceUrlProvider mvcResourceUrlProvider) {
    WelcomePageHandlerMapping welcomePageHandlerMapping = new WelcomePageHandlerMapping(new TemplateAvailabilityProviders(applicationContext), applicationContext, this.getWelcomePage(), this.mvcProperties.getStaticPathPattern());
    welcomePageHandlerMapping.setInterceptors(this.getInterceptors(mvcConversionService, mvcResourceUrlProvider));
    welcomePageHandlerMapping.setCorsConfigurations(this.getCorsConfigurations());
    return welcomePageHandlerMapping;
}
```

WelcomePageHandlerMapping 构造函数中：

```java
WelcomePageHandlerMapping(TemplateAvailabilityProviders templateAvailabilityProviders, ApplicationContext applicationContext, Resource welcomePage, String staticPathPattern) {
    // 欢迎页不为 null 且静态资源请求路径为 /** 时，转发请求 index.html
    if (welcomePage != null && "/**".equals(staticPathPattern)) {
        logger.info("Adding welcome page: " + welcomePage);
        this.setRootViewName("forward:index.html");
    } else if (this.welcomeTemplateExists(templateAvailabilityProviders, applicationContext)) {
        logger.info("Adding welcome page template: index");
        // 当欢迎页不存在时请求由 controller 处理
        this.setRootViewName("index");
    }

}
```

##### 5. favicon.ico：

浏览器会默认请求项目下 `/favicon.ico` 作为标签页图标，并保存在 session 域中。因此在配置文件中设置了静态资源访问前缀，那么 /favicon.ico 就会获取不到相对应的图标了。

### 表单与 RestFul：

#### 1. 开启方式：

一般浏览器 **表单** 不能发送 get、post 以外的其它请求（其它请求都被 get 请求代替，），SpringMvc 提供了 `HiddenHttpMethodFilter` 我们只需为 post 请求添加一个 `_method` 参数，参数值就是我们想使用的请求方式。

SpringBoot 允许我们在配置中开启这项功能：

```yaml
spring.mvc.hiddenmethod.filter.enabled: true
```

#### 2. 原理解析：

在 WebMvcAutoConfiguration 中：

```java
@Bean
@ConditionalOnMissingBean({HiddenHttpMethodFilter.class}) // 当容器中没有该组件时（我们没有自定义时）
// 检查配置中 spring.mvc.hiddenmethod.filter.enabled 的值是否开启此功能（默认 false）
@ConditionalOnProperty( prefix = "spring.mvc.hiddenmethod.filter", name = {"enabled"} )
public OrderedHiddenHttpMethodFilter hiddenHttpMethodFilter() { return new OrderedHiddenHttpMethodFilter(); }
```

在 HiddenHttpMethodFilter 过滤器中：

```java
private String methodParam = "_method"; // 默认值 _method
public void setMethodParam(String methodParam) { // 修改 methodParam
    Assert.hasText(methodParam, "'methodParam' must not be empty");
    this.methodParam = methodParam;
}
// 1. 拦截请求
protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
    HttpServletRequest requestToUse = request;
    // 是 POST 请求且没有错误时
    if ("POST".equals(request.getMethod()) && request.getAttribute("javax.servlet.error.exception") == null) {
        // 获取到请求数据中 _method 参数的值
        String paramValue = request.getParameter(this.methodParam);
        if (StringUtils.hasLength(paramValue)) { // 有值时
            String method = paramValue.toUpperCase(Locale.ENGLISH); // 转为大写
            // 2. 检查是否是允许的请求方式（ALLOWED_METHODS：PUT、DELETE、PATCH）
            if (ALLOWED_METHODS.contains(method)) {
                // 3. 将原生 request 替换为包装模式的 requestWrapper 重写了 getMethod 方法并传入 _method 参数的值
                requestToUse = new HiddenHttpMethodFilter.HttpMethodRequestWrapper(request, method);
            }
        }
    }
    // 4. 过滤器放行 request（上面条件成立则放行被替换的 request）
    filterChain.doFilter((ServletRequest)requestToUse, response);
}
```

#### 3. 自定义 HiddenHttpMethodFilter：

参照 WebMvcAutoConfiguration 自定义 HiddenHttpMethodFilter：

```java
@Configuration(proxyBeanMethods = false)
public class WebConfig {
    @Bean
    public HiddenHttpMethodFilter hiddenHttpMethodFilter() {
        HiddenHttpMethodFilter hiddenHttpMethodFilter = new HiddenHttpMethodFilter();
        hiddenHttpMethodFilter.setMethodParam("_m"); // 修改 _method 为 _m 参数
        return hiddenHttpMethodFilter;
    }
}
```

表单现在只需添加一个 `-m` 参数，参数值为 PUT、DELETE、PATCH 其中一个，它就会去访问对应的请求方法了。

### 请求映射原理：

SpringMvc 中通过 `DispatcherServlet` 做请求分发，SpringBoot 同理也一样。DispatcherServlet 是 Servlet 因此它肯定有 doGet 等方法。

1. DispatcherServlet 继承关系（idea 中 Ctrl+F12 查看）：

```java
DispatcherServlet -> FrameworkServlet -> HttpServletBean -> HttpServlet
```

2. FrameworkServlet 中重写了 doGet 等方法（idea 中 Ctrl+H 查看），并且可以发现 doGet 等方法都调用了 processRequest 方法它又调用了 doService 方法处理请求：

```java
protected final void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    this.processRequest(request, response); // 调用 processRequest 处理
}
protected final void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    /* 初始化过程，省略... */
    try {
        this.doService(request, response); // 调用 doService 统一处理请求
    } 
    /* 省略... */
}
// 它抽象方法因此可知请求被 DispatcherServlet 实现的 doService 方法处理
protected abstract void doService(HttpServletRequest request, HttpServletResponse response) throws Exception;
```

3. DispatcherServlet 中 doService 最终调用 `doDispatch` 方法派发请求：

```java
protected void doDispatch(HttpServletRequest request, HttpServletResponse response) throws Exception {
	/* ... */
    // 拿到当前请求的处理器
    mappedHandler = this.getHandler(processedRequest);
    /* ... */
}
```

4. 在 DispatcherServlet 中有一个 `List<HandlerMapping> handlerMappings` 参数它存储了许多请求的 **映射处理器** HandlerMapping， `getHandler` 方法中它会遍历这些映射处理器，并获取到能够处理当前请求的 handler：

```java
protected HandlerExecutionChain getHandler(HttpServletRequest request) throws Exception {
    if (this.handlerMappings != null) {
        Iterator var2 = this.handlerMappings.iterator();
        while(var2.hasNext()) { // 遍历
            HandlerMapping mapping = (HandlerMapping)var2.next(); // 当前映射处理器
            HandlerExecutionChain handler = mapping.getHandler(request); // 获取 handler
            if (handler != null) {
                return handler;
            }
        }
    }
    return null;
}
```

* handlerMappings 中有一个 `RequestMappingHandlerMapping` 它保存了所有 @RequestMapping 相关和handler 的映射规则。还有 `WelcomePageHandlerMapping` 它就是欢迎页面 `/index.html` 的映射处理器，它们都是 WebMvcAutoConfiguration 中帮我们配置好的。
* 遍历时查询 HandlerMapping 中是否有对应处理请求的 handler，如果当前 HandlerMapping 中没有则继续在下一个 HandlerMapping 中寻找。

5. 同理我们可以自定义映射处理器 HandlerMapping。

### 自定义 MVC:

* SpringBoot 默认是关闭矩阵变量的 `@MatrixVariable`  ，在 WebMvcAutoConfiguration 中 WebMvcAutoConfigurationAdapter 内有一个 `configurePathMatch` 方法它是来配置路径映射的我们需要修改一下路径路径匹配规则，而这个方法是通过 `UrlPathHelper` 对路径进行解析此类中有一个 `removeSemicolonContent` 默认为 `true` 表示移除 URL 路径分号的内容。

想开启矩阵变量功能，我们需要自定义 MVC SpringBoot 提供了三种方式：

1. @Configuration + 实现 `WebMvcConfigurer` 接口(推荐使用)：

```java
@Configuration(proxyBeanMethods = false)
public class WebConfig implements WebMvcConfigurer { // 实现 WebMvcConfigurer 接口
    @Override // 重写 configurePathMatch
    public void configurePathMatch(PathMatchConfigurer configurer) {
        UrlPathHelper urlPathHelper = new UrlPathHelper(); // 自定义 UrlPathHelper
        urlPathHelper.setRemoveSemicolonContent(false); // 不让异常分号内容
        configurer.setUrlPathHelper(urlPathHelper);
    }
}
```

2. @Bean 注册 WebMvcConfigurer 组件：

```java
@Configuration(proxyBeanMethods = false)
public class WebConfig {
    @Bean // 注册 WebMvcConfigurer 组件
    public WebMvcConfigurer webMvcConfigurer() {
        return new WebMvcConfigurer() { // 自定义 WebMvcConfigurer
            @Override // 重写
            public void configurePathMatch(PathMatchConfigurer configurer) {
                UrlPathHelper urlPathHelper = new UrlPathHelper();
                urlPathHelper.setRemoveSemicolonContent(false);
                configurer.setUrlPathHelper(urlPathHelper);
            }
        };
    }
}
```

3. @Configuration + `@EnableWebMvc` + 继承 WebMvcConfigurer 全面接管 SpringMvc，慎用所有的规则需要手动重写配置。

* @EnableWebMvc 会 `@Import({DelegatingWebMvcConfiguration.class})` 引入组件 `DelegatingWebMvcConfiguration` 它继承 `WebMvcConfigurationSupport` ，而在 `WebMvcAutoConfiguration` 上表示 `@ConditionalOnMissingBean(WebMvcConfigurationSupport.class)` 则存在该类时 WebMvc 的自动配置将不生效。

### 参数处理原理：

* 在 Controller 方法中参数会按照类型或注解帮我们自动注入值，它是如何实现的？

#### 1. 注解参数：

1. 在 `DispatcherServlet` 的 `doDispatch` 方法中它通过 `getHandler` 找到能够处理当前请求的 HandlerMapping 从中拿到具体处理该请求的 Handler 它记录了具体的 Controller 方法。

2.  `getHandler` 之后还会为当前的 Handler 找到 **适配器** HandlerAdapter:

```java
// doDispatch 方法中
HandlerAdapter ha = this.getHandlerAdapter(mappedHandler.getHandler()); // 获取适配器
```

3. 它会遍历适配器集合找到能够处理当前 Handler 的适配器：

```java
private List<HandlerAdapter> handlerAdapters; // 保存了多种 Handler 适配器的集合

protected HandlerAdapter getHandlerAdapter(Object handler) throws ServletException {
    if (this.handlerAdapters != null) {
        Iterator var2 = this.handlerAdapters.iterator();
        while(var2.hasNext()) {
            HandlerAdapter adapter = (HandlerAdapter)var2.next();
            if (adapter.supports(handler)) { // 支不支持当前 Handler
                return adapter;
            }
        }
    }
    throw new ServletException("No adapter for handler [" + handler + "]: The DispatcherServlet configuration needs to include a HandlerAdapter that supports this handler");
}
```

4. 在适配器集合中有一个 `RequestMappingHandlerAdapter` 它就是主要来处理 @RequestMaping 等方法的适配器。

5. 找到适配器后执行目标方法：

```java
// doDispatch 方法中
mv = ha.handle(processedRequest, response, mappedHandler.getHandler()); // 真正执行 Handler
```

6. 在 `RequestMappingHandlerAdapter` 通过 `invokeHandlerMethod` 来执行我们的目标方法（Controller 方法）。
7. 为将执行的方法设置 **参数解析器** 与 **返回值处理器** ：

```java
// RequestMappingHandlerAdapter -> invokeHandlerMethod 中
// 1. 可执行方法即要执行的 Controller 方法
ServletInvocableHandlerMethod invocableMethod = this.createInvocableHandlerMethod(handlerMethod);
/* 2. 设置参数解析器，所以可知 Controller 方法支持哪些参数类型取决于该解析器
它会拿到 Controller 方法的参数，检查是否支持解析该参数，如果支持再进行解析 */
if (this.argumentResolvers != null) { // 参数解析器列表 HandlerMethodArgumentResolvers
    invocableMethod.setHandlerMethodArgumentResolvers(this.argumentResolvers);
}
// 3. 设置返回值处理器
if (this.returnValueHandlers != null) { // 返回值处理器列表
    invocableMethod.setHandlerMethodReturnValueHandlers(this.returnValueHandlers);
}
/* ... */
invocableMethod.invokeAndHandle(webRequest, mavContainer, new Object[0]); // 调用和处理方法
```

8. `ServletInvocableHandlerMethod` 中 `invokeAndHandle` 方法内：

```java
// 去执行 Controller 方法，并得到 Controller 的返回值
Object returnValue = this.invokeForRequest(webRequest, mavContainer, providedArgs);
```

9. `invokeForRequest` 会利用 `InvocableHandlerMethod` 的 `getMethodArgumentValues` 方法中确定每一个参数的具体值：

```java
protected Object[] getMethodArgumentValues(NativeWebRequest request, @Nullable ModelAndViewContainer mavContainer,
			Object... providedArgs) throws Exception {
	// 1. 获取方法所有的参数声明
    MethodParameter[] parameters = getMethodParameters();
    if (ObjectUtils.isEmpty(parameters)) { // 为空时
        return EMPTY_ARGS;
    }
	// 2. 声明存储参数值的数组
    Object[] args = new Object[parameters.length];
    for (int i = 0; i < parameters.length; i++) {
        MethodParameter parameter = parameters[i];
        parameter.initParameterNameDiscovery(this.parameterNameDiscoverer);
        args[i] = findProvidedArgument(parameter, providedArgs);
        if (args[i] != null) {
            continue;
        }
        /* 3. 判断那个解析器支持当前参数类型
           它会遍历参数解析器（HandlerMethodArgumentResolvers），找到合适的 ArgumentResolver
           第一次执行时会将匹配的解析器加入缓存之后不再需要遍历 */
        if (!this.resolvers.supportsParameter(parameter)) {
            throw new IllegalStateException(formatArgumentError(parameter, "No suitable resolver"));
        }
        try { // 4. 使用参数解析器解析当前参数的具体值
            args[i] = this.resolvers.resolveArgument(parameter, mavContainer, request, this.dataBinderFactory);
        }
        catch (Exception ex) {
            if (logger.isDebugEnabled()) {
                String exMsg = ex.getMessage();
                if (exMsg != null && !exMsg.contains(parameter.getExecutable().toGenericString())) {
                    logger.debug(formatArgumentError(parameter, exMsg));
                }
            }
            throw ex;
        }
    }
    return args;
}
```

#### 2. Servlet API 参数：

Servlet 参数类型的解析器 `ServletRequestMethodArgumentResolver` 中：

```java
// 是否为支持的 Servlet API 类型
public boolean supportsParameter(MethodParameter parameter) {
    Class<?> paramType = parameter.getParameterType();
    return WebRequest.class.isAssignableFrom(paramType) || // 支持的 API
        ServletRequest.class.isAssignableFrom(paramType) || 
        MultipartRequest.class.isAssignableFrom(paramType) || 
        HttpSession.class.isAssignableFrom(paramType) || 
        pushBuilder != null && pushBuilder.isAssignableFrom(paramType) ||
        Principal.class.isAssignableFrom(paramType) && !parameter.hasParameterAnnotations() || InputStream.class.isAssignableFrom(paramType) || Reader.class.isAssignableFrom(paramType) || HttpMethod.class == paramType || Locale.class == paramType || TimeZone.class == paramType || ZoneId.class == paramType;
}
```

#### 3. 复杂参数：

Map、Model、ServletResponse 等类型参数。

* 以参数 Map 类型为例，在 `InvocableHandlerMethod` 的 `getMethodArgumentValues` 方法中：

1. 获取到 Map 类型的参数解析器为 `MapMethodProcessor` 。

2. 解析参数是利用 `ModelAndViewContainer mavContainer` 的 `mavContainer.getModel()` 返回 `BindingAwareModelMap` 它是 Model 也是 Map 类型，最终参数值封装到它里面。

3. `ModelAndViewContainer` 用来保存请求需要的所有数据，视图数据模型数据等等。

* Model 类型参数解析器为 `ModelMethodProcessor` 过程同理一样调用了 `mavContainer.getModel()` 。

#### 4. 自定义对象参数：

自定义 pojo 参数类型的解析器 `ServletModelAttributeMethodProcessor` 它继承 `ModelAttributeMethodProcessor` 。

* 由之前可知 `resolvers.supportsParameter(parameter)` 来判断某解析器是否能解析该类型参数：

```java
public boolean supportsParameter(MethodParameter parameter) {
    return (parameter.hasParameterAnnotation(ModelAttribute.class) || // 是否标注了 @ModelAttribute 注解
            (this.annotationNotRequired && // 不是必须的
             !BeanUtils.isSimpleProperty(parameter.getParameterType()))); // 且不是简单属性
}
```

* 同列解析参数 `resolvers.resolveArgument(...)` ，再`ModelAttributeMethodProcessor` 的 `resolveArgument` 方法中:

```java
public final Object resolveArgument(MethodParameter parameter, @Nullable ModelAndViewContainer mavContainer,
                                    NativeWebRequest webRequest, @Nullable WebDataBinderFactory binderFactory) throws Exception {
    String name = ModelFactory.getNameForParameter(parameter); // 获取参数名
    // 获取看有没有 @ModelAttribute 注解
    ModelAttribute ann = parameter.getParameterAnnotation(ModelAttribute.class);
    if (ann != null) { mavContainer.setBinding(name, ann.binding()); }
    Object attribute = null;
    BindingResult bindingResult = null;

    // 2. 判断 ModelAndViewContainer 中有没有同名参数
    if (mavContainer.containsAttribute(name)) {
        attribute = mavContainer.getModel().get(name);
    }
    else {
        // 创建一个 pojo 对象实例，所有属性值为空的实例
        try { attribute = createAttribute(name, parameter, binderFactory, webRequest); }
        catch (BindException ex) {
            if (isBindExceptionRequired(parameter)) { throw ex; }
            if (parameter.getParameterType() == Optional.class) { attribute = Optional.empty(); }
            else { attribute = ex.getTarget(); }
            bindingResult = ex.getBindingResult();
        }
    }
    if (bindingResult == null) { // 绑定结果为空时
        // 创建 web 数据绑定器
        WebDataBinder binder = binderFactory.createBinder(webRequest, attribute, name);
        if (binder.getTarget() != null) { // 拿到 pojo 实例且不为 null
            if (!mavContainer.isBindingDisabled(name)) {
                bindRequestParameters(binder, webRequest); // 将 web 请求中的数据绑定到 pojo 实例中
            }
            validateIfApplicable(binder, parameter);
            if (binder.getBindingResult().hasErrors() && isBindExceptionRequired(binder, parameter)) {
                // 绑定发生异常可通过 getBindingResult 获取（数据校验错误就是从这里拿到的）
                throw new BindException(binder.getBindingResult());
            }
        }
        if (!parameter.getParameterType().isInstance(attribute)) {
            attribute = binder.convertIfNecessary(binder.getTarget(), parameter.getParameterType(), parameter);
        }
        bindingResult = binder.getBindingResult();
    }
    Map<String, Object> bindingResultModel = bindingResult.getModel();
    mavContainer.removeAttributes(bindingResultModel);
    mavContainer.addAllAttributes(bindingResultModel);

    return attribute;
}
```

`WebDataBinder` ： web 数据绑定器，将请求参数的值绑定到指定的 JavaBean 中，它利用 `Container` 转换器，将请求数据转换成指定的数据类型再次封装到 JavaBean 中。

`GenericConversionService` ：在设置每一个值的时候，找它里面的所有 `Converter` 那个可以将这个数据类型（request带来参数的字符串）转换到指定的类型。

### 自定义 Converter：

Converter 接口 `@FunctionalInterface public interface Converter<S, T>` 包含 FunctionalInterface 注解，它只能针对 form 表单提交数据有效。

```java
@Configuration(proxyBeanMethods = false)
public class WebConfig {
    @Bean
    public WebMvcConfigurer webMvcConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addFormatters(FormatterRegistry registry) {
                // 添加自定义 Converter
                registry.addConverter(new Converter<String, Car>() { // String 类型转 Car 类型
                    @Override
                    public Car convert(String source) { // 转换具体实现方式
                        if (StringUtils.hasText(source)){ // 存在文字
                            Car car = new Car();
                            car.setName(source); // 自定义操作设定属性值
                            return car;
                        }
                        return null;
                    }
                });
            }
        };
    }
}
```

例如发起请求：`/setUser?name=userName&car=myCar` 与 `/setCar?car=111`

```java
@RequestMapping("setUser")
public User setUser(User user) {
    return user; // 结果 { name: "userName",car: { name: "myCar" } }
}
@RequestMapping("setCar")
public Car setUser(@RequestParam("car") Car car) {
    return car; // 结果 { name": "111" }
}
```

### 数据响应原理：

#### 1. 响应 JSON：

1. 由上可知 `ServletInvocableHandlerMethod` 的 `invokeAndHandle` 中会拿到 Controller 的返回值，之后它还会对返回值做处理：

```java
public void invokeAndHandle(ServletWebRequest webRequest, ModelAndViewContainer mavContainer, Object... providedArgs) throws Exception {
    // 执行 Controller 方法并拿到返回值
    Object returnValue = this.invokeForRequest(webRequest, mavContainer, providedArgs);
    this.setResponseStatus(webRequest);
    if (returnValue == null) { // 如果返回值为空
        if (this.isRequestNotModified(webRequest) || this.getResponseStatus() != null || mavContainer.isRequestHandled()) {
            this.disableContentCachingIfNecessary(webRequest);
            mavContainer.setRequestHandled(true);
            return;
        }
    // 是否是一个字符串
    } else if (StringUtils.hasText(this.getResponseStatusReason())) {
        mavContainer.setRequestHandled(true);
        return;
    }
    try {
        // 处理返回值
        this.returnValueHandlers.handleReturnValue(returnValue, this.getReturnValueType(returnValue), mavContainer, webRequest);
    } catch (Exception var6) { }
}
```

2. `HandlerMethodReturnValueHandlerComposite` 中：

```java
public void handleReturnValue(@Nullable Object returnValue, MethodParameter returnType,
                              ModelAndViewContainer mavContainer, NativeWebRequest webRequest) throws Exception {
    // 根据返回值类型获取合适的返回值处理器(它会遍历所有的返回值处理器，拿到能够处理当前返回值的处理器)
    HandlerMethodReturnValueHandler handler = selectHandler(returnValue, returnType);
    if (handler == null) { throw new IllegalArgumentException("Unknown return value type: " + returnType.getParameterType().getName()); }
    // 处理返回值
    handler.handleReturnValue(returnValue, returnType, mavContainer, webRequest);
}
```

* 返回值处理器接口 `HandlerMethodReturnValueHandler` ：

```java
public interface HandlerMethodReturnValueHandler {
    // 1. 判断是否支持某类型返回值
	boolean supportsReturnType(MethodParameter returnType);
    // 2. 处理返回值
	void handleReturnValue(@Nullable Object returnValue, MethodParameter returnType,
			ModelAndViewContainer mavContainer, NativeWebRequest webRequest) throws Exception;
}
```

* 各种返回值处理器支持的返回值类型：

```java
ModelAndView
Model
View
ResponseEntity 
ResponseBodyEmitter
StreamingResponseBody
HttpEntity
HttpHeaders
Callable
DeferredResult
ListenableFuture
CompletionStage
WebAsyncTask
// 方法有以下注解标注且返回值为对象类型的
@ModelAttribute
@ResponseBody --> RequestResponseBodyMethodProcessor // 对应的处理器
```

3. `RequestResponseBodyMethodProcessor` 处理 `@ResponseBody` 标注的方法的返回值：

RequestResponseBodyMethodProcessor 在 handleReturnValue 调用 `writeWithMessageConverters` 方法使用消息转换器（MessageConverters）进行写出操作：

内容协商：

Http 协议中规定请求头中有 Accept 属性它告诉服务器，客户端能接收的响应类型是什么。

```json
// 逗号比分号优先级高，q 代表权重，没有去默认为1，*/* 表示任意类型
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
```

**客户端能接收的类型** 用 `MediaType` **媒体类型** 对象表示，与 **服务器支持生成的类型** 循环匹配筛选出能够支持类型的 `MediaType` 。若客户端无法解析服务端返回的内容，即媒体类型未匹配，那么响应 406。

SpringMvc 遍历容器中所有 `HttpMessageConverter` 消息转换器，找到支持相应类型的转换器：

主要作用：看是否支持将返回值 Class 类型的对象，转化为 `MediaType` 类型的数据

```java
public interface HttpMessageConverter<T> {
	boolean canRead(Class<?> clazz, @Nullable MediaType mediaType); // 是否支持读
	boolean canWrite(Class<?> clazz, @Nullable MediaType mediaType); // 是否支持写
	List<MediaType> getSupportedMediaTypes();
	default List<MediaType> getSupportedMediaTypes(Class<?> clazz) {
		return (canRead(clazz, null) || canWrite(clazz, null) ? getSupportedMediaTypes() : Collections.emptyList());
	}
	T read(Class<? extends T> clazz, HttpInputMessage inputMessage) throws IOException, HttpMessageNotReadableException;
	void write(T t, @Nullable MediaType contentType, HttpOutputMessage outputMessage) throws IOException, HttpMessageNotWritableException;
}
```

利用 `MappingJackson2HttpMessageConverter` 中 `write` 方法将对象转为 JSON （利用 Jackson）再写出去。

#### 2. 内容协商原理：

1. 判断当前请求头中是否已经有确定的媒体类型 `MediaType` ，有就使用确定好的媒体类型，没有则向下执行。
2. 获取客户端支持接收的内容类型（默认通过请求头 Accept 字段） `acceptableTypes = this.getAcceptableMediaTypes(request)`。
    * **ContentNegotiationManager** 内容协商管理器 默认使用基于请求头的策略
    * **HeaderContentNegotiationStrategy** 确定客户端可以接收的内容类型
3. 获取服务器支持生成的媒体类型，再与客户端能接收的类型进行比对找到匹配的媒体类型。
4. 遍历循环容器中所有的 `HttpMessageConverter` ,拿到 **所有支持转换** 当前返回值 Class 类型的 `HttpMessageConverter`。
5. 客户端想要的类型和服务器支持的类型进行循环匹配。
6. 最终使用匹配到的 `Converter` 进行转换。

#### 3. 开启浏览器参数方式内容协商功能：

* 开启配置：

开启此配置后服务器不再默认通过请求头的 Accept 字段来获取客户端支持接收的内容类型，而是通过读取请求参数中的 **format** 值来确定客户端接收的内容类型。

```yaml
spring:
  mvc:
    contentnegotiation:
      favor-parameter: true
```

* 请求时添加 **format** 参数指定接收的数据类型即可

`/user?format=json` 接收 JSON 类型数据

### 自定义 HttpMessageConverter：

* 自定义 HttpMessageConverter：

```java
@Bean
public WebMvcConfigurer webMvcConfigurer() {
    return new WebMvcConfigurer() {
        @Override
        // 添加自定义 HttpMessageConverter
        public void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
            converters.add(new HttpMessageConverter<User>() { // controller 方法返回值为 User 类型
                @Override
                public boolean canRead(Class<?> clazz, MediaType mediaType) {
                    return false;
                }
                @Override
                public boolean canWrite(Class<?> clazz, MediaType mediaType) {
                    return clazz.isAssignableFrom(User.class); // 返回值类型为 User 类型
                }
                /** 服务器要统计所有 MessageConverter 都能写出哪些内容类型
                 * 自定义类型 application/x-user
                 */
                @Override
                public List<MediaType> getSupportedMediaTypes() {
                    return MediaType.parseMediaTypes("application/x-user");
                }
                @Override
                public User read(Class<? extends User> clazz, HttpInputMessage inputMessage) throws IOException, HttpMessageNotReadableException {
                    return null;
                }
                @Override
                public void write(User user, MediaType contentType, HttpOutputMessage outputMessage) throws IOException, HttpMessageNotWritableException {
                    // 自定义内容数据
                    String data = user.getName()+ " -> " +user.getAge();
                    // 将内容写出
                    OutputStream body = outputMessage.getBody();
                    body.write(data.getBytes(StandardCharsets.UTF_8));
                }
            });
        }
    };
}
```

当标注 @ResponseBody 的方法返回值类型为 User 且媒体类型为我们自定义的 application/x-user 时将使用此自定义 `HttpMessageConverter` 写出响应数据。

* 如果还想使用请求中添加 **format** 参数来指定客户端接收响应数据的类型，还需要在上 `WebMvcConfigurer` 中重写 `configureContentNegotiation` 方法（原来的策略全部失效）：

```java
@Override
// 配置内容协商功能
public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
    Map<String, MediaType> mediaTypes = new HashMap<>();
    mediaTypes.put("json", MediaType.APPLICATION_JSON);
    mediaTypes.put("xml", MediaType.APPLICATION_XML);
    // 自定义类型（format=user 对应 application/x-user 类型）
    mediaTypes.put("user", MediaType.parseMediaType("application/x-user"));
    // 新增参数策略
    ParameterContentNegotiationStrategy strategy = new ParameterContentNegotiationStrategy(mediaTypes);
    /* 注意如果不添加其它策略则只能使用参数策略，也可继续新增基于请求头的策略 */
    // HeaderContentNegotiationStrategy headerContentNegotiationStrategy = new HeaderContentNegotiationStrategy();
    // 设置内容协商策略
    configurer.strategies(Arrays.asList(strategy));
}
```

* 或者使用配置方式：

```yaml
spring:
  mvc:
    contentnegotiation:
      favor-parameter: true
      media-types:
        { user: application/x-user }
```

这样我们只需在请求中添加 **format=user** 则表示客户端需要接收的类型为 application/x-user 类型。

### 视图解析


#### Thymeleaf 模板：

>   现代化、服务端 Java 模板引擎
>
>   [Thymeleaf 官网：https://www.thymeleaf.org/](https://www.thymeleaf.org/)
>
>   [Thymeleaf 使用与语法](https://blog.csdn.net/ljk126wy/article/details/90735989)

##### 1. 引入 Starter：

```xml
<!-- 引入 Thymeleaf 模板引擎 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
```

##### 2. Thymeleaf 使用：

1. SpringBoot 默认帮我们配置好了 Thymeleaf：

```java
@AutoConfiguration( after = {WebMvcAutoConfiguration.class, WebFluxAutoConfiguration.class} )
@EnableConfigurationProperties({ThymeleafProperties.class})
@ConditionalOnClass({TemplateMode.class, SpringTemplateEngine.class})
@Import({ReactiveTemplateEngineConfiguration.class, DefaultTemplateEngineConfiguration.class})
public class ThymeleafAutoConfiguration {...}
```

2. 默认在 `resources/templates/` 文件夹内的 `.html` 页面文件将会被 Thymeleaf 模板引擎解析。

```java
@ConfigurationProperties( prefix = "spring.thymeleaf" )
public class ThymeleafProperties {
    public static final String DEFAULT_PREFIX = "classpath:/templates/";
    public static final String DEFAULT_SUFFIX = ".html";
    ...
}
```

*   Thymeleaf 模版页面中的 html 标签上需要声明 Thymeleaf 的命名空间：

```html
<html lang="en" xmlns:th="http://www.thymeleaf.org">
```

#### 视图解析原理：

1. SpringMvc 处理返回值时，当返回值是一个字符串时会被 `ViewNameMethodReturnValueHandler` 处理器处理：

```java
public class ViewNameMethodReturnValueHandler implements HandlerMethodReturnValueHandler {
    public boolean supportsReturnType(MethodParameter returnType) {
        Class<?> paramType = returnType.getParameterType();
        // 返回值是否为空或者一个字符串
        return Void.TYPE == paramType || CharSequence.class.isAssignableFrom(paramType);
    }
    public void handleReturnValue(@Nullable Object returnValue, MethodParameter returnType, ModelAndViewContainer mavContainer, NativeWebRequest webRequest) throws Exception {
        if (returnValue instanceof CharSequence) {
            String viewName = returnValue.toString();
            mavContainer.setViewName(viewName); // 将所有数据都存放在了 ModelAndViewContainer 中
            if (this.isRedirectViewName(viewName)) { // 是否要重定向
                mavContainer.setRedirectModelScenario(true);
            }
        } else if (returnValue != null) {
            throw new UnsupportedOperationException("Unexpected return type: " + returnType.getParameterType().getName() + " in method: " + returnType.getMethod());
        }
    }
    protected boolean isRedirectViewName(String viewName) {
        // 判断是否需要重定向
        return viewName.startsWith("redirect:") || PatternMatchUtils.simpleMatch(this.redirectPatterns, viewName);
    }
}
```

2. Controller 方法的参数是一个 **自定义类型对象** 时会默认 **自动将它存放在 ModelAndViewContainer** 中。
3. 任何目标方法执行完成以后都会返回 ModelAndView （数据与视图）。
4. 当你的 ModelAndView 没有设置 viewName 时是给你使用默认的 viewName（值为当前 Controller 方法的请求路径，如 RquestMapping("login") 那么视图就是 login）。
5. 由 `DispatcherServlet` 的 `processDispatchResult` 方法处理派发结果（处理页面该如何响应）。
6. 它会执行 `render(mv, request, response)` 渲染页面操作，遍历所有 `ViewResolver` 找到对应视图解析器得到相应的 View 对象（定义了页面渲染逻辑，如重定向是 **RedirectView** ），最后调用 View 的 render 方法进行页面渲染工作。
    * 返回值以 **forward** 开头：**InternalResourceView** 中 request 原生转发请求
    * 返回值以 **redirect** 开头：**RedirectView** 中 request 原生重定向请求
    * 普通字符串：**new ThymeleafView()**

### 拦截器

#### HandlerInterceptor：

* 拦截器 `HandlerInterceptor` 接口：

```java
public interface HandlerInterceptor {
    // 预先处理(执行目标方法之前)
    default boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        return true; // 是否放行
    }
    // 目标方法执行完成后
    default void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, @Nullable ModelAndView modelAndView) throws Exception {}
    // 请求处理完成后
    default void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, @Nullable Exception ex) throws Exception {}
}
```

#### 使用拦截器：

1. 实现 `HandlerInterceptor` :

```java
public class LoginInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        HttpSession session = request.getSession();
        Object user = session.getAttribute("user");
        if (user != null) return true; // 登录成功放行
        request.setAttribute("msg", "请登录");
        request.getRequestDispatcher("/success").forward(request, response);
        return false;
    }
}
```

2. 配置拦截器：

```java
@Configuration
public class WebConfig implements WebMvcConfigurer { // WebMvcConfigurer 中
    @Override // 1. 实现添加拦截器方法
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new LoginInterceptor()) // 2. 添加拦截器
                .addPathPatterns("/**") // 3. 拦截路径
                // 4. 放行路径（排除）
                .excludePathPatterns("/","/login",
                        // 由于 /** 拦截了包括静态资源的请求因此需要放行静态资源
                        "/css/**","/html/**","/images/**"); // 或为静态资源配置访问前缀，再放行此前缀下的所有请求
    }
}
```

#### 拦截器原理：

1. 根据当前请求，找到 mappedHandler 为 `HandlerExecutionChain` 它拿到了可以处理请求的 Handler 和相关的拦截器。
2. 之后拿到了相关的适配器（HandlerAdapter），最后使用适配器来执行目标方法。但在执行目标方法之前还有一个前置步骤 `applyPreHandle` 它会来执行我们拦截器的 `preHandle` 方法：

```java
if (!mappedHandler.applyPreHandle(processedRequest, response)) { return; }
```

3. `applyPreHandle` 会先 **正序** 挨个执行拦截器的 `preHandle` 方法，如果当前拦截器返回 true 这执行下一个。
4. 如果拦截器 `preHandle` 返回 false 会执行 `triggerAfterCompletion` 方法，它会 **逆序** 执行 **已经触发了的拦截器** 的 `afterCompletion` 方法，并且 `applyPreHandle` 返回 false。
5. 因此如果任何一个拦截器返回 false ，则 `applyPreHandle` 返回 false 将直接 return 不能执行目标方法。
6. 如果成功执行了目标方法，之后还会 **倒序** 执行所有拦截器的 `postHandle` 方法：

```java
mappedHandler.applyPostHandle(processedRequest, response, mv);
```

7. 并且注意 **前任何步骤报错** 都将执行 `triggerAfterCompletion` 方法。
8. 最后在页面渲完成以后，也会触发 `triggerAfterCompletion` 方法。

### 文件上传：

#### 文件上传：

1. 表单设置 `method="post"` 与 `enctype="multipart/form-data"` ：

```java
<form action="/upload" method="post" enctype="multipart/form-data">
    file: <input type="file" name="file" id="file"> <br/>
    <button type="submit"> 提交 </button>
</form>
```

2. 接收文件：

```java
@PostMapping("upload")
public String upload( @RequestPart("file") MultipartFile file ) throws IOException {
    if (!file.isEmpty()){
        String fileName = file.getOriginalFilename();
        File saveFile = new File("C:\\Users", UUID.randomUUID() + fileName);
        file.transferTo(saveFile);
    }
    return "success";
}
```

`@RequestParam` 也能接收 MultipartFile 类型，一般接收基本类型和 String。

`@RequestPart` 一般接收 multipart/form-data 表单数据，适用于复杂的请求域像 JSON，XML。

3. 相关配置（MultipartAutoConfiguration.class）：

```
# 上传单个文件大小上限
spring.servlet.multipart.max-file-size=10MB
# 整个请求的大小上限
spring.servlet.multipart.max-request-size=100MB
```

#### 原理解析：

1. SpringBoot 对文件上传的自动配置封装在了 `MultipartAutoConfiguration` 中，它自动帮我们配置了 `StandardServletMultipartResolver` 文件上传解析器。
2. 在 `DispatcherServlet` 的 `doDispatch` 中获取 `mappedHandler` 处理器之前会先解析请求是否是上传文件请求（根据请求类型是否是 `multipart/` 来判断）。
3. 如果是文件上传请求，文件上传解析器会将 **原生请求(request)** 封装为 `MultipartHttpServletRequest` 继续向下执行。
4. 最终参数解析器将请求中的文件内容封装成 `MultipartFile` 。

### 错误处理：

#### 默认机制：

* 默认情况下 SpringBoot 提供 `/error` 处理所有错误映射，如果是浏览器会响应一个 Whitelabel 的 **HTML** 视图，其它客户端会生产 **JSON** 响应。
* 在任何静态资源文件夹中 `error/` 目录下以 **4xx** 或 **5xx** 开头页面会在发生相应错误时被自动解析并返回。

#### 自定义异常处理：

1. `@ControllerAdvice` + `@ExceptionHandler` 处理全局异常：

```java
@ControllerAdvice // 处理所有 controller 异常的类
public class GlobalExceptionHandler {
    // 指定方法处理哪些异常（不指定则处理所有）
    @ExceptionHandler({ NullPointerException.class, ArithmeticException.class })
    public String handlerException( Exception e ){
        return ""; // 对异常进行处理并返回结果
    }
}
```

*  `@ExceptionHandler` 还能在 `Controller` 中使用，处理该 Controller 中所有或者指定的异常。

* 优先使用 Controller 中 `@ExceptionHandler` 方法处理，且匹配错误类型范围更小的优先。

2. `@ResponseStatus` 自定义异常：

```java
// 自定义异常，value 请求响应返回的状态码，reason 错误信息
@ResponseStatus(value = HttpStatus.BAD_REQUEST, reason = "请求错误")
public class UserException extends RuntimeException {}
```

3. `HandlerExceptionResolver` 自定义异常解析器：

因为我们自定义异常解析器的组件创建会比它默认的解析器后创建，而一般异常都被默认的解析器处理了轮不到我们自定义的解析器，因此我们需要提升自定义解析器创建的优先级。

```java
@Order(value = Ordered.HIGHEST_PRECEDENCE) // 设置创建该组件的优先级，数字越小优先级越高
@Component // 继承 HandlerExceptionResolver 且添加到组件中
public class CustomerExceptionResolver implements HandlerExceptionResolver {
    @Override
    public ModelAndView resolveException(HttpServletRequest request,
                                         HttpServletResponse response,
                                         Object handler, Exception ex) {
        /* 解析过程 */
        return new ModelAndView("404");
    }
}
```

#### 异常处理原理：

* `ErrorMvcAutoConfiguration` 自动配置了异常处理规则，给容器中存放了一些组件 errorAttributes（ `DefaultErrorAttributes.class` ） 组件。

```java
DefaultErrorAttributes implements ErrorAttributes, HandlerExceptionResolver
```

`ErrorAttributes` 定义了错误页面中包含的数据。

* basicErrorController( `BasicErrorController` ) 组件，默认处理 `/error` 请求。

```java
// server.error.path 没有配置值时默认使用 error.path 同理默认 /error （springEl 表达式）
@RequestMapping("${server.error.path:${error.path:/error}}")
public class BasicErrorController extends AbstractErrorController
```

其中返回 HTML 页面的请求方法会返回 `ModelAndView("error", model)` ，通过 `BeanNameViewResolver` 视图解析器，按照 **视图名作为组件的 ID** 去容器中寻找 **ID 为 error 的 View 组件** 。（还有一个返回 JSON 的请求方法）

* conventionErrorViewResolver（ `DefaultErrorViewResolver` ）组件，发生错误它会以 Http 状态码 作为视图名（404、4XX、5XX）。

#### 异常处理流程：

1. doDispatch 中执行目标方法期间发生任何异常都被 catch 捕获并将异常对象保存到 `Object dispatchException` 中。

2. 在执行 processDispatchResult 视图解析时将处理异常，由 `processHandlerException` 方法处理 handler 发生的异常并返回 ModelAndView。它会遍历所有的 `HandlerExceptionResolver` 处理器异常解析器看谁能够处理当前异常。

3. 默认是没有能够处理异常的解析器其中 `DefaultErrorAttributes` 只会将错误信息保存到请求域中，其它的解析器只在特定的情况发挥作用（如有 @ExceptionHandler 注解等）。

4. 如果没有任何解析器能够处理当前异常最终将发送 `/error` 请求，并被 `BasicErrorController` 中的方法处理。它将遍历所有的 ErrorViewResolver 错误视图解析器其中 `DefaultErrorViewResolver` 将返回错误页面视图。

### web 原生组件：

**注意原生组件不会触发 SpringBoot 的拦截器等功能。**

#### @ServletComponentScan：

1. 在主类中使用 `@ServletComponentScan` 指定 servlet、Filter、Listener 组件存放的包位置：

默认将扫描并注入此注解所在包以及所有子类包中含有 `@WebServlet` 、 `@WebFilter` 、 `@WebListener` 注解的原生组件，basePackages 属性指定扫描的包位置。

```java
// 扫描并自动注入元素 servlet 组件
@ServletComponentScan(basePackages = "top.ruoxijun.servlet")
@SpringBootApplication
public class MainApplication {...
```

2. 在 `@ServletComponentScan` 注解能扫描的包内创建原生 servlet 即可：

```java
@WebServlet(urlPatterns = "/my") // 地址
public class MyServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.getWriter().write("this is MyServlet.class"); // get 响应
    }
}
```

3. 同理 Filter ：

```java
// /* 是 java 中表示所有，spring 使用 /** 表示
@WebFilter(urlPatterns = "/css/*") // 拦截的路径
public class MyFilter implements Filter {
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {}
    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {}
    @Override
    public void destroy() { Filter.super.destroy(); }
}
```

4. Listener：

```java
@WebListener
public class MyListener implements ServletContextListener {
    @Override // 项目初始化
    public void contextInitialized(ServletContextEvent sce) {}
    @Override // 项目销毁
    public void contextDestroyed(ServletContextEvent sce) {}
}
```

#### xxxRegistrationBean：

推荐使用在配置类中向 SpringBoot 注入 `ServletRegistrationBean` 、 `FilterRegistrationBean` 、 `ServletListenerRegistrationBean` 类型组件的方式来分别添加 servlet、Filter、Listener：

```java
// 不建议使用 proxyBeanMethods = false 属性值
@Configuration
public class MyRegistrationBean {
    @Bean
    public ServletRegistrationBean myServlet(){
        MyServlet myServlet = new MyServlet(); // 自定义 servlet 对象
        // 注册 servlet 并设置访问路径
        return new ServletRegistrationBean(myServlet, "/my");
    }
    @Bean
    public FilterRegistrationBean myFilter(){
        MyFilter myFilter = new MyFilter(); // 自定义 filter 对象
        // 注册 filter 并拦截 ServletRegistrationBean 中 servlet 的请求
        // return new FilterRegistrationBean(myFilter, myServlet());
        FilterRegistrationBean<MyFilter> filterRegistrationBean =
                new FilterRegistrationBean<>(myFilter);
        // 指定拦截请求
        filterRegistrationBean.setUrlPatterns(Arrays.asList("/css/*"));
        return filterRegistrationBean;
    }
    @Bean
    public ServletListenerRegistrationBean myListener(){
        // 注册自定义监听器
        MyListener myListener = new MyListener();
        return new ServletListenerRegistrationBean(myListener);
    }
}
```

#### DispatcherServlet 实现原理:

1. 在 `DispatcherServletAutoConfiguration` 中给容器配置并注入了 `dispatcherServlet` 组件，且属性绑定在 `WebMvcProperties` 中对应的配置项为 `spring.mvc`。
2. 其中另一个配置类中给容器配置注入了 `DispatcherServletRegistrationBean` 组件，它继承至 `ServletRegistrationBean<DispatcherServlet>` ，且配置器映射路径为 `/` (对应配置： `spring.mvc.servlet.path` )。

* context-path 配置项目上下文访问的前缀，path 配置的是 dispatcherServlet 拦截的路径。

多个 servlet 处理同一层路径采用精确优先原则（如有 `/my/` 与 `/my/2` 两个 servlet ,/my/1将进入第1个）。

由于 SpringBoot 的 web 都基于 dispatcherServlet 的 `/` 实现,因此我们自定义注入的原生 web 组件是直接执行，不会通过 SpringBoot 的相关功能（如拦截器）。

### 嵌入式 Servlet 容器：

#### 原理：

1. 在 `spring-boot-starter-web` 包中默认引入 Tomcat 的包。
2. 配置类 `ServletWebServerFactoryAutoConfiguration` 它导入了 `ServletWebServerFactoryConfiguration` 组件其中它会根据添加动态判断系统导入了那个 web 服务器的包，注入相应的服务器工厂组件（ `TomcatServletWebServerFactory` 、 `JettyServletWebServerFactory` 、 `UndertowServletWebServerFactory` ）。
3. `ServletWebServerApplicationContext` 它会在容器启动时寻找 `ServletWebServerFactory` （servlet web 服务器工厂），利用服务器工厂创建除服务器并启动。

#### 切换或去除嵌入式服务器：

1. 在 pom.xml 中引入 web 包时排除 Tomcat 依赖的包：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <exclusions>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-tomcat</artifactId>
    </exclusions>
</dependency>
```

2. 引入你需要的服务器包，SpringBoot 已配置好版本号不需要填写版本号直接引入即可。


### 数据校验

*   添加依赖：

```xml
<!-- SpringBoot JSR303数据校验 -->
<!-- https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-validation -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
    <version>2.5.4</version>
</dependency>
```

*   使用：

```java
@Validated  // 数据校验
public class Person {
    @Email(message="邮箱格式错误") // name 必须是邮箱格式
    private String name;
}
```

*   常用注解：

```java
空检查
@Null       验证对象是否为null
@NotNull    验证对象是否不为null, 无法查检长度为0的字符串
@NotBlank   检查约束字符串是不是Null还有被Trim的长度是否大于0,只对字符串,且会去掉前后空格.
@NotEmpty   检查约束元素是否为NULL或者是EMPTY.

Booelan检查
@AssertTrue     验证 Boolean 对象是否为 true
@AssertFalse    验证 Boolean 对象是否为 false

长度检查
@Size(min=, max=) 验证对象（Array,Collection,Map,String）长度是否在给定的范围之内
@Length(min=, max=) string is between min and max included.

日期检查
@Past       验证 Date 和 Calendar 对象是否在当前时间之前
@Future     验证 Date 和 Calendar 对象是否在当前时间之后
@Pattern    验证 String 对象是否符合正则表达式的规则
```


### Swagger

>   [Swagger官网：https://swagger.io/](https://swagger.io/)
>
>   1.   RestFul API 文档在线生成工具
>   2.   可直接运行，支持在线测试

#### 1. swagger 2 版：

*   pom.xml依赖：

```xml
<!-- swagger2 API 文档工具 -->
<!-- https://mvnrepository.com/artifact/io.springfox/springfox-swagger2 -->
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-swagger2</artifactId>
    <version>2.9.2</version>
</dependency>
<!-- https://mvnrepository.com/artifact/io.springfox/springfox-swagger-ui -->
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-swagger-ui</artifactId>
    <version>2.9.2</version>
</dependency>
```

*   Swagger2Config配置类：

**请产考下方swagger3 配置** ，swagger2 启动依赖为 `@EnableSwagger2` ,文档类型为`DocumentationType.SWAGGER_2` 其它使用无太大变化。

浏览器访问地址为： **项目地址/swagger-ui.html** 

#### 2. swagger 3 版：

*   swagger 3 依赖：

```xml
<!-- https://mvnrepository.com/artifact/io.springfox/springfox-boot-starter -->
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-boot-starter</artifactId>
    <version>3.0.0</version>
</dependency>
```

*   Swagger3Config配置类：

```java
@Configuration
//@EnableSwagger2 // 开启swagger2
@EnableOpenApi // 开启swagger3
public class SwaggerConfig {
    @Bean
    public Docket docket(){ // 配置 Docket bean实例
       // return new Docket(DocumentationType.SWAGGER_2) // swagger2
        return new Docket(DocumentationType.OAS_30) // swagger3
                .apiInfo(apiInfo())
                .enable(true) // 是否开启 swagger
                .groupName("分组1")
                .select()
                /** RequestHandlerSelectors 指定扫描方式的类
                 * basePackage：指定扫描需要生成api的包
                 * withClassAnnotation：扫描类上有指定注解的类(如GetMapping.class)
                 * withMethodAnnotation：扫描方法上有指定注解的方法
                 * any：全部扫描
                 * none：不扫描
                 */
                .apis(RequestHandlerSelectors.basePackage("ruoxijun.cn"))
                .paths(PathSelectors.ant("/find**")) // 请求过滤
                .build();
    }
    // 配置 swagger 网页的一些显示信息
    private ApiInfo apiInfo(){
        Contact contact = new Contact( // 作者信息
                "ruoxijun",
                "http://ruoxijun.cn/",
                "1460662245@qq.com");
        return new ApiInfo(
                "项目 Api 标题",
                "项目 Api 描述",
                "1.0",
                "http://ruoxijun.cn/",
                contact,
                "Apache 2.0",
                "http://www.apache.org/licenses/LICENSE-2.0",
                new ArrayList());
    }

    // 需要有多个分组时就配置多个 docketBean 即可
    @Bean
    public Docket docket2(){
        return new Docket(DocumentationType.SWAGGER_2)
                .groupName("分组2"); // 分组名（其它配置暂不写了）
    }
}
```

浏览器访问地址为： **项目地址/swagger-ui/index.html**

#### 3.常用注解：

1. conllection 类常用注解：

```java
@Api(tags = "conllection 类说明") // conllection 类描述
@ApiOperation(value = "请求方法作用",notes = "请求方法备注说明")

@ApiImplicitParams({ // 方法参数集，required 表示参数是否必须
    @ApiImplicitParam(name = "参数名",value = "参数描述",required = true),
    @ApiImplicitParam(name = "v",value = "value值",required = true)
}) // 参数较少时也可在方法参数旁添加：@ApiParam("参数描述")

@ApiResponses({ // 方法响应 code 描述，response 抛出的异常类
    @ApiResponse(code = 200,message = "返回数据成功"),
    @ApiResponse(code = 400,message = "返回数据失败",response = ParamsException.class)
})
```

2. 实体类常用注解：

```java
@ApiModel("用户实体类") // 类描述
@ApiModelProperty("用户id") // 成员变量描述
```

### 跨域

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
      // 设置允许跨域的路径
        registry.addMapping("/**")
                // 设置允许跨域请求的域名
                .allowedOriginPatterns("*")
                // 是否允许cookie
                .allowCredentials(true)
                // 设置允许的请求方式
                .allowedMethods("GET", "POST", "DELETE", "PUT")
                // 设置允许的header属性
                .allowedHeaders("*")
                // 跨域允许时间
                .maxAge(3600);
    }
}
```

## 数据库开发

### JDBC：

#### 1. 添加依赖：

```xml
<!-- 引入jdbc -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jdbc</artifactId>
</dependency>
<!-- mysql 驱动 -->
<!-- https://mvnrepository.com/artifact/mysql/mysql-connector-java -->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <!-- <version> 8.0.20 </version> 不提倡直接修改版本 -->
</dependency>
```

* 在 spring-boot-starter-jdbc 中引入了 **HikariDataSource** 数据源（数据库连接池）、jdbc、spring 事务包，因此我们需要操作什么数据库导入相应驱动即可。
* SpringBoot 默认数据库驱动版本一般与本机数据库版本不一致，建议修改版本配置与本机一致：

```xml
<properties>
    <mysql.version>8.0.20</mysql.version>
</properties>
```

#### 2. 数据库配置：

##### 自动配置分析：

1. `DataSourceAutoConfiguration` 数据源自动配置

* 数据源相关属性都与 `DataSourceProperties` 绑定，对应配置 `spring.datasource` 的相关属性。
* 数据库连接池默认的配置在我们没有配置 `DataSource` 时才会自动配置，且默认配置使用 `HikariDataSource` 连接池。

2. `DataSourceTransactionManagerAutoConfiguration` 事务管理器自动配置

##### 数据库相关配置：

```yaml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/ssm_crud?useSSL=false&useUnicode=true&characterEncoding=utf8&serverTimezone=GMT%2B8
    username: root
    password: 88888888
#    type: com.zaxxer.hikari.HikariDataSource 配置数据源（默认 hikari）
```

#### 3. 测试使用：

```java
@Slf4j // lombok
@SpringBootTest // spring-boot-starter-test
public class SpringBoot01Test {
    @Autowired
    JdbcTemplate jdbcTemplate;
    @Test
    public void dataSourceTest(){
        List<Map<String, Object>> maps = jdbcTemplate.queryForList("select * from book");
        log.info("查询结果 {} ", maps);
    }
}
```

### Druid：

>[项目官方地址：https://github.com/alibaba/druid](https://github.com/alibaba/druid)
>
>官方介绍：Druid 是 Java 语言中最好的数据库连接池，Druid 能够提供强大的监控和扩展功能。

#### 1. 使用 druid：

##### 1. 引入依赖：

```xml
<!-- https://mvnrepository.com/artifact/com.alibaba/druid -->
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid</artifactId>
    <version>1.2.14</version>
</dependency>

<!-- 如需使用 druid 数据监控时需要用到 log4j -->
<!-- https://mvnrepository.com/artifact/log4j/log4j -->
<dependency>
    <groupId>log4j</groupId>
    <artifactId>log4j</artifactId>
    <version>1.2.17</version>
</dependency>
```

##### 2. 配置 druid：

```yaml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/springboot-vue-manage?useSSL=false&useUnicode=true&characterEncoding=utf8&serverTimezone=GMT%2B8
    username: root
    password: 88888888

    filters: stat,wall # stat：SQL 监控，wall：SQL 防火墙
```

1. 要使用 druid 数据源，由前可知需要注入 druid 的 `DataSource` 来使默认的数据源失效（也支持配置文件中 `spring.dataSource.type` 属性配置数据源）。
2. 想要开启 druid 监控与统计数据的页面需要配置 `StatViewServlet` 。
3. 页面开启后 `DruidDataSource` 中配置 `filters` 属性开启各类监控，值 stat 开启 SQL 监控，值 wall 开启 SQL 防火墙。
4. 配置 `WebStatFilter` 可开启 web 监控，并设置统计和需要排除的请求。

```java
@Configuration
public class DruidConfiguration {
    // 配置 druid 数据源，并将此数据源属性与配置绑定
    @ConfigurationProperties("spring.datasource")
    @Bean
    public DataSource dataSource(){
        DruidDataSource dataSource = new DruidDataSource();
        return dataSource;
    }
    // 添加 StatViewServlet 开启数据统计页面
    @Bean
    public ServletRegistrationBean statViewServlet(){
        StatViewServlet viewServlet = new StatViewServlet();
        ServletRegistrationBean<StatViewServlet> registrationBean =
                new ServletRegistrationBean<>(viewServlet, "/druid/*");
        // 添加初始化参数并设置监控登录页面的账户
        registrationBean.addInitParameter("loginUsername", "admin");
        registrationBean.addInitParameter("loginPassword", "admin");
        return registrationBean;
    }
    // 开启 web 监控
    @Bean
    public FilterRegistrationBean webStatFilter(){
        WebStatFilter webStatFilter = new WebStatFilter();
        FilterRegistrationBean<WebStatFilter> registrationBean
                = new FilterRegistrationBean<>(webStatFilter);
        // 设置连接路径
        registrationBean.setUrlPatterns(Arrays.asList("/*"));
        // 添加初始化参数，exclusions 设置排除的请求，不加如统计
        registrationBean.addInitParameter("exclusions", "*.js,*.gif,*.jpg,*.png,*.css,*.ico,/druid/*");
        return registrationBean;
    }
}
```

在浏览器中访问 **项目地址/druid 或 项目地址/druid/login.html** 即可查看监控页面。

#### 2. druid starter:

##### 1. 引入 druid 的 starter：

```java
<!-- https://mvnrepository.com/artifact/com.alibaba/druid-spring-boot-starter -->
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid-spring-boot-starter</artifactId>
    <version>1.2.14</version>
</dependency>
```

除了引入 druid 包手动配置以外，druid 提供了 druid-spring-boot-starter 它引入了 druid、slf4j、以及一个自动配置 druid 的包，其中设置了大量默认配置项，也可以在配置文件中自定义配置值。

##### 2. druid starter 配置：

[druid/druid-spring-boot-starter 使用方法与详细配置](https://github.com/alibaba/druid/tree/master/druid-spring-boot-starter)

```yaml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/springboot-vue-manage?useSSL=false&useUnicode=true&characterEncoding=utf8&serverTimezone=GMT%2B8
    username: root
    password: 88888888

    druid:
      stat-view-servlet:
        enabled: true # 开启监控页面
        login-username: admin # 登录监控页面账号
        login-password: admin

      web-stat-filter: # web 监控
        enabled: true
        url-pattern:  /*
        exclusions: '*.js,*.gif,*.jpg,*.png,*.css,*.ico,/druid/*'

      filters: stat, wall # stat：SQL 监控，wall：SQL 防火墙，可单独详细配置
      aop-patterns: top.ruoxijun.bean.* # Spring 监控 AOP 切入点
```

### Mybatis：

#### 1. 引入依赖：

```xml
<!-- 数据库驱动 -->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
</dependency>
<!-- Mybatis -->
<!-- https://mvnrepository.com/artifact/org.mybatis.spring.boot/mybatis-spring-boot-starter -->
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>2.2.2</version>
</dependency>
<!-- 添加pagehelper分页插件集成依赖 -->
<!-- https://mvnrepository.com/artifact/com.github.pagehelper/pagehelper-spring-boot-starter -->
<dependency>
    <groupId>com.github.pagehelper</groupId>
    <artifactId>pagehelper-spring-boot-starter</artifactId>
    <version>1.4.5</version>
</dependency>
```

* mybatis-spring-boot-starter 中已经引入 jdbc starter 场景。

#### 2. 添加配置：

```yaml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/test?useSSL=false&useUnicode=true&characterEncoding=utf8&serverTimezone=GMT%2B8
    username: root
    password: 88888888

mybatis:
  # 指定原生 mybatis 总配置文件位置（ classpath: 表示 resources 文件夹下 ）
  # config-location: classpath:mybatis/mybatis-config.xml
  mapper-locations: classpath:mybatis/mapper/*.xml # mapper.xml 位置
  # 此配置项中包含所有全局配置，且不能与 config-location 配置同时存在
  configuration:
    map-underscore-to-camel-case: true # 驼峰命名与下划线匹配
  type-aliases-package: top.ruoxijun.entity # 为此包下的基类自动取别名

pagehelper: # 分页插件配置
  helper-dialect: mysql # 使用mysql
```

#### 3. 基础使用：

1. 创建 mapper 接口：

```java
@Mapper // 声明此类是 mybatis 的 mapper 类
public interface UserMapper { List<User> findAllUser(); }
```

每一个 mapper 类都要加一个 `@Mapper` 注解表明它是一个 mapper 接口，也可以选择在启动类中利用 `@MapperScan("top.ruoxijun.mapper")` 直接扫描整个 mapper 文件夹。

```java
@SpringBootApplication
@MapperScan("top.ruoxijun.mapper") // 扫描mapper文件夹中的所有mapper接口
public class MainApplication {
    public static void main(String[] args){ SpringApplication.run(MainApplication.class,args); }
}
```

使用扫描可能出现在使用 `@Autowired` 注解自动装配 mapper 对象时在 idea 编辑器中报红显示找不到对象，但是放心运行时是没有问题的。可以不理也可用以下方法解决：

* 使用 `@Resource` 注解装配 mapper 对象。

* 在 mapper 接口上使用 `@Repository ` 标识为 bean 。

* 关闭或修改IDE的代码检查

2. 在 *resources* 文件夹下新建 mapper-locations 配置中的文件夹，然后建立 mapper 接口的对应 mapper.xml 即可。

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="对应的 Mapper 文件位置">
</mapper>
```

### Mybatis Plus：

#### 1. 引入依赖：

[MyBatis-Plus 官网地址 (baomidou.com)](https://baomidou.com/)

```xml
<!-- https://mvnrepository.com/artifact/com.baomidou/mybatis-plus-boot-starter -->
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-boot-starter</artifactId>
    <version>3.5.2</version>
</dependency>
```

* 它已经引入了 mybatis 与 jdbc 等场景。
* 配置与 `MybatisPlusProperties` 绑定（ `mybatis-plus` ）。
* 配置 mapper.xml 文件位置属性 `mapperLocations` （ `mybatis-plus.mapper-locations` ） 默认值 `classpath*:/mapper/**/*.xml` 表示任意工程路径下所有 mapper 文件夹的下 xml 都是 mapper.xml （即不仅是当前项目 classpath 还包括 jar 包该路径下）。

#### 2. 简单实例：

1. 在 `MainApplication` 类上使用 `@MapperScan("top.ruoxijun.mapper")` 指定扫描的 mapper 接口包（也可使用 @Mapper 注解方式）。
2. 编写 mapper 接口并继承 `BaseMapper<User>` 泛型是你要操作的表对应的基类：

```java
public interface UserMapper extends BaseMapper<User> {}
```

* 在 `BaseMapper` 中已经为我们声明了一些常用的数据操作方法，无需编写 mapper.xml 文件，即可获得 crud 功能（当它满足不了某些需求时可新建方法与 xml 进行自定义）。

* 默认基类的属性在表中必须有对应字段否则报错，如果属性无对应字段可在该属性上标注 `@TableField(exist = false)` 表示该属性在表中不存在。

3. 实现 Service 业务类：

```java
// 继承 IService 接口，泛型为要操作的基类
public interface UserService extends IService<User> { }

@Service // 1. 标注 @Service 实现 service 接口
public class UserServiceImpl
    extends ServiceImpl<UserMapper, User> // 2. 继承 ServiceImpl 泛型分别为操作的 mapper 与基类
    implements UserService { }
```

4. 实现 Controller 请求：

```java
@RestController
public class UserController {
    @Autowired
    UserService userService;
    
    @RequestMapping({"user"})
    public Map<String, Object> user( @RequestParam(value = "pN", defaultValue = "1") Integer pageNum ) {
        HashMap<String, Object> map = new HashMap<>();
        List<User> users = userService.list(); // 查询表中所有数据
        
        // 分页查询
        Page<User> userPage = new Page<>(pageNum, 2);
        Page<User> page = userService.page(userPage);
        
        map.put("users", users);
        map.put("page", page);
        return map;
    }
}
```

* 分页查询还需要使用分页插件（其它插件使用方式同理）：

```java
@Configuration
public class MybatisPlusConfig {
    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        // 分页拦截器，已有默认属性可自定义分页属性
        PaginationInnerInterceptor paginationInnerInterceptor = new PaginationInnerInterceptor();
        interceptor.addInnerInterceptor(paginationInnerInterceptor);
        return interceptor;
    }
}
```

### Redis：

1. 引入 Redis 场景：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
<!-- 需要 jedis 操作 Redis 时引入 -->
<dependency>
    <groupId>redis.clients</groupId>
    <artifactId>jedis</artifactId>
</dependency>
```

* 默认引入了 **Lettuce** 操作 Redis，使用 **jedis** 需要我们手动引入并且在 `client-type` 配置项中申明想使用的客户端。

2. Redis 配置：

```yaml
spring:
  redis:
    host: 192.168.0.166 # 服务器地址
    port: 6379 # 端口
    database: 0 # 数据库索引
    username: # 用户名（没有可以去除）
    password: 123456 # 密码
    connect-timeout: 10s # 连接超时时间
    # client-type: jedis # 切换操作 Redis 的客户端
    lettuce: # redis 客户端（默认 lettuce，还有 jedis）
      pool: # 连接池配置
        max-active: 8 # 最大连接数（负数表示没有限制）
        max-wait: 200s # 最大阻塞等待时间（负数表示没有限制，默认 -1）
        max-idle: 8 # 最大空闲连接
        min-idle: 0 # 最小空闲连接
```

### 事务控制

*   SpringBoot 对事务提供了实现并自动配置我们只需在需要添加事务的方法上添加如下注释即可：

```java
@Transactional(propagation = Propagation.REQUIRED)
```

## 单元测试

### 简介与使用：

#### 1. 引入依赖：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
```

#### 2. Junit5：

SpringBoot 2.2.0 版本开始引入 JUnit5 作为单元测试默认库，由三个不同子项目的几个不同模块组成
`JUnit 5 = JUnit Platform + JUnit Jupiter + JUnit Vintage` 。

**JUnit Platform**: Junit Platform 是在 JVM 上启动测试框架的基础，不仅支持 Junit 自制的测试引擎，其他测试引擎也都可以接入。

**JUnit Jupiter**: JUnit Jupiter 提供了 JUnit5 的新的编程模型，是 JUnit5 新特性的核心。内部包含了一个**测试引擎**，用于在 Junit Platform 上运行。

**JUnit Vintage**: 由于 JUint 已经发展多年，为了照顾老的项目，JUnit Vintage 提供了兼容JUnit4.x,Junit3.x 的测试引擎。

* SpringBoot2.4 以上版本移除了默认对 **JUnit Vintage** 的依赖，如果需要兼容 junit4 需要自行引入：

```xml
<!-- 测试兼容 Junit4 -->
<dependency>
    <groupId>org.junit.vintage</groupId>
    <artifactId>junit-vintage-engine</artifactId>
    <scope>test</scope>
    <exclusions>
        <exclusion>
            <groupId>org.hamcrest</groupId>
            <artifactId>hamcrest-core</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```

#### 3. 使用方式：

1. 分别使用 `@SpringBootTest` 与 `@Test` （org.junit.**jupiter**.api.Test）注解标记测试类与测试方法：

```java
@SpringBootTest
public class SpringBootTest {
    @Test
    public void test(){ }
}
```

2. 被 `@SpringBootTest` 标记的类支持  `@Autowired` 、 `@Transactional` （标注的测试方法，测试完成后自动回滚） 等 SpringBoot 注解。

### Junit5 常用注解：

[JUnit 5 官方文档 - 常用注解](https://junit.org/junit5/docs/current/user-guide/#writing-tests-annotations)

- **@ParameterizedTest** : 表示方法是参数化测试
- **@RepeatedTest** : 表示方法可重复执行
- **@DisplayName** : 为测试类或者测试方法设置展示名称
- **@BeforeEach** : 表示方法在每个单元测试之前执行， `@AfterEach` （之后）同理
- **@BeforeAll** : 表示 **静态方法** 在所有单元测试之前执行， `@AfterAll` 同理
- **@Tag** : 表示单元测试类别，类似于 JUnit4 中的 `@Categories`
- **@Disabled** : 表示测试类或测试方法不执行，类似于 JUnit4 中的 `@Ignore`
- **@Timeout** : 表示测试方法运行如果超过了指定时间将会返回错误
- **@ExtendWith** : 为测试类或测试方法提供扩展类引用

### 断言机制：

#### 1. 简单断言：

* 测试方法中前面的断言失败则后面的代码不会执行。
* 断言方法一般都是 `Assertions` 中的静态方法，简单使用方式：

```java
import static org.junit.jupiter.api.Assertions.assertEquals; // 直接导入静态方法

@Test
void simple(){
    // 是否相等，参1 期望值、参2 实际值、参3（可选）错误信息
    assertEquals(1, 1, "值不相等");
    // 是否是同一个对象
    Object o = new Object();
    assertSame(o, o);
}
```

* 常用简单断言：

| 方法              | 说明                               |
| ----------------- | ---------------------------------- |
| assertEquals      | 两个对象值或两个原始类型值是否相等 |
| assertNotEquals   | 两个对象或两个原始类型是否不相等   |
| assertSame        | 两个对象引用是否指向同一个对象     |
| assertNotSame     | 两个对象引用是否指向不同的对象     |
| assertTrue        | 给定的布尔值是否为 true            |
| assertFalse       | 给定的布尔值是否为 false           |
| assertNull        | 给定的对象引用是否为 null          |
| assertNotNull     | 给定的对象引用是否不为 null        |
| assertArrayEquals | 两个对象或原始类型的数组是否相等   |

#### 2. 组合断言：

* 有需要多个断言全部满足条件时可使用 `assertAll` ：

```java
@Test
void assertAllTest(){
    assertAll("组合断言", // 参1（可选）为该组合断言取名字
            ()-> assertTrue(true),
            ()-> assertNotEquals(1, 2));
}
```

#### 3. 异常断言：

* 业务逻辑在某情况下一定出现异常时使用 `assertThrows` ：

```java
@Test
void assertThrowsTest(){
    assertThrows(ArithmeticException.class, // 预期错误类型
            ()-> { int i = 1 / 0; },
            "异常成功触发");
}
```

#### 4. 超时断言：

```java
@Test
public void timeoutTest() {
    //如果测试方法时间超过1s将会异常
    Assertions.assertTimeout(Duration.ofMillis(1000), () -> Thread.sleep(500));
}
```

#### 5. 快速失败：

```java
@Test
public void shouldFail() {
    fail("This should fail"); // 直接失败
}
```

### 前置条件：

assumptions（假设）当不满足某前置条件时测试将不会继续执行但不会报错：

```java
@Test
void assumeTest(){
    assumeTrue(true, "不是 true");
    assumingThat(true, // 条件满足时执行 Executable 接口
        ()-> System.out.println("是 true"));
}
```

### 嵌套测试：

在 Java 内部类上标注 `@Nested` 注解可实现嵌套测试（可无限嵌套），且内部单元测试会激活外部的 `@BeforeEach` 等（BeforeAll、After...）方法（反之不行）：

```java
class JunitTest {
    @Nested
    class NestedTest{
        // 测试方法或更多内部类嵌套...
    }
    // 测试方法...
}
```

### 参数化测试：

* `@ValueSource` : 为参数化测试指定入参来源，支持八大基础类以及 String 类型, Class 类型

* `@NullSource` : 表示为参数化测试提供一个 null 的入参

* `@EnumSource` : 表示为参数化测试提供一个枚举入参

* `@CsvFileSource` ：表示读取指定 CSV 文件内容作为参数化测试入参

* `@MethodSource` ：表示读取指定方法的返回值作为参数化测试入参(注意方法返回需要是一个流)

使用 `@ParameterizedTest` 注解标注方法表示这是一个参数化测试的方法：

```java
@ParameterizedTest
@ValueSource(strings = {"1", "2"}) // 将值依次传入测试方法中测试
void valueSourceTest(String s){
    assertNotNull(s);
}


@ParameterizedTest
@MethodSource("method") // 1. 指定方法名
public void testWithExplicitLocalMethodSource(String s) {
    assertNotNull(s);
}
// 2. 方法必须是 static 且返回流
static Stream<String> method() {
    return Stream.of("1", "2");
}
```

## 指标监控

### SpringBoot Actuator:

1. 依赖导入：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

2. 访问路径：

[localhost:8080/actuator/](http://localhost:8080/actuator/) 在此路径下还可以访问更详细的监控端点 `/actuator/**` ，默认 JMX 暴露所有端点而 web（http） 只默认暴露 **health** (/actuator/health) 和 **info** 端点。

3. 配置：

常用监控端点（Endpoint）：Health 监控状况、Metrics 运行时指标、Loggers 日志记录。

```yaml
management:
  # 配置所有端点的默认行为
  endpoints:
    enabled-by-default: false # 关闭所有监控端点
    web:
      exposure:
        include: '*' # 以 web 方式暴露所有监控端点
  # 配置具体端点
  endpoint:
    health:
      enabled: true # 开启 health 监控端点
      show-details: always # 开启 health 端点的详细信息显示
    metrics:
      enabled: true # 开启 metrics 端点
    loggers:
      enabled: true
```

4. 定制 Endpoint （Health、Metrics、Info、Endpoint 等）信息略。
5. 可视化：[spring-boot-admin：https://github.com/codecentric/spring-boot-admin](https://github.com/codecentric/spring-boot-admin)

## 启动过程

### 启动原理：

1. 在主程序中 `SpringApplication.run(MainApplication.class, args)` 方法创建了一个 `SpringApplication` 对象：

* 保存信息，判断当前应用类型。
* 找到所有的 bootstrapRegistryInitializers 初始启动引导器（在 spring.factories 找）。
* 找到所有的 ApplicationContextInitializer 初始化器（在 spring.factories 找）。

* 找到所有的 ApplicationListener 应用监听器（在 spring.factories 找）。

2. 执行 `SpringApplication` 对象的 `run` 方法：

* 记录应用启动时间，创建引导上下文（DefaultBootstrapContext），它会挨个执行之前获取的 **初始启动引导器** 的 initialize 方法完成引导启动器上下文环境设置。
* 让当前应用进入 headless（java.awt.headless） 模式。
* 获取所有 SpringApplicationRunListeners 运行监听器（在 spring.factories 找），遍历所有的运行监听器并调用它的 `starting` 方法（监听器执行 **应用开始启动** 事件）。
* 保存命令行参数 ApplicationArguments 。
* 准备环境 ConfigurableEnvironment：
    * 当前上下文有环境信息就获取否则就新创建一个基础环境信息。
    * 配置环境信息对象，读取所有配置源的配置属性值，绑定环境信息。
    * 遍历所有的运行监听器并调用它的 `environmentPrepared` 方法（监听器执行 **环境准备完成** 事件）。
*  创建 IOC 容器 `createApplicationContext()` (根据项目类型创建容器)。
* prepareContext 准备 IOC 容器基本信息：
    * applyInitializers 应用初始化器，遍历所有 **初始化器** 对 IOC 容器进行初始化。
    * 遍历所有的运行监听器并调用它的 `contextPrepared` 方法（监听器执行 **IOC 容器准备完成** 事件）。
    * 遍历所有的运行监听器并调用它的 `contextLoaded` 方法（监听器执行 **IOC 容器已加载** 事件）。
* refreshContext 刷新容器，在容器中创建所有需要创建的组件。
* afterRefresh 执行容器刷新后处理。
* 遍历所有的运行监听器并调用它的 `started` 方法（监听器执行 **IOC 容器已启动** 事件）。
* callRunners 调用所有的 runners：
    * 获取容器中的 ApplicationRunner 与 CommandLineRunner 并且按照 `@Order` 进行排序。
    * 遍历所有 runners 执行 run 方法。
* 如果以上有异常发生将调用运行监听器的 failed 方法（监听器执行 **项目启动失败** 事件）。
* 无异常将调用运行监听器的 ready 方法（实际执行 running 方法，监听器执行 **项目已完全启动** 事件），其中如果发生异常依然执行 failed 方法。
* 最后返回整个 IOC 容器。

### 自定义监听组件：

1. 需要在 resources 中 `META-INF/spring.factories` 内配置的组件：

* ApplicationContextInitializer

* ApplicationListener

* SpringApplicationRunListener

2. 直接可通过 Spring 注入容器中的组件（如添加 `@Component` 注解等方式）：

* ApplicationRunner

* CommandLineRunner

## 整合 Jsp

>   产考文献：[Spring Boot 中使用之 JSP 篇](https://blog.csdn.net/fmwind/article/details/81144905)
>
>   其它问题：[spring boot 设置启动时初始化 DispatcherServlet 出错](https://blog.csdn.net/jxchallenger/article/details/86760245?utm_medium=distribute.pc_relevant.none-task-blog-2~default~CTRLIST~default-1.no_search_link&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2~default~CTRLIST~default-1.no_search_link)

### 1. 所需依赖：

```xml
<!-- SpringBoot 内置tomcat对jsp的解析包 -->
<dependency>
    <groupId>org.apache.tomcat.embed</groupId>
    <artifactId>tomcat-embed-jasper</artifactId>
    <scope>provided</scope>
</dependency>
<!-- servlet 依赖 -->
<dependency>
    <groupId>javax.servlet</groupId>
    <artifactId>javax.servlet-api</artifactId>
</dependency>
<!-- jsp 依赖 -->
<dependency>
    <groupId>javax.servlet.jsp</groupId>
    <artifactId>javax.servlet.jsp-api</artifactId>
    <version>2.3.3</version>
</dependency>
<!-- jsp对jstl语法的依赖 -->
<dependency>
    <groupId>javax.servlet</groupId>
    <artifactId>jstl</artifactId>
</dependency>
```

### 2. application 配置：

```properties
spring.mvc.view.prefix: /WEB-INF/jsp/ # jsp存放文件夹(注意不包含webapp文件夹)
spring.mvc.view.suffix: .jsp # 视图文件后缀
```

这是 properties 文件配置 yml 配置文件同理转化即可。

### 3. idea 设置和问题：

#### 1. 资源过滤问题：

如果遇到 jsp 文件不在编译后的项目中可在 `pom.xml` 的 `build` 标签中添加如下资源过滤配置。（可以根据需要更改配置）

```xml
<!-- 一些项目中包含xml配置文件或资源文件可能在
打包时不能成功，需要在project中添加下配置 -->
<resources>
    <resource>
        <directory>src/main/java</directory>
        <includes>
            <include>**/*.properties</include>
            <include>**/*.xml</include>
        </includes>
        <filtering>true</filtering>
    </resource>
    <resource>
        <directory>src/main/resources</directory>
        <includes>
            <include>**/*.*</include>
        </includes>
        <filtering>true</filtering>
    </resource>
    <!-- 将webapp中的页面编译到META-INF/resources中 -->
    <resource>
        <directory>src/main/webapp</directory>
        <targetPath>META-INF/resources</targetPath>
        <includes>
            <include>**/*.*</include>
        </includes>
    </resource>
</resources>
```

#### 2. 将webapp在idea中设置为web资源文件夹：

![SpringBoot整合jsp](/images/java/springboot/boot+jsp.png)

#### 3. 项目找不到 jsp 文件：

![SpringBoot整合jsp](/images/java/springboot/boot+jsp2.png)

视图前缀配置中有人容易加上 `webapp` 文件夹前缀，也是造成jsp页面访问不到的原因。

## SpringBoot 任务

### 异步任务

1. 在主程序类上使用 `@EnableAsync` 注解开启异步任务。
2. 在需要异步执行的业务方法上添加 `@Async` 注解。

```java
@Service
public class TestService {
    @Async
    public void asyncTest() throws InterruptedException {
        Thread.sleep(3000);
    }
}
```

3. 该方法执行时自动异步执行，不会阻碍下方的代码执行。

```java
@RequestMapping(value = "asyncTest", method = RequestMethod.GET)
public String asyncTest() throws InterruptedException {
    testService.asyncTest();
    return "asyncTest";
}
```

### 邮件任务

1. 导入依赖：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
```

2. 以 QQ 邮箱为例，在账户中开启 **POP3/SMTP** 服务并获取 **授权码** 。
3. 邮箱配置：

```yaml
spring:
  mail:
    host: smtp.qq.com # 发送的服务器（smtp 不变，后面为对应的服务器）
    username: 1460662245@qq.com # 发送的账号
    password: 授权码 # 授权码
    # QQ 邮箱需要开启加密验证
    properties:
      mail:
        smtp:
          ssl:
            enable: true
```

4. 发送邮件：

```java
@Autowired
JavaMailSenderImpl mailSender;

@GetMapping("sendMail")
public String sendMail(@RequestParam String msg){
    SimpleMailMessage sendMail = new SimpleMailMessage(); // 简单的邮件协议
    sendMail.setFrom("1460662245@qq.com"); // 发件人
    sendMail.setTo("2994160002@qq.com"); // 收件人
    sendMail.setSubject("邮件主题");
    sendMail.setText("邮件内容");
    mailSender.send(sendMail);
    return msg + " - 发送成功";
}
```

5. 复杂邮件：

```java
MimeMessage mimeMessage = mailSender.createMimeMessage(); // 创建邮件
// 使用邮件助手设置邮件
MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
helper.setFrom("1460662245@qq.com");
helper.setTo("2994160002@qq.com");
helper.setSubject("邮件主题");
helper.setText("<h1>开启 HTML 解析</h1>", true);
helper.addAttachment("附件名称", new File("D:\\桌面文件\\IDEA-java主题配色.jar"));
mailSender.send(mimeMessage); // 发送邮件
```

### 定时任务

1. 在主程序类上使用 `@EnableScheduling` 注解标注开启定时任务功能。
2. 在需要开启定时任务的业务方法上使用 `@Scheduled` 注解标注，并使用 **cron** 表达式指定执行时间。

[在线Cron表达式生成器 (qqe2.com)](https://cron.qqe2.com/)

```java
// cron： 秒 分 时 日 月 星期
@Scheduled(cron = "0/5 * * * * *")
public void schedulingTest(){
    SimpleDateFormat date = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    System.out.println(date.format(new Date()) + " 每五秒执行");
}
```

### WebSocket

#### 添加依赖：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>
```

#### Server（服务端）：

1. 配置类中注入 `ServerEndpointExporter` 启用 websocket 支持：

```java
@Configuration
public class WebSocketConfig {
    @Bean
    public ServerEndpointExporter serverEndpointExporter(){
        return new ServerEndpointExporter();
    }
}
```

2. 编写 websocket 服务端：

```java
@Slf4j
@Service
@ServerEndpoint("/websocket/{id}") // 定义 websocket 访问地址(地址前必须有 '/')
public class WebSocketServer {
    private static final Map<String, Session> sessionMap = new HashMap();

    @OnOpen
    public void onOpen(@PathParam("id") String id, Session session){
        log.info("onOpen: {} , 当前连接数: {}", id, sessionMap.size());
        sessionMap.put(id, session);
        sendMsgAll("欢迎: "+ id +", 当前人数: "+ sessionMap.size());
    }

    @OnMessage
    public void OnMessage(@PathParam("id") String id, String message){
        log.info("OnMessage: {} -> {}", id, message);
        sendMsgAllNotMe(id, id+ "："+ message);
    }

    @OnClose
    public void OnClose(@PathParam("id") String id){
        log.info("OnClose: {} , 当前连接数: {}", id, sessionMap.size());
        sessionMap.remove(id);
        sendMsgAll("退出: "+ id +", 当前人数: "+ sessionMap.size());
    }

    @OnError // Throwable 参数必须有否则报错
    public void OnError(@PathParam("id") String id, Throwable error){
        log.info("OnError: {} , 当前连接数: {}", id, sessionMap.size());
        if (sessionMap.containsKey(id)){
            sessionMap.remove(id);
        }
        sendMsgAll("出错: "+ id +", 当前人数: "+ sessionMap.size());
    }

    public static void sendMsg(String id, String message){
        Session session = sessionMap.get(id);
        session.getAsyncRemote().sendText(message);
    }
    public static void sendMsgAll(String message){
        for (Session session : sessionMap.values()){
            session.getAsyncRemote().sendText(message);
        }
    }
    public static void sendMsgAllNotMe(String id, String message){
        for (String i : sessionMap.keySet()){
            if (!i.equals(id)){
                Session session = sessionMap.get(i);
                session.getAsyncRemote().sendText(message);
            }
        }
    }
}
```

#### Client（客户端）：

```java
@Data
@Slf4j
@Component
@ClientEndpoint // 定义客户端
public class CqClient {

    private static Session s;
    @Value("${client.uri}")
    private String uri;

    // 连接
    public boolean connect(){
        if (s == null || !s.isOpen()){
            try {
                s =  ContainerProvider.getWebSocketContainer()
                        .connectToServer(this, new URI(this.uri));
            } catch (Exception e) {
                e.printStackTrace();
                return false;
            }
        }
        return true;
    }

    @OnOpen
    public void OnOpen(Session session){
        log.info("OnOpen 连接成功");
    }
    @OnMessage
    public void OnMessage(String message){
        log.info("接收消息 ---> " + message);
    }
    @OnClose
    public void OnClose(Session session){
        log.info("OnClose 连接关闭");
    }
    @OnError
    public void OnError(Session session, Throwable throwable){
        log.info("OnError 连接出错");
    }

    public static void sendMsg(String msg) throws JsonProcessingException {
        s.getAsyncRemote().sendText(msg);
    }
}
```

## 日志

* 基本使用：

```java
private static final Logger logger = LoggerFactory.getLogger(MyClass.class);

logger.debug("This is a debug message");
logger.info("This is an info message");
logger.warn("This is a warning message");
logger.error("This is an error message");

// 使用占位符 {}
logger.debug("User {} logged in successfully", username);

// 调试时条件
if (logger.isDebugEnabled()) {
    String expensiveDebugInfo = generateExpensiveDebugInfo();
    logger.debug("Expensive debug info: {}", expensiveDebugInfo);
}

// 建议错误日志打印方式
try {
    // Some code that may throw an exception
} catch (Exception e) {
    logger.error("An error occurred: {}", e.getMessage(), e);
}
```

* 在 Spring Boot 项目中只需将 `logback-spring.xml` 文件放置在 `src/main/resources` 目录下，Spring Boot 就会在启动时自动加载并应用这个日志配置：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <!-- 引入 Spring Boot 提供的默认配置 -->
    <include resource="org/springframework/boot/logging/logback/base.xml"/>

    <!-- 定义变量 -->
    <!-- 日志文件的存储位置 -->
    <property name="LOG_HOME" value="./logs" />
    <!-- 应用程序名称 -->
    <property name="APP_NAME" value="application" />
    <!-- 日志文件的最大历史记录数，单个日志文件的最大大小 -->
    <property name="MAX_HISTORY" value="30" />
    <property name="MAX_FILE_SIZE" value="10MB" />
    <!-- 控制台和文件的日志输出格式 -->
    <property name="CONSOLE_PATTERN" value="%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n" />
    <property name="FILE_PATTERN" value="%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n" />

    <!-- 控制台日志配置 -->
    <appender name="Console" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>${CONSOLE_PATTERN}</pattern>
        </encoder>
    </appender>

    <!-- 文件日志配置 -->
    <appender name="RollingFile" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <!-- 文件名与日志格式 -->
        <file>${LOG_HOME}/${APP_NAME}-0-current.log</file>
        <encoder>
            <pattern>${FILE_PATTERN}</pattern>
        </encoder>
        <!-- 日志滚动策略 -->
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <!-- 日志文件名、单个日志文件最大大小 -->
            <fileNamePattern>${LOG_HOME}/${APP_NAME}-%d{yyyy-MM-dd}.%i.log</fileNamePattern>
            <timeBasedFileNamingAndTriggeringPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedFNATP">
                <maxFileSize>${MAX_FILE_SIZE}</maxFileSize>
            </timeBasedFileNamingAndTriggeringPolicy>
            <!-- 文件保存最多个数，超过时会删除之前的文件 -->
            <maxHistory>${MAX_HISTORY}</maxHistory>
        </rollingPolicy>
    </appender>

    <!-- root 处理所有的日志事件，level="INFO" 日志级别 -->
    <root level="INFO">
        <appender-ref ref="Console"/>
        <appender-ref ref="RollingFile"/>
    </root>
    <!-- 为特定的包或类配置单独的日志事件（可定义多个），
        additivity="false" 不会将日志传递给其祖先 Logger -->
    <logger name="com.example" level="DEBUG" additivity="false">
        <appender-ref ref="Console"/>
        <appender-ref ref="RollingFile"/>
    </logger>
</configuration>
```

