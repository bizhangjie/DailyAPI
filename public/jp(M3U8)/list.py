#!/usr/bin/python3.10
# -------------------------------------------------
# -*- coding: utf-8 -*-
# @Time    : 2024/3/28 17:58
# @Author  : 章杰
# @Email   : zj@buxiangyao.link
# @File    : list
# @Software: PyCharm
# @ Description：I'm in charge of my Code
# -------------------------------------------------

import os
from pathlib import Path

def get_m3u8_files(directory):
    # 使用 pathlib 模块来处理路径
    path = Path(directory)
    # 遍历目录中的所有文件和子目录
    for subpath in path.iterdir():
        # 如果是文件
        if subpath.is_file():
            # 检查文件的扩展名是否为".m3u8"
            if subpath.suffix == '.m3u8':
                print(subpath)
                # print(f'<li><a href="https://api.buxiangyao.link/jp(M3U8)/{subpath}"target="_blank">{subpath}</a></li>')
        # 如果是子目录
        elif subpath.is_dir():
            # 递归调用 get_m3u8_files 函数来查找子目录中的 m3u8 文件
            get_m3u8_files(subpath)

# 示例用法
directory = '.'
get_m3u8_files(directory)