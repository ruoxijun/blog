---
title: python 基础
date: 2020-06-27 13:44:47
categories: Python
tags: 
    - python
---
> ## python 基础

### 基础超速一览：

-   `print("hello world!")` ：打印默认会换行逗号添加 `end=''` 解除，python2 支持不要括号 `print "hello world!"` ,
-   定义变量：python 定义变量不需要关键字只需要定义变量名和赋值。python 中用 `#` 作为注释
-   `print("hello world!\n" * 3)` ：python 中字符串可以做乘法
-   `input("请输入：")` ：接受键盘的输入，返回输入的字符串
-   类型转换：`int(表达式)` `str(表达式)` `float(表达式)` ,bool 值`true==1` `false==0`
-   `import random` ： 引入模块 `random.randint(1,10)` 使用模块方法产生随机数
-   基本数据类型：`str` `int` `float` `bool`
-   类型判断： `type(表达式)` 返回其类型的字符串， `isinstance(表达式,数据类型)` 判断参 1 的值是否是参 2 的数据类型
-   运算符：`**` 幂运算，`//` 取整除(向下除)， 非 `not` 或 `or` 且`and`
-   `if`语句：python 中没有大括号，都用缩进表示

```python
if 条件:
    语句
elif 条件:
    语句
else:
    语句
```

-   `while`：

```python
while 条件:
    语句
```

-   `for`：for 元素 in 可迭代列表:

```python
msg="12345"
for s in msg:
    print(s) # break与continue 控制循环
else:
    # 循环自然结束时执行
```

for 循环常搭配 `range([sta]默认0,end,[步进])` 一起使用：

```python
for s in range(5):
    print(s,end='')
# 默认从0开始到5但不取5，输出结果：01234

for s in range(2,5):
    print(s,end='')
# 从2到5但不取5，输出结果：234

for s in range(1,5,2):
    print(s,end='')
# 每次步进2位数，输出结果：13
```

### Str(字符串)：

> 字符串，列表，元组，在 python 中都是序列。

-   python 中字符串可以用单双三引号三种方式定义， `r"str\n"` 等于 `"str\\n"`

```python
str='hi'
str="hello"
# 多行字符串
str="""
hello
world\n
"""
# 原始字符串：
str=r"hello world\n" #等于"hello world\\n"
```

-   字符串与元组类似：

```python
str[0] # 获取单个字符
str[5:] # 切片
str[-10:-1] # 负数则从末尾计数
```

-   字符串常用方法：

```python
len(str) # 返回字符串长度
str.strip() # 删除开头和结尾的空白字符
str.lower() # 返回小写的字符串
str.upper() # 返回大写的字符串
str.swapcase() # 切换大小写
str.replace('hello','hi') # 返回替换后的字符串
str.split('\n',num) # 返回按指定分隔符分隔的列表,num为分隔次数默认-1分隔全部
print("hello" in str) # 查看某字符串是否存在此字符串中
print("hello" not in str) # 与not搭配使用

str.count("str") # 某字符串出现的次数
# find与index类似，查找某串在字符串中的位置
print(str.find("w")) # find(value, [[start], end])
print(str.index("w")) # 参数同上
# 未查找到时：find方法返回 -1，index方法将引发异常

"123abc".isalnum() # 字符串中的字符是否都是字母或数字
"abc".isalpha() # 字符串中的字符是否都是字母
"123".isdigit() # 字符串中的字符是否都是数字

# join按指定分隔符将可迭代对象中的元素，连接为一个字符串
lists=("1","2","3")
print("-".join(lists)) # 1-2-3
d={"name":"ruoxi","value":"123"}
print("+".join(d)) # name+value key的组合字符串


```

-   字符串格式化：
    因为 python 中字符串不允许与数字相加组成新的字符串 `str+1 #报错` ，此时我们可借助字符串格式化来完成。

