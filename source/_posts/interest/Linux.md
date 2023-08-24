---
title: Linux
date: 2023-04-01 13:06:44
categories: Linux
tags: 
    - linux
    - nginx
---

# Linux

> 命令主要针对 Linux CentOS 7 版本

## 认识 Linux

### 目录结构：

* Linux 中一切皆文件，它只有一个根目录 */* 所有的文件都挂载在这个节点下

| 目录       | 作用                                                        |
| ---------- | ----------------------------------------------------------- |
| bin        | 是 Binary 的缩写存放着最经常使用的命令                      |
| boot       | 存放 Linux 启动时使用的一些核心文件，包括连接文件和镜像文件 |
| dev        | Linux 的外部设备，在 Linux 中访问设备的方式和访问文件的方式 |
| **etc**    | 存放所有系统管理所需的配置文件和子目录                      |
| **home**   | 用户的主目录，在 Linux 中，每个用户都有一个自己的目录       |
| lib        | 系统最基本的动态连接共享库（类似 Windows 的 DLL）           |
| lost+found | 存放系统突然关机时的一些文件                                |
| media      | 自动识别一些设备如U盘、光驱等，自动挂载到该目录下           |
| mnt        | 让用户临时挂载文件系统（如挂载光驱）                        |
| **opt**    | 安装额外软件摆放目录                                        |
| proc       | 系统内存映射虚拟目录，可通过它获取系统信息                  |
| **root**   | 系统管理员主目录                                            |
| sbin       | 系统管理员使用的系统管理程序                                |
| srv        | 存放一些服务启动之后需要提取的数据                          |
| sys        | 安装了 Linux 2.6 内核新出现的一个文件系统 sysfs             |
| **tmp**    | 存放临时文件目录（安装包等）                                |
| **usr**    | 系统默认软件放置目录                                        |
| run        | 临时文件系统存储系统启动以来的信息，重启时会被清空          |
| var        | 存放不断扩充的东西（可存放经常修改的目录文件如日志等）      |

## 常用命令操作

### 命令格式：

* 命令格式：命令 [-选项] [参数]
* 多个选项可以写在一起共用一个 **'-'**
* Linux中选项前加单杠（-）是为简写，双杠（--）为全写，效果一致

### 简单命令：

* 关机(shutdown)重启（reboot）命令：

```bash
sync # 将数据由内存同步到硬盘 (关机或重启前建议执行一次)

shutdown # 立即关机 (同：shutdown -h now)
shutdown -h 10 # 10分钟后关机(同：shutdown -h +10)
shutdown -h 20:25 # 指定系统时间关机

reboot # 立即重启 (同：shutdown -r now)
shutdown -r +10 # 十分钟后重启
```

* ls：直接使用时表示列出当前目录下的所有非隐藏文件

```bash
ls 目录名 # ls 后跟上路径，表示指定路径查询
ls -a # 加上 -a选项(--all) 列出当前目录下的所有文件包括隐藏文件
ls -l # -l(可加上 h 人性化显示信息)选项表示同时列出文件属性和权限
```

* pwd：显示目前的目录
* clear：清空命令行
* cd 目录名：切换到指定目录
* cat /etc/redhat-release：系统版本

### 目录命令：
* mkdir、rmdir 文件夹创建与删除

```bash
mkdir 目录名        # 创建一个目录
mkdir -p 多级目录   # 递归创建多级目录

rmdir 目录名        # 删除空目录（目录中有文件，需要清空文件才能删除）
rmdir -p 多级目录   # 递归删除多级空目录
```

* cp 复制文件或目录

```bash
cp [选项] 文件或目录 目标目录 # 文件可直接复制（目录需要 -a || -r 选项）
cp -r 原目录 目标目录        # 加上 -r 选项表示复制目录
cp -p 原目录 目标目录        # -p 保留文件原属性复制

# 文件或目录可以是多个使用空格隔开
# 目标目录/不在的文件名(文件夹同理)：则是为复制的文件重命名

# -a：相当于 -d、-p、-r 选项的集合
# -d：如果源文件为软链接（对硬链接无效），则复制出的目标文件也为软链接
# -i：询问，如果目标文件已经存在，则会询问是否覆盖
```

* mv 移动文件或目录

```bash
mv file1 file2 # 将file1移动到file2（file2不存在则是将file1重命名为file2）
# -f 强制移动
```

### 文件命令：
* rm 删除文件或目录

```bash
rm -f 文件或目录 # -f 不出现警告并忽略不存在的文件强制删除，可以不加但删除前会询问输入y确认
rm -rf  文件或目录 # -r 删除目录(文件夹和文件夹内所有文件)
```

* 文件查看：

```bash
cat 文件名 # 从第一行开始显示文件内容
cat -n 文件名 # 显示内容时同时显示行号（还可使用命令：nl 文件名）
tac 文件名 # 从最后一行开始显示（倒着显示）

less 文件名 # 分页显示文件内容，可用上下箭头一行一行翻页，PgUp|PgDn|空格翻页。
# 还可输入 / 后跟上想搜索的内容回车搜索输入 n 查找下一个 N 上一个，最后按 q 退出阅读

head -n 行数 文件名 # 显示前几行内容
tail -n 行数 文件名 # 显示最后几行
```

* touch 文件名(空格隔开创建多个)：在当前目录下创建一个空文件，也可改为目录名在指定目录下创建文件

### 文件属性：

#### 文件属性含义：

* 执行 `ls -ll` 后每行最前面的 10 位就代表了文件的属性：

```bash
# ls -ll
lrwxrwxrwx.  1  root root     7 Mar  7  2019 bin -> usr/bin
dr-xr-xr-x.  5  root root  4096 Jul 28  2022 boot
# 文件权限  个数 属主 属组  大小 时间         文件名
```

`lrwxrwxrwx` ：分别以 0-9 为坐标，0 为表示 **文件类型** ，剩下字符每3个为一组 1-3 表示主权限（root），4-6 表示组权限，7-9 表示其他用户权限。

文件类型： **d** 目录、 **-** 文件、 **l** 连接文档、 **b** 装置文件中可供存储的接口设备、 **c** 装置文件中串行端口设备（鼠标、键盘）

权限： **r** 可读、 **w** 可写、 **x** 可执行

#### 修改文件属性：

1. chgrp 修改文件属组：

```bash
chgrp 属组名 文件或目录
chgrp -R 属组名 文件或目录 # 递归更改目录
```

2. chown 修改文件属主：

```bash
chown 属组名 文件或目录 # -R 选项递归更改目录
chown [-R] 属主名：属组名 文件名 # 同时更改文件属组
```

3. chmod 修改文件权限：

```bash
# 3 组权限每组都可以使用数字表示
# r: 4  w: 2  x: 1
chmod 777 www # 将 www 的三组权限都修改为 rwx(r+w+x=7)
chmod -R 755 www # 递归将 www 的权限都修改为 drwxr-xr-x
```

### 链接:

* 硬链接：以文件副本的形式存在，不占用实际空间，不允许给目录创建硬链接，同一个文件系统中才能创建
* 软链接：链接文件路径，能链接目录文件，也可以跨越文件系统进行链接。当原始文件被删除后，链接文件也将失效

```bash
ln [选项] 文件 链接名 # 创建链接（默认硬链接）
# -s 软链接(符号链接)
# -b 覆盖以前建立的链接
# -d 允许超级用户制作目录的硬链接
# -f 强制执行
# -n 把符号链接视为一般目录

touch f1.txt # 创建一个文件
echo "hello" >> f1.txt # 向文件写入文字(文件不存在则创建)
ln f1.txt fy # 给 f1.txt 创建一个 fy 的硬链接
ln -s f1.txt fr # 给 f1.txt 创建一个 fr 的软链接
```

### 磁盘管理：

* df 检查文件系统的磁盘空间占用情况:

```bash
df -ahT [目录或文件名]
# -a ：列出所有的文件系统
# -h ：以人们较易阅读的 GBytes, MBytes, KBytes 等格式自行显示
# -T ：显示文件系统类型
```

* du 对文件和目录磁盘使用的空间的查看：

```bash
du [选项] [文件或目录名] # 不指定目录则列出当前目录下所有文件夹容量（包括隐藏文件夹）
# -a、-h 同 df
# -s ：列出总量而已，而不列出每个各别的目录占用容量
# -S ：不包括子目录下的总计
```

* 磁盘挂载与卸除：

```bash
mount /dev/hdc6 /mnt/hdc6 # 将 /dev/hdc6 挂载到 /mnt/hdc6
umount /dev/hdc6 # 卸载 /dev/hdc6(-f 强制卸除)
```

## 用户管理

### 账号管理：

* useradd 添加用户：

```bash
useradd 选项 用户名
useradd –d /home/sam -m sam # -d和-m选项为sam产生一个主目录 /home/sam
# -c comment 指定一段注释性描述
# -d 指定用户主目录，如果此目录不存在，使用 -m 选项，则会创建主目录
# -g 指定用户所属的用户组
```

* userdel 删除用户：

```bash
userdel -r sam # 把sam用户的主目录一起删除
```

* usermod 修改用户：

```bash
usermod 选项 用户名 # 选项与 useradd 相同
```

* passwd 用户密码：

```bash
passwd # 当前用户修改密码
passwd 用户名 # 管理员用户修改指定用户密码
passwd -d 用户名 # 使账号无密码
# -l 锁定口令，即禁用账号
# -f 强迫用户下次登录时修改口令
```

### 用户组管理：

>  用户组的增加、删除和修改实际上就是对/etc/group文件的更新

```bash
groupadd group1 # 增加组 group1,组标识号是在当前最大组标识号加 1
groupadd -g 101 group2 # 增加组 group2，同时指定组标识号是 101

groupdel group1 # 删除组 group1

groupmod -g 102 group2 # 将组 group2 的组标识号修改为 102
groupmod –g 100 -n group3 group2 # 将组 group2 的标识号改为 100，组名修改为 group3

# 用户同时属于多个用户组，那么用户可以在用户组之间切换
newgrp root # 当前用户切换到root用户组
```

### 用户文件

1. `/etc/passwd` 文件：

每个用户都在/etc/passwd文件中有一个对应的记录行，它记录了这个用户的一些基本属性

```bash
$ cat /etc/passwd
root:x:0:0:root:/root:/bin/bash
bin:x:1:1:bin:/bin:/sbin/nologin
# /etc/passwd中一行记录对应着一个用户，每行记录又被冒号(:)分隔为7个字段
# 用户名:口令:用户标识号:组标识号:注释性描述:主目录:登录Shell
```

## 系统管理

### 进程管理：

* `|` : 管道符， `grep` : 指定文本内容进行过滤，并返回符合条件的行

1. `ps` 查看正在服务器上执行的进程相关信息的列表

```bash
ps -aux
ps -aux|grep nginx # 查看 nginx 相关进程
# -a：表示显示所有用户的进程列表
# -u：以详细的格式输出进程状态
# -x：表示显示无控制终端的进程
```

2. `pstree` 以树状图的方式展现进程之间的派生关系

```bash
pstree -aup
# -a：显示每个程序的完整指令，包含路径、参数或是常驻服务的标示
# -u：以用户为主的格式列出进程
# -p：在树形结构中显示每个进程的进程编号（PID）
```

3. `kill` 终止指定进程

```bash
kill -15 123 # 强制停止 PID 为 123 的进程
# -9 或 -SIGKILL：强制停止进程
# -15 或 -SIGTERM：请求进程自行退出，否则强制进程终止（推荐）
```

4. `nohup` 使命令在后台运行而不受当前终端断开的影响

```bash
nohup java -jar file.jar > output.log &
# 输入该命令后，您会看到它进程的 PID
# 将程序运行期间产生的所有输出保存到 output.log
# &：在命令结尾加上“&”符号，意味着在后台运行该程序
ps aux | grep file.jar # 查看该进程
```

### 端口管理：

1. **CentOS** 端口管理依赖 **firewalld** 防火墙

```bash
systemctl start firewalld # 开启防火墙
firewall-cmd --list-ports # 查看所有开启的端口

firewall-cmd --zone=public --add-port=8080/tcp --permanent # 开放 8080 端口
# --zone 作用域
# --permanent 永久生效，没有此参数重启后失效
# --remove-port 可关闭端口

systemctl restart firewalld.service # 重启防火墙
firewall-cmd --reload # 重新加载

netstat -ntlp # 查看当前所有tcp端口
netstat -ntulp |grep 8080 # 查看所有 8080 端口使用情况
```

2. **Ubuntu** 一般默认有 **iptables**

```bash
sudo apt-get install iptables # sudo 以管理员运行安装 iptables

iptables -I INPUT -p tcp --dport 8080 -j ACCEPT # 开放 8080 端口
iptables-save # 保存规则

# 服务器重启上述规则就没有了，需要对规则进行持久化
sudo apt-get install iptables-persistent # 安装 iptables-persistent
sudo netfilter-persistent save # 保存
sudo netfilter-persistent reload # 重启
```

## 软件安装：

### 安装工具：

| 功能                 | CentOS                  | Ubuntu                  |
| -------------------- | ----------------------- | ----------------------- |
| 更新软件包列表       | `yum update`            | `apt update`            |
| 安装软件包           | `yum install <package>` | `apt install <package>` |
| 查看已安装软件包列表 | `yum list installed`    | `dpkg -l` 或 `apt list` |
| 卸载软件包           | `yum remove <package>`  | `apt remove <package>`  |
| 清理不再使用的依赖   | `yum autoremove`        | `apt autoremove`        |

1. 一般Linux 系统基本上分两大类：

   * **RedHat** 系列：Redhat、 **Centos** 、Fedora 等

   * **Debian** 系列：Debian、 **Ubuntu** 等

2. 软件包管理器 **dpkg/apt** 是针对基于 Debian 的发行版，而  **yum/rpm** 则是针对基于 RedHat 的发行版。

3. apt 是基于 dpkg 的软件包管理器，dpkg 是一个底层工具，可以处理 **.deb** 格式的软件包文件。

4. yum 是基于 rpm 包管理器的软件包管理器，用于处理 **.rpm** 格式的软件包文件。

### 安装方法：

#### 1. yum 安装：

```bash
yum check-update # 列出所有可更新的软件清单命令
yum update # 更新所有软件命令
yum update <package_name> # 仅更新指定的软件命令

yum remove <package_name> # 删除软件包命令
yum clean all # 清除缓存目录下的软件包及旧的 headers

yum -y install <package_name> # 安装指定的软件，按默认值

yum list # 列出所有可安裝的软件清单命令
yum search <keyword> # 查找软件包命令
```

* `yum` 与 `rpm` 类似也能安装本地 rpm 包，它能自动的解决包之间的依赖问题，而 `rpm` 需要手动解决 rpm 包之间的依赖问题
* yum 换源：

```bash
# 备份配置
mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.backup
# 下载阿里云 yum 配置源
wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo
# 腾讯云 yum 配置源 https://mirrors.cloud.tencent.com/repo/centos7_base.repo

# 清除缓存，生成新的缓存，更新系统软件包
yum clean all
yum makecache
yum update
```

#### 2. rpm 安装：

```bash
rpm -qa|grep jdk # 查看所有已安装的软件包中包含 jdk 的软件包名称和版本
# jdk1.8-1.8.0_361-fcs.x86_64 # 假如查到信息，下面用它卸载
rpm -e --nodeps jdk1.8-1.8.0_361-fcs.x86_64 # 卸载程序

rpm -ivh jdk-8u361-linux-x64.rpm # 安装程序（i：安装，v：安装过程，h：进度条）
```

* 因为在 RPM 安装时，程序会自动将相关可执行文件安装到系统默认的路径中，而这些路径已经被添加到系统环境变量 `PATH` 中，所以可以直接在终端或命令提示符中使用相关命令，无需手动配置环境变量

#### 3. 压缩包安装：

##### jdk 安装配置：

* 压缩包方式安装 jdk 需要配置环境变量

* 配置有两种方式：
  * `/etc/profile` 文件，在文件末尾添加配置
  * 进入 `/etc/profile.d/` 目录，在该目录中新建一个 `.sh` 文件（ **推荐** ）
* 安装前应 `java -version` 和 `rpm -qa|grep jdk` 检查 jdk 是否已安装

```bash
tar -zxvf jdk-8u291-linux-x64.tar.gz -C /usr/local/java/ # 解压安装 jdk
# -zxvf 选项适用于解压缩 .tar.gz 或 .tgz 格式的文件
# -xvf 单纯地解开归档文件，适用于解压缩普通的 .tar 格式文件
# -C 解压到指定目录

vim /etc/profile.d/jdkenv.sh # 新建并打开 jdkenv.sh
# 在 jdkenv.sh 中添加如下 jdk 配置
export JAVA_HOME=/usr/local/java/jdk1.8.0_291
export CLASSPATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar
export PATH=$JAVA_HOME/bin:$PATH
# wq 保存退出

source /etc/profile # 使配置生效
java -version # 检查是否生效
```

### 安装细节：

#### Tomcat 自启动：

tomcat 启动前如端口冲突需修改 `server.xml` 文件中 `Connector` 与 `Server` 的 `port` ，默认重启后不会自启动需要添加自启动服务，同样它也能执行自启动脚本

1. 创建自启动要执行的脚本：

```bash
#!/bin/bash

sudo /home/ruoxijun/apache-tomcat-9.0.73/bin/shutdown.sh
sudo /home/ruoxijun/apache-tomcat-9.0.73/bin/startup.sh
```

2. 在 `/etc/systemd/system/` 下创建自启动服务文件如 `startup.service` 内容如下：

```bash
[Unit]
Description=Startup Script

[Service]
Type=forking
User=root
Group=root

ExecStart=/home/ruoxijun/apache-tomcat-9.0.73/bin/startup.sh

[Install]
WantedBy=multi-user.target
```

* `ExecStart` 是你要执行的脚本地址

3. 开启自启动服务：

```bash
systemctl daemon-reload # 重载 Systemd 配置
systemctl enable startup.service # 启用自启动服务
systemctl start startup.service # 启动服务
```

#### MySQL 安装：

1. 下载：[https://dev.mysql.com/downloads/mysql/](https://dev.mysql.com/downloads/mysql/)

centos 7 版本应选择的 MySQL 安装包为：

```bash
cat /etc/redhat-release # 查看系统版本
uname -m # 查看服务器架构类型（arm、x86）

# 下载界面选择下载
Select Operating System:
Red Hat Enterprise Linux / Oracle Linux # 选择
Select OS Version:
Red Hat Enterprise Linux 7 / Oracle Linux 7 (x86, 64-bit) # 选择
(mysql-8.0.32-1.el7.x86_64.rpm-bundle.tar) # 下载
```

2. 删除自带的 **mariadb** 否则容易导致出错：

```bash
rpm -qa|grep mariadb # 查看现有 mariadb
rpm -e --nodeps mariadb-libs-5.5.68-1.el7.x86_64 # 删除 mariadb
```

3. MySQL 压缩包解压后有大量的 rmp 包：

```bash
mkdir mysql
tar -xvf mysql-8.0.32-1.el7.x86_64.rpm-bundle.tar -C ./mysql # 解压

# 只需要安装 common、libs、client、server 4项
rpm -ivh mysql-community-common-8.0.32-1.el7.x86_64.rpm
rpm -ivh mysql-community-client-plugins-8.0.32-1.el7.x86_64.rpm
rpm -ivh mysql-community-libs-8.0.32-1.el7.x86_64.rpm
rpm -ivh mysql-community-client-8.0.32-1.el7.x86_64.rpm
rpm -ivh mysql-community-icu-data-files-8.0.32-1.el7.x86_64.rpm
rpm -ivh mysql-community-server-8.0.32-1.el7.x86_64.rpm
# 其中 libs 需要依赖 client-plugins，server 需要 icu-data-files 注意先后顺序
# 可在每行命令后面添加 --nodeps --force 强制安装且忽略包之间的依赖关系
```

4. 启动 MySQL 服务：

```bash
systemctl status mysqld # 查看 MySQL 服务状态
systemctl start mysqld # 启动 MySQL 服务
systemctl enable mysqld # 开启 MySQL 自启动服务

cat /var/log/mysqld.log|grep password # 通过日志查看密码
# A temporary password is generated for root@localhost: _6_6jZoiLSzf

# 运行MySQL安全性脚本，进行安全配置修改密码等，通过日志的密码进去
mysql_secure_installation

mysql -uroot -p # 登录数据库
ALTER USER 'root'@'localhost' IDENTIFIED BY '密码' # 也可修改密码
# 1. 开启远程访问 % 表示任意 IP 都能访问
create user 'root'@'%' identified with mysql_native_password by '密码';
# 2. 授予 root 用户在所有数据库和表上执行任何操作的权限
grant all privileges on *.* to 'root'@'%' with grant option;
# 3. 重新加载授权表
flush privileges;
# 4. 最后开启 3306 端口即可远程访问
```

## Nginx

### Nginx 安装

1. 确保已安装以下软件

```bash
yum install -y yum-utils net-tools epel-release
```

2. 添加 nginx 的软件包到 yum 存储库中

```bash
cat > /etc/yum.repos.d/nginx.repo << EOF
[nginx-stable]
name=nginx stable repo
baseurl=http://nginx.org/packages/centos/\$releasever/\$basearch/
gpgcheck=1
enabled=1
gpgkey=https://nginx.org/keys/nginx_signing.key
module_hotfixes=true
EOF
```

3. 安装 nginx

```bash
yum install -y nginx
```

4. systemctl 启动 nginx

```bash
systemctl start nginx # 开启 nginx 服务
systemctl enable nginx # 开机自启动

systemctl status nginx # 状态
systemctl stop nginx # 停止服务
systemctl reload nginx # 重载服务
```

### Nginx 基础：

#### 常用命令：

```bash
nginx # 启动
nginx -s stop # 立即停止
nginx -s quit # 执行完当前请求再停止

nginx -s reload # 重新加载配置文件
nginx -t # 测试配置文件
nginx -s reopen # 将日志写入一个新的文件
```

* 日志位于： `/var/log/nginx/`

#### 默认配置：

* 配置文件位于 `/etc/nginx/nginx.conf` 它的 http 中有这样一句：

```nginx
include /etc/nginx/conf.d/*.conf;
```

* 它表示会引用 `/etc/nginx/conf.d` 目录下所有的 `.conf` 文件，而 `/etc/nginx/conf.d/default.conf` 提供了默认配置：

```nginx
server {
    listen       80; # 端口
    server_name  localhost;
    location / {
        root   /usr/share/nginx/html; # 根目录
        index  index.html index.htm; # 首页
    }
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}
```

* 配置文件基本结构：

```nginx
http {

  server{ # 虚拟主机

    location { 
      listen 80；
      server_name localhost;
    }
    location {} # 可配置多个
  }
  server{} # 可配置多个

}
```





