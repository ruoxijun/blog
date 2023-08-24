---
title: Jsoup
date: 2021-01-17 19:50:14
categories: Java
tags: 
    - 爬虫
    - jsoup
---

# Jsoup

> *   Jsoup 是一款 java 的 HTML 解析器可以直接解析 URL 地址或是 HTML 文本。可以通过 Dom、CSS已经类似于 jQuery 的操作方式提取数据。

## 依赖：

```xml
<dependency>
    <groupId>org.jsoup</groupId>
    <artifactId>jsoup</artifactId>
    <version>1.13.1</version>
</dependency>
```

## Jsoup 可解析类型：

```java
String url = "https://www.baidu.com/";
// 将一个URL解析为document最长时间为3秒
Document dom = Jsoup.parse(new URL(url), 3000);
/**
 * Jsoup 还提供了解析字符串和文件的方式，
 * 注意 baseUri 参数表示，此网页中所有网址的前缀。
 * Document parse(String html)
 * Document parse(String html, String baseUri)
 * Document parse(File in, String charsetName)
 * Document parse(File in, String charsetName, String baseUri)
 * Document parse(InputStream in, String charsetName, String baseUri)
 */
```

通过URL或文件字符串解析得到的 `Document` 对象，就是我们可获取数据的操作对象。接下来我们将以这里百度的 **dom对象为例** 来获取数据。

## dom方式获取元素：

```java
/* 以dom方式获取元素 */
// 1. 根据ID获取元素
Element byId = dom.getElementById("su");
String val = byId.val(); // 该按钮元素value属性的值
System.out.println("id = "+val);

// 2. 根据标签获取元素
Element title = dom.getElementsByTag("title").first(); // first 表示第一个元素
String titleText = title.text(); // 元素内的文本
System.out.println("tag = "+titleText);

// 3. 根据class值获取元素(可以是该标签引用的所有class，也可以是一部分)
Element byClass = dom.getElementsByClass("s-top-left s-isindex-wrap").first();
// dom.getElementsByClass("s-isindex-wrap").first(); // 作用同上
String byClassText = byClass.text();
System.out.println("class = "+byClassText);

// 4. 根据标签属性名获取元素
Element attr = dom.getElementsByAttribute("name").first();
String attrText = attr.text();
System.out.println("href = "+attrText);
// 4.1 根据标签属性与值获取元素
Element attrByValue = dom.getElementsByAttributeValue("name","tj_zhidao").first();
String attrByValueText = attrByValue.text();
System.out.println("attrByValue = "+attrByValueText);
```

## 获取数据：

```java
/* 获取元素中的数据 */
// 1. 获取元素的id
System.out.println("元素id为："+byId.id());

// 2. 获取元素的class值(classNames方法将每一个class都封装到了set集合中)
System.out.println("元素的class值为："+byClass.className());// 完整的class值

// 3. 根据元素属性的名字获取属性的值
System.out.println("属性值为："+attrByValue.attr("name"));

// 4. 获取元素的所有属性与值
Attributes attributes = byId.attributes(); // 提供了很多api供我们提取值
System.out.println("元素的所有属性与值："+attributes.toString());

// 5. 带有value属性的表单组件可以使用 val 方法，一般标签可使用 text 获取文本
```

## 选择器获取元素：

### 1. 基本选择方式：

```java
// 1. 通过标签查找元素
Element selectA = dom.select("a").first();
System.out.println("选择a标签 = "+selectA.className());

// 2. 通过id来查找
Element selectId = dom.select("#su").first();
System.out.println("通过id = "+selectId.val());

// 3. 通过class查找
Element selectClass = dom.select(".mnav").first();
System.out.println("通过class = "+selectClass.text());

// 4. 通过属性或属性与值(去除属性等于的值就能获取拥有该属性的元素)
Element selectAttr = dom.select("[name=tj_zhidao]").first();
System.out.println("通过属性 = "+selectAttr.text());
```

### 2. 高级筛选之组合：

这里不做过多讲解与CSS的选择器类似，只以方式1为例简单介绍一下：

```java
/**
 * 1. 元素+(id|class|属性名值) 指定元素
 * 2. parent child ：parent元素下所有为child的子元素
 * 3. parent > child ：parent元素下直接所有子元素为child的
 * 4. parent > * ：parent下的所有元素
 */
// 满足该属性的 a 标签
Element first = dom.select("[href=http://news.baidu.com]a").first();
System.out.println(first.text());
```