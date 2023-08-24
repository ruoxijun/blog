---
title: spring注解开发与Aop
date: 2020-08-16 8:55:10
categories: SpringBoot
tags: 
    - spring
    - aop
---

# 注解开发与Aop

## 注解开发：

### 1. 注解实现自动装配：

在使用注解之前我们还需要在bean文件中加入注解驱动（在spring4之后使用注解开发要保证 **aop** 包导入了）：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:context="http://www.springframework.org/schema/context"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        https://www.springframework.org/schema/context/spring-context.xsd">
    <!-- 注解驱动 -->
    <context:annotation-config/>
    
    <bean id="cat" class="ruoxijun.pojo.Cat" p:name="猫"/>
    <bean id="dog" class="ruoxijun.pojo.Dog" p:name="狗"/>
    <bean id="people" class="ruoxijun.pojo.People">
        <property name="name" value="若惜君"/>
    </bean>
</beans>
```

1. 使用 **@Autowired** 注解：

```java
@Data
public class People {
    // Autowired表示自动装配，它有个required属性默认为true
    @Autowired // 注解的成员无get,set等方法也能自动装配
    private Cat cat;
    // required为false时表示该属性可以为null，即bean文件中没有该对象时不会报错
    @Autowired(required=false) 
    private Dog dog;
    private String name;
}
```

**原理** ：先按照 **类型** 在容器中寻找相应组件，找到多个时根据 **bean id** 匹配（使用变量名与id进行匹配），未找到时报错。

2. **@Autowired** 和 **@Qualifier(value = "id")** 结合使用可指定装配某一个bean：

```java
@Autowired // 默认使用变量名与id匹配
@Qualifier(value = "cat") // 指定的一个id与bean id匹配
private Cat cat;
```

扩展：**@Autowired** 和 **@Qualifier(value = "id")** 还能为方法使用，注意使用 Autowired 注解的方法会装配后自动运行。

```java
@Autowired // 为方法的每一个参数自动赋值，原理一样
private void show(@Qualifier("a") A a){ // 为某参数指定bean
    System.out.println(a);
}
```

3. java中jdk自带有一个和 **@Autowired** 类似的注解 **@Resource**：

```java
@Data
public class People {
    @Resource // 自动匹配
    private Cat cat;
    @Resource(name = "dog") // 指定对象，也可指定类型type = Dog.class
    private Dog dog;
    private String name;
}
```

注意Resource与Autowired的区别：Resource先按照名称装配，其次按照类型装配，扩展性强。

Resource与Autowired都可以标注在属性的set方法上，且Autowired只能在加入了IOC容器中的类才能使用。

### 2. 注解实现bean功能：

在使用这些注解之前还需要在bean文件中添加下面这句，spring会去自动扫描base-package对应的路径或者该路径的子包下面的java文件，如果扫描到文件中带有@Service,@Component,@Repository,@Controller等这些注解的类，则把这些类注入到IOC容器中：

```xml
<!-- 开启包注解扫描 -->
<context:component-scan base-package="ruoxijun.pojo"/>
```

```xml
<!-- 类排除： -->
<context:component-scan base-package="ruoxijun.service">
    <!-- type="annotation"：按照指定注解排除，assignable：排除指定类
             expression：给出全类名即可 -->
    <context:exclude-filter type="annotation" expression="注解全类名"/>
</context:component-scan>
```

```xml
<!-- 类指定：（使用与类排除基本一致）
         use-default-filters="false"：必须禁用默认规则才会生效 -->
<context:component-scan base-package="ruoxijun.service" use-default-filters="false">
    <context:include-filter type="assignable" expression="指定类全类名"/>
