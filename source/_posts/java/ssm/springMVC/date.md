---
title: SpringMVC数据处理
date: 2020-08-22 8:55:10
categories: SpringBoot
tags: 
    - springmvc
    - fastjson
    - jackson
    - json
    - 文件上传
    - 异常
    - 拦截器
    - springmvc运行流程
---

# SpringMVC 高级属性

## SpringMvc与JSON：

### 1. JS对象与JSON转换：

```javascript
let o = {name:"test",age:18,pass:111};
// stringify：对象转json字符串
let json = JSON.stringify(o);
console.log(json); // {"name":"test","age":18,"pass":111}
// parse：json字符串转对象
let obj = JSON.parse(json);
console.log(obj); // {name: "test", age: 18, pass: 111}
```

### 2. 了解 Jackson：

#### 1. 导入依赖：

*   [依赖地址](https://mvnrepository.com/artifact/com.fasterxml.jackson.core/jackson-databind)：

```xml
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.11.2</version>
</dependency>
```

#### 2. @ResponseBody：

* SpringMvc 中导入 Jackson 使用 @ResponseBody 标识的方法的返回值是一个对象，那么 Jackson 会自动将该对象转为 json 字符串并返回。
* @ResponseBody 标注的类则此类中所有的方法都返回 JSON 字符串。

```java
// produces 解决乱码问题
@RequestMapping(value="/hello",produces="application/json;charset=utf-8")
@ResponseBody // 使该方法不通过视图解析器，直接返回字符串
public String hello() throws JsonProcessingException {
    // 对json处理都依赖于此对象
    ObjectMapper mapper = new ObjectMapper();
    // 将传入的java任意对象（包括集合，数组等）转换为json字符串
    return mapper.writeValueAsString(new User("test",111));
}
```

*   对于专返回 json 字符串的 controller 类可直接在类上标注 **`@RestController`** 注解，此注解是 `@Controller` 与 `@ResponseBody` 的结合。

#### 3. JSON编码统一处理：

* 在 SpringMvc 配置文件中对返回的字符串进行编码设置：省去对每一个方法设置编码的步骤

```xml
<mvc:annotation-driven>
    <mvc:message-converters register-defaults="true">
        <bean class="org.springframework.http.converter.StringHttpMessageConverter">
            <constructor-arg value="UTF-8"/>
        </bean>
        <bean class="org.springframework.http.converter.json.MappingJackson2HttpMessageConverter">
            <property name="objectMapper">
                <bean class="org.springframework.http.converter.json.Jackson2ObjectMapperFactoryBean">
                    <property name="failOnEmptyBeans" value="false"/>
                </bean>
            </property>
        </bean>
    </mvc:message-converters>
</mvc:annotation-driven>
```

#### 4. @RequestBody：

* **@RequestBody** 注解能获取到本次请求的 **请求体** ，get没有请求体所以会获取到空。
* 如果请求体是一个对象的 JSON 字符串，它能将此 JSON 映射到对应的对象上，需要为 ajax 请求中设置 `contentType: "application/json"` 表示内容格式为 JSON 字符串类型。

```java
@RequestMapping("/hello")
public void hello(@RequestBody User user){
    System.out.println(user);
}
```

##### HttpEntity：

*   方法中还能使用一个参数 `HttpEntity` 它能同时拿到 **请求体和请求头** 的数据：

```java
@RequestMapping("/hello")
public String hello(HttpEntity<String> str) {
    System.out.println(str);
}
```

##### ResponseEntity：

*   方法的返回值可以是 `ResponseEntity` 它可以 **返回响应体的同时设置响应头** ：

```java
@RequestMapping("/test")
public ResponseEntity<String> test() {
    // 设置响应头
    MultiValueMap<String, String> headers = new HttpHeaders();
    headers.add("Set-Cookie","user=root");
    // 参数1 响应体(泛型数据类型)，参数2 响应头，参数3 响应状态码
    return new ResponseEntity<String>("{a:1}", headers, HttpStatus.OK);
}
```

#### 5. 时间对象(Date)：

*   SpringMvc 中默认 Date 对象转换为时间戳，可以通过设置 ObjectMapper 时间格式处理返回的 Date 对象：

```java
// 对json处理都依赖于此对象
ObjectMapper mapper = new ObjectMapper();
//不使用时间戳的方式
mapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
//自定义日期格式对象
SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//指定日期格式
mapper.setDateFormat(sdf);
// 传入Date对象，返回指定时间格式字符串
return mapper.writeValueAsString(new Date());
```

*   pojo 类成员上使用注解方式指定时间格式(推荐)，每次 Jackson 将 pojo 类转为 JSON 时都会按照你在成员上方注解的规则进行转化：

```java
@JsonIgnore // 转 JSON 时忽略此成员
private int pass;

@JsonFormat(pattern="yyyy-MM-dd") // 规定转 JSON 时时间的格式
private Date date;
```

#### 6. 使用 Jackson：

1. jackson 对象：

```java
ObjectMapper mapper = new ObjectMapper();
```

2. java对象序列化为json：

```java
// 对java象转化为json字符串
String json = mapper.writeValueAsString(new User());
// 将java对象转化为json字符串并序列化为json文件
mapper.writeValue(new File("json/js.json"),new User());
```

3. json反序列化为java对象：

```java
// json字符串转java对象
User user = mapper.readValue(json, User.class);
// 将读取的json文件（或者url）转化为java对象
User user2 = mapper.readValue(new File("json/js.json"), User.class);
```

4. 通过`TypeReference`反序列化为集合(list，map)：

```java
// 使用TypeReference将json字符串转化为集合（list,map）
ArrayList<String> list =
        mapper.readValue(json,new TypeReference<ArrayList<String>>(){});
HashMap<String, Object> map =
        mapper.readValue(json,new TypeReference<HashMap<String, Object>>(){});
// 使用TypeReference是为了保证数据准确性和安全，也可以直接转换但不准确
```

5. JsonNode 对象读取json：

```java
// 通过ObjectMapper将json字符串转化为JsonNode对象
JsonNode jsonNode = mapper.readTree(json);
// 通过json的key获取value的JsonNode对象
JsonNode name = jsonNode.get("list");
// JsonNode 获取该节点的json字符串
String s = name.toString();
// 或将该节点转化为某值
String s1 = name.asText();
```

### 3. 了解 fastjson：

1. 导入依赖，[依赖地址](https://mvnrepository.com/artifact/com.alibaba/fastjson)：

```xml
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>fastjson</artifactId>
    <version>1.2.73</version>
</dependency>
```

2. fastjson常用方法：

fastjson 三个主要的类：**JSONObject  代表 json 对象** ，**JSONArray  代表 json 对象数组**，**JSON代表 JSONObject和JSONArray的转化**。

```java
//创建一个对象
User user1 = new User("秦疆1号", 3);
User user2 = new User("秦疆2号", 3);
List<User> list = new ArrayList<>();
list.add(user1);
list.add(user2);

// Java对象 转 JSON字符串
String str1 = JSON.toJSONString(list);
String str2 = JSON.toJSONString(user1);

// JSON字符串 转 Java对象
User jp_user1=JSON.parseObject(str2,User.class);

// Java对象 转 JSON对象
JSONObject jsonObject1 = (JSONObject) JSON.toJSON(user2);
// 根据key获取json对象中的值
jsonObject1.getString("name");

// JSON对象 转 Java对象
User to_java_user = JSON.toJavaObject(jsonObject1, User.class);
```

## 数据校验：

Java 标准提案第 303 条规定了数据校验的标准形成了 **JSR303** ，它是为 Java Bean 数据合法性校验提供的标准框架已经包含在 Java EE 6.0 中。

**Hibernate Validator** 是 JSR303 的一种参考实现，除 jsr 标准注解外它还支持额外的一些注解：

* maven添加依赖支持：

```xml
<!-- https://mvnrepository.com/artifact/org.hibernate/hibernate-validator -->
<dependency>
    <groupId>org.hibernate</groupId>
    <artifactId>hibernate-validator</artifactId>
    <version>6.1.0.Final</version>
</dependency>
```

* 常用注解（所有注解都有一个message属性，自定义错误信息）：

| Constraint                      | 详细信息                                     | 作用类型                                                     |
| ------------------------------- | -------------------------------------------- | ------------------------------------------------------------ |
| @Null                           | 元素必须为 null                              | 引用类型                                                     |
| @NotNull                        | 元素必须不为 null                            | 引用类型                                                     |
| @AssertTrue                     | 元素必须为 true                              | boolean                                                      |
| @AssertFalse                    | 元素必须为 false                             | boolean                                                      |
| @Min(value)                     | 必须是一个数字，其值必须大于等于指定的最小值 | byte、short、int、long及对应的包装类型以及BigDecimal、BigInteger |
| @Max(value)                     | 必须是一个数字，其值必须小于等于指定的最大值 | byte、short、int、long及对应的包装类型以及BigDecimal、BigInteger |
| @DecimalMin(value)              | 必须是一个数字，其值必须大于等于指定的最小值 | byte、short、int、long及对应的包装类型以及BigDecimal、BigInteger、String |
| @DecimalMax(value)              | 必须是一个数字，其值必须小于等于指定的最大值 | byte、short、int、long及对应的包装类型以及BigDecimal、BigInteger、String |
| @Size(max, min)                 | 大小必须在指定的范围内                       | String、Collection、Map和数组                                |
| @Digits (integer, fraction)     | 必须是一个数字，其值必须在可接受的范围内     | byte、short、int、long及各自的包装类型以及BigDecimal、BigInteger、String |
| @Past                           | 必须是一个过去的日期                         | java.util.Date,java.util.Calendar                            |
| @Future                         | 必须是一个将来的日期                         | java.util.Date,java.util.Calendar                            |
| @Pattern(regex=)                | 必须符合指定的正则表达式                     | String                                                       |
| @Valid                          | 需要递归验证                                 | 引用对象                                                     |
| 以下是Hibernate Validator新增的 |                                              |                                                              |
| @Email                          | 必须是电子邮箱地址                           | String                                                       |
| @Length(min=下限, max=上限)     | 字符串的大小必须在指定的范围内               | String                                                       |
| @NotEmpty                       | 必须非空并且size大于0                        | String、Collection、Map和数组                                |
| @NotBlank                       | 必须不为空且不能全部为’ '(空字符串)          | String                                                       |
| @Range(min=最小值, max=最大值)  | 必须在合适的范围内                           | byte、short、int、long及各自的包装类型以及BigDecimal、BigInteger、String |

* 为 pojo 类需要的属性添加相应校验注解后，SpringMvc 请求方法中在使用到该 pojo 的变量前使用注解声明该 pojo 自动封装为对象时需要校验：

```java
@RequestMapping("hello")
// Valid 标注需要验证,添加 BindingResult 参数接收封装校验结果
public String hello(@Valid User user, BindingResult result){
    result.hasErrors(); // 是否有校验错误
    // 获取所有验证错误的对象
    List<ObjectError> allErrors =result.getAllErrors();
    for (ObjectError allError : allErrors) {
        allError.getDefaultMessage(); // 错误信息
        allError.getObjectName(); // 错误字段名
    }
    return "hello";
}
```

注意：校验的 pojo 类后需要紧跟一个 `BindingResult` 来接收前一个参数(pojo类)的校验结果，中间不能有其它的参数。

## 拦截器：

SpringMVC 的拦截器类似于 Servlet 中的过滤器 Filter ,区别在于 **拦截器是AOP思想的具体应用**。

* 自定义拦截器必须继承 **HandlerInterceptor** 接口。源码如下：

```java
public interface HandlerInterceptor {
    // 目标方法运行之前,此方法的返回值表示对请求是否放行
    default boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        return true; // 默认请求放行
    }
    // 目标方法运行之后
    default void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, @Nullable ModelAndView modelAndView) throws Exception {
    }
    // 整个请求完成后，来到目标页面（preHandle放行，资源响应之后）
    default void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, @Nullable Exception ex) throws Exception {
    }
}
```

* 自定义拦截器后需要在spring-mvc.xml中配置拦截器：

```xml
<!-- 拦截器管理配置 -->
<mvc:interceptors>
    <!-- 配置当个bean默认拦截所有请求 -->
    <!-- <bean class="ruoxijun.config.MyInterceptor"/> -->
    
    <!-- 单个拦截器配置 -->
    <mvc:interceptor>
        <!-- 拦截的请求路径，**表示此请求下的所有请求 -->
        <mvc:mapping path="/**"/>
        <!-- 绑定拦截器类 -->
        <bean class="ruoxijun.config.MyInterceptor"/>
    </mvc:interceptor>
    <!-- 还可配置多个interceptor（拦截器） -->
</mvc:interceptors>
```

* 拦截器可用于用户的登录等权限管理操作，常搭配 **Session** 与 **Cookie** 一同使用（详情见javawab章）。
* **mvc单拦截器运行流程：**
  1. preHandle：目标方法运行前
  2. 目标方法执行
  3. postHandle：目标方法运行后
  4. 页面加载完成
  5. afterCompletion：请求完成后
* **mvc多拦截器运行流程** ：（如有两个拦截器，且1配置在2之前）
  1. preHandle1 -> preHandle2 -> 后目标方法运行
  2. postHandle2 -> postHandle1 -> 后页面加载
  3. afterCompletion2 -> afterCompletion1

## 异常处理：

SpringMvc 中也能使用 `SimpleMappingExceptionResolver ` 在配置文件中配置异常处理。

### 1. @ExceptionHandler：

controller 类中可以使用 `@ExceptionHandler` 注解来处理该 controller发生的异常，它标注在一个方法上且 value 属性值为需要拦截的异常类数组。

```java
// 标注此方法专处理该 controller 中发生的某些异常
@ExceptionHandler({Exception.class}) 
public String err(Exception exception){ // 填写异常类参数接收异常
    return "err"; // 与请求方法一样经过视图解析器，返回 err.jsp 页面
}
```

*   该方法参数只能是异常类为参数来接收异常，返回值与请求方法类似(可返回 `ModelAndView` )
*   当一个 controller 中有多个 @ExceptionHandler 标注的方法，发生异常时异常会匹配更精确的那个方法

### 2. @ControllerAdvice：

被 `@ControllerAdvice` 标注的类被自动添加到 spring 的 ioc 容器中，该类中被 `@ExceptionHandler` 标注的方法就是全局异常处理方法，同时这个类也被称之为全局异常处理类。

```java
@ControllerAdvice
public class Err {
    @ExceptionHandler(Exception.class)
    public String err(){
        return "err";
    }
}
```

*   controller 异常处理方法和全局异常处理类同时存在时，优先使用 controller 本类中的存在的异常处理方法。

### 3. @ResponseStatus：

自定义异常类注解 `@ResponseStatus` 当发生该类异常时会来到一个 SpringMvc 异常显示界面，当存在异常处理方法拦截到该异常时将由异常处理方法处理，不再去 SpringMvc 的异常显示界面。

```java
@ResponseStatus(reason = "自定义异常发生" ,
                code = HttpStatus.NOT_ACCEPTABLE)
public class MyException extends RuntimeException { }
```

## 文件上传与下载：

### 文件上传注意事项：

1. 为保证服务器安全，上传文件应放在外界无法访问的目录下，如WEB-INF目录。
2. 为防止文件覆盖现象应为上传文件产生一个唯一文件名。
3. 限制上传文件的最大值，限制上传文件的类型。

### 上传文件具体实现：

#### 1. 添加依赖：

添加`commons-fileupload`依赖，maven会自动导入它的依赖包`commons-io`。

```xml
<!-- 文件上传 -->
<!-- https://mvnrepository.com/artifact/commons-fileupload/commons-fileupload -->
<dependency>
    <groupId>commons-fileupload</groupId>
    <artifactId>commons-fileupload</artifactId>
    <version>1.4</version>
</dependency>
```

#### 2. 表单配置：

1. form 属性 `method` 需要设置为 `post` ，`get` 不能传输文件，但会接收到文件名。
2. form 属性 `enctype` 设置为 `multipart/form-data` (文件传输必须设置，表示已二进制流方式处理表单数据)
3. input 的 `type` 设置为 `file`

```html
<form action="/download" method="post" enctype="multipart/form-data">
    <input type="file" name="file" />
    <input type="submit" value="上传" />
</form>
```

#### 3. 配置文件上传解析器：

SpringMvc 提供了即插即用文件上传解析器 **MultipartResolver（CommonsMultipartResolver类）** ：

```xml
<!-- springmvc文件上传解析器，id必须为multipartResolver -->
<bean id="multipartResolver" class="org.springframework.web.multipart.commons.CommonsMultipartResolver">
    <!-- 请求编码格式 -->
    <property name="defaultEncoding" value="utf-8"/>
    <!-- 文件上传大小上限，10MB=10485760字节 -->
    <property name="maxUploadSize" value="#{1024*1024*10}"/>
    <property name="maxInMemorySize" value="40960"/>
</bean>
```

#### 4. 文件上传：

* CommonsMultipartFile 的 常用方法：

1. **String getOriginalFilename()：获取上传文件的原名**

2. **InputStream getInputStream()：获取文件流**

3. **void transferTo(File dest)：将上传文件保存到一个目录文件中**

* 使用流（getInputStream）获取保存文件：

SpringMvc 将上传的文件信息都封装在了 `CommonsMultipartFile` 中，在使用文件上传时一般我们只需在接收上传文件的方法参数中添加它的父类 `MultipartFile` 参数来接收上传的文件：

```java
// 一般不直接使用 CommonsMultipartFile 而是使用它的父类 MultipartFile
@RequestMapping(value = "/file")
public String file(@RequestPart(value = "file")CommonsMultipartFile file,
                   HttpServletRequest request) throws IOException {
    // 该文件 input 的 name 值
    String name = file.getName(); 
    // 获取文件名
    String fileName = file.getOriginalFilename();
    // 创建存放文件的文件夹
    File path = new File(request.getServletContext().getRealPath("/file"));
    if (!path.exists()){
        path.mkdir();
    }
    // 获取上传文件的文件流
    InputStream in = file.getInputStream();
    // 存放文件
    File filePath = new File(path,fileName);
    OutputStream out = new FileOutputStream(filePath);
    int len = 0;
    byte[] buffer = new byte[1024];
    while ((len = in.read(buffer))!=-1){
        out.write(buffer,0,len);
        out.flush();
    }
    out.close();
    in.close();
    return "redirect:/";
}
```

* 使用 **transferTo ** 方法保存文件：

```java
@RequestMapping(value = "/file")
public String file(@RequestPart(value = "file")CommonsMultipartFile file,
                   HttpServletRequest request) throws IOException {
    // 获取文件名
    String fileName = file.getOriginalFilename();
    // 创建存放文件的未文件夹
    File path = new File(request.getServletContext().getRealPath("/file"));
    if (!path.exists()){
        path.mkdir();
    }
    // 存放文件
    File filePath = new File(path,fileName);
    // 定义文件对象后使用transferTo方法，直接保存文件
    file.transferTo(filePath);
    return "redirect:/";
}
```

#### 5. 多文件上传：

SpringMvc 多文件上传时将每一个文件的信息都封装在了 `MultipartFile` 最终将它们组成了一个 `MultipartFile[]` 的数组，我们只需在接收上传文件的方法中添加此数组参数即可接收上传的文件。

HTML中表单设置：

```html
<form action="${pageContext.request.contextPath}/upload"
      method="post" enctype="multipart/form-data" >
    <%-- 文件控件同名 --%>
    <input type="file" name="file" /> 
    <input type="file" name="file" />
    <%-- 不同 name 需要分别处理 --%>
    <input type="file" name="file2" />
    <input type="submit" value="上传" />
</form>
```

controller中：

```java
@ResponseBody
@RequestMapping("/upload") // 将MultipartFile设置为数组
public String upload(@RequestPart("file") MultipartFile[] file,
                    @RequestPart("file2") MultipartFile file2)
    throws IOException {
    for (MultipartFile multipartFile : file) {
        if (!multipartFile.isEmpty()){ // 当文件不为空时保存起来
            multipartFile.transferTo(new File("E:\\",
                multipartFile.getOriginalFilename()));
        }
    }
    return "ok";
}
```

#### @RequestPart:

@RequestPart 适用于复杂的请求域（像JSON，XML），既可以接收 JSON 字符串并封装为对象又可以接收二进制数据流（multipart/form-data）。

### 文件下载：

文件下载注意配置 response 响应头和一些必要配置，都是一些固定设置。

```java
@RequestMapping(value = "/download")
public String file(HttpServletRequest request, HttpServletResponse response)
        throws IOException {
    // 设置页面不缓存,清空buffer
    response.reset();
    // 设置字符编码
    response.setCharacterEncoding("utf-8");
    // 二进制传输数据
    response.setContentType("multipart/form-data");
    // 设置响应头
    response.setHeader("Content-Disposition","attachment;fileName="+
            URLEncoder.encode("wallhaven-eyg6l8.jpg","utf-8"));
    
    // 读取文件
    File path = new File(request.getServletContext().getRealPath("/file"));
    File filePath = new File(path,"wallhaven-eyg6l8.jpg");
    InputStream in = new FileInputStream(filePath);
    // 获取传输文件输出流
    OutputStream out = response.getOutputStream();
    int len = 0;
    byte[] buffer = new byte[1024];
    while ((len = in.read(buffer))!=-1){
        out.write(buffer,0,len);
        out.flush();
    }
    out.close();
    in.close();
    return "redirect:/";
}
```

## SpringMvc 运行流程：

1. 发起请求，前端控制器（DispatcherServlet）接受请求，调用doDispatch进行处理
2. 根据HandlerMapper中保存的请求映射信息找到，处理当前请求的处理器执行链（包含拦截器）
3. 根据当前处理器找到它的HandlerAdapter（适配器）
4. 拦截器的preHandle先执行
5. 适配器执行目标方法，并返回ModelAndView
   1. ModelAttribute注解标注的方法提前运行
   2. 执行目标方法时确定目标方法用的参数，根据参数前有无注解和参数类型(如Model)执行不同。
      * 如果是自定义类型：
        1. 看隐含模型中有没有，有就从隐含模型中取
        2. 否则再看是否为SessionAttributes标注的属性，是则拿，拿不到则报错
        3. 以上都不满足利用反射创建对象
6. 拦截器的postHandle执行
7. 处理结果；（页面渲染流程）
   1. 如果有异常使用异常解析器处理，处理完成后返回ModelAndView
   2. 调用render进行页面渲染
      1. 视图解析器根据视图名得到视图对象
      2. 视图对象调用render方法
   3. 执行拦截器的afterCompletion

==掌握1-7（7.1-7.3）==