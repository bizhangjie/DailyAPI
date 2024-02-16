#!/usr/bin/python3.10
# -------------------------------------------------
# -*- coding: utf-8 -*-
# @Time    : 2024/2/16 19:05
# @Author  : 章杰
# @Email   : zj@buxiangyao.link
# @File    : jable
# @Software: PyCharm
# @ Description：I'm in charge of my Code
# -------------------------------------------------

import cloudscraper, re
import sys

# 获取命令行参数
args = sys.argv[1:]  # 跳过第一个参数（脚本路径），获取剩余的参数


scraper = cloudscraper.create_scraper()
url = 'https://en.jable.tv/videos/' + args[0] + '/'
# print(url)
resp = scraper.get(url).text
# title = re.findall("<title>(.*?)<", resp)[0]
m3u8 = re.findall("hlsUrl = '(.*?)'", resp)[0]
# data = { 'title': title, 'm3u8': m3u8}
print(m3u8)
