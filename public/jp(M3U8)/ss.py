#!/usr/bin/python3.10
# -------------------------------------------------
# -*- coding: utf-8 -*-
# @Time    : 2024/4/21 10:43
# @Author  : 章杰
# @Email   : zj@buxiangyao.link
# @File    : ss
# @Software: PyCharm
# @ Description：I'm in charge of my Code
# -------------------------------------------------
from pathlib import Path

def get_m3u8_files(directory):
    path = Path(directory)
    for subpath in path.iterdir():
        if subpath.is_file():
            if subpath.suffix == '.srt':
                # 获取旧文件名
                old_name = subpath.name
                # 替换文件名中的特定文本
                new_name = old_name.replace('【jp】', 'jp')
                # 获取新的完整路径
                new_path = subpath.with_name(new_name)
                # 重命名文件
                subpath.rename(new_path)
                print(f"Renamed: {old_name} -> {new_name}")
        elif subpath.is_dir():
            get_m3u8_files(subpath)

# 示例用法
directory = '.'
get_m3u8_files(directory)