</context:component-scan>
```

**注意：** 此注解同时启用了注释驱动的 `<context:annotation-config/>` 配置

* 注解实现bean（ **@Component** ）与属性值注入（ **@value** ）：

```java
// 组件，等价于：<bean id="cat" class="ruoxijun.pojo.cat"/>
@Component // 默认id类名首字母小写，可传入字符串更改为指定id
public class Cat {
    // 属性注入,等价于：<property name="name" value="猫"/>
    @Value("猫")
    private String name;
}
```

* **@Component** 衍生注解：

java中web开发按照MVC分为dao，service，controller层。

| 包层           | 注解              |
| -------------- | ----------------- |
| **dao**        | **`@Repository`** |
| **service**    | **`@Service`**    |
| **controller** | **`@Controller`** |

这三个注解的作用与 **@Component** 作用相同只是表达的含义不同而已。

* 作用域，在类的上方使用注解 **@Scope** ：

```java
// 指定作用域，等价于：<bean id="cat" class="ruoxijun.pojo.cat" scope="singleton"/>
@Scope("singleton") //单例模式，默认
@Scope("prototype") //原型模式
```

### 3. 注解实现配置类（bean文件）：

* java类：

```java
@Data
public class User {
    @Value("若惜君")
    private String name;
}
```

* 利用 **@Configuration** 实现一个 bean 配置文件

```java
@Configuration // 代表这是一个配置类，等同与beans.xml文件
public class Config {
    @Bean // 等同于一个 bean标签，方法名就是id，返回值就是class
    // @Bean("user")
    public User user(){
        return new User();
    }
}
```

* 使用`AnnotationConfigApplicationContext`构造器获取Spring上下文对象：

```java
ApplicationContext context = new AnnotationConfigApplicationContext(Config.class);
User user = (User) context.getBean("user");
// getBean(Config.class) 注意配置类本身也是一个组件
```

使用组件 bean 对象调用方法也同样可以拿到对应对象，注解有个 `proxyBeanMethods` 属性默认为 true（单实例）。

* 此外还有两个注解：

```java
// 扫描包注解，等同于：<context:component-scan base-package="ruoxijun"/>
@ComponentScan("ruoxijun")
// 导入其它配置类的bean，也可以导入组件类会在此类中自动生成组件bean
@Import(Config.class) // 可使用逗号分隔导入多个
```

## AOP知识储备：

>   OOP：Object Oriented Programming 面向对象编程
>
>   AOP：Aspect Oriented Programming 面向切面编程(基于OOP)
>
>   面向切面编程：指在程序运行期间，将某段代码 **动态切入到指定位置** 运行。

![AOP专业术语](/images/java/AOP专业术语.jpg)

### 1. 代理模式：

客户类与目标类之间存在中介类，中介类就称之为代理类。

* 优点：可以限制客户类直接访问目标类，实现了解耦。同时完成业务时可再在其中附加一些功能，完成功能增强。
* 缺点：目标类较多时会产生大量的代理类。

### 2. 动态代理（了解原理）：

利用jdk反射机制创建代理对象，并动态的指定要代理的目标类。我们只需创建目标对象，后利用如下两个类：

```java
InvocationHandler：实现动态代理的接口，invoke方法，表示代理对象要执行的方法，如下参数：
    Object proxy：代理对象
    Method method：method.invoke(目标对象实例, args) // 执行目标对象方法
    // 在目标对象方法执行前后我们可以定义我们需要的方法
    Object[] args：目标对象方法的参数
    // invoke的返回值就是代理对象执行方法后的返回值
    
Proxy：创建动态代理对象，通过它静态的 newProxyInstance 方法，如下参数：
    ClassLoader loader：通过反射获取类加载器:目标类对象.getClass().getClassLoader()
    Class<?>[] interfaces：目标对象实现的所有接口数组:目标类对象.getClass().getInterfaces()
    InvocationHandler h：代理类要完成功能（上方实现的 InvocationHandler 接口类）
