---
title: ZeroTermux
date: 2023-04-15 20:45:00
categories: Linux
tags: 
    - linux
    - zerotermux
    - termux
    - 内网穿透
    - nps
---

# ZeroTermux 使用

## 初始化

> * [ZeroTermux 官网地址：https://github.com/hanxinhao000/ZeroTermux](https://github.com/hanxinhao000/ZeroTermux)
> * [下载地址 ：ixcmstudio.cn](https://od.ixcmstudio.cn/repository/main/ZeroTermux/)
> * [termux 官网地址：https://github.com/termux/termux-app](https://github.com/termux/termux-app)

### 安装常用软件：

```bash
pkg install -y vim git nmap openssh tsu curl wget tree proot
```

### 初始化设置：

```bash
# 设置密码
passwd
# 将默认编辑器设置为 vim
export EDITOR=vim
# 查看用户名
whoami
# 查看 ip
ifconfig
# 开启 ssh
sshd

# 远程 ssh 连接(termux 默认 ssh 端口 8022)
ssh -p 8022 root@192.168.0.166
```

### 设置或删除启动文字：

```bash
# 删除
rm $PREFIX/etc/motd

# 修改启动问候语
vim $PREFIX/etc/motd
```

## 安装 Linux 发行版

### 以 centos 为例：

```bash
# 安装必要工具
pkg install proot git python -y

# 安装 centos（执行命令后按照指引安装即可）
git clone https://github.com/sqlsec/termux-install-linux
cd termux-install-linux
python termux-linux-install.py

# 启动 centos
cd ~/Termux-Linux/CentOS
./start-centos.sh
```

## 搭建服务器环境

### 安装 mysql jdk redis nginx：

```bash
pkg install mariadb openjdk-17 redis nginx -y
```

### 配置 mariadb(mysql)：

```bash
# 登录数据库（默认没有密码，回车即可）：
mysql -uroot -p
# 创建可以远程数据库的用户 admin：
CREATE USER 'admin'@'%' IDENTIFIED BY '123456';
GRANT ALL PRIVILEGES ON *.* TO 'admin'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```

### 配置 Redis：

```bash
# 开启 redis 服务
redis-server
# 报错：
WARNING Your kernel has a bug that could lead to data corruption during background save. Please upgrade to the latest stable kernel.
# 解决方案：
vim /data/data/com.termux/files/usr/etc/redis.conf
# 在配置文件中解除最后一行 ignore-warnings ARM64-COW-BUG 的注释即可

# 在配置文件中设置 Redis 密码：
requirepass 123456
# 命令行登录：
redis-cli -a 123456
```

### 配置 nginx：

* 该 nginx 配置文件中默认启用的 8080 端口，按需求自行修改：

```bash
vim /data/data/com.termux/files/usr/etc/nginx/nginx.conf
```

## 配置自启动

* 到用户目录下 `cd` 配置 `.bashrc` 自启动执行脚本
* termux 启动时自启动 mariadb(mysql) openjdk-17 redis nginx 等

```bash
# 删除脚本
rm -f .bashrc

# 写入脚本
cat > .bashrc << EOF
echo "<------------- init start ! -------------->"
echo ""

# 启动 sshd
if pgrep -x "sshd" >/dev/null
  then
    echo "~ > sshd started"
  else
    sshd >/dev/null
    echo "~ > sshd start success"
fi

# 启动 mysql
if pgrep -x "mysqld_safe" >/dev/null
  then
    echo "~ > mysql started"
  else
    mysqld_safe -u root >/dev/null  &
    echo "~ > mysql start success"
fi

# 启动 redis
if pgrep -x "redis-server" >/dev/null
then
  echo "~ > redis-server started"
else
  redis-server /data/data/com.termux/files/usr/etc/redis.conf  >/dev/null  &
  echo "~ > redis-server start success"
fi

# 启动 nginx
if pgrep -x "nginx" >/dev/null
then
  echo "~ > nginx started"
else
  nginx >/dev/null
  echo "~ > nginx start success"
fi

echo ""
echo "<-------------- init end ! --------------->"
echo ""
EOF
```

## termux-api

### 安装 termux-api：

1. 手机屏幕左侧右滑点击 **官方插件 -> Termux:Api** 安装 APP
2. 安装 termux-api 命令行工具：

```bash
pkg install termux-api
```

* 注意：Termux:Api APP 需要在手机应用设置中手动设置 **自启动** 并开启手机的一些相应功能权限才能正常使用

### 使用 apt install termux-api：

* [Termux:API 扩展用法详解：https://zhuanlan.zhihu.com/p/381044910](https://zhuanlan.zhihu.com/p/381044910)

## 内网穿透（nps）

### 有公网 IP 服务器：

* [ehang-io/nps 官网: https://github.com/ehang-io/nps](https://github.com/ehang-io/nps)

* [官方文档：https://ehang-io.github.io/nps/#/](https://ehang-io.github.io/nps/#/)

* [ehang-io/nps 服务端和客户端下载地址：https://github.com/ehang-io/nps/releases](https://github.com/ehang-io/nps/releases)

### 无公网 IP 服务器：

* [ZeroTier 官网地址：https://www.zerotier.com/](https://www.zerotier.com/)
* [ZeroTier 客户端下载地址：https://www.zerotier.com/download/](https://www.zerotier.com/download/)

* [ZeroTier 安卓客户端下载地址：https://apkpure.com/zerotier-one/com.zerotier.one](https://apkpure.com/zerotier-one/com.zerotier.one)