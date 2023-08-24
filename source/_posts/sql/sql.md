---
title: MySQL 语法基础
date: 2020-07-06 10:46:48
categories: SQL
tags: 
    - mysql
    - sql
---

## <center>MySql 使用与 SQL 语句基础<center/>

> ### MySql 使用：

以下操作都是以管理员方式打开 `cmd` 并切换至安装 MySQL 的 `bin` 目录下执行：

-   启动与关闭 MySql ：

```sql
net start mysql // 启动mysql
net stop mysql // 关闭mysql
```

-   登录与退出 MySQL 环境：

```sql
mysql -u用户名 -p密码 // 登录密码裸露在外不推荐
mysql -u用户名 -p // 回车后输入密码(密码隐藏)，推荐使用
mysql -hIP地址 -u用户名 -p密码 //连接指定IP地址的数据库
exit // 退出mysql命令行环境
```

> ### SQL 操作数据库：

-   注释：

```sql
-- 单行注释，必须有一个以上空格隔开
# 单行注释
/* 多行注释 */
```

### 数据库：

-   创建数据库：

```sql
create database 数据库名; // 基本格式
create database if not exists 数据库名; // 查看数据库，不存在时创建
create database 数据库名 character set 字符集; // 修改字符集
create database if not exists 数据库名 character set 字符集; // 综合修改
```

-   删除数据库：

```sql
drop database 数据库名; // 直接删除
drop database if exists 数据库名; // 查看数据库存在再删除
```

-   修改数据库：

```sql
alter database 数据库名 character set 字符集名;
```

-   查看数据库与切换：

```sql
show databases; // 查看所有数据库名称
select database(); // 当前正在使用的数据库
show create database 数据库名; // 查看数据库的创建属性
use 数据库名称; // 切换到指定数据库
```

### 数据表：

-   创建表：

```sql
// 基本格式：
create table(
    列名1 数据类型 添加约束,
    列名2 数据类型,
    ...(最后一列不能有逗号)
);

// 复制表
create table 新表名 like 被复制表名;
```

-   删除表：

```sql
drop 表名; // 直接删除
drop table if exists 表名; // 判断表存在则删除
```

-   修改表：

```sql
alter table 表名 rename to 新表名; // 修改表名
alter table 表名 character set utf8; // 修改表的字符集

alter table 表名 add 列名 数据类型; // 添加一列
alter table 表名 modify 列名 新数据类型; // 修改数据类型
alter table 表名 change 列名 新列名 新数据类型; // 修改列名和数据类型
alter table 表名 drop 列名; // 删除列
```

-   查看表：

```sql
show tables; // 查看此数据库内的所有表
show create table 表名; // 查看表创建时的属性
desc 表名; // 查看指定表的结构
```

-   约束的创建，更改，删除：

`not null` 约束：

```sql
// 创建时添加非空约束
create table test( id int not null );

// 删除约束
alter table test modify id int;

// 直接给字段添加约束
alter table test modify id int not null;
```

`unique` 约束：

```sql
// 创建时添加值唯一
create table test( id int unique );

// 删除约束
alter table test drop index id;

// 直接给字段添加值唯一约束
alter table test modify id int unique;
```

`primary key` 约束：

```sql
// 创建时添加主键
create table test(id int primary key);

// 删除主键约束
alter table test drop primary key;

// 直接给字段添加主键
alter table test modify id int primary key;
```

`auto_increment` 约束：

```sql
// 创建时给主键添加自动增长
create table test(id int primary key auto_increment);

// 删除主键的自动增长
alter table test modify id int;

// 直接给主键添加自动增长
alter table test modify id int auto_increment;
```

`foreign key`设置外键约束：

```sql
// 作为外键的字段必须唯一(primary key 或 unique)，否则报错
// 创建时添加外键，外键名可随意取
create table test(
id int,
constraint 外键名 foreign key (本表字段) references 外键表(外键表字段)
);

// 删除外键
alter table test drop foreign key 外键名;

// 直接添加外键
alter table test add constraint 外键名 foreign key (本表字段) references 外键表(外键表字段);
```

### 表数据：

