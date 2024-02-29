#!/usr/bin/python3.10
# -------------------------------------------------
# -*- coding: utf-8 -*-
# @Time    : 2024/2/28 19:32
# @Author  : 章杰
# @Email   : zj@buxiangyao.link
# @File    : __init__.py
# @Software: PyCharm
# @ Description：I'm in charge of my Code
# -------------------------------------------------
from typing import Optional

import cloudscraper, re
from bs4 import BeautifulSoup

from urllib.parse import urlencode
from time import time


class Jable:
    def __init__(self, name):
        self.name = name
        self.search = 'https://jable.tv/search/{wd}/'
        self.base_url = 'https://jable.tv/search'
        self.m3u8 = 'https://jable.tv/videos/{uid}/'
        # 定义有效的 sort_by 选项，使用字典存储
        self.sort_by_options = {
            0: 'post_date_and_popularity',
            1: 'post_date',
            2: 'video_viewed',
            3: 'most_favourited',
            4: ''
        }
    def say_hello(self):
        print(f"Hello, my name is {self.name}")

    def construct_jable_url(self, base_url: str, search_query: str, sort_by_index: Optional[int] = 4,
                            from_param: str = '') -> str:
        timestamp = str(int(time()))

        # 如果 sort_by_index 不在有效的索引范围内，使用默认值 ('')
        sort_by = self.sort_by_options.get(sort_by_index, '')

        search_params = {
            'mode': 'async',
            'function': 'get_block',
            'block_id': 'list_videos_videos_list_search_result',
            'q': search_query,
            'sort_by': sort_by,
            'from': from_param,
            '_': timestamp,
        }

        # 构建完整的 URL
        url = f"{base_url}/{search_query}/?{urlencode(search_params)}"
        scraper = cloudscraper.create_scraper()
        resp = scraper.get(url)
        return self.parse(resp)

    # bs4解析
    def parse(self, response):
        soup = BeautifulSoup(response.text, 'lxml')
        lis = []
        for video in soup.find_all(class_='video-img-box'):
            # title
            title = video.find(class_='title').text
            # img+href
            pf = video.find(class_='img-box').find('a')
            img = pf.find('img').attrs['data-src']
            href = pf.attrs['href']
            # 时长
            duration = video.find(class_='label').text
            lis.append({
                'aid': href.split('/')[-2],
                'title': title,
                'img': img,
                'href': href,
                'proxy_img': 'https://api.buxiangyao.link/img?img=' + img,
                'duration': duration
            })
        # 总数
        count = soup.find(class_='title-box').find('span').text
        return {
            'count': count,
            'list': lis
        }

    # 获取m3u8
    def get_m3u8(self, uid):
        scraper = cloudscraper.create_scraper()
        resp = scraper.get(self.m3u8.format(uid=uid))
        m3u8 = re.findall("hlsUrl = '(.*?)'", resp.text)[0]
        return m3u8

    # 搜索
    def get_search(self, wd, typ, pg):
        data = self.construct_jable_url(self.base_url, wd, typ, pg)
        return data

if __name__ == '__main__':
    api = Jable("API")
    api.say_hello()
    url = api.construct_jable_url(api.base_url, '黑人', 1, 1)
    print(url)

# post_date_and_popularity  最近最佳
# post_date 最近更新
# video_viewed  最多观看
# most_favourited 最高收藏
# '' 最高相关
