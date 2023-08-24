---
title: File and 字节流
date: 2020-07-03 15:06:15
categories: Java
tags: 
    - file
    - outputstream
    - inputstream
    - fileoutputstream
    - fileInputstream
---

## <center>File and 字节流</center>

> ### File：

-   初始化一个 `File` 对象：
    -   以路径最后所指文为准，最后时文件夹则为文件夹对象反之文件同理。
    -   `File.separator` ：返回系统文件目录分隔符

```java
//接受一个目录路径字符串，实例化为文件或文件夹对象
File file=new File("E:"+File.separator+"test"+File.separator+"test.txt");
//接受两个字符串，参2拼接在参1后面
File file2=new File("E:"+File.separator+"test","test.txt");
//接受一个file对象，参2接入该目录中
File file3=new File(file,"test.txt");
//File 对像 tostring 方法返回 getPath 方法值
System.out.println(file);
System.out.println(file2);
System.out.println(file3);
```

-   `File` 常用方法：

```java
File file=new File("e:/test/test.txt");
file.getPath();//该对象创建时传入的路径
file.getAbsolutePath();//文件的绝对路径
file.getName();//文件名(即文件路径的最后一项)
file.exists();//文件或文件夹是否存在
file.length();//文件大小(字节)
file.lastModified();//文件最近修改时间

//是文件或文件夹与后缀名无关，下列方法文件或文件夹不存在时也返回false
file.isFile();//该file对象是否是文件
file.isDirectory();//是否是文件夹
file.isHidden();//是否是隐藏文件或文件夹
```

-   `File` 对文件的操作：

```java
/**
 * createNewFile:
 * 只能创建文件，文件不存在路径正确创建成功返回true
 * 文件已存在返回false，路径错误将抛出IOException
 */
file.createNewFile();
//删除是直接删除不会存入回收站，正在被使用或不存在的文件无法删除
file.delete();
```

-   `File` 对文件夹(目录)的操作：

```java
file.mkdir();//一次只能创建一级目录，当路径中多级目录不存在时将创建失败
file.mkdirs();//创建多级目录
file.delete();//删除文件夹(要保证将删除的文件夹为空)

/**list():
 * 返回当前文件夹目录下的所有文件和文件夹名组成的String[]
 * 不返回List是因为List是可变的，数组是不可变的
 */
String[] files=file.list();//获取该文件夹下的文件和文件夹名
for (String file_item:files){//遍历所有名称
System.out.println(file_item);
}

/**
 * 与上list方法类似不过返回File对象组成的数组
 * 如果是系统级的文件夹，java没有权限访问会返回null(可能会造成空指针异常)
 */
File[] files=file.listFiles();
```

-   `File` 的 list，listFiles 方法添加过滤器：

```java
/**过滤器：
 * 需要实现FilenameFilter(文件名过滤器)或FileFilter(文件过滤器)接口
 * 实现accept方法指定过滤方式
 * list只能添加文件名过滤器，listFiles对于两种过滤器都可以
 */
//获取到后缀名为'.txt'的文件名
String[] fileName=file.list(new FindFileName());
//获取到File的文件对象
File[] files=file.listFiles(new FindFile());


/***过滤器具体实现类***/
//文件名过滤接口实现
class FindFileName implements FilenameFilter{
    public boolean accept(File dir, String name) {
        //此过滤器只有后缀名为'.txt'的文件满足要求
        return name.endsWith(".txt");
    }
}
//文件过滤接口实现
class FindFile implements FileFilter{
    public boolean accept(File pathname) {
        //此过滤器只有File对象为文件对象满足要求
        return pathname.isFile();
    }
}
```

> ### 字节流输出流：

#### 须知基础：

-   字符串转字节数组(`byte[]`)：

    1. `str.getBytes()`：将字符串按系统默认编码，编码为字节数组
    2. `str.getBytes("utf-8")`：将字符串按指定编码，编码为字节数组

-   字节数组(`byte[]`)转字符串：

    1. `new String(bytes)`：将字节数组按系统默认编码，解码为字符串对象
    2. `new String(bytes,"utf-8")`：将字节数组按指定编码，解码为字符串对象

-   字节流可操作所有文件，对文本文件编解码有一定困难。对文本文件建议使用字符流。

#### OutputStream ：

字节输出流的顶层抽象父类，它定义了字节输出流的基本方法：

