---
title: Spring数据库操作
date: 2020-08-18 8:55:10
categories: SpringBoot
tags: 
    - spring
    - mybatis
    - mybatis逆向工程
    - spring与mybatis整合
    - mybatis代码生成器
    - 事务隔离
---

# 事务管理与SM整合

## 事务控制：

> *   Spring 的事务控制是基于 AOP (切面编程)的，因此需要导入AOP的包。
>
> *   spring 中只需告诉它哪些方法是事务方法即可，spring自动进行事务控制。
> *   事务4个特性：原子性，一致性，隔离性，持久性。

### 1. 注解开启事务：

* spring-service.xml中添加开启事务配置：

```xml
<!-- 1. 配置事务管理器，让其进行事务控制 -->
<bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
    <!-- dataSource 是数据源，数据库的连接配置 -->
    <property name="dataSource" ref="dataSource"/>
</bean>

<!-- 2. 开启基于注解的事务控制模式，依赖tx名称空间
     transaction-manager：值默认为transactionManager
     当与事务管理器 bean id 相同时可以不用配置此属性 -->
<tx:annotation-driven transaction-manager="transactionManager"/>
```

* 业务类的业务方法(对数据库的增删改方法)上添加 **Transactional** 开启事务：

```java
@Transactional
public * add(..) {
    // 数据库cud操作
}
```

* Transactional属性取值：

```java
// 事务方法执行超出指定时长后回滚
int timeout() default -1; // 秒为单位

// 是否设置事务为只读，增加数据库的查询速度，存在更改数据方法时报错
boolean readOnly() default false;
 
// 事务隔离级别(使用请百度)：
Isolation isolation() default Isolation.DEFAULT;

// 事务传播行为(使用请百度)：（！多事务方法嵌套是否回滚问题）
Propagation propagation() default Propagation.REQUIRED;

/**
 * 任何异常tyr-catch后不抛出都不会回滚
 * 异常回滚分类：所有的运行时异常都默认回滚
 * 编译时异常 throws 抛出后不回滚
 * 我们可以使用如下属性，对需要的异常指定回滚与否的操作：
 */
// 指定那些需要回滚(一般针对编译时异常)：
Class<? extends Throwable>[] rollbackFor() default {}; // 异常类对象
String[] rollbackForClassName() default {}; // 异常类全类名
    // 抛出找不到文件异常时需要回滚,多个异常使用逗号隔开
    @Transactional(rollbackFor = {FileNotFoundException.class})

// 指定那些事务不需要回滚(一般针对运行时异常)：
Class<? extends Throwable>[] noRollbackFor() default {}; // 异常类对象
String[] noRollbackForClassName() default {}; // 异常类全类名
    // 假如此计算不影响数据，指定抛出算数异常时不需要回滚
    @Transactional(noRollbackFor = {ArithmeticException.class})
```

### 2. 事务隔离级别：

#### 1. 概念：

1.   **脏读** (一定不能发生)：a、b 并发访问数据库，a 在事务方法中修改 val 还未提交，b 读了 val 的值此时 a 发送错误回滚。b 读到的值是无效的，这就是脏读。
2.   **不可重复读** (针对字段)：a 在事务方法内读取了 val，b 在此时修改了 val 的值并提交了，a 还在未完成的事务中再次读取了 val 的值。这种在一个事务中多次读取一个字段值不同的问题叫不可重复读。
3.   **幻读** (针对行)：a 在事务中查询 >4 的 val行，b此时向表中插入或删除了几条 >4 的 val 并提交了，a在事务中再次读取时数据个数发生变化，误以为多读或者少读了数据。

#### 2. 隔离级别：

1.  读未提交（READ UNCOMMITTED）
2.  读已提交 （READ COMMITTED）
3.  可重复读 （REPEATABLE READ）
4.  串行化 （SERIALIZABLE 几乎不可能使用）

#### 3. 关系表：

