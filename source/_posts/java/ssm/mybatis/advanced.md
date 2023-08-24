---
title: mybatis 动态SQL
date: 2020-08-11 14:27:00
categories: SpringBoot
tags: 
    - mybatis
    - lombok
    - 多表查询
    - 动态sql
    - mybatis缓存
---

## 注解，多表查询与动态SQL，缓存

### 使用注解开发：

使用注解进行开发时要注意：注解来映射简单语句会使代码显得更加简洁，但复杂的操作，最好用 XML 来映射语句。

使用注解的方法就不用创建Mapper.xml（可以创建），因此在`mybatis-config.xml`配置文件中注册映射器时建议使用`mapper`的**class**属性利用Mapper接口来注册映射器：

```xml
<mappers>
    <mapper class="io.github.ruoxijun.mapper.UserMapper"/>
</mappers>
```

#### 1. 利用注解查表（@Select）：

在Mapper接口中定义查询方法，并在方法上使用 `@Select`注解，参数为SQL查询语句字符串：

```java
@Select("select * from user")
List<UserPojo> getUserList();
```

使用按正常步骤调用方法即可。

存在多个参数时使用注解方式就能不再利用对象传参了，在参数（参数必须为基本类型）前使用`@Param`注解并给参数取别名，在SQL语句中直接**`#{别名}`**方式调用参数即可：

```java
@Select("select * from user where name=#{name} and age=#{age}")
List<UserPojo> findUserList(@Param("name") String name,@Param("age") int age);
```

此方法定义的参数也可在Mapper.xml中直接使用，并且不用**parameterType**属性声明类型：

```xml
<select id="findUserList" resultType="userPojo">
    select * from teacher where name=#{name} and age=#{age}
</select>
```

#### 2. 增（Insert@）：

```java
@Insert("insert into user values(#{id},#{name},#{age})")
int addUser(@Param("id") int id,@Param("name") String name,@Param("age") int age);
```

#### 3. 改（Update@）：

```java
@Update("update user set name=#{name},age=#{age} where id=#{id}")
int updateUser(@Param("id") int id,@Param("name") String name,@Param("age") int age);
```

#### 4. 删（Delete@）：

```java
@Delete("delete from user where id=#{id}")
int deleteUser(int id);
```

### Mybatis 执行流程解析：

1. 获取加载**resources**中的全局配置文件流（mybatis-config.xml）。
2. 实例化**SqlSessionFactoryBuilder**调用**build**方法通过配置文件流解析配置文件（底层使用XMLConfigBuilder对象解析xml文件）。利用**Configuration**对象存储所有配置信息。
3. **SqlSessionFactory**实例化。
4. **transactional**事务管理器。
5. 创建**executor**执行器。
6. 创建**SqlSession**。
7. 实现CRUD（SQL增删改查操作），若事务出现问题**事务回滚到第4步**。
8. 查看CRUD是否执行成功，失败则**回滚到第4步**。
9. 提交事务并关闭**SqlSession**。

> 之前我们说过MyBatis对数据库的增删改操作`SqlSession`必须手动提交事务（commit）才能表修改成功。Mybatis中也提供了指定提交事务的方法：
>
>  **`sqlSessionFactory.openSession(true)`** 
>
> 即在创建`SqlSession`时在`openSession`方法中传入`true`参数则此`SqlSession`执行的增删改方法都会自动提交事务。

### Lombok 使用：

1. idea在settings的插件中搜索 **lombok** 下载。为了使用提示功能。

2. 导入**lombok**的依赖：

   ```xml
   <!-- https://mvnrepository.com/artifact/org.projectlombok/lombok -->
   <dependency>
       <groupId>org.projectlombok</groupId>
       <artifactId>lombok</artifactId>
       <version>1.18.12</version>
       <scope>provided</scope><!-- 建议去掉 -->
   </dependency>
   ```

3. 注解与使用：

   - **@Data**：在 **类** 上，提供类所有属性的 get 和 set 方法，还提供了equals、canEqual、hashCode、toString 方法。
   - **@Setter**：在 **属性** 上，为单个属性提供 set 方法。在 **类** 上，为该类所有的属性提供 set 方法， 都提供默认构造方法。
   - **@Getter**：与 @Setter 类似。
   - **@Log4j**：在 **类** 上，为类提供一个 属性名为 log 的 log4j 日志对象，提供默认构造方法。
   - **@Slf4j**：日志 **推荐** 使用 @Slf4j ，它与 @Log4j 使用方法类似。
   - **@AllArgsConstructor**：在 **类** 上，为类提供一个全参的构造方法，将覆盖默认的空参构造。
   - **@NoArgsConstructor**：在 **类** 上；为类提供一个无参的构造方法。
   - **@EqualsAndHashCode**：在 **类** 上, 可以生成 equals、canEqual、hashCode 方法。
   - **@ToString**：在 **类** 上，可以生成所有参数的 toString 方法，还会生成默认的构造方法。
   - **@Value**：在 **类** 上，生成含所有参数的构造方法，get 方法，还提供equals、hashCode、toString 方法。