* `insert into` 插入数据：

表名后不跟列名时默认给所有列插入数据。
```sql
insert into 表名(列名1,列名2,...) values(值1,值2,...);
```

* `delete` 删除数据：

```sql
delete from 表名 [where 条件];
```

* `update` 修改数据：

不添加where条件则会一条一条的删除表中所有数据，不推荐此方法清空表效率低。
推荐 `truncate table 表名;` 先删除表，再创建一个一样的空表(效率高)
```sql
update 表名 set 列名1=值2,列名2=值2,...[where 条件]; // 没有条件则整列值被修改
```

### `select` **查询数据：**

* 查询所有字段：
```sql
select 列 from 表
    [where]
    [group by]
    [having]
    [order by]
```

* 列还可进行四则运算：
```sql
// 第三列为第一列与第二列的和，为null的值运算结果为null，需要ifnull设置默认值
select 列名1,列名2,ifnull(列名1,0)+ifnull(列名2,0) from 表名;
```

* 聚合函数：

```sql
// distinct 去重
select distinct(列名) as 别名 from 表名;

// count 计算个数(注意它会忽略值为null的行)
select count(列名) as 别名 from 表名;

// max 最大值
select max(列名) as 别名 from 表名;

// min 最小值
select min(列名) as 别名 from 表名;

// avg 平均值
select avg(列名) as 别名 from 表名;

// sum 求和
select sum(列名) as 别名 from 表名;
```

* where 条件查询：

```sql
// like 模糊查询：'_'单个字符，'%'任意多个字符，[],[^]指定范围和非指定范围
select 列名 from 表名 where 条件列 like 条件;

// in 或值查询：
select * from 表名 where 列名 in(val1,val2,...);

// between 起始值 and 终值 范围查询：
select * from 表名 where 列名 between 起始值 and 终点值;
```

* order by 排序：

```sql
// asc：升序(默认)，desc：降序
select * from 表名 order by 排序列名 排序方式,次排序列名 排序方式,...;
```

* group by 分组：

```sql
select 分组列[,聚合函数(列)]... from 表名 group by 分组列;

// 搭配 having 使用(与where类似)，对分组后的表格进行条件筛选
select class as cla from t group by class having cla>4;
```

* limit 分页：limit 为mysql方法分页查询

```sql
// 行标从0开始，行标=(页数-1)*显示行数
select * from 表名 limit 行标,显示行数;
// 如：select * from t_students limit 0,6;
```

### 多表查询：

* 查询多表：`select * from 表1,表2;` 直接查询多表，它会将每个表每行组合的所有可能都显示出来。我们只需要利用条件限制，筛选出自己需要的数据。

实例：如下查询了3个表的三个字段，通过别名简化操作。通过对条件的限定，筛选出了我们需要的数据。
```sql
select  // 表字段
stu.StuName,
cla.Classname,
pro.ProName
from    // 表
    t_students as stu,
    t_classes as cla,
    t_pro as pro
where   // 条件
stu.ClassID=cla.ClassID and cla.ProID=pro.ProID
```

*  `inner join` 进行两表的查询：

```java
select * from
    表1
inner join  // inner 可省略
    表2
on 条件

// 双表查询，保留左表全部数据并并根据条件取交集部分
select * from 表左 left join 表右 on 条件
// 双表查询，保留右表全部数据并根据条件取交集部分
select * from 表左 right join 表右 on 条件
```

* 子查询：查询嵌套查询

单行单列子查询：

```sql
// 查询某值最大的一列，查询中条件中嵌套了一个求最大值的查询
select * from 表 where 值列名=(select max(值列名) from 表);
```

多行单列子查询实例：

```sql
select
    stu.StuName
from
    t_students as stu
where
    stu.ClassID in 
    (select ClassID from t_classes where classname in('计应用ZK1601','软件技术ZK1601'))
```

多行多列子查询实例：

```sql
select
    stu.StuName,cla.Classname
from
    t_students as stu,
    (select * from t_classes where classname in('计应用ZK1601','软件技术ZK1601')) as cla
where
    stu.ClassID=cla.ClassID 
```