```

### 3. 动态代理实现案例：

jdk动态代理的弊端时目标类必须有实现的接口，所以需要为目标类编写接口。

```java
// 目标类
class B implements A{
    @Override // 目标方法
    public void show() { System.out.println("A的show方法执行了"); }
}
// 目标接口
public interface A {
    void show();
    public static void main(String[] args) {
        // 目标对象(需要被代理的对象)
        A a = new B();
        // 添加功能
        InvocationHandler in = new InvocationHandler() {
            @Override
            public Object invoke(Object proxy, Method method, Object[] args)
                    throws Throwable {
                System.out.println("方法执行之前");
                Object o = method.invoke(a,args);
                System.out.println("方法执行之后");
                return o;
            }
        };
        // 获取目标类加载器
        ClassLoader loader = a.getClass().getClassLoader();
        // 获取目标类的实现接口数组
        Class<?>[] interfaces = a.getClass().getInterfaces();
        // 创建动态代理对象
        A o = (A) Proxy.newProxyInstance(loader,interfaces,in);
        // 调用动态代理对象的实现方法
        o.show();
    }
}
```

## AOP的实现：

Spring使用AOP需要导入 ***aspectjweaver*** 依赖包：

```xml
<!-- https://mvnrepository.com/artifact/org.aspectj/aspectjweaver -->
<dependency>
    <groupId>org.aspectj</groupId>
    <artifactId>aspectjweaver</artifactId>
    <version>1.9.6</version>
</dependency>
```

### 1. API接口方式实现：

* Spring实现AOP主要有以下接口：

1. MthodBeforeAdvice：目标方法实施前
2. AfterReturningAdvice：目标方法实施后
3. ThrowsAdvice 异常抛出
4. IntroductionAdvice 为目标类添加新的属性和方法。可以构建组合对象来实现多继承
5. MethodInterceptor 方法拦截器，环绕在方法执行前之前，在方法执行后之前

* **定义目标接口和实现类**：

```java
public interface UserService { // 目标接口
    void add();
    void delete();
}
public class UserServiceImpl implements UserService { // 目标类
    public void add() { System.out.println("add User"); }
    public void delete() { System.out.println("delete User"); }
}
```

* **代理类功能实现准备：**

**MethodBeforeAdvice接口** 根据需求在方法执行前实现额外功能：

```java
public class UserBefore implements MethodBeforeAdvice { // 方法执行前接口
    @Override // 参数解析：参1：目标方法对象，参2：目标方法参数，参3：目标对象
    public void before(Method method, Object[] objects, Object o) throws Throwable {
        System.out.println("MethodBeforeAdvice："+o.getClass().getName()+
                "类"+method.getName()+"方法");
    }
}
```

**AfterReturningAdvice接口** 根据需求在方法执行后实现额外功能：

```java
public class UserAfter implements AfterReturningAdvice { // 方法执行后接口
    @Override// 参数解析：参1：目标方法返回值，参2：目标方法对象，参3：目标方法参数，参4：目标对象
    public void afterReturning(Object o, Method method, Object[] objects, Object o1)
            throws Throwable {
        System.out.println("AfterReturningAdvice："+o1.getClass().getName()+
                "类"+method.getName()+"方法,返回"+o);
    }
}
```

* **bean文件完成代理类配置**：

```xml
<!-- 先将所有类注册为bean -->
<bean id="userService" class="ruoxijun.service.UserServiceImpl"/>
<bean id="userBefore" class="ruoxijun.proxy.UserBefore"/>
<bean id="userAfter" class="ruoxijun.proxy.UserAfter"/>

<!-- 配置AOP需要在beans标签中导入aop约束 -->
<aop:config>
    <!-- 切入点配置：
         id：取名，expression：表达式（指定要执行的aop方法） -->
    <aop:pointcut id="pointcut"
                  expression="execution(* ruoxijun.service.UserServiceImpl.*(..))"/>
    <!-- 执行环绕增加：
         advice-ref：实现了接口的类
         pointcut-ref：切入点（pointcut）的id -->
    <aop:advisor advice-ref="userBefore" pointcut-ref="pointcut"/>
    <!-- 不使用配置的切入点，pointcut：直接指定切入点 -->
    <aop:advisor advice-ref="userAfter"
                 pointcut="execution(* ruoxijun.service.UserServiceImpl.*(..))"/>
</aop:config>
```

* 使用：

```java
ApplicationContext context = new
        ClassPathXmlApplicationContext("applicationContext.xml");
