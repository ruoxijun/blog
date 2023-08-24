---
title: java jdbc 操作数据库
date: 2020-05-30 11:13:03
categories: Java
tags: 
    - jdbc
---

### <center>深入 JDBC 了解类的反射机制</center>

### JDBC 基本使用：

> 在此我们会使用官方的思维来注册驱动，在后面我们可以利用， **_类的反射_** 来实现更简单的驱动注册。

JDBC 一次简单的调用大致分为 5 步：

1. 加载驱动：

```java
Driver driver=new com.mysql.cj.jdbc.Driver();
DriverManager.registerDriver(driver);
```

`Driver`： 驱动类，由 java 提供的接口。而它后面的 Driver 对象是由 SQL 厂商提供的实现类。由于它们的类名相同所有我们不能，再导入厂商的类包，只能用完整包名。
`DriverManager`：驱动管理类，来加载驱动。

2.获取连接：

```java
//获取连接
String url="jdbc:mysql://127.0.0.1:3306/stu?serverTimezone=GMT%2B8";
String user="root";
String pass="991314";
connection=DriverManager.getConnection(url,user,pass);
```

获取连接对象时需要 3 个参数，其中 url 在新版中后面需要时设置地区时间参数。否则会报数据库时区异常,建议设置为 `jdbc:mysql://127.0.0.1:3306/数据库名?characterEncoding=utf8&serverTimezone=GMT%2B8` ，jdbc 5.1.47 以下不存在此问题。

3. 获取数据库操作对象：

```java
Statement statement=connection.createStatement();
```

4. 执行操作：

```java
//插入数据
String sql="insert into student values ('longlong',30)";
//删除数据
//String sql="delete from student where name='longlong'";
//修改数据
//String sql="update student set name='hff' where name='何芳芳'";
//执行语句，返回被操作数据的条数
int count=statement.executeUpdate(sql);
System.out.println(count+"条数据被影响");
```

`executeUpdate` 方法一般用于对表数据增删改操作

```java
String sql="select * from student";
ResultSet resultSet=statement.executeQuery(sql);
while(resultSet.next()){
    //列索引方式获取
    String name=resultSet.getString(1);
    //列名称方式获取
    int age=resultSet.getInt("age");
    System.out.println("name："+name+"\t"+"age："+age);
}
```

`executeQuery` 方法一般用于查询数据库。它会将查询结果封装为一个 `ResultSet` 对象,通过该对象的 `next` (最开始指向空，运行一次指向下一条结果并返回true，最后结束返回false)和 `get类型(查询结果的列索引||列名)` 方法获取值(注意列索引从1开始)。

5. 关闭资源：

```java
statement.close();
connection.close();
```

注意关闭的先后顺序(有查询语句时还要先关闭查询结果集)，先关闭操作对象，再关闭连接。**_后获取的先关闭_** ,这还不是最好的关闭方式应放在 `finally` 中进行关闭。

### 实例：

```java
Driver driver=null;//驱动
Connection connection=null;//连接
Statement statement=null;//操作
ResultSet resultSet=null;//查询结果集
try {
    //注册驱动
    driver = new com.mysql.cj.jdbc.Driver();
    DriverManager.registerDriver(driver);

    //获取连接
    String url="jdbc:mysql://127.0.0.1:3306/stu?characterEncoding=utf8&serverTimezone=GMT%2B8";
    String user="root";
    String pass="991314";
    connection=DriverManager.getConnection(url,user,pass);

    //获取操作对象
    statement=connection.createStatement();

    //执行操作
    //增删改语句
    //String sql="insert into student values ('longlong',30)";
    //String sql="delete from student where name='longlong'";
    //String sql="update student set name='hff' where name='何芳芳'";
    //返回被操作数据的条数
    //int count=statement.executeUpdate(sql);
    //System.out.println(count+"条数据被影响");

    //查询语句
    String sql="select * from student";
    resultSet=statement.executeQuery(sql);
    while(resultSet.next()){
        String name=resultSet.getString(1);
        int age=resultSet.getInt("age");
        System.out.println("name："+name+"\t"+"age："+age);
    }
} catch (SQLException throwables) {
    throwables.printStackTrace();
} finally{//关闭资源
    if(resultSet!=null){
        try {
            resultSet.close();
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
    }
    if(statement!=null){
        try {
            statement.close();
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
    }
    if(connection!=null){
        try {
            connection.close();
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
    }
}
```

### 利用反射注册驱动：

首先我们看一下 `com.mysql.cj.jdbc.Driver` 类中一块源码：

```java
static {
    try {
        DriverManager.registerDriver(new Driver());
    } catch (SQLException var1) {
        throw new RuntimeException("Can't register driver!");
    }
}
```

可以看出它是一个静态语句块，并且此类一加载就完成了驱动的注册。由此我们可以利用类的反射机制完成注册驱动。

```java
try {
    //反射机制，加载驱动类
    Class.forName("com.mysql.cj.jdbc.Driver");
} catch (ClassNotFoundException e) {
    e.printStackTrace();
}
```