-   `write`：写方法，它有 3 种重载方法：

    -   传入一个字节数组 `write(byte[] b)` 将此字节数组输出
    -   `write(byte[] b,int off,int len)` 输出一个字节数组，并指定它的某一段
    -   `write(int b)` 输出一个字节

-   `flush()` ：刷新此输出流
-   `close()` ：关闭此输出流

#### FileOutputStream ：

字节文件输出流继承自`OutputStream`，有 3 种常用的构造方法：

-   `FileOutputStream(String path)` ：传入文件路径的字符串
-   `FileOutputStream(File file, boolean append)` ：参 1 为文件对象，参 2 表示是否续写此文件
-   `FileOutputStream(String path, boolean append)`

当不选择续写时，文件不存在时会自动创建，文件已存在时将在文件后续写。

向 `e:/test/test.txt` 文件中写入 "test" :

```java
File file = new File("e:/test/test.txt");
//创建一个字节文件输出流并选择续写模式
FileOutputStream fos=new FileOutputStream(file,true);
byte[] date="test".getBytes();//将字符串转为字节数组
fos.write(date);//将数据写入该文件中
fos.flush();//刷新此输出流
fos.close();//关闭此输出流
```

IO 流的操作都存在许多异常，上写法存在许多隐患。推荐下方式更标准的一种写法：

```java
File file=new File("e:/test/test.txt");
FileOutputStream fos = null;//在try语句外定义文件字节输出流变量
try {
    fos=new FileOutputStream(file);//创建文件字节输出流实例
    byte[] date="test".getBytes();//准备数据
    fos.write(date);//写入数据
    fos.flush();//刷新此流
} catch (FileNotFoundException e) {
    e.printStackTrace();
} catch (IOException e) {
    e.printStackTrace();
} finally{//此语句块内的语句无论上方语句中是否产生异常都会执行
    //有时可能路径问题造成实例创建失败，所有在此需要判断是否为空
    if (fos!=null){
        try {//流不为空时关闭此流
            fos.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

因为流是会消耗系统资源的，所有无论数据写入的成功与否该流都应关闭。因此流的关闭方法写在了 `finally` 语句块中，此语句块中的语句无论上方 `try` 块中是否产生异常都必须执行。

#### BufferedOutputStream ：

字节缓冲输出流继承自`FilterOutputStream`，缓冲流适用于输出资源较多时。
写入的数据将暂存在缓冲区只有调用刷新或关闭方法时才能将缓冲区的数据写入文件中。
关闭方法中在关闭前有调用刷新方法，建议每写一次 `write` 就刷新调一次 `flush` 。

```java
File file=new File("e:test/test.txt");
//创建一个字节文件输出流
FileOutputStream fos=new FileOutputStream(file);
//将字节文件输出流交给字节缓冲输出流
BufferedOutputStream bos=new BufferedOutputStream(fos);
byte[] date="test".getBytes();//准备数据
bos.write(date);//写入数据
bos.flush();//刷新缓冲区，将数据写入
//缓冲流将调用字节文件输出流的关闭方法
bos.close();//缓冲流自身并没有关闭方法
```

> ### 字节流输入流：

#### InputStream ：

读入流的顶层父类，它定义了读入流的基本方法。

-   `read`：读方法，它有 3 种重载方法：

    -   `read(byte[] b)` 读取字节数组长度个或小于此长度个字节，字节数组大小建议为 1024 的倍数
    -   `read(byte[] b,int off,int len)` 读取字节存入字节数组中，并取出其中指定的一段
    -   `read()` 读取一个字节，读取到末尾时返回-1

*   `available()` 可读取的剩余字节数的估计

-   `close()` 关闭此读入流

#### FileInputStream ：

FileInputStream 有两个常用构造方法，传入一个 `File` 对象，或传入文件的路径。

简单使用：

```java
File file=new File("e:/test/test.txt");
FileInputStream is=new FileInputStream(file);
byte[] bytes=new byte[1024];//数据存储(缓冲区)
System.out.println("剩余字节数："+is.available());
int i=0;//接受读取文件的返回值
while ((i=is.read(bytes))!=-1){//文件是否读取到末尾
    System.out.println("剩余字节数："+is.available());
    //将字节数组中存有数组的一段组成字符串输出
    System.out.println(new String(bytes,0,i));
}
is.close();//关闭流
```