```python
# format 方法格式化
print("{}hello{}world".format(1,"ha"))
print("{1}hello{0}world{0}".format(1,"ha"))
print("{a}hello{b}world{a}".format(a=1,b="ha"))

# 通过字典设置参数
site = {"name": "name", "url": "www"}
print("网站名：{name}, 地址 {url}".format(**site))
# 通过列表索引设置参数
lists=['name', 'www']
print("网站名：{0[0]}, 地址 {0[1]}".format(lists))  # "0" 是必须的
# 还可传入一个对象
print('value 为: {0.value}'.format(obj))

# 格式化数字
print("{0:.2f}".format(3.1415926)) # 保留小数点后两位(为0表示不要小数)
print("{0:+.2f}".format(3.1415926)) # 带符号保留小数点后两位
print("{:0>2d}".format(3)) # 数字补零(填充左边,宽度为2)
print("{0:x<4d}".format(3)) # 数字补零(填充左边,宽度为2)

# %操作符格式化：
# 使用格式：%[(key)][+:右对齐,-:左对齐,0:0填充][字符宽度].[小数位]类型
print("%dhello world%s"%(12,1234)) #元组方式
print("%(key1)d hi world %(key2)s" % {'key1':12,'key2':123}) # 字典方式
print("%-4d" % 5) # 单个元素无须括号包裹
print("%+8.3f" % 2.3)
# 常用类型：%s字符串，%b二进制整数，%d十进制整数
# %o八进制整数，%x十六进制整数，%f浮点数，%%字符"%"
```

### 容器：

-   #### List(列表)：

创建一个列表：(看似与 c 数组相似实则使用差距甚远)

```python
lists1=[0,'1',"2",[3,4,5]]
lists2=['str','hi']
print(lists2[1])
print(lists1)
print(lists1+lists2)
```

运行结果：

```
hi
[0, '1', '2', [3, 4, 5]]
[0, '1', '2', [3, 4, 5], 'str', 'hi']
```

可以看出一个列表可接受任何类型的数据，并且两个列表之间可以向加。

常用方法：

```python
lists2.append("world") # 添加
print(len(lists2)) #长度
lists2.extend(['list']) # 将另一列表元素添加到此列表
lists2.insert(1,'hello') # 插入从0开始
lists2.remove('str') # 移除一个指定元素
lists2.pop() # 移除最后一个元素并返回
lists2.pop(1) # 指定位置移除并返回此元素
lists2.sort() # 对列表元素排序(默认升序)
lists2.reverse() # 将现列表反序
lists1.count('2') # 统计某元素出现的次数
lists1.index('2') # 查找元素
lists1.index('2',1,4) # 指定位置开始在某范围内查找
print(lists2)
print('2' in lists1) # 查找元素是否存在某元素中
```

切片：

```python
lists1[:] # 复制此列表返回
lists1[:3] # 从头取到3的前一个元素
lists1[1:] # 从1取到最后一个元素
lists1[2:3] # :后的数字在列表长度内不取，大于列表长度将取到最后一位
```

-   #### Tuple(元组)：

元组和列表类似，但是不同的是元组不能修改，元组使用小括号。
元组中的元素值是不允许修改的，元组之间可相加。

```python
t1=(0,'1',"2",[3,4,5])
t2=('str','hi')
print(t1+t2)
```

当元组只有一个元素时在后面添加一个 `‘,’` 才能表示它是一个元组。

```python
num=(1) # 普通数字
t3=(1,) # 元组
t4=1,2 # 有多个元素时不用括号也表示元组
```

### 序列：

```python
(list1,list2)=("1","2") # 将序列元素赋值给指定变量,列表同([])
print(list1,list2) # 输出：1 2

str="hello"
print(list()) # 返回一个空列表，tuple同
print(list(str)) # 将一个序列元素变为列表
print(tuple(str)) # 将一个序列元素变为列表
print(tuple(list(str))) # 因为list和tuple都是序列可以相互转换
len(tuple(str)) # 返回长度

# 序列中数字和字符串同时存在时使用max或min将报错
print(max(list(str))) # 返回序列中的最大值，max(str)同
min(str) # 最小值同理
sum((1,2,3,4)) # 对数字序列求和(参2可选再加上一数)

list(reversed(str)) # 返回一个反转的迭代器，序列对象可接受并转换
# 将序列组合为一个索引序列，同时列出数据和数据下标，返回enumerate(枚举)对象
print(list(enumerate(str))) # 运行结果：((0, 'h'), (1, 'e'), (2, 'l'), (3, 'l'), (4, 'o'))

# 将序列中对应的元素打包成一个个元组，然后返回由这些元组组成的对象
a=(1,2,3,4) # 4在b中没有对应元素，将被舍去
b=("一","二","三")
print(list(zip(a,b))) # 运行结果：[(1, '一'), (2, '二'), (3, '三')]
```

### 函数：

python 中使用 `def` 定义函数，并且允许设置的默认值。 `*变量名` 允许传入任意个的值，此变量名管理一个元组。

