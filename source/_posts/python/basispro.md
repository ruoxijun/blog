---
title: Python 进阶
date: 2020-06-30 14:15:34
categories: Python
tags: 
    - python
---
> ## Python 进阶

### File(文件)：

-   打开文件：参 1 文件路径名，参 2 文件打开模式，参 3 编码格式(默认 win 上 gbk)
    -   `f = open("E:/test/qq.html", "r", encoding='utf-8')`
-   关闭文件 ： `f.close()`

#### 模式：

| 模式       | 功能                                     |
| ---------- | ---------------------------------------- |
| **r**      | 只读，指针指向开头                       |
| **w**      | 只写，指针指向开头。文件不存在将创建文件 |
| **a**      | 追加，指针指向结尾。文件不存在创建新文件 |
| 可附加模式 | "+"：用于读写，"b"：以二进制打开文件     |

#### 常用方法：

```python
f = open("E:/test/str.txt","r",encoding='utf-8') # 1文件路径名 2文件打开模式 3编码格式
print(f.closed,f.name,f.mode) # 文件是否关闭，文件名，模式

print(f.read()) # 传入int参数从文件读取指定的字节数，如果未给定或为负则读取所有
print(f.readline()) # 读取整行，包括"\n"字符(也可传入int指定字节数)
print(f.readlines()) # 读取所有行(直到结束符EOF)并返回列表

f.write(str) # 将字符串写入文件，返回的是写入的字符长度
f.writelines(['第一行\n','第二行']) # 写入序列字符串列表，换行需要自己加入每行的换行符

f.tell() # 返回文件当前指针位置
# seek参1：移动的字节数，是负数表示从倒数第几位开始
# seek参2：0(默认) 从文件头，1 从当前位置，2 从文件末尾
f.seek() # 移动指针，成功返回新位置，失败返回-1
# truncate：从文件首字节开始截断，截断文件为参1个字节，无参表示从当前位置截断
# 必须在能写模式下，`r` 下模式建议使用 `r+`
# 读取模式下截断后不能继续读取，否则数据将不会被删除
f.truncate() # 截断数据，其它数据将被删除

f.flush() # 刷新文件内部缓冲，直接把内部缓冲区的数据立刻写入文件
f.close() # 关闭文件
```

#### OS 模块：

python 提供了 `OS` 模块可以应对不同的操作系统，对文件做更多的操作。通过 `import os` ：导入 OS 模块

常用方法：

```python
import os # 导入模块

print(os.sep) # 系统路径分隔符
print(os.linesep) # 系统行终止符
print(os.name) # 工作平台:Windows='nt'，Linux/Unix='posix'
print(os.curdir) # 当前目录："."
print(os.getcwd()) # 当前工作目录
os.chdir("e:"+ os.sep) # 改变当前工作目录
os.system('cmd') # 运行shell命令
print(os.stat(r'E:\test\test.txt')) # 获得文件属性

print(os.listdir()) # 返回目录下文件和文件夹名的列表(可传入路径字符串指定目录)
os.mkdir('e:/a') # 创建一个文件夹，路径错误会文件夹已存在将报错
os.makedirs('e:/a/b/c/d') # 创建多级目录，目录所有目录已存在将报错
os.rmdir('e:/a/b/c/d') # 删除一个空文件夹，非空或不存在会报错
os.removedirs('e:/a/b/c') # 删除目录
```

#### OS 下的 path 模块：

```python
import os
file = "e:/test/test.txt"

os.path.abspath(".") # 返回指定路径的绝对路径
os.path.basename(".") # 返回文件名
os.path.dirname(file) # 传入路径的路径名(去除文件名)
os.path.split(file) # 分割文件和路径名组成元组
os.path.splitext(file) # 分割路径文件名和文件扩展名
os.path.join("e:\\","test","test.txt") # 组合路径名(cde等主盘路径不会加反斜杠)

os.path.getatime(file) # 最近访问时间
os.path.getctime(file) # 创建时间
os.path.getmtime(file) # 最近修改时间(可time.gmtime(tiem)查看时间)
os.path.getsize(file) # 文件大小(字节)，文件不存在报错
os.path.exists(file) # 查看路径是否损坏

os.path.isabs(file) # 是否为绝对路径
os.path.isdir(file) # 是否为目录
os.path.isfile(file) # 是否为文件
os.path.islink(file) # 是否为连接
os.path.ismount(file) # 是否为挂载点(如'c:')
```

### 错误和异常：

```python
try:
    # 语句执行区域
    raise Exception # 抛出一个异常
except:
    print("except") # 异常发生语句执行区
    raise # 不想或无法处理的异常继续抛出
else:
    print("else") # 无异常语句执行区
finally:
    print("finally") # 必执行语句区
```

-   一些对象定义了标准的清理行为，无论系统是否成功的使用了它，一旦不需要它了，那么这个标准的清理行为就会执行。
    如打开一个文件对象：

```python
# with 关键字无论文件是否打开成功，不再使用后都会关闭
with open("myfile.txt") as f:
    for line in f:
        print(line, end="")
```

-   自定义异常类：

```python
class MyError(Exception): # 继承 Exception 异常类
        def __init__(self, value):
            self.value = value
        def __str__(self):
            return repr(self.value)

raise MyError("my define error")
```

### Class 与面向对象：

-   类常识：

```python
class Class(object): # 括号内表示继承类，多继承可逗号隔开
    name='' # 定义类元素
    def __init__(self,name): # 构造函数
        Class.name="hi" # 定义或对类元素赋值
        self.name=name # 对实例元素name赋值
        self.age=10
    def show(self): # self 表示当前实例对象类似(this)
        print('name=',self.name,',age=',self.age)

c=Class('world') # 创建实例对象
c.show() # 调用方法
Class.name="Class" # 创建或改变类属性值
c.name="self" # 创建或改变实例属性值
print(Class.name) # 访问类属性(实例属性同理)
```

-   类继承：

```python
class Class2(Class): # 继承上 Class 类
    def __init__(self,name): # 子类构造方法也会覆盖父类构造方法，需要自行调用父类构造方法
        super().__init__(name) # 调用父类构造方法(调用父类其它方法同理)
    def show(self): # 重写父类方法
        print(self.name)

c2=Class2("Class2")
c2.show()
# c2.show='a' # 定义属性与方法名同时属性将覆盖方法，调用方法将报错
```

-   类常用方法：

```python
issubclass(Class2,Class) # 参1(类)是否为参2(类)的子类
isinstance(c,Class) # 参1(实例)是否为参2(类)的实例

# 对类或实例的属性操作方法
hasattr(Class,"name") # 参1(类)是否存在参2属性
hasattr(c,"name") # 实例同理
getattr(Class,"name") # 获取某属性
setattr(Class,"name","value") # 添加或设置某属性值
delattr(Class,"name") # 删除某属性(还可使用del关键字)
```

-   特殊方法：

```python
class Test:
    def __init__(self): # 初始化
        self.num=1
    def __str__(self): # 类似tostring方法
        return str(self.num)
    def __del__(self): # 实例被删除(del)时调用
        print("实例被del")

    def getnum(self):
        return self.num
    def setnum(self,num):
        self.num=num
    def delnum(self):
        del self.num
    x=property(getnum,setnum,delnum) # 对该属性的操作将调用不同的方法

test=Test()
print(test) # 调用tostring方法

print(test.x) # 调用get方法
test.x=30 # 调用set方法
print(test)
del test.x # 调用del方法
del test
```