### 多表查询：

现在使用这两个表作为演示：

![学生表和老师表](/images/java/test2.jpg)

学生表实例类（pojo）：

```java
public class Student { // get和set等方法省略...，请自行补齐
    private int id;
    private String name;
    private Teacher teacher;//老师对象
}
```

老师表实例类（pojo）：

```java
public class Teacher { // get和set等方法省略...，请自行补齐
    private int id;
    private String name;
    private List<Student> students;
}
```

#### 1. 多对一:

**需求**：查询所用学生并且查出每个学生对应的老师。

定义Mapper接口与方法：

```java
interface StudentMapper {
    List<Student> getStudentsList();
}
```

**方法一**：Mapper.xml中通过 `association` 的**select**属性进行**子查询**：

```xml
<!-- 1.查询学生表，并设置结果集 -->
<select id="getStudentsList" resultMap="studentMap">
    select * from student
</select>
<!-- 2.配置结果集为学生类 -->
<resultMap id="studentMap" type="student">
    <!-- id和name默认即可不用配置 -->
    <!-- association：当实体类成员变量为对象时使用，给对象设置结果集
             column：将传递给子查询的参数
             property：对应的成员变量（对象）
             javaType：指定该成员变量的java类型(这里使用的类型别名)
             select：绑定子查询 -->
    <association column="tid" property="teacher" javaType="teacher" select="getTeachersList"/>
</resultMap>
<!-- 3.作为子查询查询老师表，查询条件为父查询的tid值 -->
<select id="getTeachersList" resultType="teacher">
    select * from teacher where id=#{tid}
</select>
```

**方法二（建议使用）**：直接使用SQL**多表查询**，再配置结果集映射数据：

```xml
<!-- 1.书写多表查询SQL语句 -->
<select id="getStudentsList" resultMap="studentMap">
    select s.id id,s.name name,t.id tid,t.name tname
    from student s,teacher t
    where s.tid=t.id
</select>
<!-- 2.设置结果集 -->
<resultMap id="studentMap" type="student">
    <!-- 因为是多表查询所以所有的字段都需要映射到指定成员变量上 -->
    <result property="id" column="id"/>
    <result property="name" column="name"/>
    <!-- association：给对象设置结果集
        property：指定那个成员对象（成员对象变量名）
        javaType：对象的类型 -->
    <association property="teacher" javaType="teacher">
        <!-- 设置对应的结果集到该对象对应的成员变量上 -->
        <result property="id" column="tid"/>
        <result property="name" column="tname"/>
    </association>
</resultMap>
```

#### 2. 一对多：

**需求**：查询指定老师并查出该老师的所有学生。

定义Mapper接口与方法：

```java
interface TeacherMapper {
    List<Teacher> findTeacher(@Param("id") int id);
}
```

**方法一**：Mapper.xml中通过 `association` 的**select**属性进行**子查询**：

```xml
<select id="findTeacher" resultMap="teacherMap">
    select * from teacher where id=#{id}
</select>
<resultMap id="teacherMap" type="teacher">
    <!-- 因为id字段在下方被使用，默认映射被覆盖
        在此必须指定id字段的映射否则不被赋值 -->
    <result property="id" column="id"/>
    <!-- collection：为集合元素指定结果集映射
             column：传递给子查询的参数
             property：对应的成员变量名
             javaType：该成员变量的java类型
             ofType：该集合元素的java类型
             select：绑定子查询 -->
    <collection column="id" property="students" javaType="ArrayList" ofType="student" select="getStudents"/>
</resultMap>
<!-- 子查询 -->
<select id="getStudents" resultType="student">
    select * from student where tid=#{id}
</select>
```

**方法二（建议使用）**：直接使用**多表查询**，再配置结果集映射数据：

```xml
<select id="findTeacher" resultMap="teacherMap">
    select t.id tid,t.name tname,s.id sid,s.name sname
    from teacher t,student s
    where t.id=#{id} and t.id=s.tid
</select>
<resultMap id="teacherMap" type="teacher">
    <result property="id" column="tid"/>
    <result property="name" column="tname"/>
    <!-- collection：当成员变量为集合时使用，给集合中的元素设置结果集
             property：对应的集合变量名
             ofType：指定集合中每个元素的java类型 -->
    <collection property="students" ofType="student">
        <!-- 为集合中元素对象做结果集映射 -->
        <result property="id" column="sid"/>
        <result property="name" column="sname"/>
    </collection>
</resultMap>
```

