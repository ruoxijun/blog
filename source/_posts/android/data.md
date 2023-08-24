---
title: Android 数据存储
date: 2020-07-06 20:01:47
categories: Android
tags: 
    - sharedpreferences
    - sqlite
    - file
---

## Android 数据存储

> ### SharedPreferences 轻量级存储：

SharedPreferences是存储共享变量的接口，文件路径位于“/data/data/应用程序包/shared_prefs”目录下的xml文件。

```java
// 获取共享文件对象，参1为文件名不存在则创建，参2为操作文件的模式推荐使用：'MODE_PRIVATE'
SharedPreferences sp=getSharedPreferences("data",MODE_PRIVATE);
// 查看某key数据是否存在
sp.contains("key");
// 根据key获取value，参2为key不存在时返回的默认值
sp.getString("key","defaultValue");
```

Editor接口为SharedPreferences接口的内部接口，专编辑共享数据。通过共享对象的 `edit()` 获取到该对象。

```java
// 获取该共享文件的编辑对象
SharedPreferences.Editor edit=sp.edit();
// 添加或修改数据值
edit.putString("key","value");
edit.clear(); // 清空该共享文件数据
// 数据编辑完成后，必须使用该方法数据才能载入xml文件中
edit.apply();
```
以上都以 `String` 数据演示，还有其它数据可选。

> ### Android 自带数据库 SQLite 存储：
> Android 数据库文件存在 "/data/data/应用程序包/databases" 文件夹中

#### SQLiteOpenHelper ：

Android 操作数据库首先需要继承 `SQLiteOpenHelper` 抽象类。我们需要实现3个方法：

* `onCreate` ：只在创建数据库时调用一次此方法，此方法中一般写入创建表语句。

* `onUpgrade` ：升级数据库方法。

* `构造函数` ：构造函数主要为了向父构造方法传参，参2为数据库名，参3为游标工厂对象为 `null` 时有默认的游标工厂，参4为数据库版本数。

```java
public class MySqlite extends SQLiteOpenHelper {

    //构造函数，保存数据库信息
    public MySqlite(@Nullable Context context) {
        super(context, TABLE_ENAME, null, VERSION);
    }
    
    @Override // 创建表
    public void onCreate(SQLiteDatabase db) {
        db.execSQL("create table ...");
    }
    
    @Override // 数据库表升级方法
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {}
}
```

* 创建继承 `SQLiteOpenHelper` 类的对象后，并未创建数据库它只利用构造方法记录(赋值)了数据库的信息。
* 只有第一次调用  `getWritableDatabase` 或 `getReadableDatabase` 方法时才会创建数据库并调用此类的 `onCreate` 方法(创建表)所以该方法内不能使用此get方法否则会造成无限递归。
* 调用  `getWritableDatabase` 或 `getReadableDatabase` 方法，会返回 `SQLiteDatabase` 数据库的操作对象。

```java
String sql = "SQL 原生语句";

// 创建 SQLiteOpenHelper 数据库对象
MySqlite mySqlite=new MySqlite(context);
// 获取 SQLiteDatabase 数据库操作对象
SQLiteDatabase database=mySqlite.getWritableDatabase();

// 执行数据库 "增删改" 方法
database.execSQL(sql);

// 执行数据库 "查" 方法，数据保存在 Cursor 对象中返回
Cursor cursor=database.rawQuery(sql,null);
// 遍历查找的数据
while(cursor.moveToNext()){//查看游标是否指向数据末尾
    // 获取游标当前行的name列的数据，列数从0开始算起
    cursor.getString(cursor.getColumnIndex("name"));
}

// 关闭数据库
database.close();
```

数据库查询的所有类型数据都可通过游标( `Cursor` )的 `getString` 方法获取到。

关于数据库的操作，由于数据库的原生语句容易出错。Android官方还提供了许多API方法简易操作，请自查。

> ### File 文件存储：

Android分为内部存储和外部存储。上面介绍的轻量级xml键值对文件存储和数据库存储都是是内部存储。
内部存储还有 `/data/data/应用程序包` 下的 `files` 和 `cache` 文件夹管理的文件。 我们可以通过上下文对象的 `getFilesDir()` 和 `getCacheDir()` 方法获取它们两的file对象。

#### 内部存储 files 文件夹下：

操作都基于 Java 的 IO 流进行。

* 文件存储
```java
// 通过调用上下文的openFileOutput方法，拿到 写 对象
FileOutputStream out=openFileOutput("test.txt",MODE_PRIVATE);
out.write("hello world".getBytes());
out.close();
```
* 文件取出
```java
// 通过openFileInput方法，拿到 读 对象
FileInputStream in=openFileInput("test.txt");
byte[] data=new byte[1024];
int i=in.read(data);
System.out.println(new String(data,0,i));
in.close();
```