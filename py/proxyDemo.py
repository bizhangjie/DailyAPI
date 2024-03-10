#!/usr/bin/python3.10
# -------------------------------------------------
# -*- coding: utf-8 -*-
# @Time    : 2024/3/10 10:53
# @Author  : 章杰
# @Email   : zj@buxiangyao.link
# @File    : google
# @Software: PyCharm
# @ Description：I'm in charge of my Code
# -------------------------------------------------
import requests

# 定义代理
proxy = {
    'http': 'http://172.67.43.82:80',
    'https': 'http://172.67.43.82:80'
}

# 定义Google搜索的URL
url = 'https://ifconfig.me/'

# 使用代理发送请求
response = requests.get(url, proxies=proxy)

# 处理响应
if response.status_code == 200:
    # 处理响应中的HTML内容或其他数据
    print(response.text)
else:
    print('请求失败，状态码为:', response.status_code)