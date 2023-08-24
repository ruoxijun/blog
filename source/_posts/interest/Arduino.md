---
title: Arduino
date: 2023-04-20 20:43:00
categories: 物联网
tags: 
    - 物联网
    - arduino
---

# Arduino

## ArduinoUno

### 组成信息：

![ArduinoUNO](/images/wlw/arduino/ArduinoUNO.png)

#### 电源与供电：

* USB 供电为 5V ，DC 供电电压要求 7～12V 一般取中间值 9V。
* 左下角电源接口可给外围模块供电，其中 VIN 输出电压等于主板电源电压

#### 指示灯：

* ON：电源指示灯
* L：该 LED 连接到 Arduino 的 13 号引脚（不同主板可能不同）
* TX：串口发送指示灯，RX：串口接收指示灯

### 针脚说明：

![ArduinoUNO](/images/wlw/arduino/ArduinoUNO2.png)

#### 输入输出：

ArduinoUNO 有 14 个数字输入输出端口，6 个模拟输入端口

* 0（RX）、1（TX）分别用于接收和发送串口数据
* 2、3 可以输入外部中断信号
* 带 **~** 号数字引脚（3、5、6、9、10、11）可用于输出模拟值
* 带 **A** 前缀引脚模拟输入引脚，读入模拟值
* 10（SS）、11（MOSI）、12（MISO）、13（SCK） 可用于 SPI 通信
* A4（SDA）、A5（SCL）和 TWI 接口 可用于 TWI 通信，兼容 I²C 通信
* AREF 模拟输入参考电压输入端口

### ArduinoIDE：

> 注意：电脑连接或切换开发板需要在工具中选择对应的开发板和端口

* ArduinoUno-ch340 驱动下载地址：

https://www.wch.cn/downloads/CH341SER_EXE.html

* 添加 ESP8266 开发版 JSON：

https://arduino.esp8266.com/stable/package_esp8266com_index.json

* ESP8266-cp210 驱动下载地址：

https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers?tab=downloads

## Arduino

### C/C++ 基础

```c++
// 宏定义(可以没有分号结尾)
#define PI 3.14
// 常量
const int led = 13;

// 数据类型
int           // 整型
unsigned int  // 无符号整型
long          // 长整型
unsigned long // 无符号长整型
short         // 短整型
float         // 浮点型
double        // 双精度浮点型
char          // 字符型
bool          // 布尔型
int a[5]      // 数组
String        // 字符串
```

### 入门案例

* 使 ArduinoUno 开发板上自带与 13 号引脚连接的 LED 灯闪烁：

```c++
// 初始化
void setup() {
  /*
    LED_BUILTIN：内置 LED 灯（13 引脚，不同板子可能不同）
    OUTPUT：数字输出模式
    pinMode(引脚, 模式)：将指定引脚配置为数字输入或输出模式
  */
  pinMode(LED_BUILTIN, OUTPUT);
}

// 循环执行
void loop() {
  /*
    digitalWrite(引脚, 电平)：将指定引脚输出高电平（HIGH）或低电平（LOW）
    delay(时间毫秒); 让程序延时指定毫秒后执行
  */
  digitalWrite(LED_BUILTIN, HIGH);
  delay(500);
  digitalWrite(LED_BUILTIN, LOW);
  delay(3000);
}
```

### Arduino 基础

#### 数字输入输出：

* Arduino 针对不同的开发板预定义了不同的引脚，LED_BUILTIN 一般表示开发板自带的 LED 灯相连的引脚
* OUTPUT 输出模式、INPUT 输入模式、INPUT_PULLUP 输入上拉模式
* HIGH 高电平、LOW 低电平

```c++
// 引脚模式，数字输入输出需要在 setup 中指定引脚模式
pinMode(pin, mode);

digitalWrite(pin, value); // 数字写出
int digitalRead(pin) // 数字读入
```

#### 模拟输入输出：

```c++
// 模拟值读入（A0~5，0～5V 值为 0～1023）
int analogRead(pin) 
// 模拟值写出（3、5、6、9、10、11 引脚，0～255）
analogWrite(pin, value)
```

* `analogRead` 它基于 ATmega328P 微控制器的 Arduino 板的 ADC 分辨率为10位。这意味着它可以将输入电压分为2^10 = 1024个不同的级别
* `analogWrite` 输出值0到255范围的原因是因为 Arduino 的 PWM 分辨率为8位，这意味着它可以表示2^8 = 256个不同的占空比级别，将模拟输入值映射到0到255范围可以充分利用 Arduino 的 PWM 分辨率

