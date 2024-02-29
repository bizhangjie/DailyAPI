#!/usr/bin/python3.10
# -------------------------------------------------
# -*- coding: utf-8 -*-
# @Time    : 2024/2/28 20:05
# @Author  : 章杰
# @Email   : zj@buxiangyao.link
# @File    : zonghe
# @Software: PyCharm
# @ Description：I'm in charge of my Code
# -------------------------------------------------


import requests

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
}

resp = requests.get('https://jable.tv/videos/jufe-124/',headers=headers)
print(resp.text)

