---
title: TypeScript
date: 2022-07-09 10:37:00
categories: Vue
tags: 
    - typescript
    - vue3
    - es6
---

# TypeScript

## TS 环境与常用命令

### 1. 环境安装：

* 安装 TypeScript 编译工具：

```
npm install -g typescript
```

* 查看 TypeScript 版本：

```
tsc -V
```

### 2. 常用命令：

1. 编译 **ts** 文件：

```
tsc demo.ts
```

编译完成后会生成同名 js 文件，使用 node 命令 `node demo.js` 执行文件。

2. 监听 **ts** 文件变化并及时编译：

```
tsc demo.ts -w
```

3. 生成 **tsconfig.json** 配置文件：

```
tsc --init
```

此命令会在当前文件夹中生成 ts 配置文件，并且执行 `tsc` 命令会自动根据 **tsconfig.json** 配置编译当前文件夹以及子文件夹中的所有 **ts** 文件。

执行 `tsc -w` 会监听当前文件夹内（包括子文件夹）的所有 **ts** 文件并及时编译。

配置文件中 `"outDir": "./"` 可以指定文件编译后所在位置。

### 3. ts-node:

ts-node (非必要安装)可以直接运行 ts 文件不需要我们先编译在执行。

* 安装 ts-node:

```
npm i -g ts-node
```

* 运行 ts 文件：

```
ts-node demo.ts
```

## tsconfig.json

**tsconfig.json** 是 TypeScript 的配置文件，其中常见配置如下：

```json
{
  // 配置编译选项
  "compilerOptions": {
    "module": "commonjs", // 模块化模式（如 es6 模块化模式）
    "target": "ES5", // 指定编译后的 js 版本
    "sourceMap": true,
    "lib": ["ES6"], // 编译时引入的 es 库
    "outDir": "./build", // 输出目录
    "outFile": "./build/app.js", // 将编译后的 js 合并到某个文件（module 必须为 amd 或 system）
    "allowJs": true, // 允许 js 编译
    "checkjs": true, // 检查 js
    "removeComments": true, // 编译后删除注释
    "noEmit": true, // 只检查不编译生成 js 文件
    "noEmitOnError": true, // 有错误时不生成编译文件
    "alwaysStrict": true, // js 使用严格模式
    "noImplicitAny": true, // 存在隐式 any 时报错
    "noImplicitReturns": true, // 不存在 return 时报错
    "noImplicitThis": true, // this 可能为 any 时报错
    "strictNullChecks": true, // 严格的检查空值
    "strict": false, // 检查的总开关
  },
  // 指定编译
  "include": [
    "./src/**/*", // 编译src下面已经子目录下面的所有文件
  ],
  // 排除目录
  "exclude": [
    "node_modules",
  ],
  "files": [] // 单独设置需要编译的文件（不常用）
}
```

注意使用命令行模式 `tsc fileName.ts` 方式编译会忽略 **tsconfig** 配置。

## TypeScript 语法

### 1. 基础类型：

* TypeScript 是 JavaScript 的一个超集，支持 ECMAScript 6 标准。

* TypeScript 是一种给 JavaScript 添加特性的语言扩展。

1. 类型声明与基础语法：

```typescript
let test; // let test:any; // 表示可以是任意类型的值
test = true;
test = "str";

let str:string = "str"; // 声明变量同时声明类型

let isTrue = true; // 声明变量时赋值，会使用值的类型作为限制
// isTrue = "str"; // 报错

// 限定方法参数只能为个数2且都为 number 类型，限定返回值为 number
function add(num1:number, num2:number):number {
  return num1 + num2;
}
let sum = add(1, 1); // sum 类型也被限定为方法的返回值类型
// sum = "str"; // 报错，sum 只能为 number

let info: string|number; // 联合类型，这里表示可以为 string 或 number 类型
let arr: (string|number)[]; // 数组值可以是数字或字符串

let num:10; // 字面量
// num = 11; // 报错，只能为10
let sex:"nan"|"nv"; // 值只能为这两个
```

2. TS 的基础类型：

