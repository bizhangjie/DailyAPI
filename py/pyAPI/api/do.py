#!/usr/bin/python3.10
# -------------------------------------------------
# -*- coding: utf-8 -*-
# @Time    : 2024/3/1 21:10
# @Author  : 章杰
# @Email   : zj@buxiangyao.link
# @File    : do
# @Software: PyCharm
# @ Description：I'm in charge of my Code
# -------------------------------------------------
import requests

def category():
    listData = []
    for pg in range(1,8):
        url = 'https://www.douyu.com/gapi/rkc/directory/mixList/2_183/' + str(pg)
        print("处理url=》 " + url)
        resp = requests.get(url)
        data = resp.json().get('data').get('rl')
        for i in data:
            # title
            title = i.get('rn')
            # url
            url = i.get('url').replace('/', '')
            listData.append({
                'title': title,
                'url': url
            })
    return listData