```python
def fun(name="long",value="yes",*var):
    '函数第一行字符串作为函数的文档，通过help方法可以查看'
    print(name+value)
    for s in var: # '*':任意参数接受到的值将组成一个元组
        print(s)
    return name #返回值

help(fun) # 查看函数文档
fun(value="ha",name="zhang") # 关键字传参(不能传入任意参数的值)
fun("1","2",1,2) # 1，2 作为任意参数组成元组传入

# 任意参数后还有参数时必须用关键字传参
def fun2(*var,str="s"):
    for s in var:
        print(s)
    print(str)
fun2(1,str="ha") # 使用关键字传参给任意参数后面的参数传参
```

函数细节：

```python
# global：修饰全局变量：
def fun():
    # 在函数内改变外部变量需要加 global 关键字
    global count # 去掉此句 count 将是一个局部变量
    count=2
    print("fun() = %d"%count)
count =1
fun() # 输出：fun() = 2
print("main() = %d"%count) # 输出：main() = 2

# nonlocal 修饰外层变量：
def func1():
    x=2
    def func2(): # 函数内部可嵌套函数
        nonlocal x # 修饰为外部变量，去除此句将报错
        x *=x
        print(x)
    return func2() # 返回内部函数
func1() # 输出：4

# lambda 表达式：
def f1(): # lambda 表达式可以简写此方法
    return 1
# 使用方法：'lambda 参数(多个用逗号隔开): 返回值表达式'
f=lambda : 1 # 它返回的只是一个函数对象
print(f())
```

### Set(集合)：

集合是无序和无索引的集合。在 Python 中，集合用花括号编写。
可以使用 `for` 循环遍历 set 项目，或者使用 `in` 关键字查询集合中是否存在指定值。

```python
# 定义集合
sets={"set1","set2"}
set(sets) # 接受一个可迭代序列转集合，空参为空集合
print(sets)
for item in sets: # 遍历集合
    print("iemt : "+item)
print("set2" in sets) # 查看某元素是否存在

# 集合运算：
a=set('abc') # {'a', 'c', 'b'}
b=set('bcd') # {'d', 'c', 'b'}
print(a - b) # a包含b不包含的元素(a独有或删除a中b存在的元素)
print(a | b) # ab 中所有的元素
print(a & b) # ab 同时包含的元素
print(a ^ b) # ab 中它们独有的元素
```

常用方法：

```python
sets=set("abcde")
len(sets) # 集合个数
print('a' in sets) # 判断元素是否存在此集合中
sets.copy() # 拷贝此集合
sets.clear() # 清空集合

# 添加元素：
sets.add("a") # 添加一个元素
# 另一种添加元素方式，可传入可迭代元素(包括字典保存它的key)
sets.update({'b':'2','c':'3'},'e',[1,2])

# 移除元素：
sets.remove("a") # 移除元素并返回，元素不存在则报错
sets.discard("f") # 移除指定元素不存在时不会报错
sets.pop() # 随机移除元素并返回

a={1,2,3}
b={1,2}
a.isdisjoint(b) # 集合是否没有相同元素
a.issuperset(b) # 集合是否是某集合的父集
b.issubset(a) # 集合是否是某集合的子集
```

### Dictionary(字典):

键必须是唯一的，但值则不必。值可以取任何数据类型，但键必须是不可变的，如字符串，数字或元组。

```python
# 字典创建key唯一，可以是字符串，数字，元组
d={'a':1,2:2,(1,2):3} # 字典值可以是任何对象
print(d[(1,2)]) # 可以通过键访问和修改值
print("a" in d) # 查看某键是否存在此字典中
d["b"]='b' # 当key不存在时会自动创建
del d['a'] # 删除某元素
len(d) # 元素个数
```

常用方法:

```python
d.get("a",False) # 根据key获取值不存在时，返回参2的值默认为None
d.setdefault('c','c') # 与get一样，不存在时创建并赋参2值
d.update({'b':'c','d':'d'}) # 将传入的字典数据都添加到此字典中
d.pop('b',False) # 删除指定key，不存在时返回参2值或参2不写将报错
d.popitem() # 删除并返回最后一组键值对组成元组
d.copy() # 返回此字典的拷贝

d.keys() # 返回此字典key的迭代器(可用list()转换为列表)
d.values() # 返回values的迭代器(可list())
d.items() # 返回键值对元组，组成的列表:[(键，值)]
d.clear() # 清空字典

t=(1,2,3) # 创建序列作为key
d=d.fromkeys(t,'def') # 创建一个新字典，参2为值(默认None)
print(d) # {1: 'def', 2: 'def', 3: 'def'}
del d # 删除字典
```