| 数据类型  | 关键字      | 描述                                                         |
| --------- | ----------- | ------------------------------------------------------------ |
| 数字      | number      | `let num:number = 1;`                                        |
| 字符串    | string      | `let str:string = "str";`                                    |
| 布尔      | boolean     | `let flag:boolean = true;`                                   |
| 数组      | Array 或 [] | `let arr:number[];` 或 `let arr:Array<number>;`              |
| 元组      |             | `let arr:[number, string]` 数组长度限定且位置指定类型        |
| 枚举      | enum        | `enum Color {Red, Green}` 使用： `let c:Color = Color.Red;//1` |
| void      | void        | 标识方法返回值类型，表示该方法没有返回值                     |
| null      | null        | 空值                                                         |
| undefined | undefined   | 变量为未定义的值                                             |
| never     | never       | 永远不会出现的值（方法中死循环、方法抛出异常）               |
| any       | any         | 任意类型                                                     |
| unknown   | unknown     | 安全类型的 any（不能直接赋值给其它变量，可以赋值给 any）     |

* unknown 赋值方式：

```typescript
let test:unknown = 0;
test = "str"; // 接收任意类型
let str:string = "str";

// str = test; // 直接赋值报错

if (typeof test === "string") { // 类型判断
  str = test;
}
str = test as string; // 断言
str = <string>test;

// 利用 any
let s:any = test; // any 可以接收 unknown 类型
str = s;
```

* 二维元组：

```typescript
let arr:[string,number][] = [
  ["str",1],
];
```

* type 别名：

```typescript
// 当同一限定类型需要多次使用时我们可以为其取别名
type myType = string | number;
let val:myType = 0;
```

### 2. 对象与函数：

```typescript
let o = { // 声明时属性已确定
  name: "o",
}
// o.age = 18; // 报错，只能操作对象声明的属性

let user:{name:string, age?:number}; // 声明对象模板，问号表示属性为可选属性
user = {name: "user"}
// let user:{name:string} = {name: "user"}; // 声明时赋值

// 在属性不确定时可以使用 [name:string]:any 接收任意属性
let userinfo:{name:string, [name:string]:any}
userinfo = {name: "userinfo", age: 18, sex: "nv"};

// & 类型约束
let o: {name:string} & {age:number};
o = {name:"o", age:18}

// 函数约束
let fun1:(a:number, b:number) => number; // 两个参数为 number，返回值为number
fun1 = (a, b) => a*b;
```

### 3. 断言（as）：

```typescript
function demo(n:string|number) {
  let len:number;
  len = (n as string).length; // 直接赋值会报错
}

// 具体值推断类型转换为字面值类型
let str = "str" as const; // 等同：let str:"str";
str = "str"; // 只能赋值为 "str"

let arr = ["str", 1] as const; // 只读数组（对象同理）
// let arr = <const>["str", 1]; // 效果同上

// 推断类型数组转换为元组
function ew() {
  return ["str", 1]; // 推断返回值类型为 (string|number)[]
}
let [a, b] = ew();
// a.length; // 报错，a 类型为string|number
/** 解决方法：
 * return ["str", 1] as const; // 推荐使用
 * ew() as [string, number] 
 * (a as string).length
 */

// 开启空值检查 dom 操作往往会报错，可以采用非空断言
let body:HTMLBodyElement = document.querySelector('body')!; // !表示非空断言
// let body:HTMLBodyElement = document.querySelector('body') as HTMLBodyElement;
```

### 3. TS 函数：

```typescript
// let fun:Function = function(a:number) {}
type myFun = (n:number)=>void;
let fun:myFun = function(a:number) {}

// n? 可选参数，当有必选参数时可选参数必须声明在必选参数之后
let fun2:(n?:number)=>void = ()=>{}; // 可选参数不能设置默认值

// 任意个参数收集到数组，只能作为最后一个参数声明
let fun3:(...n:any[])=>void = (...n:any[])=>{
  console.log(n);
};

/* 函数重载 */
// 定义重载函数签名
function disp(s1:string):void; 
function disp(n1:number,s1:string):void; 
// 实现重载函数
function disp(x:any,y?:any):void { 
    console.log(x); 
    console.log(y); 
} 
disp("abc");
disp(1,"xyz");
```

### 4. 面向对象：

#### 1. 类的基础：