#### 串口通信：

```c++
// setup 中串口通信初始化，并指定波特率（数据传输的速率）
Serial.begin(9600);
// 关闭所有的串口通信，并将其释放回给系统
Serial.end();

// 读到的字符形成了一个完整的字符串，然后将其从串口缓存中读取并返回
Serial.readString();
// 等待读取到特定的终止符返回
Serial.readStringUntil("\n"); // 读取直到遇到换行符为止的字符串
// 在串口上输出字符串，并自动换行
Serial.println();
```

`Serial.println` 有第二个参数，参数用于控制输出格式：

- `DEC`：输出十进制数字
- `HEX`：输出十六进制数字
- `OCT`：输出八进制数字
- `BIN`：输出二进制数字
- `BYTE`：输出字符的 ASCII 编码值

## 模块实例

### 按钮模块

* 按钮在按下时可能出现震颤现象，这会导致在极小的一段时间里电平不停的高低之间转换（最简单的除颤方法是在电平首次改变时延时一段时间）

#### 下拉电阻：

##### 连接图：

* 示意图：

![下拉电阻方式](/images/wlw/arduino/mode/xiala.jpg)

* 实例图：

![下拉电阻方式](/images/wlw/arduino/mode/xiala2.jpg)

* **限流电阻** ：一般LED的最大能承受的电流为 **25mA** ，在LED一端串联了 220Ω 的电阻，这样可以控制流过LED的电流，防止损坏LED
* **下拉电阻** ：在 2 号引脚到 GND 之前，连接了一个阻值 10K 的电阻。没有该电阻，当未按下按键时，2号引脚会一直处于悬空（没有连接任何电路）状态，会得到一个不稳定的值（可能是高，也可能是低）。电阻到地就是为了稳定引脚的电平，当引脚悬空时，就会识别为低电平。而这种 **将某节点通过电阻接地** 的做法，叫做下拉

##### 代码：

```c++
#define readPin 2 // 定义 2 号引脚读取按钮状态

int check = LOW; // 记录初始状态
long i = 0; // 点击次数

void setup() {
  Serial.begin(9600);
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(readPin, INPUT);
}

void loop() {
  int flag = digitalRead(readPin);
  // 按钮按下且按钮电平状态改变时
  if(flag == HIGH && flag != check){
    Serial.println(++i);
    digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN));
  }
  check = flag;
  delay(100);
}
```

#### 上拉电阻：

##### 连接图：

* 示意图：

![上拉电阻方式](/images/wlw/arduino/mode/shangla.jpg)

* 实例图：

![上拉电阻方式](/images/wlw/arduino/mode/shangla2.jpg)

* **上拉电阻** ：同下拉电阻一样，可以稳定 I/O 口电平，不同的是电阻连接到 VCC，将引脚稳定在高电位

##### 代码：

* 只需将上面代码中 `pinMode(readPin, INPUT);` 替换为：

```c++
pinMode(readPin, INPUT_PULLUP);
```

* 启动后 LED 灯将默认亮起，因为 `INPUT_PULLUP` 模式表示将引脚设置为输入模式，并启用内部上拉电阻
* 如果没有外部电压施加到该引脚，它将默认读取为高电平（HIGH）。当外部设备将引脚接地时（按下），引脚将读取为低电平（LOW）
* 这种模式通常用于连接开关或按钮，因为它可以帮助消除浮动输入的问题

### 电位器

#### 原理图：

![电位器原理图](/images/wlw/arduino/mode/Potentiometer.jpg)

* 电位器一般有 3 个针脚两边针脚任意接电压线和接地线，中间的针脚接模拟输入脚位（带 **A** 前缀的）
* 转动电位器时的值为 **0~1023** ，向接电压针脚方向转时值增加，向接地方向时减小

#### 实例代码：

* A0 针脚读取电位器的值，3 号针脚接蜂鸣器正极并输出模拟值

* 范围值映射： `long map(long x, long in_min, long in_max, long out_min, long out_max)`

```c++
#define led 3
#define sensor A0

void setup() { Serial.begin(9600); }

void loop() {
  // 它读到返回的值为 0 ~ 1023
  int analog = analogRead(sensor);
  // 0~1023 范围的值映射为 0~255 返回
  analog = map(analog, 0, 1023, 0, 255);
  Serial.println(analog);
  // 输出 0~255 的模拟值控制蜂鸣器声音大小
  analogWrite(led, analog);
  delay(500);
}
```













