---
title: Thread
date: 2020-06-13 16:39:57
categories: Java
tags: 
    - java
    - thread
    - lock
    - synchronize
---

## 多线程

### 知识储备：

-   java 中线程类主要依靠 `Runnable` 接口和 `Thread` 类。线程的启动主要依靠 `Thread` 的 `start`方法。
-   线程中发生异常，只会停止异常线程。一般不会影响其它线程。
-   线程存在编号从 0 开始。一个线程多次启动会报错，线程执行结束后也不能重启动。
-   main 方法是主线程，也是一条线程不能忽视

### 线程的创建与基础使用：

创建线程一般有两种方式：

-   继承 `Thread` 类，重写 `run` 方法，调用 `start` 启动线程。
-   实现 `Runnable` 接口，实现 run 方法。将实现类作为参数传给 Thread 构造方法，利用 `start` 启动线程。

```java
/* 1利用类继承Thread类 */
class ThreadTest extends Thread{
    /* 重写run方法，run方法中写入线程需要执行的代码 */
    @Override
    public void run() {
        System.out.println("extends Thread");
    }
}

/* 2利用类实现Runnable接口 */
class RunnableTest implements Runnable{
    /* 实现run方法，run方法中写入线程需要执行的代码 */
    public void run() {
        System.out.println("implements Runnable");
    }
}

public class ThreadDemo{
    public static void main(String[] args) {
        //1.利用Thread的继承类，创建线程并启动
        new ThreadTest().start();
        //2.利用Runnable的实现类，创建线程并启动
        new Thread(new RunnableTest()).start();
    }
}
```

注意：

-   `start` 方法启动线程，Java 虚拟机调用此线程的 run 方法。直接调用 `run` 方法跟普通成员方法一样，是不会启动线程的。
-   `Thread` 是 `Runnable` 的子类。

Tread 的 3 个静态方法：

-   `Thread.currentThread()` 返回当前线程对象
-   `Thread.currentThread().getName()` 返回当前线程名称
-   `Thread.sleep(long millis)` 线程释放执行权并睡眠指定毫秒数

### synchronized 同步锁：

线程中多线程操作一个资源时往往容易发生错误，这时我们需要利用 `同步` 和 `锁` 来同步操作资源的代码块。

-   同步前提：有多个线程且同步代码块使用同一个锁(对象)，不同锁同步块的线程互不产生影响。
-   `synchronized` 修饰的代码块，为同步代码块。它需要传入一个对象作为参数，传入的对象作为了锁。
-   多线程中当某线程执行同步代码块代码时拿到锁(对象)如中途休眠，其它线程开始执行。当执行到同步代码块时它会去获取同步锁，因为锁被占用此线程将无法继续执行，而释放执行权。直至持有锁的线程执行完成并释放锁，其它同锁线程才能执行。

```java
//线程中存在共性数据时，用同步保证数据安全性
synchronized(Object){//同步代码块，需要传入一个对象作为锁
    //当前线程等待，被唤醒后继续向下执行(会抛出InterruptedException)
    Object.wait();
    //唤醒一个在此对象监视器(锁)上的单线程(无等待线程时使用不报错)
    Object.notify();
    Object.notifyAll();//唤醒在此对象监视器(锁)上的所有线程
    //以上三个方法必须在同步中且被锁对象调用，都是继承至Object的方法
}
```

操控 synchronized 同步块(Object(锁)的三个线程方法)：

-   `wait` ：当前线程在此(同步块中)等待，且释放锁。也可传入一个 `long` 型的参数作为等待毫秒数，在此时间内未被唤醒，后将重新具有线程的执行权。
-   `notify` ：唤醒正在等待对象锁的单个线程。
-   `notifyAll`：唤醒正在等待对象锁的所有线程。

`synchronized` 修饰函数：

```java
public synchronized void function(){
    //同步函数，以this为锁。多个块需要同步时不建议使用
}
public static synchronized void function(){//静态方法锁 = 类名.class
    //静态同步函数，因为静态中没有this，所以以本类字节码文件对象为锁
    if(c==null){//设计模式中的应用
        synchronized(RunnableDemo.class){//提高效率，减少对锁的判断
            if(c==null) c=new class();
        }
    }
    return c;
}
```

### 初识死锁

简单死锁：

```java
synchronized(ObjectA){//线程1同步代码块
    synchronized(ObjectB){}
}
synchronized(ObjectB){//线程2同步代码块
    synchronized(ObjectA){}
}
```

简单死锁实例：

```java
class ThreadTest extends Thread{
    public boolean is;
    public static Object objA = new Object();//锁A
    public static Object objB = new Object();//锁B
    public ThreadTest(boolean is){this.is = is;}//线程控制
    @Override
    public void run(){
    if(is){//if线程块
    while (true) {
        synchronized (objA) {
            System.out.println(Thread.currentThread().getName() + "--if--objA");
            synchronized (objB) {
                System.out.println(Thread.currentThread().getName() + "--if--objB");
            }
        }
    }
    }else{//else线程块
    while (true) {
        synchronized (objB) {
            System.out.println(Thread.currentThread().getName() + "--else--objB");
            synchronized (objA) {
                System.out.println(Thread.currentThread().getName() + "--else--objA");
            }
        }
    }
    }
    }
}

public class ThreadDemo{
    public static void main(String[] args) {
        System.out.println(Thread.currentThread().getName());
        ThreadTest Trun = new ThreadTest(true);
        ThreadTest Frun = new ThreadTest(false);
        new Thread(Trun).start();
        new Thread(Frun).start();
    }
}
```

运行结果：

