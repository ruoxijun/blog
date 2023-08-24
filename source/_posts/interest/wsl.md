---
title: wsl
date: 2023-03-02 10:04:00
categories: Linux
tags: 
    - linux
    - wsl
---

### 安装：

[安装 WSL2 并下载配置 Ubuntu (zhihu.com)](https://zhuanlan.zhihu.com/p/348813745)

```
wsl --install
```

通过Windows Store 直接搜索 Ubuntu，进行安装即可。

### 快速进入默认的 Linux 发行版：

```
wsl
```

### 迁移 wsl：

> 因为通过 Windows Store 安装默认在 C 盘会导致 C 盘压力过大因此我们将系统需要将系统迁移到其它磁盘，来减小 C 盘压力。

#### 1. 终止正在运行的 wsl:

```
wsl --shutdown
```

#### 2. 查看系统列表名称：

```
wsl -l
```

##### 显示：

```
适用于 Linux 的 Windows 子系统分发版:
Ubuntu-22.04 (默认)
```

注意这里的 `Ubuntu-22.04 (默认)` 字样中 `Ubuntu-22.04` 是你的 Linux 系统对应名称，后面的默认字样代表这个系统是你的默认Linux发行版。即 `wsl` 命令默认启动该系统。

#### 3. 将需要迁移的 Linux 进行导出:

```text
wsl --export Ubuntu-22.04 D:/ubuntu/export.tar
```

`wsl --export` 后面是你查出的系统名称 `Ubuntu-22.04` ，系统名称后面 `D:/ubuntu/export.tar` 表示 Linux 导入的路径与文件名。

#### 4. 卸载：

```
wsl --unregister Ubuntu-22.04
```

#### 5. 将导出的 Linux 导入：

```
wsl --import Ubuntu D:/ubuntu/ D:/ubuntu/export.tar --version 2
```

参数解析： `wsl --import [Linux 系统名称] [存放路径] [导入的 Linux 源文件] --version 2`

我的用户名称与密码：ruoxijun 123456

### 解决 wsl 中文乱码：

1. 打开 wsl 执行：

```bash
sudo dpkg-reconfigure locales
```

2. 使用空格键选中 `en_US.UTF-8` 、 `zh_CN.UTF-8` ，使用 Tab 键切换至 OK ，再将 `en_US.UTF-8` 选为默认。