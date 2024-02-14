#!/bin/bash
# 一键安装MacCMS
# 检查是否为root用户
[ $(id -u) != "0" ] && { echo "${CFAILURE}Error: You must be root to run this script${CEND}"; exit 1; }
# 检查系统版本
check_sys(){
    local checkType=$1
    local value=$2
    local release=''
    local systemPackage=''
    if [[ -f /etc/redhat-release ]]; then
        release="centos"
        systemPackage="yum"
    elif cat /etc/issue | grep -q -E -i "debian"; then
        release="debian"
        systemPackage="apt"
    elif cat /etc/issue | grep -q -E -i "ubuntu"; then
        release="ubuntu"
        systemPackage="apt"
    elif cat /etc/issue | grep -q -E -i "centos|red hat|redhat"; then
        release="centos"
        systemPackage="yum"
    elif cat /proc/version | grep -q -E -i "debian"; then
        release="debian"
        systemPackage="apt"
    elif cat /proc/version | grep -q -E -i "ubuntu"; then
        release="ubuntu"
        systemPackage="apt"
    elif cat /proc/version | grep -q -E -i "centos|red hat|redhat"; then
        release="centos"
        systemPackage="yum"
    fi
    if [ "$checkType" == "sysRelease" ]; then
        if [ "$value" == "$release" ]; then
            return 0
        else
            return 1
        fi
    elif [ "$checkType" == "packageManager" ]; then
        if [ "$value" == "$systemPackage" ]; then
            return 0
        else
            return 1
        fi
    fi
}
# 安装依赖
install_dependencies(){
    if check_sys packageManager yum; then
        yum -y install wget unzip
    elif check_sys packageManager apt; then
        apt-get -y install wget unzip
    fi
}
# 下载MacCMS
download_maccms(){
    if [ -f /usr/local/maccms ]; then
        echo "MacCMS已安装"
    else
        wget -O /usr/local/maccms.zip http://www.maccms.la/down/maccms10.zip
        unzip /usr/local/maccms.zip -d /usr/local
        rm -f /usr/local/maccms.zip
    fi
}
# 配置MacCMS
config_maccms(){
    chmod -R 777 /usr/local/maccms
    chown -R www:www /usr/local/maccms
    echo "MacCMS安装完成"
}
# 安装
install_maccms(){
    install_dependencies
    download_maccms
    config_maccms
}
# 执行
install_maccms


# 安装php
apt install php
apt install php-fpm
apt install php-mysql
apt install php-gd
apt install php-xml
apt install php-curl
apt install php-mbstring
apt install php-zip

# 修改php.ini配置文件
vim /etc/php/7.2/fpm/php.ini
# 修改后的配置应如下所示：
echo "extension=mysqli"
echo "extension=pdo_mysql"
echo "extension=gd"
echo "extension=xml"
echo "extension=curl"
echo "extension=mbstring"
echo "extension=zip"