```typescript
// 定义类
class Person {
  name: string;

  // 构造方法
  constructor(name: string) {
    this.name = name;
  }

  say(): void {
    console.log(this.name);
  }
}

const person:Person = new Person("class");
person.name = "John";
person.say(); // John

// extends 继承
class Student extends Person {
  school:string;

  constructor(name:string, school:string) {
    super(name); // 调用父类构造方法
    this.school = school;
  }

  // 重写（覆盖）父类方法
  say(): void {
    super.say(); // 调用父类方法
    console.log(this.school+ " " + this.name);
  }
}

const student = new Student("student", "myScholl");
student.say(); // student，myScholl student
```

#### 2. 访问修饰符：

```typescript
class Person {
  public name: string; // 默认 public
  private _age: number; // private 私有（私有属性名建议使用下划线开头）
  protected sex: string; // protected 只能自身或子类访问
  readonly sfz: string; // readonly 只读属性（只允许初始化赋值或构造方法赋值一次）
  static num: number; // static 静态属性

  // 构造方法
  public constructor(name: string) {
    this.name = name;
  }

  public say(): void {
    console.log(this.name);
  }
}
```

#### 3. 存取器：

```typescript
// 定义类
class Person {
  private _name: string; // 定义私有属性
  public constructor(name: string) {
    this._name = name;
  }

  // 存取器（建议使用此方式为属性添加 get、set 方法）
  set name(name: string) {
    this._name = name;
  }
  get name(): string {
    return this._name;
  }
}

const person = new Person("class");
person.name = "John"; // 存值
console.log(person.name); // 取值
```

#### 4. 抽象类与接口：

1. 抽象类：

```typescript
// 有一个（或以上）抽象属性（方法）的类就只能被声明为抽象类
abstract class Person {
  abstract name: string; // 抽象属性
  abstract run(): void; // 抽象方法没有方法体
  // 抽象类中允许有非抽象属性（方法）
}

// 子类必须实现所有抽象属性（方法），否则子类也只能为抽象类
class User extends Person {
  public name: string = "";
  public run(): void {}
}
```

2. 接口（接口名称建议以大写 **I** 开头）：

```typescript
// interface 接口只能有抽象属性
interface Person {
  name: string;
  run(): void;
}

// 类必须实现所有抽象属性（方法），或者继承接口成为接口类（接口允许多继承、多实现）
class User implements Person {
  public name: string = "";
  public run(): void {}
}
```

3. 接口类型约束：

```typescript
// 类作为类型约束
class Person {
  name: string = 'John';
  age: number = 18;
}

const p:Person = new Person();
const p2:Person = {name: 'hello', age: 20};

type MyObj1 = {name:string, age:number};
const myObj:MyObj1 = {name: 'hello', age:20};

// 多个类作为类型约束
type MyObj2 = {name:string} | {age:number};
type MyObj3 = {name:string} & {age:number};

// 接口作为类型约束
interface Interface1 {
  name: string;
  age: number;
}
const interface1:Interface1 = {name: 'hello', age:20};

// 两个同名结合会自动合并
interface A {
  name: string;
}
interface A {
  age: number;
  sex?: string;
}
const a:A = {name: 'A', age:20};

// 设置属性类型不限制个数
interface B {
  [key: number]: string;
}
const b:B = {1: '1', 2: '2', 3: '3'};
```

#### 5. 泛型：

```typescript
// 泛型定义函数（可以有多个泛型使用逗号隔开）
function fun<T>(arg:T):T {
  return arg;
}
let num:number = fun<number>(1);
let o:{name:string} = fun<{name:string}>({name: "name"});
let str:string = fun("str"); // 自动推断类型

// 函数泛型指定默认类型
const fun2 = <T=number>(arg:T):T => arg;
let num2 = fun2(1);

// 泛型约束
interface ILength {
  length:number;
}
function getLength<T extends ILength>(arg:T):number { // 泛型继承接口约束类型
  return arg.length;
}
// getLength(123); // 报错，数字没有 length 属性
getLength("123");
getLength({name: "1", length: 1});

// 类（接口）泛型默认类型
interface IA<T1=string,T2=number> {
  name: T1;
  age: T2;
}
const ia1:IA<number, number> = { name: 1, age: 1 }
const ia2:IA = {
  // name: 2, // 报错未指定泛型类型时，类型推断优先使用默认类型
  name: "2", age: 2 }
```

### 5. 命名空间：

1. 同文件内：

```typescript
// 创建命名空间
namespace One {
  // 如果想让外界访问到需 export 导入
  export function add(n:number):number { return n; }
}
namespace Two {
  export function add(n:string):string { return n; }
}

console.log(One.add(1));
console.log(Two.add("2"));
```

