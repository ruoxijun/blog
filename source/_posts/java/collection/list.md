---
title: List 集合
date: 2020-05-15 09:37:19
categories: Java
tags: 
    - list
    - arraylist
    - linkedlist
---

### List 集合

> List 接口 (有序,带索引,元素可重复)，继承了 Collection 接口继承了它的方法外，它还定义了 list 集合的特性和独有方法，它的元素是 **_有序带索引且可重复_** 的，通过索引可以精确操作集合元素。所有对索引操作的方法都存在 **_角标越界_** 的错误风险。

#### List 重载和特有方法一览：

| 方法             | 效果                   | 返回值           |
| ---------------- | ---------------------- | ---------------- |
| add(int,object)  | 指定插入               | void             |
| set(int,object)  | 修改元素               | Object(泛型对象) |
| get(int)         | 获取元素               | Object(泛型对象) |
| indexOf(object)  | 查找获取该元素位置     | int              |
| remove(int)      | 删除元素               | 被删除元素       |
| subList(int,int) | 取部分集合，取头不取尾 | List             |

#### List 已实现类和特性：

-   Vector: 是长度可变的数组结构，增删改查都慢，同步(不建议使用)
-   ArrayList: 是长度可变的数组结构，查询速度快,增删较慢,且是不同步的
-   LinkedList: 是链表结构(指针)，增删快，查询较慢，不同步

#### List 的基本使用：

```java
List list=new ArrayList();
list.add("obj1");
list.add("obj2");
list.add("obj3");
//指定位置插入(角标0开始)
list.add(1,"obj");
//修改(角标0开始)
list.set(0,"obj0");
//获取指定位置上的元素
System.out.println(list.get(1));
//查找某元素在集合第一次出现的位置，未查找到返回-1
System.out.println(list.indexOf("obj2"));
//查找某元素在集合最后次出现的位置，未查找到返回-1
System.out.println(list.lastIndexOf("obj0"));
//移除指定位置上的元素
list.remove("obj");
//取部分集合，参1开始坐标，参2长度(包含头不包含尾)
List list2=list.subList(0,2);

System.out.println(list2);
System.out.println(list);
```

运行结果：

```
obj
2
0
[obj0, obj2]
[obj0, obj2, obj3]
```

#### 在循环中修改元素：

-   在 for 循环中对 list `remove` 操作时需注意元素的移动，和 size 的变化。

```java
for(int i=0;i<list.size();i++){
    System.out.println(i+":"+list.get(1));
        if (list.get(i).equals("obj2")){
        //移除元素后，后元素前移。
        list.remove("obj2");
        //角标需后移一位
        i--;
    }
}
```

-   foreach 循环中不能使用 `add` 和 `remove` 方法，否则报错。原因请参考此文章： [foreach 循环中不能用 list.remove() list.add()方法的原因分析](https://blog.csdn.net/wxxiangge/article/details/89874178?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.nonecase&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.nonecase)

*   利用 ListIterator 动态修改元素(官方推荐)：

```java
//获取到当前list的迭代器，并判断是否存在下一个元素
for (ListIterator li=list.listIterator();li.hasNext();){
    //next返回当前元素返回，指针并指向下一元素
    if(li.next().equals("obj0")){
        //改变当前next返回的元素
        li.set("obj");
        //移除当前next返回的元素
        li.remove();
        //在当前next返回的元素，之后添加元素
        li.add("obj1");
    }
}
```

注意此 **ListIterator** 迭代器为为 list **独有**。

#### LinkedList：

此类的方法是实现模拟 **堆栈** 或 **队列** 的最好选择

```java
LinkedList list=new LinkedList();
//在头部添加元素
list.addFirst("add0");
//在尾部添加元素
list.addLast("add1");
//获取头部上的元素
list.getFirst();
//获取尾部上的元素
list.getLast();
//移除头部上的元素并返回
list.removeFirst();
//移除尾部元素并返回
list.removeLast();
```