#### 3. 多表查询总结：

1. 多对一：结果集映射到 **对象** 使用 **association** 标签
2. 一对多：结果集映射到 **集合** 使用 **collection** 标签
3. 绑定子查询时 **column** 属性中的字段值将作为参数传递到子查询中，通过 `#{字段名}` 直接调用
4. **javatype** ：指定实体类中成员变量的java类型
5. **ofType** ：当成员变量为集合时指定其元素的java类型（泛型的类型）
6. 多对一（association），一对多（collection）可无限嵌套

### 动态sql：

[Mybatis动态SQL官方API：https://mybatis.org/mybatis-3/zh/dynamic-sql.html](https://mybatis.org/mybatis-3/zh/dynamic-sql.html)

Mybatis动态SQL标签与**JSTL**（jsp）类似，你对动态 SQL 元素可能会感觉似曾相识。

#### 1. if：

传入的参数：

```java
Map<String,Object> map = new HashMap<>();
map.put("id",3);
map.put("name","小张");
```

if标签中**test**属性值就是条件，当条件成立时标签内的内容才会显现。并且你可以发现在**test**属性值内访问参数不需要再通过 **`#{}`** 就可以直接访问：

```xml
<select id="findStudents" resultType="student" parameterType="map">
    select <if test="true">id,name</if> from student where 1=1
    <if test="id != null">and id=#{id}</if>
    <if test="name != null">and name=#{name}</if>
</select>
```

#### 2. choose、when、otherwise：

**choose**与java中的**switch**类似，一旦一个**when**满足test条件其它的就不会再判断其它**when**。**otherwise**只有当所有的when都不满足时调用。when和otherwise中可嵌套if，if中可嵌套choose。

```xml
<select id="findStudents" resultType="student" parameterType="map">
    select <if test="true">id,name</if> from student
    <choose>
        <when test="id != null">
            where id=#{id}
        </when>
        <when test="name != null">
            <if test="name != null">where id=3</if>
            and name=#{name}
        </when>
        <otherwise>
            where 1=1
        </otherwise>
    </choose>
</select>
```

#### 3. trim、where、set：

* **where**：*where* 标签在SQL语句中只在需要使用where的位置使用，并只会在**子元素返回内容的情况下**才插入 **where**关键字 。而且若子句的开头为 “AND” 或 “OR”，*where* 元素会将它们自动去除。

```xml
<select id="findStudents" resultType="student" parameterType="map">
    select * from student
    <where>
        <if test="id != null">or id=#{id}</if>
        <if test="name != null">and name=#{name}</if>
    </where>
</select>
```

* **set**：*set* 标签在SQL语句中只在需要使用set的位置使用，*set* 元素会动态地在行首插入 SET 关键字，并会**自动删掉额外的逗号**。

```xml
<update id="updateStudent" parameterType="map">
    update student
    <set>
        <if test="name != null">name=#{name},</if>
        <if test="tid != null">tid=#{tid},</if>
    </set>
    <where>
        <if test="id !=null">and id=#{id}</if>
    </where>
</update>
```

运行后SQL语句为 **`update student SET name=?, tid=? WHERE id=?`** 可以看到 `tid=#{tid},` 后的**，**逗号被去除。还有 `and id=#{id}` 判断开头的 `and` 也自动去除。

* **trim**：请到官网了解，它就是定义去除关键字的标签。

```xml
<trim prefix="WHERE" prefixOverrides="AND |OR ">
    <!-- 定制 where 元素的功能，去除内容开头的and或者or -->
</trim>
<trim prefix="SET" suffixOverrides=",">
    <!-- 定制 set 元素的功能，去除内容末尾的逗号（，） -->
</trim>
```

#### 4. foreach：

* 首先我们了解一下**SQL片段**：

```xml
<!-- sql标签：定义SQL片段
        id：唯一标记名
        标签内是需要复用的语句-->
<sql id="if-id-name">
    <if test="id != null">or id=#{id}</if>
    <if test="name != null">and name=#{name}</if>
</sql>
<select id="findStudents" resultType="student" parameterType="map">
    select * from student
    <where>
        /* 在SQL语句中需要使用的地方通过 include 标签来引用 */
        <include refid="if-id-name"/>
    </where>
</select>
```

* **foreach的使用**：

Mapper接口中定义方法：

```JAVA
// 使用Param注解取别名方便在SQL中调用，也可Map传参put一个List
List<Student> findStuForeach(@Param("ids") List<Object> ids);
```

Mapper.xml中使用**foreach**动态编写SQL语句：

```xml
<!-- collection：可遍历的集合
    item：遍历集合元素时的别名
    open：语句开始位置的值
    close：语句接受位置的值
    separator：每个item之间的分隔符
    标签内为每一次遍历拼接的值 -->
<select id="findStuForeach" resultType="student">
    select * from student where id in
    <foreach collection="ids" item="id"
             open="(" close=")" separator=",">
        #{id}
    </foreach>
</select>
```

使用后拼接为：`select * from student where id in ( ? , ? ,...)`

### Mybatis 缓存：

[Mybatis 缓存官方文档：https://mybatis.org/mybatis-3/zh/sqlmap-xml.html#cache](https://mybatis.org/mybatis-3/zh/sqlmap-xml.html#cache)

#### 1.缓存简介：

缓存就是将用户**经常查询并且不经常改变的数据**放在缓存中，就不用多次从数据库中去查询重复的数据。Mybatis中默认定义了**两级缓存**。一级缓存默认开启，二级缓存需用手动开启。

#### 2.一级缓存：

* 一级缓存是默认开启的，也无法关闭。一个**SqlSession**就是一个一级缓存，一级缓存的作用域是一个**SqlSession**创建到关闭内。
* 同一个**SqlSession**查询同样的数据，只有第一次会从数据库查询。之后都是从缓存中获取，除非**SqlSession**执行清空缓存 `clearCache` 或者**执行insert、update 和 delete 语句都会刷新缓存**。

**实例1**：

```java
SqlSession sqlSession1 = GetSqlSession.getSqlSession();
StudentMapper mapper = sqlSession1.getMapper(StudentMapper.class);
mapper.getAll(); // 查询表中所有数据
System.out.println("==================");
mapper.getAll(); // 再次查询表中所有数据
sqlSession1.close();
```

**部分日志**：

```java
==>  Preparing: select * from student        // 第一次执行数据库查询
==> Parameters: 
<==    Columns: id, name, tid
<==        Row: 1, 小明, 1
<==        Row: 2, 小红, 1
<==      Total: 2
==================
// 打印 “=” 后，日志中再未出现数据库查询操作，说明二次查询直接来自一级缓存
```

**实例2**：

```java
SqlSession sqlSession1 = GetSqlSession.getSqlSession();
StudentMapper mapper = sqlSession1.getMapper(StudentMapper.class);
mapper.getAll();
mapper.updateStudent(map); // sqlSession1.clearCache()直接刷新缓存
sqlSession1.commit();
mapper.getAll();
sqlSession1.close();
```

**部分日志**：

```java
==>  Preparing: select * from student
...省略...
==>  Preparing: update student SET name=?, tid=? WHERE id=?
...省略...
==>  Preparing: select * from student
// 可以看出执行了三次SQL数据库操作，说明更改数据时刷新了缓存
```

**实例3：**：

```java
SqlSession sqlSession1 = GetSqlSession.getSqlSession();
SqlSession sqlSession2 = GetSqlSession.getSqlSession();
StudentMapper mapper1 = sqlSession1.getMapper(StudentMapper.class);
StudentMapper mapper2 = sqlSession2.getMapper(StudentMapper.class);
mapper1.getAll();
mapper2.getAll();
sqlSession1.close();
sqlSession2.close();
```

**部分日志**：

```java
==>  Preparing: select * from student
...省略...
==>  Preparing: select * from student
// 执行了两次数据库查询，由此可知一个 SqlSession 对应一个一级缓存，不同一级缓存之间无法互通。
```

#### 3.二级缓存：

要启用全局的二级缓存，只需要在你的 SQL 映射文件（Mapper.xml）中添加一行：

```xml
<cache/>
<!-- 当然也可以配置属性 -->
<cache
  eviction="FIFO"
  flushInterval="60000"
  size="512"
  readOnly="true"/>
```

* 二级缓存作用域是一个Mapper.xml。也就是说只要`getMapper(Mapper.class)`对应同一个文件Mapper.xml，那么它们就是同一个二级缓存。
* **工作机制**：一个**SqlSession**查询一条数据，查询完成后首先会放在**一级缓存**中。当一级缓存（**SqlSession**）被**关闭**时一级缓存中的数据会被转存到二级缓存中。
* **查询机制**：查询数据时首先会到 **二级缓存** 再查询 **一级缓存** 最后还是没有则从**数据库查询**。

#### 4.自定义缓存：

请了解数据库底层后再查看官网。