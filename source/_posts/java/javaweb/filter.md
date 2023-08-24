---
title: 过滤器和文件上传下载
date: 2020-05-21 20:17:51
categories: Java
tags: 
    - javaweb
    - filter
    - 文件上传与下载
---

## Filter 过滤器：

> 对在客户端和服务器之间的中间层 **接口**，可对客户请求消息和服务器响应消息做拦截处理。并且 **_一个 servlet 文件可以添加多个过滤器，一个过滤器也可过滤多个 servlet 文件_** 都在 xml 文件中配置。

```java
public interface Filter {
    default void init(FilterConfig filterConfig) throws ServletException {}
    //关键方法
    void doFilter(ServletRequest var1, ServletResponse var2, FilterChain var3) throws IOException, ServletException;

    default void destroy() {}
}
```

源码中可以看出它与 servlet 类似，都有 init 初始化和 destroy 销毁的方法。但这两方法与 servlet 不同的是，它们前面加入了 **_default_** 关键字(java8 新特性)。可以看到它们后面有方法体，所以我们可以选择不重写此两方法，只重写过滤的关键方法 **_doFilter_** 。且此方法与 servlet 中 **_service_** 方法类似，可对请求和响应做操作。

-   实例情景模拟：在浏览器中用**post**方式并以 name 为 key 传递一个**中文**的值访问 `/servlet` 映射如下。

```html
<form action="/web/servlet" method="post">
    名字：<input type="text" value="" name="name" />
    <input type="submit" value="提交" name="sub" />
</form>
```

-   servlet 类中：

```java
@WebServlet("/servlet")
public class Servlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        //可就地设置编码
        //request.setCharacterEncoding("UTF-8");
        //response.setContentType("text/html;charset=utf-8");
        //未设置编码时下方请求和响应都出现乱码
        String name = request.getParameter("name");
        System.out.println(name);
        response.getWriter().write("哈哈哈");
    }
}
```

-   过滤器中：

```java
public class MyFilter implements Filter {
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse,
                         FilterChain filterChain) throws IOException, ServletException {
        /**在servlet中我们需要给请求和响应设置编码，
         * 当有多个servlet类时我们就可以用过滤器方式，
         * 减少复用，只用在xml中给这些类配置过滤器。
         */
        servletRequest.setCharacterEncoding("UTF-8");
        servletResponse.setContentType("text/html;charset=UTF-8");
        //过滤器会默认中断请求，需要请求继续传递下去需要使用 FilterChain
        //doFilter参数中自带filterChain，doFilter需要传入请求和响应对象
        filterChain.doFilter(servletRequest,servletResponse);
    }
}
```

-   xml 中将 servlet 与过滤器关联：

```html
<web-app>
    <filter
        ><!--映射，与servlet的映射类似-->
        <filter-name>myfilter</filter-name>
        <filter-class>io.ruoxijun.MyFilter</filter-class>
    </filter>
    <filter-mapping>
        <filter-name>myfilter</filter-name>
        <!--指明添加此过滤器映射的URL，过滤jsp写站点路径全名-->
        <url-pattern>/servlet</url-pattern>
        <!--还可以继续为其它servlet添加此过滤器-->
        <url-pattern>/此url标签不限个数</url-pattern>
    </filter-mapping>

    <!--也可为一个url配置多个过滤器映射-->
    <filter-mapping>
        <filter-name>filters</filter-name>
        <url-pattern>/servlet</url-pattern>
    </filter-mapping>
</web-app>
```

#### Filter 生命周期：

> 与 servlet 类似唯一不同是当 **服务器启动** 便利用反射加载类调用无参构造函数，还有一个前提是必须在 xml 中配置了 Filter。之后便于 servlet 类似： `init初始化 → doFilter(执行多次，到服务器关闭) → destory销毁`
> 当一个 servlet 文件对应多个过滤器时，在 xml 中排在前的过滤器先执行。且注意过滤器是否有继续传递请求。

#### Filter 注解：

与 servlet 一样，Filter 也能使用注解：
在 Filter 类上方: **_`@WebFilter("/servlet")`_**
它还能过滤 jsp： **_`@WebFilter("/路径全名.jsp")`_**

