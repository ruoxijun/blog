---
title: mybatis 配置
date: 2020-08-07 16:44:33
categories: SpringBoot
tags: 
    - mybatis
    - log4j
    - pagehelper
---

## 配置文件，日志，分页

### 核心配置文件解析与优化：

详情请看：[官方配置文档](https://mybatis.org/mybatis-3/zh/configuration.html#typeAliases)

>注意官方规定`mybatis-config.xml`文件中`configuration`标签中的配置标签必须遵循如下顺序：
>
>`properties` → `settings` → `typeAliases` → `typeHandlers` → `objectFactory` → `objectWrapperFactory` → `reflectorFactory` → `plugins` → `environments` → `databaseIdProvider` → `mappers`

#### 1. 环境配置（environments）：

从我们熟悉的 `environments` 标签入手，首先看一下官方提供的环境配置的模板：

```xml
<environments default="development">
  <environment id="development">
    <transactionManager type="JDBC">
      <property name="..." value="..."/>
    </transactionManager>
    <dataSource type="POOLED">
      <property name="driver" value="${driver}"/>
      <property name="url" value="${url}"/>
      <property name="username" value="${username}"/>
      <property name="password" value="${password}"/>
    </dataSource>
  </environment>
</environments>
```

1. 环境与配置：`environments` 内配置环境可存在多个环境，一个`environment` 就是一个环境。`environments` 中的 **default** 值应为某个`environment` 环境的 **id** 值，它表示默认使用那一个环境。

   * 此外官方还提到：**尽管可以配置多个环境，但每个 SqlSessionFactory 实例只能选择一种环境。**

   * 如果你连接多个数据库，就需要创建多个 SqlSessionFactory 实例。mybatis提供了以下4种方法创建SqlSessionFactory 实例：

     ```java
     // 以下两种使用`environments`默认的环境
     SqlSessionFactory factory = new SqlSessionFactoryBuilder().build(reader);
     SqlSessionFactory factory = new SqlSessionFactoryBuilder().build(reader, properties);
     // 以下两种可利用参2根据传入`environment`的id来确认使用某个环境
     SqlSessionFactory factory = new SqlSessionFactoryBuilder().build(reader, environment);
     SqlSessionFactory factory = new SqlSessionFactoryBuilder().build(reader, environment, properties);
     ```

2. 事务管理：`transactionManager` 有两种类型事务管理器即 **type** 的值有 **JDBC** 和 **MANAGED** 两个：

   * JDBC：直接使用了 **JDBC 的提交和回滚设施**，它依赖从数据源获得的连接来管理事务作用域。
   * MANAGED：几乎不用。mybatis自身不会去实现事务管理，让程序的容器来实现事务的管理。
   * 官方提到使用 Spring + MyBatis，没有必要配置事务管理器可写成：`<transactionManager type="JDBC"/>`

3. 数据源：`dataSource` 使用标准的 JDBC 数据源接口来配置 JDBC 连接对象的资源：

   * `dataSource` 属性 **type** 的值有3种其中默认 **POOLED** ：利用“池”将 JDBC 连接对象组织起来，避免创建新的连接实例花费时间。 一般常用此属性，能使并发 Web 应用快速响应请求。
   * `property`：中**name**属性常配置的有4个：1. `driver` JDBC 驱动的 Java 类全限定名，2. `url` 数据库的 JDBC URL 地址，3.`username` 登录数据库的用户名，4. `password` 登录数据库的密码。需要在 **value** 属性中赋予响应的值。

#### 2. 属性（properties）：

利用典型的 Java 属性文件(properties后缀)动态配置属性。在 `resources` 文件夹下新建文件 **db.properties** (文件名可自定义)，文件中 **=** 号前为 **key** 后为 **value**：

```properties
driver=com.mysql.cj.jdbc.Driver
url=jdbc:mysql://localhost:3306/test?useSSL=false&useUnicode=true&characterEncoding=utf8&serverTimezone=GMT%2B8
username=root
password=991314
```

在 **mybatis-config.xml** 文件的`configuration`标签中利用`properties`标签引入属性文件：

```xml
<properties resource="db.properties" />
```

此时就可以利用属性文件动态的替换属性值了，在需要引用的地方利用 `${key}` 的方式动态替换。如官方提供的环境配置模板中数据库连接配置处正是使用了此种方式：

```xml
<dataSource type="POOLED">
  <property name="driver" value="${driver}"/>
  <property name="url" value="${url}"/>
  <property name="username" value="${username}"/>
  <property name="password" value="${password}"/>
</dataSource>
```

`properties` 除引入属性文件以外，还能在其内部利用`property`标签定义键值对。

```xml
<properties resource="db.properties">
    <property name="username" value="false"/>
    <property name="password" value="false"/>
</properties>
```

当`properties`中和属性文件内都定义了key相同的键值对时会发生什么，我们看一段官方的文档内容：

- 首先读取在 properties 元素体内指定的属性。
- 然后根据 properties 元素中的 resource 属性读取类路径下属性文件，或根据 url 属性指定的路径读取属性文件，并覆盖之前读取过的同名属性。
- 最后读取作为方法参数传递的属性，并覆盖之前读取过的同名属性。

由此可知标签内的键值对先被读取，再读取属性文件内的值。所以属性文件内的值会覆盖标签的定义值。

#### 3.类型别名（typeAliases）：

```xml
<select id="getUsersList" resultType="io.github.ruoxijun.pojo.UserPojo">
    select * from user
</select>
```

如上在Mapper.xml中设置select的返回值类型时使用了`resultType="io.github.ruoxijun.pojo.UserPojo"`完整路径类名的方式声明类型，项目中不止一个地方会用到这个全名。书写全名是比较繁琐的因此给它**取别名**是最好的选择。

1. **Mybatis-config.xml**中`typeAlias`配置单个类型别名：

```xml
<!-- typeAliases别名组标签 -->
<typeAliases>
    <!-- typeAlias别名配置:
        type：类型名要完整的路径全名
        alias：别名（可以理解为变量名） -->
    <typeAlias type="io.github.ruoxijun.pojo.UserPojo" alias="userPojo" />
</typeAliases>
```

之后在需要使用此类型名的地方引用此别名即可，如上例可替换为：

```xml
<select id="getUsersList" resultType="userPojo">
    select * from user
</select>
```

2. **Mybatis-config.xml**中`package`配置包中所有类的类型别名：

```xml
<package name="io.github.ruoxijun.pojo" /><!-- typeAliases标签内 -->
```

此配置此包内的所有类都会自动取别名，且**别名为忽视大小写的类名**。官方推荐引用时采用**类名首字母小写**的方式引用。

3. 使用注解取别名：

```java
@Alias("user") // 为此类取别名为 user
public class UserPojo {}
```

此三种方式可随意使用不冲突，同时使用时取的所有别名都可生效都可引用。

#### 4. 映射器（mappers）：

之前我们在`mybatis-config.xml`的mapper中利用**resource**属性注册的Mapper.xml就是映射器。这只是注册映射器的方法之一：

```xml
<mappers>
    <mapper resource="io/github/ruoxijun/mapper/UserMapper.xml" />
</mappers>
```

* 使用映射器接口实现类的完全限定类名

```xml
<mappers>
  <mapper class="io.github.ruoxijun.mapper.UserMapper"/>
</mappers>
```

注意：此方式要求Mapper接口和Mapper.xml的**文件名必须同名且在同一个包下**。

* 将包内的映射器接口实现全部注册为映射器

```xml
<mappers>
  <package name="io.github.ruoxijun.mapper"/>
</mappers>
```

注意：此方式要求Mapper接口和Mapper.xml的**文件名必须同名且在同一个包下**。

### resultMap 结果集映射：

之前我们写数据库表的对应字段类时要求，类中成员变量名与字段名要相同。这时我**将第3个成员变量`age`改为`a`**。运行查询表所有信息后**a为的值全为0**也就是没有赋值，可知Mybatis是根据字段名是否匹配来做操作的。

##### 1.因此对于查表可以利用SQL查询语句给 *字段取别名* 方式来解决字段名不同的问题：

```xml
<select id="getUserList" resultType="userPojo" >
    select id,name,age as a from user
</select>
```

但这不是最好的方法，Mybatis有更好的方案来解决此类问题。

##### 2. 在Mapper.xml中(mapper标签内)配置resultMap结果映射：

```xml
<!-- id：此结果映射集的id
    type：表字段对应的字段类(pojo类)，这里使用的该类的类型别名 -->
<resultMap id="userMap" type="userPojo">
    <!-- 对于字段名和成员变量同名的字段可以不用配置默认即可 -->
    <result column="id" property="id"/>
    <result column="name" property="name"/>
    <!-- column：数据库字段名
        property：映射到此类指定的变量 -->
    <result column="age" property="a"/>
</resultMap>
```

使用时不能在使用**resultType**属性，该为**resultMap**属性值为自定义属性结果集的**id**：

```xml
<select id="getUserList" resultMap="userMap" >
    select * from user
</select>
```

没有自行配置**resultMap**之前Mybatis自动创建了一个默认的字段名与映射名相同的**resultMap**。这也是为什么之前我要求类的成员变量名与表的字段名对应的原因。、

### 日志：

#### settings 设置：

学习日志前先了解一下 Mybatis 核心配置文件中的 **settings** 这是 MyBatis 中极为重要的调整设置，它们会改变 MyBatis 的运行时行为。

**settings** 每一项  **setting** 标签就是一项设置，通过指定属性`name`和`value`的值来完成一项设置。其中包括日志的设置：

```xml
<!-- MyBatis 中的调整设置 -->
<settings>
    <!-- logImpl：日志实现 
        STDOUT_LOGGING：控制台日志 -->
    <setting name="logImpl" value="STDOUT_LOGGING"/>
    <!-- 开启驼峰命名自动映射 -->
    <setting name="mapUnderscoreToCamelCase" value="true"/>
</settings>
```

#### 控制台日志（STDOUT_LOGGING）：

上方对**setting**的设置指定使用了控制台日志，运行以后大致会输出以下日志内容：

```java
// 打开 JDBC 的连接
Opening JDBC Connection
// 创建一个 connection (连接对象)
Created connection 247944893.
// 在 JDBC 连接上将 autocommit (事务自动提交)设置为 false
Setting autocommit to false on JDBC Connection [com.mysql.cj.jdbc.ConnectionImpl@ec756bd]
// 执行的 SQL 语句
==>  Preparing: select * from user
// 传入的参数(此处参数为空)
==> Parameters: 
// 查询的信息
<==    Columns: id, name, age
<==        Row: 1, 张三, 10
<==      Total: 1
// 打印的数据(System.out.println)
UserPojo{id=1, name='张三', a=10}
// 在 JDBC 连接上将 autocommit 重置为 true
Resetting autocommit to true on JDBC Connection[com.mysql.cj.jdbc.ConnectionImpl@ec756bd]
// 关闭 JDBC 连接
Closing JDBC Connection [com.mysql.cj.jdbc.ConnectionImpl@ec756bd]
// 将连接返回数据库连接池
Returned connection 247944893 to pool.
```

#### LOG4J 日志：

##### 文件配置实现日志：

1. 同在 **settings** 中配置使用 **LOG4J**：`<setting name="logImpl" value="LOG4J"/>`

2. 光设置还不能使用我们还需要导入**LOG4J**依赖，在**pom.xml**中导入log4j的包：

   ```xml
   <!-- https://mvnrepository.com/artifact/log4j/log4j -->
   <dependency>
       <groupId>log4j</groupId>
       <artifactId>log4j</artifactId>
       <version>1.2.17</version>
   </dependency>
   ```

3. 在**properties**中新建配置文件**log4j.properties**：

    ```properties
    #将等级为DEBUG的日志信息输出到console和file这两个目的地，console和file的定义在下面的代码
    log4j.rootLogger=DEBUG,console,file
    
    #控制台输出的相关设置
    log4j.appender.console = org.apache.log4j.ConsoleAppender
    log4j.appender.console.Target = System.out
    log4j.appender.console.Threshold=DEBUG
    log4j.appender.console.layout = org.apache.log4j.PatternLayout
    log4j.appender.console.layout.ConversionPattern=[%c]-%m%n
    
    #文件输出的相关设置
    log4j.appender.file = org.apache.log4j.RollingFileAppender
    log4j.appender.file.File=./log/runTime.log
    log4j.appender.file.MaxFileSize=10mb
    log4j.appender.file.Threshold=DEBUG
    log4j.appender.file.layout=org.apache.log4j.PatternLayout
    log4j.appender.file.layout.ConversionPattern=[%p][%d{yy-MM-dd}][%c]%m%n
    
    #日志输出级别
    log4j.logger.org.mybatis=DEBUG
    log4j.logger.java.sql=DEBUG
    log4j.logger.java.sql.Statement=DEBUG
    log4j.logger.java.sql.ResultSet=DEBUG
    log4j.logger.java.sql.PreparedStatement=DEBUG
    ```

    现在就已经实现对Mybatis的日志打印了。


##### 代码中简单使用**LOG4J**日志：

```java
// 获取日志对象(建议设置为类对象)需要当前类的class对象作为参数
Logger logger = Logger.getLogger(Demo.class);
@Test
public void testLog(){
    // 三种不同级别的日志打印方式
    logger.info("Log4j日志打印级别：info");
    logger.debug("Log4j日志打印级别：debug");
    logger.error("Log4j日志打印级别：error");
}
```

### 查询数据分页：

#### 1. SQL语句 **limit** 实现分页：

分页查询数据最简单最实用的方法就是在Mapper.xml中书写SQL语句时使用 **limit** 实现分页查询。

Mapper接口中定义分页查询方法：

```java
List<UserPojo> getUserLimit(Map<String,Object> map);
```

Mapper.xml中书写SQL语句：

```xml
<select id="getUserLimit" resultMap="userMap" parameterType="map">
    select * from user limit #{startIndex},#{pageSize}
</select>
```

使用（此处省略获取mapper实例等步骤）：

```java
Map<String,Object> map = new HashMap<>();
map.put("startIndex",0);
map.put("pageSize",3);
List<UserPojo> userLimit = mapper.getUserLimit(map);
```

#### 2. 使用 RowBounds 对象方式(了解)：

RowBounds只是逻辑上的分页，它是将SQL已经查询到的数据进行分页。

```java
// 构造函数参数与limit类似：参1表示数据开始位置角标，参2表示当前页的数据个数
RowBounds rowBounds = new RowBounds(0,3);
SqlSession sqlSession = GetSqlSession.getSqlSession();
// 参1为 Mapper 接口的全名加使用的方法名，参3传入 RowBounds 即可
List<UserPojo> userPojoList = sqlSession
    .selectList("io.github.ruoxijun.mapper.UserMapper.getUserList",
                null, rowBounds);
for (UserPojo user : userPojoList) {
    System.out.println(user);
}
sqlSession.close();
```

#### 3. MyBatis 分页插件 PageHelper ：

[MyBatis 分页插件官网（内有文档使用教程）](https://pagehelper.github.io/)

* 添加依赖：

```xml
<dependency>
    <groupId>com.github.pagehelper</groupId>
    <artifactId>pagehelper</artifactId>
    <version>5.2.0</version>
</dependency>
```

* mybatis配置文件中配置插件：

```xml
<plugins>
    <plugin interceptor="com.github.pagehelper.PageInterceptor">
        <property name="reasonable" value="true"/><!-- 分页合理化 -->
    </plugin>
</plugins>
```

* 使用：

```java
// 参1：当前第几页，参2：每页的数据量（数据条数）
PageHelper.startPage(1,5);
// 紧跟在上方法后的第一个MyBatis 查询方法会被进行分页
List<User> users= UserService.getAll();
// PageInfo对结果进行包装,参1：查询的数据集合，参2：连续显示的页数
PageInfo pageInfo = new PageInfo(users,5);
System.out.println("当前页码："+pageInfo.getPageNum());
System.out.println("总页码："+pageInfo.getPages());
System.out.println("总记录数"+pageInfo.getTotal());
System.out.println("连续显示的页码：");
int[] nums = pageInfo.getNavigatepageNums();
for (int num : nums) {
    System.out.print(" "+num);
}
System.out.println("当前页数据：");
List<User> list = pageInfo.getList();
for (User user:users){
    System.out.println(employee);
}
```