```java
main
Thread-3--else--objB
Thread-2--if--objA
```

结论：Frun 拿到 objB 锁输出后线程阻塞，Trun 线程执行拿到了 objA 锁，执行输出 `Thread-2--if--objA` 后需要 objB 锁但此锁在 Frun 线程中因此线程阻塞。Frun 在次拿到线权但它需要 objA 锁，因此两线程都进入了阻塞状态。也就形成了死锁。

### Lock 同步

jdk1.5 以后出现了新的锁，在 java.util.concurrent.locks 包中。 `Lock` 代替同步 `synchronized` 。Lock 作为锁使用更加灵活，synchronized 更加方便直观。

Lock 是一个接口建议使用它的实现类 `ReentrantLock` 类创建对象使用。一个 lock 对象表示同一个锁。

`Lock lock = new ReentrantLock()` ：创建锁对象
`lock.lock()` ：获取锁
`lock.unlock()` ：释放锁(该放在 finally 中)

`Condition set = lock.newCondition()` ：生产线程控制器
`set.await()` ：当前线程在此等待，且释放锁
`set.signal()` ：唤醒此控制器停止的线程
`set.signalAll()` ：唤醒此控制器停止的所有线程

Lock 锁多消费多生产实例：

-   生产和消费线程类：

```java
class Set implements Runnable{//生产线程
    private Shopping shopping;
    public Set(Shopping shopping){
        this.shopping=shopping;
    }
    public void run() {
        while (true) {
            shopping.set();
        }
    }
}
class Out implements Runnable {//消费线程
    private Shopping shopping;
    public Out(Shopping shopping){
        this.shopping=shopping;
    }
    public void run() {
        while (true) {
            shopping.out();
        }
    }
}
```

-   商品类以及线程使用：

```java
public class Shopping {
    private Lock lock=new ReentrantLock();//创建锁
    private boolean isEmpty=true;//判断商品是否为空
    private Condition set=lock.newCondition();//生产线程控制器
    private Condition out=lock.newCondition();//消费线程控制器
    private static int count=0;
    public void set(){//生产方法
        try {
            lock.lock();//获取锁
            if (isEmpty) {
                count++;
                System.out.println(Thread.currentThread().getName()+"生产商品：" + count);
                isEmpty=false;
                out.signal();//唤醒消费线程
                set.await();//生产线程等待
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally{
            lock.unlock();//释放锁
        }
    }
    public void out(){//消费方法
        try {
            lock.lock();//获取锁
            if (!isEmpty){
                count--;
                System.out.println(Thread.currentThread().getName()+"消费商品："+count);
                isEmpty=true;
                set.signal();//唤醒生产线程
                out.await();//消费线程等待
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally{
            lock.unlock();//释放锁
        }
    }

    public static void main(String[] args){
        Shopping shopping=new Shopping();
        Set set=new Set(shopping);
        Out out=new Out(shopping);
        new Thread(set).start();
        new Thread(set).start();
        new Thread(out).start();
        new Thread(out).start();
    }
}
```

### Thread 与 线程细节

1. `sleep` 与 `wait` 异同：

-   sleep 是 Thread 的静态方法可在任何位置调用，wait 是绑定在锁上控制线程的方法，且只能在同步中使用。
-   sleep 必须传入时间，wait 有多种不同参数的重构方法
-   都在同步中时 sleep 不能释放锁，wait 会释放锁。但都会让线程处于冻结状态

2. `interrupt` 中断：

是`Thread` 中的方法，当此线程处于线程池等待的状态时(sleep,wait,join)，可让此线程对象调用 `interrupt()` 方法中断等待强行唤醒。

3.守护线程：

-   `setDaemon(true)` 设置守护线程方法必须在该线程启动之前调用
-   标记为守护线程的线程使用与普通线程一样，当所有普通线程执行完以后，只剩下守护线程那么所有守护线程无论状态都将自动结束线程并退出 java 虚拟机

如下当 t1 执行完以后无论 t2 是和状态是否执行完毕都将结束：

```java
Thread t1 = new Thread(r);
Thread t2 = new Thread(r);
t1.start();
t2.setDaemon(true);//标记3为守护线程，false普通线程
t2.start();//在标记之后启动线程
```

4. 线程的优先级：

线程优先级 `1-10` 所有线程默认优先级为 5， `setPriority(int)` 设置优先级。

5. `ThreadGroup` 线程组：

-   `Thread(ThreadGroup group, Runnable target)` thread 构造方法可明确线程所属线程组。
-   线程组可对多个线程或线程组进行统一操作，所有线程默认属于 main 线程组。

6. `join` 和 `yield` :

-   `join` 主线程等待子线程结束之后才能继续运行

```java
// 主线程
public class Father extends Thread {
    public void run() {
        Son s = new Son();
        s.start();
        s.join();
        ...
    }
}
// 子线程
public class Son extends Thread {
    public void run() {
        ...
    }
}
```

Father 的线程要等 Son 的线程执行完毕才能执行。

-   `yield` 当某线程调用此方法时，表示释放该线程的执行权。让其它线程有机会争夺执行权，且自己也有机会争夺执行权。

7.匿名内部类创建启动线程：

因为 Thread 重写了 Runnable 的 run 方法，所以将执行 Thread 的 run 方法。使用 super 也可调用到 Runnable 的 run 方法。

```java
new Thread(new Runnable() {
    public void run() {
        System.out.println("Runnable 执行");
    }
}){
    @Override
    public void run() {
        super.run();//没有super将无无法执行Runnable的run方法
        System.out.println("Thread 执行");
    }
}.start();
```