#### Filter 使用场景：

1. 同一处理中文乱码
2. 屏蔽敏感词汇
3. 控制资源访问权限

## 文件上传：

知识补充： `req.getServletContext().getRealPath("/file/1.txt");` 可拿到当前文件的路径，且传入参数会附加在该路径之后。返回字符串

上传时表单设置：

1. input 的 `type` 设置为 `file`
2. form 属性 `method` 需要设置为 `post` (get 不会传输文件，只会提交文件的 name)
3. form 属性 `enctype` 设置为 `multipart/form-data` (文件传输必须设置)

```html
<form action="servlet" method="post" enctype="multipart/form-data">
    <input type="file" name="file" />
    <br /><br />
    <input type="submit" value="提交" />
</form>
```

-   servlet 中直接利用 `resp` 获取文件：
    通过 `req.getInputStream()` 方法，接收到文件流

```java
protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    BufferedReader buReader=new BufferedReader(
            new InputStreamReader(req.getInputStream()));
    String values=null;
    BufferedWriter buWriter=new BufferedWriter(
            new OutputStreamWriter(
                    new FileOutputStream("E:/test/str.txt")));
    while ((values=buReader.readLine())!=null){
        System.out.println(values);
        buWriter.write(values);
        buWriter.newLine();
        buWriter.flush();
    }
}
```

**_注意：_** 此流输出的文件并不是指包含文件本身，它流的*开头*和*末尾*都插入了，一些浏览器*信息*。不经过处理直接保存可能导致文件无法正常使用。

-   使用 `fileupload` 获取上传文件：
    使用 `fileupload` 需要导入 `commons-fileupload` 和 `commons-io` 的 jar 包。它将所有的请求都解析成了 `FileItem` 对象,以面像对象的方式完成文件的上传。如我们不用再考虑怎么处理浏览器头尾自带的信息，它的将文件和信息提取分离了出来。我们只需调用它提供的方法就能获取到我们需要的数据信息。
    `ServletFileUpload` 文件管理对象的 `parseRequest(HttpServletRequest)` 请求解析方法，会将 form 的每一个 input 都解析为一个 fileitem 对象,并组成 `List<FileItem>` 集合返回。

```java
protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    //文件管理对象
    DiskFileItemFactory dfif=new DiskFileItemFactory();
    //文件上传对象，需要传入一个文件管理对象
    ServletFileUpload sfu=new ServletFileUpload(dfif);
    try {
        //将请求解析为fileitem的集合
        List<FileItem> fileItems=sfu.parseRequest(req);
        for(FileItem fileItem: fileItems){
            //判断是否是表单字段，否则就是文件
            if(fileItem.isFormField()){
                //获取该input的name属性名
                String name=fileItem.getFieldName();
                //获取该input的值
                String value=fileItem.getString("UTF-8");
            }else{
                //获取该input上传的文件名，非上传文件时该值为null
                String fileName=fileItem.getName();
                long size=fileItem.getSize();//文件大小
                //此流只存在文件数据，头尾不在有多余累赘
                InputStream input=fileItem.getInputStream();
                FileOutputStream output=new FileOutputStream("e:/test/"+fileName);
                int b=0;
                while ((b=input.read())!=-1){
                    output.write(b);
                }
                output.close();
                input.close();
            }
        }
    } catch (FileUploadException e) {
        e.printStackTrace();
    }
}
```

## 文件下载：

```html
<a href="servlet">下载</a>
```

servlet 中：

1. `resp.setContentType` 和 `resp.setHeader` 为文件下载必须设置方法。它们会掉用浏览器自带的下载程序。
2. `resp.getOutputStream()` 获取到指向浏览器的输出流，输出文件。

```java
protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    //响应方式
    resp.setContentType("application/x-msdownload");
    //下载之后的文件名
    resp.setHeader("Content-Disposition","attachment;filename=ha.txt");
    OutputStream output = resp.getOutputStream();
    FileInputStream input = new FileInputStream("E:\\test\\1.txt");

    int b=0;
    while ((b=input.read())!=-1){
        output.write(b);
    }
}
```