| 隔离级别 | 脏读 | 不可重复读 | 幻读 |
| -------- | :--: | :--------: | :--: |
| 读未提交 |  √   |     √      |  √   |
| 读已提交 |  ×   |     √      |  √   |
| 可重复读 |  ×   |     ×      |  √   |
| 串行化   |  ×   |     ×      |  ×   |

### 3. xml配置事务：

```xml
<!-- 利用切面编程添加事务 -->
<aop:config>
    <!-- 配置切入点 -->
    <aop:pointcut id="pointcut"
                  expression="execution(* ruoxijun.service.UserServiceImpl.*(..))"/>
    <!-- 配置事务，pointcut只是说明事务管理器要切入这些方法，
      advice中的method配置指明哪些方法添加事务 -->
    <aop:advisor advice-ref="advice" pointcut-ref="pointcut"/>
</aop:config>

<!--  配置事务传播特性,transaction-manager 指向之前配置的事务管理器 -->
<tx:advice id="advice" transaction-manager="transactionManager">
    <!-- 事务属性 -->
    <tx:attributes>
        <!-- method 指明那些方法是事务方法，
                其它属性设置请参考注解中的属性 -->
        <!-- 所有以query开头的方法添加事务，且设置为只读属性 -->
        <tx:method name="query*" read-only="true"/>
        <!-- "*"：为所有属性添加事务 -->
        <tx:method name="*" propagation="REQUIRED"/>
    </tx:attributes>
</tx:advice>
```

## Spring 整合 MyBatis：

### 1. 导入整合需要的依赖：

Spring整合Mybatis除了它们自身需要的包以外，还需要mybatis和spring整合的包 **mybatis-spring** 包：

```xml
<!-- Mybatis 结合 spring 使用需要导入此包 -->
<dependency>
    <groupId>org.mybatis</groupId>
    <artifactId>mybatis-spring</artifactId>
    <version>2.0.5</version>
</dependency>
<!-- 使用 jdbc 数据源操作数据库 -->
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-jdbc</artifactId>
    <version>5.2.8.RELEASE</version>
</dependency>
```

### 2. 新建 `spring-dao.xml` 对 mybatis 进行配置：

#### 1. datasource：spring 管理数据源

```xml
<bean id="dataSource" class="org.springframework.jdbc.datasource.DriverManagerDataSource">
    <property name="driverClassName" value="com.mysql.cj.jdbc.Driver"/>
    <property name="url" value="jdbc:mysql://localhost:3306/test?useSSL=false&amp;
            useUnicode=true&amp;characterEncoding=utf8&amp;serverTimezone=GMT%2B8"/>
    <property name="username" value="root"/>
    <property name="password" value="991314"/>
</bean>
```

*   通常以上属性的value值会单独配置到一个 `properties` 文件中方便我们管理，这时需要在配置数据源的文件中添加 `<context:property-placeholder location="classpath:database.properties"/>` 的配置引用外部属性文件。
*   **classpath** ：是固定写法，表示引用类路径下的一个资源。
*   在 value 中填入配置文件的值只需使用 `${key}` 即可，为了防止配置文件中的 key 与 spring 中自带的属性冲突通常会在数据源配置的 key 前加上 **jdbc.** 的前缀(如 username 就是 spring 自带的属性则我们配置文件中不能使用 username ，可以改为 jdbc.username )。

#### 2. 在 MyBatis-Spring 中，可使用 SqlSessionFactoryBean 来创建 SqlSessionFactory 。将配置的数据源赋给 sqlSessionFactory 的 dataSource 属性

```xml
<bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
    <property name="dataSource" ref="dataSource" />
    <!-- 绑定mybatis配置文件，spring才能读取到配置文件。
         否则在此利用SqlSessionFactoryBean属性代替mybatis配置所有设置 -->
    <property name="configLocation" value="classpath:mybatis-config.xml"/>
    <!-- 它的属性还能替换mybatis中的配置，例如下为代替mybatis注册Mapper.xml文件 -->
    <!--<property name="mapperLocations" value="classpath:ruoxijun/mapper/*.xml"/>-->
</bean>
```

