#!/usr/bin/python3.10
# -------------------------------------------------
# -*- coding: utf-8 -*-
# @Time    : 2024/3/4 9:35
# @Author  : 章杰
# @Email   : zj@buxiangyao.link
# @File    : user
# @Software: PyCharm
# @ Description：I'm in charge of my Code
# -------------------------------------------------

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import re

# 创建一个 ChromeOptions 对象，配置无界面模式
chrome_options = Options()
chrome_options.add_argument("--headless")  # 启用无界面模式

# 创建一个 Chrome 浏览器实例
driver = webdriver.Chrome(options=chrome_options)

# 打开指定网址
url = "https://www.douyin.com/user/MS4wLjABAAAAPrwjPeBPCOAiC9Qg9lLGN9ny69RZKye_K54L6zu95NI"
driver.get(url)

# 等待页面加载完成，可以根据需要调整等待时间
driver.implicitly_wait(3)

# 获取页面内容
page_source = driver.page_source

# 打印页面内容
print(page_source)

# 正则获取rid
rid = re.findall(r'live.douyin.com/(\d+)', page_source)[0]
print("直播间rid => " + rid)

# 关闭浏览器实例
driver.quit()