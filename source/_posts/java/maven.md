---
title: Maven
date: 2020-05-17 16:24:35
categories: Java
tags: 
    - maven
    - idea
---

# Maven 安装与使用

> Maven 突出的几个特点：
>
> -   有**强制**规定的**指定文件**存放指定文件，方便管理项目
> -   jar 包的管理，使用 jar 包时我们不用再将整个 jar 包存放在项目中。maven 中有 jar 仓库，将需要的**jar 包依赖**(jar 的坐标)写入 maven 的配置内，它会帮我们找到需要的 jar 包

## 1. Maven 的安装

> 我们也回忆一下 Java jdk 和 Tomcat 的安装。(下载不用多说，见官网： [https://maven.apache.org/](https://maven.apache.org/))
> 几个安装都有的前奏： `我的电脑右击 → 属性 → 高级系统设置 → 环境变量`

### 安装后续：

**`新建系统变量 → 变量名MAVEN_HOME，变量值Maven解压的路径，确定 → 找到Path，编辑输入：%刚刚定义的变量名%\bin`**

打开 cmd 输入`mvn -v`查看是否成功。

> jdk 和 Tomcat 的安装与此差别不大，不过 jdk 变量名为：JAVA_HOME，Tomact 变量名为：CATALINA_HOME。

## 2. Maven 全局配置文件(settings.xml)

> 以下配置都是在 Maven 安装文件夹下的 conf 文件夹下 settings.xml 文件中需要添加或修改的配置

### 设置仓库位置：

定义存放 jar 包的本地仓库(路径)：

```xml
// 建议先创建好该路径且路径以 repository 结尾
<localRepository>自定义的仓库路径/repository<localRepository>
```

### 设置阿里云中央仓库(镜像)：

原镜像下载极慢可以用无法使用来形容，替换为国内的阿里云镜像。

```xml
<mirrors>
    <mirror>
        <id>alimaven</id>
        <name>aliyun maven</name>
        <url>http://maven.aliyun.com/nexus/content/groups/public/</url>
        <mirrorOf>central</mirrorOf>
    </mirror>
</mirrors>
```

### 配置全局编译 jdk 版本：

在 `<profiles></profiles>` 标签中添加：

```xml
<!-- 声明编译环境的 jdk 版本 -->
<profile>
    <id>jdk-1.8</id>
    <activation>
        <activeByDefault>true</activeByDefault>
        <jdk>1.8</jdk>
    </activation>

    <properties>
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>
        <maven.compiler.compilerVersion>1.8</maven.compiler.compilerVersion>
    </properties>
</profile>
```

## 3. Maven 项目结构与文件

### 项目标准目录结构：

1. src/main/java：核心代码部分
2. src/main/resources：配置文件部分
3. src/test/java:测试代码部分
4. src/test/resources：测试配置文件
5. target：编译后自动生成存储 class 文件的文件夹
6. src/main/webapp：web(网页)有关文件(此部分是创建 web 项目才需要)

> web项目webapp下必须有 **WEB-INF**目录，WEB-INF下必须有 **web.xml** 文件和classes(编译后)，其中classes中存放的是编译好的class
> Tomcat规定的必须这样建立目录才会Tomcat认为是web项目

### pom.xml 文件：

`Maven 工程配置文件：依赖管理，项目信息、运行环境信息(jdk、Tomcat 信息等)`

基本样式：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!-- 头文件标签，对xml文件的约束与标识 -->
<project xmlns="http://maven.apache.org/POM/4.0.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
                        https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <!-- 指定 pom.xml 符合哪个版本的描述符。maven2和3 只能为 4.0.0 -->
    <modelVersion>4.0.0</modelVersion>

    <!-- 项目信息(此项目坐标)： -->
    <groupId>逆向域名</groupId><!-- 创建项目的组织名称的逆向域名。一般对应 java 的包结构 -->
    <artifactId>项目名</artifactId><!-- 单独项目的唯一标识符 -->
    <version>当前项目版本</version><!-- 项目的特定版本 -->

    <!-- 项目打包后的类型(默认jar，war：打包为web应用，pom：为父工程时) -->
    <packaging>jar</packaging>

    <!-- 依赖组：管理所有依赖总标签，且子项目直接继承此中依赖 -->
    <dependencies>
        <!-- 依赖：添加某个依赖 -->
        <dependency><!-- 依赖的坐标(与项目信息类似) -->
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.13</version>
        </dependency>
        <!-- 可继续添加多个依赖 -->
    </dependencies>

    <!-- 依赖管理：此中添加的依赖，子项目不能直接继承。
    且子项目添加同依赖时可以省去版本号标签，默认父类版本 -->
    <dependencyManagement>
        <dependencies><!-- 依赖组 -->
            <dependency><!-- 依赖 -->
                <groupId></groupId>
                <artifactId></artifactId>
                <version></version>
            </dependency>
        </dependencies>
    </dependencyManagement>
</project>
```

构建设置：

```xml
<!-- 对项目构建进行设置 -->
<build>
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
                <include>**/*.properties</include>
                <include>**/*.xml</include>
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
</build>
```

## 4. Maven 常用命令与生命周期

### 常用命令：

> 首先 cmd 进入 Maven 项目路径，在项目目录下使用如下指令

-   `mvn compile`：对 java 文件进行编译，并在 src 外创建了一个 target 目录，将编译文件存放在了里面。
-   `mvn test`：测试文件夹下和主 Java 文件夹下的 java 文件都编译
-   `mvn package`：**打包**，将所有 java 和 test 编译，再打包成指定文件(通过项目下的**pom.xml**文件**packaging 标签**决定打包类型)都放在 target 文件夹下
-   `mvn clean`：清理编译的文件，target 文件夹将被删除
-   `mvn install`：安装，编译 + 打包 + 将打包文件移到到本地仓库

### Maven 生命周期(简化周期)：

> 默认生命周期：验证(validate) → 编译(compile) → 测试(test) → 打包(package) → 验证(verify) → 安装(install) → 发布(deploy)
> 清理生命周期：清除项目编译信息(clean)

## 5. IDEA 配置 Maven：

1. `file → settings` 方式表示本项目设置，当创建新项目时设置内容将重置。所以我们需要 **配置新建项目** 的设置如下图：

![新项目设置](/images/java/new_pro_set.jpg)

2. 配置新建项目的 Maven 设置：

![设置 Maven](/images/java/idea_maven_set.jpg)

将 Maven → Runner 中下图选项勾选，否则容易出现导入的依赖在测试或运行时报依赖中的类不存在的错误，若还是出现此错误建议使用maven命令： `mvn idea:idea` 之后再运行。（目前已知idea2020.1常出现此错误）

![测试或运行设置](/images/java/run.jpg)

3. 此后新建的 Maven 项目都配置好了，但此项目配置并未改变。只需在 `file → settings` 中按步骤 2 同等配置即可。
4. 同上图中 **Skip Tests** （跳过测试）选项打钩，问题缘由我在整合mybatis和spring时调用插入数据方法， **SQL语句被执行了两遍** 这主要是运行时测试调用了一次主项目再会调用一次。

## 6. Maven 依赖详解

### 了解 `classpath`：

-   简单的理解就是，项目编译好后形成的 `class` 文件所在的路径。
-   Maven 工程会将 `src/main/java` 和 `src/main/resources` 文件夹下的文件编译后全部打包在 `classpath` 中。

### 依赖范围(常用)：

> Maven 中添加的依赖编译后也会打包进 `classpath` 中，而不同的阶段所需依赖不同。
> 此时我们可以给依赖添加范围限制，依赖中通过 `scope` 标签中添加限制指令方式规定依赖的范围。

| 限制指令 | 范围                                            |
| -------- | ----------------------------------------------- |
| compile  | 未写 `scope` 标签时默认。编译，测试，运行都有效 |
| test     | 测试时有效                                      |
| provided | 编译和测试有效                                  |
| runtime  | 测试和运行有效                                  |

如下 `junit` 依赖只有测试才需要用到，所以使用 `test` 对齐加以限制：

```html
<dependencies>
    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.13</version>
        <!-- 指明依赖范围 -->
        <scope>test</scope>
    </dependency>
</dependencies>
```

### 依赖传递：

* 依赖传递使我们不需要关注添加的依赖是否依赖了其它依赖。Maven会自动将所关联的依赖以自动传递的方式传递进来。
* 最短路径优先：A依赖了B和D，B依赖了C和D，当A和B所依赖的D版本不同时，会选择A依赖的D作为最终依赖。
* 先声明优先：项目中依赖了A和B它们同时依赖了C，当两个C版本不同时，取决于我们先依赖A还是B，谁先声明就最终依赖谁的C。

## IDEA 中 Maven 常见错误(待改正)：

1. 本地运行错误(Javaweb)：

在本地运行时 idea 中需要设置配置 Tomcat7 运行方式，在 `pom.xml` 中插入如下配置：

```html
<build>
    <plugins>
        <plugin>
            <!--表明以方式Tomcat7启动-->
            <groupId>org.apache.tomcat.maven</groupId>
            <artifactId>tomcat7-maven-plugin</artifactId>
            <version>2.2</version>
            <!--其它可选项设置-->
            <configuration>
                <port>8080</port
                ><!--端口-->
                <uriEncoding>UTF-8</uriEncoding
                ><!--编码-->
                <path>/url</path
                ><!--访问应用路径-->
            </configuration>
        </plugin>
    </plugins>
</build>
```

之后 maven 中输入 `mvn tomcat7:run` 运行。

2. Servlet 中@WebServlet("XXXX")注解无效(javaweb):

打开 web.xml 检查 web-app 标签中的两个属性，①version 是否大于 3.0，②metadata-complete 是否为 false，或直接将 `web.xml` 中 web-app 头标签替换为如下设置：

```html
<web-app
    xmlns="http://xmlns.jcp.org/xml/ns/javaee"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee
        http://xmlns.jcp.org/xml/ns/javaee/web-app_3_1.xsd"
    version="3.1"
    metadata-complete="false"
></web-app>
```

3. maven 的程序测试运行必须检查是否有 `Junit` 包：
   pom.xml 中：

```java
<dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>4.13</version>
    <scope>test</scope>
</dependency>
```
