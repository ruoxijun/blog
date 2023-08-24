---
title: Set 集合
date: 2020-06-02 10:56:29
categories: Java
tags: 
    - set
    - hashset
    - treeset
    - linkedhashSet
---

### Set 集合

> Set 接口 (无序,元素不能重复)，继承了 Collection 接口无特有方法。

#### Set 已实现类与特性：

-   HashSet：哈希表结构，保证元素唯一性依靠 `hashCode()` 和 `equals()` 方法(hash 值相同时再判断 equals,相同将不再存储)，不同步
-   TreeSet：是链表结构(指针)，需保证元素唯一性，可排序
-   LinkedHashSet：HashSet 的子类，按存入顺序使用

#### Set 利用 Iterator 动态移除元素：

与 list 类似直接在 foreach 或循环中动态 `add` 或 `remove` 会出错。

```java
Set set=new HashSet();
set.add("set0");
set.add("set1");
set.add("set2");

Iterator iterator=set.iterator();
while (iterator.hasNext()){
    String str = (String) iterator.next();
    if (str.equals("set1")) {
        iterator.remove();
    }
    System.out.println(str);
}
```

#### HashSet 元素唯一性：

> -   HashSet 保证元素唯一性是通过元素的两个方法，hashCode()和 equals()来完成的。
> -   如果元素的 HashCode 值相同，才会判断 equals 是否为 true。
> -   如果元素的 HashCode 值不同，不会调用 equals。

由此可知我们要保证 Set 中存入的对象(元素)唯一时，需在该元素类中重写 `hashCode` 和 `equals` 方法。
例子：

```java
class stu{
    private String name;
    private int age;
    public stu(String name, int age) {
        this.name = name;
        this.age = age; }
    @Override//先返回hash值
    public int hashCode() {
        return Objects.hash(name);
    }
    @Override//再判断属性是否相同
    public boolean equals(Object o) {
        stu stu = (stu) o;
        return name.equals(stu.name);
    }
    @Override
    public String toString() {return "stu{name="+name+"-age="+age+"}";}
}
--------------使用----------------------------
HashSet hashSet=new HashSet();
hashSet.add(new stu("stu1",10));
hashSet.add(new stu("stu2",30));
hashSet.add(new stu("stu1",20));
System.out.println(hashSet);
```

运行结果：

`[stu{name=stu1-age=10}, stu{name=stu2-age=30}]`

可以看出因为 `new stu("stu1",10)` 即 stu1 已存在 `new stu("stu1",20)` 存入失败。

#### TreeSet 排序与去重：

-   TreeSet 保证元素唯一性和排序依靠，`Comparable` 接口的 `compareTo` 或 `Comparator` 接口的 `compare`方法。此
-   new TreeSet 时传入一个 Comparator 对象，将使用此接口方法比较元素。
-   不传入参数时默认需元素类实现 Comparable 接口，将默认使用此接口 compareTo 方法，来比较元素。存入的元素类未实现此接口将报错。
-   比较元素时返回值 **等于 0** 表示 **元素重复**。

**_使用默认比较排序：_**

```java
//实现Comparable接口和compareTo方法
class stu implements Comparable{
    private String name;
    private int age;
    public stu(String name, int age) {
        this.name = name;
        this.age = age; }
    @Override
    public String toString() {return "stu{name="+name+"-age="+age+"}";}
    @Override
    public int compareTo(Object o) {
        stu s=(stu)o;
        return name.compareTo(s.name);
    }
}
----------------使用-------------------
TreeSet hashSet=new TreeSet();
hashSet.add(new stu("stu1",10));
hashSet.add(new stu("stu2",30));
hashSet.add(new stu("stu1",20));
System.out.println(hashSet);
```

运行结果：
`[stu{name=stu1-age=10}, stu{name=stu2-age=30}]`

**_使用比较器比较排序：_**

```java
//实现Comparator接口和compare方法
class compare implements Comparator{
        @Override
    public int compare(Object o1, Object o2) {
        stu s1=(stu) o1;
        stu s2=(stu) o2;
        return s1.name.compareTo(s2.name);
    }
}
------------------使用-----------------------------
//传入比较器
TreeSet hashSet=new TreeSet(new compare());
hashSet.add(new stu("stu1",10));
hashSet.add(new stu("stu2",30));
hashSet.add(new stu("stu1",20));
System.out.println(hashSet);
```

运行结果与上同。

#### Set 中有序集合 LinkedHashSet：

```java
LinkedHashSet hashSet=new LinkedHashSet();
hashSet.add(new stu("stu1",10));
hashSet.add(new stu("stu2",30));
hashSet.add(new stu("stu1",20));
System.out.println(hashSet);
```

运行结果：
`[stu{name=stu1-age=10}, stu{name=stu2-age=30}]`

`LinkedHashSet` 去重与 `HashSet` 同，元素顺序与存入时的顺序同。