// 这里看似获取目标类，实则获取到的是代理类。     
// 因为返回的是代理类，所以这里只能使用接口类型接受对象。使用目标类型会报错
UserService userService = (UserService) context.getBean("userService");
userService.add();
```

### 2. 自定义类实现：

之前我们分别使用两个类分别实现两个接口的方式，在目标方法执行前后的额外功能实现，再在bean文件中配置组合成了代理类。现在我们需要在一个自定义类中，定义在目标方法执行前后的额外功能实现，通过这个自定义类和bean文件配置来实现代理类。

* 自定义类：

```java
public class UserProxy {
    // 自定义方法，实现目标方法执行前执行
    public void before(){
        System.out.println("目标方法执行前");
    }
    // 自定义方法，实现目标方法执行后执行
    public void after(){
        System.out.println("目标方法执行后");
    }
}
```

* 配置bean文件

```xml
<bean id="userProxy" class="ruoxijun.proxy.UserProxy"/>
<!-- 配置切面类 -->
<aop:config >
    <!-- 自定义切面，ref自定义的切面类bean id -->
    <aop:aspect ref="userProxy">
        <!-- 配置切入点表达式 -->
        <aop:pointcut id="pointcut" expression="execution(* ruoxijun.service.UserServiceImpl.*(..))"/>
        <!-- aop:后跟切入点，指定目标方法执行前需要执行的方法，method值指定方法 -->
        <aop:before method="before" pointcut-ref="pointcut"/>
        <!-- 指定目标方法执行后需要执行的方法 -->
        <aop:after method="after" pointcut-ref="pointcut"/>
    </aop:aspect>
</aop:config>
```

* 高级配置：

```xml
<!-- order：多切面时指定当前切面的优先执行等级 -->
<aop:aspect ref="countAspect" order="1">
    <!-- after-returning：目标方法正常执行结束返回之后
                returning：指定通知方法接收返回值的参数 -->
    <aop:after-returning method = "aspectAfterReturning"
                         pointcut-ref = "pointcut"
                         returning = "result"/>
    <!-- after-throwing：目标方法抛出异常之后
                throwing：指定通知方法接收产生异常的参数 -->
    <aop:after-throwing method = "aspectAfterThrowing"
                        pointcut-ref = "pointcut"
                        throwing = "exception"/>
</aop:aspect>
```

### 3. 注解实现AOP：

* 使用注解之前需要开启AOP的注解支持：

```xml
<!-- 开启对aop注解的支持 -->
<aop:aspectj-autoproxy/>
<!-- 将该自定义类注册为bean，也可在类中使用注解注册 -->
<bean id="userProxy" class="ruoxijun.proxy.UserProxy"/>
```

* 将自定义类修改为注解注册的aop类

```java
@Aspect // 标注此类为一个切面
public class UserProxy {
    // @Before定义目标方法执行前的操作，参数为execution表达式指定给那些方法添加
    @Before("execution(* ruoxijun.service.UserServiceImpl.*(..))")
    public void before(){
        System.out.println("目标方法执行前");
    }
    // @After定义目标方法执行后的操作
    @After("execution(* ruoxijun.service.UserServiceImpl.*(..))")
    public void after(){
        System.out.println("目标方法执行后");
    }
    // @Around 环绕通知，类似于一个完整的动态代理
    @Around("execution(* ruoxijun.service.UserServiceImpl.*(..))")
    public void around(ProceedingJoinPoint pjp) throws Throwable {
        System.out.println("环绕开始");
        Object re = pjp.proceed(); // 让目标开始执行方法，并返回方法返回值
        System.out.println("环绕结束");
        return re; // 返回方法执行后的返回值
    }
}
```

常用注解如下：

```java
@Aspect // 标注此类为一个切面

@Before // 在目标方法之前
@After // 在目标方法结束后
@AfterReturning // 在目标方法正常返回之后
@AfterThrowing // 在目标方法抛出异常之后运行

