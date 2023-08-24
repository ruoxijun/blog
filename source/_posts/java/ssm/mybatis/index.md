---
title: mybatis 基础入门
date: 2020-07-17 16:14:54
categories: SpringBoot
tags: 
    - mybatis
---

## MyBatis 入门

### MyBatis 环境配置与简单查询实例：

> MyBatis 就是封装版的 JDBC 简化了对数据库的操作：
>
> [MyBatis 中文官网](https://mybatis.org/mybatis-3/zh/getting-started.html)
>
> [MyBatis 各版本下载位置](https://github.com/mybatis/mybatis-3/releases)

#### 1. 创建maven程序，添加依赖 (jar 包)：

在 maven 项目文件 `pom.xml` 下的 `dependencies` 标签中导入一下依赖(jar包)：

* MyBatis 依赖：

```xml
<dependency>
    <groupId>org.mybatis</groupId>
    <artifactId>mybatis</artifactId>
    <version>3.5.5</version>
</dependency>
```

* SQL 数据库驱动依赖(根据所使用的数据库自行选择依赖)：

```xml
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.18</version>
</dependency>
```

#### 2. 编写核心配置xml文件：

* 在 `resources` 文件夹中新建 `mybatis-config.xml` (文件名也可自定义)：

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!-- mybatis 主配置文件：头部的声明，它用来验证 XML 文档的正确性 -->
<!DOCTYPE configuration
    PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
    "http://mybatis.org/dtd/mybatis-3-config.dtd">
<!-- 核心配置文件(存放mybatis与数据库的各种配置) -->
<configuration>
    <!-- 环境配置组(default值表示默认环境,根据环境id选择) -->
    <environments default="development">
        <!-- 环境配置(id为环境名称，可自定义) -->
        <environment id="development">
            <!-- 事务管理(一般为JDBC，表示使用JDBC管理事务的提交和回滚) -->
            <transactionManager type="JDBC"/>
            <!-- 使用标准的JDBC数据源接口来配置JDBC连接对象的资源 -->
            <dataSource type="POOLED">
                <!--jdbc驱动-->
                <property name="driver" value="com.mysql.cj.jdbc.Driver"/>
                <!-- JDBC 连接数据库url设置：
                设置安全连接：useSSL=false
                设置中文可用编码：useUnicode=true
                设置设置编码格式：characterEncoding=utf8
                设置时区为北京：serverTimezone=GMT%2B8 -->
                <property name="url" value="jdbc:mysql://localhost:3306/数据库名?useSSL=false&amp;
                useUnicode=true&amp;characterEncoding=utf8&amp;serverTimezone=GMT%2B8"/>
                <!--用户名与密码-->
                <property name="username" value="root"/>
                <property name="password" value="991314"/>
            </dataSource>
        </environment>
    </environments>
    <!-- 管理Mapper接口对应的Mapper.xml -->
    <mappers>
        <!-- 每个Mapper.xml文件都需要在此注册 -->
    </mappers>
</configuration>
```

#### 3. 编写Mapper接口与配置Mapper.xml：

Mapper接口中定义对数据库表增删改查的方法，接口名建议以 `[表名|数据库名]Mapper` 命名。以配置Mapper.xml(建议以 `对应接口名.xml` 命名)的方式实现该接口,下以查询为例：

1. 查询的每一条数据都作为一个对象返回，我们需要先创建一个对应表字段的实体类（pojo）：

   以下表为例：

   ![数据库表字段](/images/java/m-CreTab.jpg)

   为此表字段编写一个对应的类：

   ```java
   public class UserPojo {
   //    1.设置变量字段，注意变量的名称与类型应与表字段保持一致
       private int id;
       private String name;
       private int age;
   //    2.为每个字段设置 get 和 set 方法
       public int getId() { return id; }
       public void setId(int id) { this.id = id; }
       public String getName() { return name; }
       public void setName(String name) { this.name = name; }
       public int getAge() { return age; }
       public void setAge(int age) { this.age = age; }
       // 其它可自行根据需要进行增添设置
   //    构造函数
       public UserPojo(){}
       public UserPojo(int id, String name, int age) {
           this.id = id;
           this.name = name;
           this.age = age;
       }
   //    toString 方法
       @Override
       public String toString() {
           return "User{" +
                   "id=" + id +
                   ", name='" + name + '\'' +
                   ", age=" + age +
                   '}';
       }
   }
   ```
   
2. 编写执行数据库方法的Mapper接口：

   建议每一个表的实体类(pojo)对应一个Mapper接口，接口中定义对对应表的增删改查方法，接口名建议以 `实体类名+Mapper` 命名。

```java
public interface UsersMapper {
    // 定义一个查询方法返回List，其中每一个元素都是表的字段对象
    List<UserPojo> getUserList();
}
```

3. 编写Mapper.xml实现接口中的方法：

   Mapper.xml建议以 `对应接口名.xml` 命名，它可以看成是Mapper的具体实现类。对接口中的方法进行配置实现对表的操作。

   ```xml
   <?xml version="1.0" encoding="UTF-8" ?>
   <!-- 头文件(mapper.xml的头部声明) -->
   <!DOCTYPE mapper
           PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
           "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
   <!-- 绑定Mapper.xml对应的Mapper接口类 -->
   <mapper namespace="io.github.ruoxijun.mapper.UsersMapper">
       <!-- select 查询：
       id 对应接口中的方法名
       resultType 每条查询结果封装的类型
       标签内为查询语句 -->
       <select id="getUserList" resultType="io.github.ruoxijun.data.UserPojo">
           select * from user
       </select>
   </mapper>
   ```

4. 在核心配置文件中注册配置好的Mapper.xml：

   注意：resource中值为文件相对路径以 *`/`* 为分隔符，切记不能用 `.` 分隔。
   
   ```xml
   <!-- 在mybatis-config.xml文件的configuration标签内 -->
   <mappers>
       <!-- 注意路径使用的是文件方式 “/” 注册 -->
       <mapper resource="io/github/ruoxijun/mapper/UsersMapper.xml"/>
</mappers>
   ```


#### 4. 编写测试类验证程序：

建议在test文件夹下对应main文件夹下的Mapper接口位置创建测试类：

```java
@Test
public void test(){
    // 主配置文件相对与resources文件夹的路径
    String resource = "mybatis-config.xml";
    InputStream inputStream = null;
    try {
        // 拿到主配置文件的流。MyBatis的工具类Resources，它加载资源文件更加容易
        inputStream = Resources.getResourceAsStream(resource);
    } catch (IOException e) {
        e.printStackTrace();
    }
    // 利用SqlSessionFactoryBuilder通过主配置文件的流，获取SqlSessionFactory对象
    SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
    
    // 通过SqlSessionFactory对象拿到执行SQL命令的对象SqlSession
    SqlSession sqlSession=sqlSessionFactory.openSession();

    // SqlSession对象通过Mapper接口的类对象获取实例对象(根据Mapper.xml实例化的对象)
    UsersMapper mapper = sqlSession.getMapper(UsersMapper.class);
    // 调用实例方法
    List<UserPojo> userList = mapper.getUserList();
    for (UserPojo user : userList){
        System.out.println(user);
    }

    // 关闭资源
    sqlSession.close();
}
```

最后因为Maven项目中默认只有resources 文件夹中的资源(配置)文件才能被打包，测试时可能因为我们的Mapper.xml文件在java文件夹中而不能被打包到classpath中。

所以有必要对 `pom.xml` 配置构建时的配置：

```xml
<build>
    <resources>
        <!-- 让Maven进行项目构建时不会忽略java下的xml等配置文件 -->
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
    </resources>
</build>
```

此时运行测试项目成功。

#### 5. 增加带参方法条件查询：

1. Mapper 接口中新增方法： 

   ```java
   // 因为确定返回的数据最多只有1条，所以返回值类型为该对象而不用List(也行)
   UserPojo getUserById(int id);
   ```

2. Mapper.xml中添加方法配置：

   ```xml
   <!-- parameterType 代表传入参数的类型，只有一个参数且为基本类型时可以不声明
        查询语句中增加条件，利用 #{参数(变量)名} 的方式调用参数
        使用 ${}(不安全有SQL注入风险) 或 #{0}(不灵活) 也可达到效果但不推荐 -->
   <select id="getUserById" parameterType="int" 
           resultType="io.github.ruoxijun.data.UserPojo">
       select * from user where id = #{id}
   </select>
   ```

3. 测试时同上所讲获取到接口实例化对象调用方法即可：

   ```java
   UserPojo user = mapper.getUserById(4);
   System.out.println(user);
   ```

### 对象作用域(生命周期)与封装：

#### 对象生命周期：

了解Mybatis中对象的生命周期也是很重要的，错误的使用会导致严重的**并发问题**。

##### SqlSessionFactoryBuilder：

​    一旦创建了 SqlSessionFactory，就不再需要它了。所以最好定义为局部方法变量。

##### SqlSessionFactory：

​    一旦被创建就应该在应用的运行期间一直存在，没有任何理由丢弃它或重新创建另一个实例。

##### SqlSession：

​    SqlSession 的实例不是线程安全的，因此是不能被共享的，所以它的作用域是局部作用域。 绝对不能将 SqlSession 实例的引用放在一个类的静态域，甚至一个类的实例变量也不行。并且使用完后一定要关闭。

#### 获取 SqlSession 的封装：

之后的应用中需要经常用到 `SqlSession` 不可能每次都写一次，在此对获取 `SqlSession` 做一个简单的封装。创建一个专用于获取 `SqlSession` 的工具类：

```java
public class GetSqlSession {
    private static SqlSessionFactory sqlSessionFactory;
    // 让类初始化就加载 SqlSessionFactory 之后就不用重复定义了
    static {
        try {
            String resources="mybatis-config.xml";
            InputStream inputstream = Resources.getResourceAsStream(resources);
            sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputstream);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    // 获取 SqlSession 方法
    public static SqlSession open(){ return sqlSessionFactory.openSession(); }
}
```

此后使用时只需要两句便可以获取到Mapper接口的实例对象：

```java
// 通过定义好的工具类获取 SqlSession
SqlSession sqlSession = GetSqlSession.open();
// SqlSession对象通过Mapper接口的类对象获取实例对象
UsersMapper mapper = sqlSession.getMapper(UsersMapper.class);
```

这只是一个简单的封装，实际使用时建议使用 ***单例模式*** 来设计更好的封装方法。


### 增改删操作：

> 增改删流程与查类似，Mapper接口中定方法再在Mapper.xml中使用对应的标签(如增是使用insert标签)绑定方法。
>
> 增改删与查不同的是，接口实例对象所有的增改删方法被调用后， `SqlSession` 对象必须 `commit` (提交事务)才能生效。且这些方法的返回值为 `int` 即数据更改成功的个数。

#### 1. 增(insert)：

1. 在Mapper接口中定义插入数据的方法： `int insertUser(UserPojo user);`

2. 在Mapper.xml中进行对插入方法具体实现的配置：

   ```xml
   <!-- parameterType中声明传入一个字段对象类型作为参数
         因为字段类中设置了成员变量的get方法，
         可直接通过 #{成员变量名} 的方式来获取具体的值 -->
   <insert id="insertUser" parameterType="io.github.ruoxijun.data.UserPojo">
       insert into user(id,name,age) values(#{id},#{name},#{age})
   </insert>
   ```

3. 使用时在获取到接口实例对象后：

   ```java
   // 利用获取到的接口实例调用方法，传入一个字段对象
   int insertNum = mapper.insertUser(new UserPojo(6,"哈哈",18));
   if (insertNum==1){
       // 对表数据更改的操作，必须 commit 提交事务才能生效
       sqlSession.commit();
       System.out.println("插入成功!");
   }
   ```

#### 2. 改(update)：

操作都基本类似，只看一下Mapper.xml配置：

```xml
<update id="updateUser" parameterType="io.github.ruoxijun.data.UserPojo">
    update user set name=#{name} where id=#{id}
</update>
```

#### 3. 删(delete)：

Mapper.xml配置：

```xml
<delete id="deleteUser" parameterType="int">
    delete from user where id=#{id}
</delete>
```

### Map 传参与模糊查询：

#### Map简化传参：

上方所讲 ***改(update)*** 处在修改方法中传入了一个用户对象，但可以看出实际使用时并未使用到全部属性。当表的字段较多时字段对象的成员变量也会相应增多，而SQL语句中需要用到的值只有几个，此时传入一个完整的对象显得不再合理。利用传入一个 **`Map`** 就可只传入我们需要使用的数据，而不用在创建一个完整的对象方式。

Mapper接口中传入值替换为Map：

```java
// key为 String，value类型不定采用 Object
int updateUser2(Map<String,Object> map);
```

Mapper.xml中传入类型替换为map：

```xml
<!-- parameterType 值更改为map，即传入的参数类型为Map
      SQL 中调用 Map 元素值用 #{key} 即可 -->
<update id="updateUser2" parameterType="map">
    update user set name=#{userName} where id=#{userId}
</update>
```

使用时：

```java
// 准备数据
Map<String,Object> map = new HashMap<>();
map.put("userId",4);
map.put("userName","更改");

// SqlSession 获取Mapper接口实例
UsersMapper mapper = sqlsession.getMapper(UsersMapper.class);
mapper.updateUser2(map); // 调用方法，传入 Map
sqlsession.commit(); // 一定要提交事务(commit)
```

#### 模糊查询与SQL拼接：

Mapper接口中定义查询方法：`List<User> findLikeNameList(String name);`

Mapper.xml中实现方法与书写模糊查询语句：

```xml
<!-- 在标签的SQL语句中字符串 "" 与挨着的变量值会自动拼接 -->
<select id="findLikeNameList" parameterType="string" resultType="io.github.ruoxijun.data.UserPojo">
    select * from user where name like "%"#{name}"%"
</select>
```

在标签内把SQL语句写死，而不用参数的方式 `%name%` 传入模糊语句是为了数据库安全防止SQL注入。