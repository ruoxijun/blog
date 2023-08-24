---
title: MyBatis-Plus
date: 2023-04-29 10:10:14
categories: SpringBoot
tags: 
    - mybatisplus
    - lambda
    - stream流
---

# MyBatis-Plus

## 函数式编程

### Lambda

> Lambda 是 JDK8 中的一个语法糖，它课可以对某些匿名内部类的写法进行简化。
>
> 任何接口只包含唯一一个抽象方法，那么它就是一个函数式接口，则可以使用 Lambda 表达式代替。

* 基本格式：

```java
([参数列表]) -> {方法体}
```

* 使用实例：

```java
// 匿名内部类写法
new Thread(new Runnable() {
    @Override
    public void run() {
        System.out.println("new Runnable");
    }
}).start();

// Lambda 写法
new Thread(()-> System.out.println("Lambda")).start();
```

### Stream 流









### Optional



## MyBatis-Plus

### 使用方法

#### 官网

[MyBatis-Plus官网：https://www.baomidou.com/](https://www.baomidou.com/)

#### 依赖

```xml
<!-- https://mvnrepository.com/artifact/com.baomidou/mybatis-plus-boot-starter -->
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-boot-starter</artifactId>
    <version>3.5.3.1</version>
</dependency>
```

#### 配置

* 配置 mapper 扫描

```java
@MapperScan("top/ruoxijun/mapper")
```

* application.yml

```yaml
spring:
  datasource:
    type: com.alibaba.druid.pool.DruidDataSource
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/db_user?serverTimezone=GMT%2B8&characterEncoding=utf8&useSSL=false&useUnicode=true
    username: root
    password: 88888888

mybatis-plus:
  global-config:
    db-config:
      id-type: auto # 配置全局 id 自增
      logic-delete-field: deleted # 全局逻辑删除的实体字段名
      logic-delete-value: 1 # 逻辑已删除值(默认为 1)
      logic-not-delete-value: 0 # 逻辑未删除值(默认为 0)
  configuration:
    map-underscore-to-camel-case: true # 开启驼峰命名
    auto-mapping-behavior: full # 自动映射字段，包括复杂结果集
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl # 开启控制台 SQL 日志打印
  mapper-locations: classpath*:/mapper/**/*.xml
```

* 自动填充配置

```java
@Component
public class MyMetaObjectHandler implements MetaObjectHandler {

    @Override
    public void insertFill(MetaObject metaObject) {
        this.strictInsertFill(metaObject, "createTime", () -> LocalDateTime.now(), LocalDateTime.class);
    }

    @Override
    public void updateFill(MetaObject metaObject) {
        this.strictInsertFill(metaObject, "createTime", () -> LocalDateTime.now(), LocalDateTime.class);
        this.strictUpdateFill(metaObject, "updateTime", () -> LocalDateTime.now(), LocalDateTime.class);
    }

}
```

* MyBatis-Plus 插件配置类

```java
@Configuration
@MapperScan("scan.your.mapper.package")
public class MybatisPlusConfig {

    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        // 分页插件
        interceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.MYSQL));
        // 乐观锁插件
        interceptor.addInnerInterceptor(new OptimisticLockerInnerInterceptor());
        return interceptor;
    }

    /**
     * 新的分页插件,一缓和二缓遵循mybatis的规则,需要设置
     * MybatisConfiguration#useDeprecatedExecutor = false 
     * 避免缓存出现问题(该属性会在旧插件移除后一同移除)
     */
    @Bean
    public ConfigurationCustomizer configurationCustomizer() {
        return configuration -> configuration.setUseDeprecatedExecutor(false);
    }

}
```

### 常用注解

#### 表名

```java
@TableName(value="sys_user", resultMap="user")
```

#### 主键

```java
@TableId(value="id", type="IdType.AUTO")
```

#### 字段

```java
@TableField(
  value = "name", 
  exist = true, // 该字段表中是否存在
  fill = "INSERT_UPDATE" // 插入和更新时填充字段（CURRENT_TIMESTAMP）
)
```

#### 乐观锁

```java
@Version
```

#### 枚举类

```java
@EnumValue
```

#### 逻辑处理

```java
@TableLogic(value="1", delval="0")
```

#### 默认排序

```java
@OrderBy(isDesc=true)
```

## Service 接口

### save 插入

```java
boolean save
boolean saveBatch
boolean saveOrUpdate
boolean saveOrUpdateBatch
```

### remove 删除

```java
boolean remove
boolean removeById
boolean removeByMap
boolean removeByIds
```

### update 更新

```java
boolean update
boolean updateById
boolean updateBatchById
```

### get 查询

```java
T getById
T getOne
Map<String, Object> getMap
<V> V getObj
```

### list 查询

```java
List<T> list
Collection<T> listByIds
Collection<T> listByMap
List<Map<String, Object>> listMaps
List<Object> listObjs
```

### page 分页

```java
IPage<T> page
IPage<Map<String, Object>> pageMaps
```

### 查询记录数

```java
int count
```

### Chain 链式操作

```java
// 链式查询 普通
QueryChainWrapper<T> query();
// 链式查询 lambda 式
LambdaQueryChainWrapper<T> lambdaQuery();

// 链式更改 普通
UpdateChainWrapper<T> update();
// 链式更改 lambda 式
LambdaUpdateChainWrapper<T> lambdaUpdate();
```

##  Mapper 接口

### 增删改

```java
int insert(T entity); // 插入一条记录

// 删除记录
int delete
int deleteBatchIds
int deleteById
int deleteByMap

// 更新记录
int update
int updateById
```

### 查询

```java
T selectById
T selectOne
List<T> selectBatchIds
List<T> selectList
List<T> selectByMap
List<Map<String, Object>> selectMaps

// 根据 Wrapper 条件，查询全部记录。注意： 只返回第一个字段的值
List<Object> selectObjs

// 分页查询记录
IPage<T> selectPage
IPage<Map<String, Object>> selectMapsPage

Integer selectCount
```

## 条件构造器

### AbstractWrapper

> QueryWrapper(LambdaQueryWrapper) 和 UpdateWrapper(LambdaUpdateWrapper) 的父类

#### 条件语句

```java
allEq
eq
ne // <>
gt // >
ge // >=
lt // <
le // <=
between
notBetween

or
and

isNull
isNotNull
in
notIn
inSql
notInSql
```

#### 模糊查询

```java
like // '%val%'
notLike
likeLeft
notLikeLeft
likeRight
notLikeRight
```

#### 集合处理

```java
groupBy
orderByAsc
orderByDesc
orderBy
having
```

#### sql 处理

```java
func
nested
apply
last
exists
notExists
```