@Around // 定义目标方法执行时环绕的操作
```

### 4. Spring AOP 执行流程：

```java
try{
    @Before // 方法前置
    pjp.procced(args) // 方法执行
    @AfterReturning // 方法正常返回
} catch(Exception exception) {
    @AfterThrowing // 方法抛出异常时
} finally {
    @After // 方法执行完成后
}
```

#### 1. spring 4 执行流程：

正常执行顺序：`Before -> After -> AfterReturning`

异常执行顺序：`Before -> After -> AfterThrowing`

添加环绕通知(环绕优先)：`环绕前置 -> Before ->方法执行 -> 环绕后置 -> After -> AfterReturning`

#### 2. spring 5 执行流程：

正常执行顺序：`Before -> AfterReturning -> After`

异常执行顺序：`Before -> AfterThrowing -> After`

添加环绕通知：`环绕前置 -> Before ->方法执行 -> AfterReturning -> After -> 环绕后置`

## AOP细节：

spring注解实现AOP只对通知方法内的参数做检查，对通知方法的修饰符,返回值,方法名都无要求可以任意。但配置（xml）实现AOP时必须保证方法的修饰符是可以让配置文件访问到的。

### 1. 获取方法基本信息：

```java
@Before("execution(* ruoxijun.service.CountImpl.*(..))")
// 在切面类的通知方法的参数中添加一个JoinPoint参数，这个参数能拿到方法信息
public void aspectBefore(JoinPoint joinPoint){
    // 获取方法参数
    Object[] args = joinPoint.getArgs();
    // 方法签名
    Signature signature = joinPoint.getSignature();
    signature.getName(); // 方法名
}
```

### 2. 获取方法返回值：

```java
@AfterReturning(value = "execution(* ruoxijun.service.CountImpl.*(..))",
        returning = "result")
// AfterReturning的returning属性指定接收方法返回值的参数，并添加同名的参数
public void aspectAfterReturning(Object result){
    System.out.println("目标方法的返回值："+result);
}
```

### 3. 方法产生异常后获取异常：

```java
@AfterThrowing(value = "execution(* ruoxijun.service.CountImpl.*(..))",
        throwing = "exception")
// AfterThrowing的throwing属性指定接收方法产生异常的参数，并添加Exception类型的同名参数
public void aspectAfterThrowing(Exception exception){
    System.out.println("目标方法抛出异常："+exception);
}
```

### 4. 简化切入点表达式：

```java
@Pointcut("execution(* ruoxijun.service.CountImpl.*(..))") // 切入点写入
public void init(){};
// 填写上方方法(其它方法需要在同样的execution表达式直接复用即可)
@Before(value = "init()")
```

### 5. expression表达式：

原型：`execution(访问权限 返回值类型 方法全类名(参数列表))`

统配符：`*`：任意个字符(在方法参数中表示任意一个参数)，`..`：任意个参数

`execution(* ruoxijun.service.UserServiceImpl.*(..))`

 expression表达式分为4个部分加上expression关键字为5个部分：

1. 第一部分“ * ”号表示返回值，这里表示可以为任何类型
2. 第二部分为包名
3. 第三部分为类名，我们这里是`UserServiceImpl`这个类，也可以 **`service.*`** 表示service包中的**所有类**
4. 第四部分为方法名和参数，“ * ”号表示所有方法括号内的 " .. " 表示任何参数。

### 6. 指定动态代理的实现方式：

开启对aop注解的支持标签中 **`proxy-target-class`** 属性能控制动态代理的实现方式，Spring **默认使用JDK基于接口的代理实现即属性值为false** ， **属性值修改为true则使用 cglib 模拟子类继承的方式** 实现动态代理：

```xml
<!-- 开启对aop注解的支持，并使用cglib实现动态代理 -->
<aop:aspectj-autoproxy proxy-target-class="true"/>
```

动态代理的目标类都需要有接口的实现，并使用时需要利用接口类型接受bean这是因为此时得到的类时一个Porxy类它也实现了该接口，这都是使用jdk实现动态代理。使用cglib进行代理便可以不需要接口给任意类添加代理，返回的bean也是本类型。

**spring5 自动根据运行类选择JDK或CGLIB代理，无需设置proxy-target-class属性。**

### 7. 多切面运行：

```java
@Aspect // 标注此类为一个切面
@Order(1) // 当有多个切面时可添加此注解，设置当前切面的优先级，值小的优先级高
```

优先级高的切面前置方法先执行，后置方法越后执行。

