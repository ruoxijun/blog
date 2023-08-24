---
title: HttpClient
date: 2021-01-12 19:50:14
categories: Java
tags: 
    - 爬虫
    - httpclient
---

# HttpClient

> *   网络数据都需要使用 HTTP 协议访问互联网获取，而 Java 的 HTTP 协议客户端 HpptClient 技术（就相当于一个浏览器）能更好的协助请求网络数据。
> *   这里主要介绍 get 与 post 的带参请求，如无需参数去除参数构建与添加环节代码即可。

## 依赖：

```
<dependency>
    <groupId>org.apache.httpcomponents</groupId>
    <artifactId>httpclient</artifactId>
    <version>4.5.13</version>
</dependency>
```

## Get 请求：

```java
// 访问地址
String url = "https://www.baidu.com/";
// 创建客户端
CloseableHttpClient client = HttpClients.createDefault();
// 利用 URIBuilder 对象添加参数
URIBuilder uriBuilder = new URIBuilder(url)
        .addParameter("a","1")
        .addParameter("b","2");
// 创建 get 请求对象(无需参数可省略URIBuilder直接传入url地址)
HttpGet httpGet = new HttpGet(uriBuilder.build());
CloseableHttpResponse response = null;
try {
    // 客户端执行请求,并拿到响应对象
    response = client.execute(httpGet);
    // 查看响应状态码是否为200
    if (response.getStatusLine().getStatusCode() == 200) {
        // 获取到响应的实体对象
        HttpEntity entity = response.getEntity();
        // 利用工具类获取到网页内容
        String content = EntityUtils.toString(entity, "utf8");
        // 打印网页代码
        System.out.println(content);
    }
} catch (Exception e) {
    e.printStackTrace();
} finally {
    if (response != null) {
        try {
            response.close(); // 关闭 get 响应
        } catch (IOException e) { e.printStackTrace(); }
    }
    try {
        client.close(); // 关闭客户端
    } catch (IOException e) { e.printStackTrace(); }
}
```

## Post 请求：

```java
// 请求路径
String url = "https://www.baidu.com/";
// 创建客户端
CloseableHttpClient client = HttpClients.createDefault();
// 创建 post 请求对象
HttpPost httpPost = new HttpPost(url);
// 利用集合封装表单数据
List<NameValuePair> params = new ArrayList<>();
// 添加数据
params.add(new BasicNameValuePair("a","1"));
// 创建表单的实体对象，参1需传入封装的表单数据
UrlEncodedFormEntity em = new UrlEncodedFormEntity(params,"utf8");
// 将表单实体对象设置到 post 请求实体中
httpPost.setEntity(em); // 无参 post 请求与 get 无参类似
CloseableHttpResponse response = null;
try {
    // 执行 post 请求
    response = client.execute(httpPost);
    // 查看响应对象状态码是否为200
    if (response.getStatusLine().getStatusCode() == 200) {
        // 利用实体工具类将响应实体转换为 utf8 的字符串
        String content = EntityUtils.toString(response.getEntity(), "utf8");
        // 输出网页内容
        System.out.println(content);
    }
} catch (Exception e) {
    e.printStackTrace();
} finally {
    if (response != null) {
        try {
            response.close(); // 关闭 post 响应
        } catch (IOException e) { e.printStackTrace(); }
    }
    try {
        client.close(); // 关闭客户端
    } catch (IOException e) { e.printStackTrace(); }
}
```

## 连接池：

每次请求都需要创建 HTTPClient，而频繁的创建与销毁会造成资源的浪费，此时我们就可以通过使用连接池来管理 HTTPClient。（与数据库连接池原理相同）

```java
// 创建连接池管理器
PoolingHttpClientConnectionManager cm = new PoolingHttpClientConnectionManager();
// 设置最大连接数
cm.setMaxTotal(100);
// 设置每个主机的最大连接数
cm.setDefaultMaxPerRoute(10);
// 从连接池中获取客户端（HTTPClient）对象
CloseableHttpClient httpclient = HttpClients.custom()
        .setConnectionManager(cm).build(); // 给客户端构造对象设置连接池并构建客户端对象
// 创建请求对象
HttpGet httpGet = new HttpGet("https://www.baidu.com/");
CloseableHttpResponse response = null;
try {
    response = httpclient.execute(httpGet);
    if (response.getStatusLine().getStatusCode() == 200) {
        String content = EntityUtils.toString(response.getEntity(), "utf8");
        System.out.println(content);
    }
} catch (IOException e) {
    e.printStackTrace();
} finally {
    if (response != null) {
        try {
            response.close();
        } catch (IOException e) {e.printStackTrace(); }
    }

    /* 注意这里的客户端由连接池统一管理所以不用我们手动关闭 */
    // httpclient.close(); // 省略
}
```