#### 3. 在 MyBatis-Spring 中 SqlSessionTemplate 就是 SqlSession，需要利用构造函数传入我们配置好的sqlSessionFactory

```xml
<bean id="sqlSession" class="org.mybatis.spring.SqlSessionTemplate">
    <!-- 官方推荐使用 index="0"，此处我们使用name -->
    <constructor-arg name="sqlSessionFactory" ref="sqlSessionFactory"/>
</bean>
```

#### 4. 在spring的总配置文件`applicationContext.xml`中导入mybatis的spring配置：

```xml
<!-- 导入对mybatis的配置，与正常的导入一个beans.xml文件一样-->
<import resource="spring-dao.xml"/>
```

### 3. 编写 MapperImpl 实现类：

对数据库进行操作除编写 Mapper接口 定义方法和配置 Mapper.xml 以外，spring中新增一项那就是还需要给Mapper接口编写**MapperImpl实现类**：

```java
public class UserMapperImpl implements UserMapper { // 实现Mapper接口
    // 此类中需要获取SqlSession，之前说过MyBatis-Spring中SqlSessionTemplate就是SqlSession
    private SqlSessionTemplate sqlSession;
    public void setSqlSession(SqlSessionTemplate sqlSession) {
        this.sqlSession = sqlSession;
    }
    @Override // 在实现的方法中：获取Mapper实现类调用方法并返回结果
    public List<User> getUserList() {
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);
        return mapper.getUserList();
    }
}
```

### 4. 将MapperImpl实现类配置为bean：

在 `applicationContext.xml` 中配置MapperImpl类并将sqlSession注入：

```xml
<bean id="userMapper" class="ruoxijun.mapper.UserMapperImpl">
    <property name="sqlSession" ref="sqlSession"/>
</bean>
```

### 5. 测试：

```java
ApplicationContext context=new ClassPathXmlApplicationContext("applicationContext.xml");
UserMapper userMapper = (UserMapper) context.getBean("userMapper");
List<User> userList = userMapper.getUserList();
```

### 扩展：

* 除4中那样直接实现Mapper接口外，还提供了一种继承**SqlSessionDaoSupport**类+实现Mapper接口的方式，这样我们不必再自己去获取写获取sqlsession方法，它的内部提供了**`getSqlSession`**方法获取SqlSession。

```java
public class UserMapperImpl extends SqlSessionDaoSupport implements UserMapper {
    @Override
    public List<User> getUserList() {
        return getSqlSession().getMapper(UserMapper.class).getUserList();
    }
}
```

在 `applicationContext.xml` 中配置MapperImpl的bean时，可以选择只注入sqlSessionFactory表示我们连`spring-dao.xml`的第2步的第3小步也可省略：

```xml
<bean id="userMapper" class="ruoxijun.mapper.UserMapperImpl">
    <!-- 两参数注入择一即可，也可同时注入 -->
    <property name="sqlSessionTemplate" ref="sqlSession"/>
    <property name="sqlSessionFactory" ref="sqlSessionFactory"/>
</bean>
```

### 事务管理：

spring中事务 **利用 AOP 给指定方法配置事务** ，当方法中的语句出错时，那么此方法中所有有关数据库数据的操作的事务都不会提交。并且对某方法增加事务只需在 beans.xml 进行配置，不用改动原程序这正是aop的概念。

**实例**：在 `spring-dao.xml`  对 mybatis 进行新增事务配置

