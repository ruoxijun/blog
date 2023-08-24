---
title: Map 集合
date: 2020-06-02 14:07:41
categories: Java
tags: 
    - map
    - hashmap
---

### Map 集合

#### Map 已实现类与特性：

-   Hashtable:哈希表结构，且不允许 null 作为键和值，同步(不建议使用)，键唯一性靠 hashCode()和 equals()(在键对象的类中重写方法，可保证键唯一性)
    -   Properties(Hashtable 子类):属性集，**_键与值都是字符串_**(没有泛型)，都以 object 存储在其中(自身提供了不用强转的方法)，且可以结合 **_流_** 进行键值操作
-   HashMap: :哈希表结构，且允许**null 作为键和值**，不同步
    -   LinkedHashMap：HashMap 的子类，元素顺序为存入顺序(有序)
-   TreeMap:二叉树结构，会对元素根据键排序(排序方法参照 TreeSet)，不同步

#### Map 常用方法：

```java
Map map = new HashMap();
map.clear();//清空元素
map.size();//获取元素个数
map.containsKey("obj");//是否包含某键
map.containsValue("obj");//是否包含某值
map.isEmpty();//集合是否为空

map.get("key");//根据键拿值
map.put("key", "value");//添加元素
//键要保持唯一,添加同一键时会覆盖之前的值,且返回之前的值
map.put("key", "value2");//修改key的值
map.putAll(map);//将一个Map中的所有内容添加到此map中
map.remove("key");//根据键移除指定元素,返回删除的值
map.remove("key", "value");//根据键与值移除指定元素(必须完全相同),返回Boolean
```

#### 迭代 Map 集合的 3 种方法：

1. `map.keySet()` 获取所有键：
   它返回一个 set 集合，元素都是 map 集合的 key。

```java
HashMap<Integer,String> map=new HashMap<>();
map.put(1,"obj2");
map.put(2,"obj3");
map.put(0,"obj1");

Set<Integer> set=map.keySet();
for (Integer i:set) {
    System.out.println(map.get(i));
}
```

2. `map.values()` 获取所有值
   它返回 Collection 集合，元素都是 map 的 value。

```java
HashMap<Integer,String> map=new HashMap<>();
map.put(1,"obj2");
map.put(2,"obj3");
map.put(0,"obj1");

Collection<String> col=map.values();
for (String vs:col) {
    System.out.println(vs);
}
```

3. `map.entrySet()` 对象方式取出

它返回 `Set<Map.Entry<k,v>>` Entry是Map的内部接口，每一个Entry对象存储了map的一对键值对。通过Entry中的 `getKey` `getValue` `setValue` 等方法，对map进行 key,value的获取和value的修改。

```java
HashMap<Integer,String> map=new HashMap<>();
map.put(1,"obj2");
map.put(2,"obj3");
map.put(0,"obj1");

Set<Map.Entry<Integer,String>> entry=map.entrySet();
for (Map.Entry<Integer,String> e:entry) {
    System.out.println("key="+e.getKey()
            +"，value="+e.getValue());
    if (e.getKey()==1){
        //直接修改map中的值
        e.setValue("obj");
    }
}
System.out.println(map);
```