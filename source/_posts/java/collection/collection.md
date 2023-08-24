---
title: Collection 集合基类
date: 2020-05-14 18:14:37
categories: Java
tags: 
    - java
    - 集合
    - collection
    - 迭代器
    - iterator
---

### 初识集合 Collection

在开始之前我们先看一下**集合的结构图解**
![集合结构图,图片来自网络](/images/java/list.jpg)

> Collection 集合的顶层接口，定义了集合的特性和方法。
> 集合存储的都是对象，集合类都在 java.util 包中。

#### Collection 基本方法一览：

| 方法             | 效果               | 返回值  |
| ---------------- | ------------------ | ------- |
| add(Object)      | 添加(对象)方法     | Boolean |
| remove(Object)   | 删除方法           | Boolean |
| contains(Object) | 是否包含某元素     | Boolean |
| isEmpty()        | 集合是否为空       | Boolean |
| size()           | 集合中元素个数     | int     |
| clear()          | 清除集合中所有元素 | void    |

**所有集合都有 toString()** 方法，可直接使用打印方法输出在控制台上。

#### 使用实例：

```java
//创建一个collection对象，ArrayList是它的一个子类(此时不用太多了解)
Collection con = new  ArrayList();

//add添加元素，不能添加基本类型元素，只能添加它们的包装类
con.add("object1");
con.add("object2");
con.add("object3");
System.out.println(con);//打印结果：[object1, object2, object3]

//remove删除元素，成功返回true否则false
boolean rm=con.remove("object2");
System.out.println(rm+" - "+con);//打印结果：true - [object1, object3]

//contains判断集合是否包含某元素
boolean exist=con.contains("object1");
boolean exist2=con.contains("object2");
System.out.println(exist+" - "+exist2);//打印结果：true - false

//isEmpty判断当前集合为空(没有元素)返回true，反之false
boolean empty=con.isEmpty();
System.out.println(empty);//打印结果：false

//clear清空当前集合元素
con.clear();

//size返回元素集合个数
int count=con.size();
//因为我们在上面已经把集合清空，所以打印结果为：0
System.out.println(count);
```

> 上实例只是为了演示 collection 中的方法，ArrayList 是 collection 的子类，则 `Collection con = new ArrayList()` 是多态中的向上转型，此时我们只能使用 collection 中的方法，ArrayList 中的方法无法使用，所有现在不用关心 ArrayList 后期会详细讲解。

#### Collection 带 All 方法一览：

| 方法                    | 效果                                 | 返回值  |
| ----------------------- | ------------------------------------ | ------- |
| addAll(Collection)      | 将某集合的元素全部添加到此集合中     | boolean |
| containsAll(Collection) | 此集合中是否包含另一集合中的所有元素 | boolean |
| removeAll(Collection)   | 移除此集合中与另一集合相同的元素     | boolean |
| retainAll(Collection)   | 此集合只保留与另一集合相同的元素     | boolean |

#### All 方法使用实例：

```java
Collection con=new  ArrayList();
con.add("obj1");
con.add("obj2");
con.add("obj3");

Collection con2=new ArrayList();
con2.add("obj4");
con2.add("obj5");
con2.add("obj6");

//将con2中元素全部向con添加一遍
con.addAll(con2);
System.out.println(con);
//打印结果：[obj1, obj2, obj3, obj4, obj5, obj6]

//判断con中是否包含con2中所有元素
boolean contain=con.containsAll(con2);
System.out.println(contain);//打印结果：true

//仅保留con中与con2相同的元素
con.retainAll(con2);
System.out.println(con);//打印结果：[obj4, obj5, obj6]

//移除con中与con2相同的元素
con.removeAll(con2);
System.out.println(con+" - "+con2);//打印结果：[] - [obj4, obj5, obj6]
```

### 集合迭代器(Iterator)

> Iterator 接口每一个集合都有实现此接口，通过它可以做到无视集合的数据结构，只判断有无元素而取出元素。它可以对任何集合做迭代通过 **_集合.iterator()_** 拿到迭代器对象，所有集合适用。
>
> > 主要方法：
> >
> > -   next 迭代元素。返回当前指向的元素，并且每次使用后指向下一个元素。当最后一个元素被迭代后再使用将报错
> > -   hasNext() 判断集合中还有无可迭代元素

#### 常用迭代方法实例：

```java
Collection con=new  ArrayList();
con.add("obj1");
con.add("obj2");
con.add("obj3");
//获取迭代器对象
for(Iterator it=con.iterator();it.hasNext();){
    System.out.println(it.next());
}
```

### 集合的一些细节

> 1. 集合中储存的是对象的引用地址，并非对象本身
> 2. 集合本不能存储基本数值类型，但 jdk1.5 以后存储基本数据类型时，内部将自动装箱处理：add(Integer.valueOf(1))
> 3. 存储时为 object 类型那么取出时也为 object 类型，想使用该对象方法需要向下转型(也可以通过泛型方式，去除此过程)
> 4. 一般集合中判断元素对象是否相等是调用了 equals 方法，而 object 的 equals 方法是默认比较**地址是否相等**。如需使用到会比较对象是否相等(重复)的方法，请**重写 equals 方法**