2. 不同文件中：

```typescript
/* One.ts 中将命名空间导出 */
export namespace One {
  // 如果想让外界访问到需 export 导入
  export function add(n:number):number { return n; }
}

/* two.ts 中将命名空间导出 */
export namespace Two {
  export function add(n:string):string { return n; }
}

/* main.ts 中导入并使用 */
import { One } from './One';
import { Two } from './Two';
console.log(One.add(1));
console.log(Two.add("2"));
```

还能添加子命名空间等。

## 描述文件声明

* 在 TS 中使用第三方 js 文件库需要在项目中配置后缀名为 **.d.ts** 的文件，此文件可以在项目中的任意位置它将会自动被扫描。

* 只有配置了该文件才能获得代码补全，接口提示等功能。

1. 在某 js 文件中：

```javascript
let ewhost = "1";
function ewshop(n){ return n }
function Person() { this.name = "John";}
```

2. config**.d.ts** 中：

```typescript
// 声明需要使用的成员的描述
declare let ewhost: string; // 变量
declare function ewshop(n:number):number; // 函数
declare class Person {name:string;}; // 类
// 命名空间（如页面中引入了 jquery）
declare namespace $ {
  // $.get("apy", function(res){});
  export function get(url: string, fn:(res:object)=>void): any;
}

// 模块
declare module "mymodule" {
  export  function join(arr:any[]):void;
}
/* 在 ts 中使用
import mymodule from "mymodule";
mymodule.join("1","2");
*/

// 所有的 png 图片，作为一个模块
declare module "*.png";
// ts 中使用 import myimg from "./myimg";
```

3. [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types) 中为我们提供好了常用的第三方 js 库的 **.d.ts** 配置文件，在 [TypeScript: Search for typed packages (typescriptlang.org)](https://www.typescriptlang.org/dt/search?search=) 中搜索我们需要使用的库的配置文件然后安装即可。

## Vue3 与 TS

### 1. shims-vue.d.ts：

shims-vue.d.ts 是为了 typescript 做的适配定义文件，因为 vue 文件不是一个常规的文件类型，ts 是不能理解 vue 文件是干嘛的，加这一段是是告诉 ts，vue 文件是这种类型的：

```typescript
/* eslint-disable */
declare module '*.vue' { // 表明 ts 项目中 vue 文件是一个模块
  import type { DefineComponent } from 'vue' // 将组件定义作为一个类型
  const component: DefineComponent<{}, {}, any> // 表明我们定义的每一个组件必须是此类型
  export default component
}
```

### 2. defineComponent：

* 原来 vue 中使用 `export default {}` 定义组件属性，对于编辑器而言 {} 只是一个 Object 的类型，无法有针对性的提示我们对于 vue 组件来说 {} 里应该有哪些属性。
* 在 TypeScript 中 {} 就变成了 defineComponent 的参数，那么对参数类型的提示，就可以实现对 {} 中属性的提示，外还可以进行对参数的一些类型推导等操作。

```html
<!-- 这里 lang 表示使用 ts -->
<script lang="ts">
import { defineComponent } from 'vue';
import HelloWorld from '@/components/HelloWorld.vue';

// 不建议使用 export default {} 而是使用 export default defineComponent({})
export default defineComponent({
  components: {
    HelloWorld,
  },
});
</script> 
```

### 3. 选项式 API：

```typescript
import { defineComponent, PropType } from 'vue';

// 作类型约束成员建议单独写在一个 ts 文件中，在需要时导入即可（不需要 .ts 后缀）
interface User { name:string } // 定义接口作为约束

export default defineComponent({
  props: {
    user: {
      type: Object as PropType<User>, // PropType 作 props 属性类型约束
      default():User {
        return { name: 'user' };
      }
    }
  },
  data() {
    return {
      msg: 'Hello' as string, // 断言
      stu: Object as User, // 断言添加类型约束
    }
  },
  mounted():void {
    console.log(this.msg);
  },
});
```

### 4. 组合式 API：

```typescript
setup() {
    interface User { name:string }
    
    const msg = ref<string>('hello'); // 限定类型
    const stu = reactive<User>({name: 'user'}); // 接口类型约束
    onMounted(():void=> {
        console.log(msg.value);
    });

    return { msg, stu, }
}
```