```xml
<!-- 1.要开启Spring的事务处理功能，在Spring配置文件中创建DataSourceTransactionManager对象 -->
<bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
    <!-- 设置数据源，构造方法和set注入二选一即可 -->
    <constructor-arg ref="dataSource" />
    <property name="dataSource" ref="dataSource"/>
</bean>

<!-- 2.结合aop实现事务的置入 -->
<!-- 2.1 配置事务通知(配置事务的类，由spring提供) -->
<tx:advice id="txAdvice" transaction-manager="transactionManager">
    <!-- 指定给SQL的那些方法提供事务 -->
    <tx:attributes>
        <tx:method name="add" propagation="REQUIRED"/>
        <tx:method name="delete" propagation="REQUIRED"/>
        <tx:method name="update" propagation="REQUIRED"/>
        <tx:method name="query" read-only="true" propagation="REQUIRED"/>
        <!-- 常用，一般使用下一项即可 -->
        <tx:method name="*" propagation="REQUIRED"/>
    </tx:attributes>
</tx:advice>
<!-- 2.2 配置事务切入，给指定方法设置事务 -->
<aop:config>
    <aop:pointcut id="txPointCut"
                  expression="execution(* ruoxijun.mapper.UserMapperImpl.*(..))"/>
    <aop:advisor advice-ref="txAdvice" pointcut-ref="txPointCut"/>
</aop:config>
```

## mybatis逆向工程（mybatis.generator）：

* 导入依赖：

```xml
<dependency>
    <groupId>org.mybatis.generator</groupId>
    <artifactId>mybatis-generator-core</artifactId>
    <version>1.4.0</version>
</dependency>
```

* 在项目根目录下新建xml配置：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE generatorConfiguration
        PUBLIC "-//mybatis.org//DTD MyBatis Generator Configuration 1.0//EN"
        "http://mybatis.org/dtd/mybatis-generator-config_1_0.dtd">
<generatorConfiguration>
    <context id="DB2Tables" targetRuntime="MyBatis3">
        <!-- 去除注释 -->
        <commentGenerator>
            <property name="suppressAllComments" value="true" />
        </commentGenerator>
        <!-- 配置数据库连接 -->
        <jdbcConnection driverClass="com.mysql.cj.jdbc.Driver"
                        connectionURL="jdbc:mysql://localhost:3306/ssm_crud?useSSL=false&amp;useUnicode=true&amp;characterEncoding=utf8&amp;serverTimezone=GMT%2B8"
                        userId="root"
                        password="991314">
        </jdbcConnection>
        <javaTypeResolver >
            <property name="forceBigDecimals" value="false" />
        </javaTypeResolver>
        <!-- 指定javabean生成（pojo）的位置 -->
        <javaModelGenerator targetPackage="ruoxijun.bean"
                            targetProject=".\src\main\java">
            <property name="enableSubPackages" value="true" />
            <property name="trimStrings" value="true" />
        </javaModelGenerator>
        <!-- 指定SQL映射文件生成位置 -->
        <sqlMapGenerator targetPackage="ruoxijun.dao"
                         targetProject=".\src\main\java">
            <property name="enableSubPackages" value="true" />
        </sqlMapGenerator>
        <!-- mapper接口生成位置 -->
        <javaClientGenerator type="XMLMAPPER" targetPackage="ruoxijun.dao"
                             targetProject=".\src\main\java">
            <property name="enableSubPackages" value="true" />
        </javaClientGenerator>
        <!-- 指定每个表的生成策略 -->
        <table tableName="tbl_emp" domainObjectName="Employee"></table>
        <table tableName="tbl_dept" domainObjectName="Department"></table>
    </context>
</generatorConfiguration>
```

* 新建测试类运行代码生成文件：

```java
List<String> warnings = new ArrayList<String>();
boolean overwrite = true;
// 指定配置文件
File configFile = new File("mbg.xml");
ConfigurationParser cp = new ConfigurationParser(warnings);
Configuration config = cp.parseConfiguration(configFile);
DefaultShellCallback callback = new DefaultShellCallback(overwrite);
MyBatisGenerator myBatisGenerator = new MyBatisGenerator(config, callback, warnings);
myBatisGenerator.generate(null);
```