**注意：由连接池管理的客户端对象是不用我们来关闭的，由连接池直接管理。**

## 配置请求：

```java
/* 以为 get 请求添加配置为例 */
HttpGet httpGet = new HttpGet();
// 创建请求配置对象
RequestConfig config = RequestConfig.custom()
        .setConnectTimeout(1000) // 创建连接的最长时间
        .setConnectionRequestTimeout(500) // 获取连接的最长时间
        .setSocketTimeout(10*1000) // 数据传输的最长时间
        .build();
// 添加配置
httpGet.setConfig(config);
```

## HttpClient 封装：

这里我们主要封装了无参 get 请求，其它请求请自行封装。

```java
/**
 * HttpClient 工具类
 */
public class HttpUtils {

    // 连接池对象
    private PoolingHttpClientConnectionManager cm;
    public HttpUtils() {
        // 创建连接池对象
        this.cm = new PoolingHttpClientConnectionManager();
        this.cm.setMaxTotal(100); // 设置连接数
        this.cm.setDefaultMaxPerRoute(10); // 设置每个主机的最大连接数
    }

    // 请求配置对象
    private RequestConfig getConfig() {
        return RequestConfig.custom()
                .setConnectTimeout(1000) // 创建连接的最长时间
                .setConnectionRequestTimeout(500) // 获取连接的最长时间
                .setSocketTimeout(10*1000) // 数据传输的最长时间
                .build();
    }

    // 通过get获取页面
    public String doGetHtml(String url) {
        String html = "";
        // 获取客户端对象
        CloseableHttpClient httpclient = HttpClients.custom()
                .setConnectionManager(this.cm).build();
        // 创建请求对象
        HttpGet httpGet = new HttpGet(url);
        // 配置请求
        httpGet.setConfig(getConfig());
        CloseableHttpResponse response = null;
        try {
            // 客户端执行请求
            response = httpclient.execute(httpGet);
            // 查看请求是否成功
            if (response.getStatusLine().getStatusCode() == 200) {
                // 拿到响应实体
                HttpEntity entity = response.getEntity();
                // 当响应实体不为空时转换为字符串
                if (entity != null) {
                    html = EntityUtils.toString(entity, "utf8");
                }
            }
        } catch (IOException e) { e.printStackTrace();
        } finally {
            if (response != null) {
                try {
                    response.close(); // 关闭响应
                } catch (IOException e) {e.printStackTrace(); }
            }
        }
        return html;
    }

    /** get 方式下载图片
     * @param url 网站地址
     * @param path 保存地址
     * @return 全路径名
     */
    public String doGetImage(String url,String path) {
        String msg = "";
        // 获取客户端对象
        CloseableHttpClient httpclient = HttpClients.custom()
                .setConnectionManager(this.cm).build();
        // 创建请求对象
        HttpGet httpGet = new HttpGet(url);
        // 配置请求
        httpGet.setConfig(getConfig());
        CloseableHttpResponse response = null;
        try {
            // 客户端执行请求
            response = httpclient.execute(httpGet);
            // 查看请求是否成功
            if (response.getStatusLine().getStatusCode() == 200) {
                // 拿到响应实体
                HttpEntity entity = response.getEntity();
                // 当响应实体不为空时保存图片
                if (entity != null) {
                    String suffix = url.substring(url.lastIndexOf(".")); // 后缀名
                    String imageName = UUID.randomUUID().toString()+suffix; // 图片名
                    File imageFile = new File(path, imageName); // 创建文件
                    msg = imageFile.toString(); // 文件位置
                    OutputStream image = new FileOutputStream(imageFile); // 文件流
                    entity.writeTo(image); // 保存
                }
            }
        } catch (IOException e) { e.printStackTrace();
        } finally {
            if (response != null) {
                try {
                    response.close(); // 关闭响应
                } catch (IOException e) {e.printStackTrace(); }
            }
        }
        return msg;
    }

}
```