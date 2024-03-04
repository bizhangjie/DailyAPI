#!/usr/bin/python3.10
# -------------------------------------------------
# -*- coding: utf-8 -*-
# @Time    : 2024/3/3 23:49
# @Author  : 章杰
# @Email   : zj@buxiangyao.link
# @File    : list
# @Software: PyCharm
# @ Description：I'm in charge of my Code
# -------------------------------------------------
import requests


headers = {
    "authority": "www.douyin.com",
    "pragma": "no-cache",
    "cache-control": "no-cache",
    "sec-ch-ua": "^\\^",
    "accept": "application/json, text/plain, */*",
    "sec-ch-ua-mobile": "?0",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.139 Safari/537.36",
    "sec-ch-ua-platform": "^\\^Windows^^",
    "sec-fetch-site": "same-origin",
    "sec-fetch-mode": "cors",
    "sec-fetch-dest": "empty",
    "referer": "https://www.douyin.com/follow",
    "accept-language": "zh-CN,zh;q=0.9"
}
cookies = {
    "ttwid": "1^%^7CX7cEWcU_SpoFb_0qNU0bEfR5sEGhfBrl5kWyHdBpk4M^%^7C1696666287^%^7Cea05df5d60deec986733e653c2862e91f4f991dbc52170de471e6e3d2f0a314a",
    "bd_ticket_guard_client_web_domain": "2",
    "xgplayer_user_id": "106617885529",
    "n_mh": "OEC_b8locIDS9Jhl8Fog0kY8TttLgN0c6UQLibKX2f0",
    "sso_uid_tt": "f144ffa9a432e48a8c6d67c5ffaa9367",
    "sso_uid_tt_ss": "f144ffa9a432e48a8c6d67c5ffaa9367",
    "toutiao_sso_user": "356d3c1f5d6cc8cc2ad754cfe2555717",
    "toutiao_sso_user_ss": "356d3c1f5d6cc8cc2ad754cfe2555717",
    "passport_assist_user": "CjzuGg0RGxc5TNrvTu107k5vmDaexTaTjyZL2WRAGMKbSh-7q85VjqwRC964YFC4bheqUgu9nzEHnAK0iqEaSgo8c7IeME6cDbXWdWHZPEZM_LEcziTKrx9hW2iJl1-0QuMTdQNbiMLlIPB4zXnVVb9XSgjbWd0SKA2s0Tu7ENr6wg0Yia_WVCABIgED1xOVSw^%^3D^%^3D",
    "uid_tt": "cd8b9a2b08cd957066a2f8dbbe31312a",
    "uid_tt_ss": "cd8b9a2b08cd957066a2f8dbbe31312a",
    "sid_tt": "9f4488aedff63d8cf3e4e21a7bae79ab",
    "sessionid": "9f4488aedff63d8cf3e4e21a7bae79ab",
    "sessionid_ss": "9f4488aedff63d8cf3e4e21a7bae79ab",
    "LOGIN_STATUS": "1",
    "store-region": "cn-ah",
    "store-region-src": "uid",
    "d_ticket": "d9ede26984a4d73303fb8e3a8602a77ea34c2",
    "my_rd": "2",
    "live_use_vvc": "^%^22false^%^22",
    "SEARCH_RESULT_LIST_TYPE": "^%^22single^%^22",
    "publish_badge_show_info": "^%^220^%^2C0^%^2C0^%^2C1709035292858^%^22",
    "sid_ucp_sso_v1": "1.0.0-KGU3MDUyYTAyOWI5N2EwYjUxYTVkM2IwMzJkYzg2NjdhYzQ4ZmI3OWYKHAiwpYigXhCxnveuBhjvMSAOMLOiwL0FOAZA9AcaAmhsIiAzNTZkM2MxZjVkNmNjOGNjMmFkNzU0Y2ZlMjU1NTcxNw",
    "ssid_ucp_sso_v1": "1.0.0-KGU3MDUyYTAyOWI5N2EwYjUxYTVkM2IwMzJkYzg2NjdhYzQ4ZmI3OWYKHAiwpYigXhCxnveuBhjvMSAOMLOiwL0FOAZA9AcaAmhsIiAzNTZkM2MxZjVkNmNjOGNjMmFkNzU0Y2ZlMjU1NTcxNw",
    "sid_guard": "9f4488aedff63d8cf3e4e21a7bae79ab^%^7C1709035315^%^7C5184000^%^7CSat^%^2C+27-Apr-2024+12^%^3A01^%^3A55+GMT",
    "sid_ucp_v1": "1.0.0-KGJmOGUzNzgzZTMzZWJlOTNmNWMwYWVlMmE4NDFkNjU4ZTY2Njc5NjgKGAiwpYigXhCznveuBhjvMSAOOAZA9AdIBBoCbGYiIDlmNDQ4OGFlZGZmNjNkOGNmM2U0ZTIxYTdiYWU3OWFi",
    "ssid_ucp_v1": "1.0.0-KGJmOGUzNzgzZTMzZWJlOTNmNWMwYWVlMmE4NDFkNjU4ZTY2Njc5NjgKGAiwpYigXhCznveuBhjvMSAOOAZA9AdIBBoCbGYiIDlmNDQ4OGFlZGZmNjNkOGNmM2U0ZTIxYTdiYWU3OWFi",
    "dy_sheight": "864",
    "dy_swidth": "1536",
    "passport_csrf_token": "3a66535bc96168c3b09c204d7d6e7a0c",
    "passport_csrf_token_default": "3a66535bc96168c3b09c204d7d6e7a0c",
    "download_guide": "^%^223^%^2F20240227^%^2F0^%^22",
    "pwa2": "^%^220^%^7C0^%^7C3^%^7C0^%^22",
    "FRIEND_NUMBER_RED_POINT_INFO": "^%^22MS4wLjABAAAA4SsvACR50nyMXj5oEwqWBg_UK7ptCxwlMk4yL1bVTbM^%^2F1709395200000^%^2F1709354991004^%^2F0^%^2F0^%^22",
    "_bd_ticket_crypt_cookie": "ec5ee29f8882d4e0a9148403bd33959b",
    "FOLLOW_NUMBER_YELLOW_POINT_INFO": "^%^22MS4wLjABAAAA4SsvACR50nyMXj5oEwqWBg_UK7ptCxwlMk4yL1bVTbM^%^2F1709395200000^%^2F1709355042367^%^2F1709354991463^%^2F0^%^22",
    "__live_version__": "^%^221.1.1.8422^%^22",
    "strategyABtestKey": "^%^221709474560.18^%^22",
    "csrf_session_id": "f635843235c2d88a728449e3e84a45e0",
    "douyin.com": "",
    "device_web_cpu_core": "12",
    "device_web_memory_size": "8",
    "architecture": "amd64",
    "webcast_leading_last_show_time": "1709475203673",
    "webcast_leading_total_show_times": "1",
    "volume_info": "^%^7B^%^22isUserMute^%^22^%^3Afalse^%^2C^%^22isMute^%^22^%^3Atrue^%^2C^%^22volume^%^22^%^3A0.209^%^7D",
    "webcast_local_quality": "origin",
    "xg_device_score": "6.955146064883371",
    "__ac_nonce": "065e497ca008093d71c05",
    "__ac_signature": "_02B4Z6wo00f01dst36wAAIDBWy8l7Pp09QnbDdsAABMxwTxml8fyO6QE1zYRRStTc5ujpxlkjLTM3ahfNp2FNBzGLPVmbEyGd1mXnzSHATovM0p-hTBV7CBSpyfyTBgBBzF3hzA9QOkPZ61aa7",
    "FOLLOW_LIVE_POINT_INFO": "^%^22MS4wLjABAAAA4SsvACR50nyMXj5oEwqWBg_UK7ptCxwlMk4yL1bVTbM^%^2F1709481600000^%^2F1709474610610^%^2F0^%^2F1709480488854^%^22",
    "tt_scid": "EgzcePLAIwfU-xbmA75RJ3JhVpEpo2IDjoc4cbCCHIPGoL-D8Rgf3Ced-rbm8UdHac9a",
    "home_can_add_dy_2_desktop": "^%^220^%^22",
    "bd_ticket_guard_client_data": "eyJiZC10aWNrZXQtZ3VhcmQtdmVyc2lvbiI6MiwiYmQtdGlja2V0LWd1YXJkLWl0ZXJhdGlvbi12ZXJzaW9uIjoxLCJiZC10aWNrZXQtZ3VhcmQtcmVlLXB1YmxpYy1rZXkiOiJCQklSK010dm5QOHlEWTlVbHM4TzR2QVVFSmhUd2pRK2t4NXNNek5ad2EyM2lxMzJkK0RjVW9KN1FvYnBydnA4eHY1aGtGL1ZVRmRWQ3VMd0xORklLcDA9IiwiYmQtdGlja2V0LWd1YXJkLXdlYi12ZXJzaW9uIjoxfQ^%^3D^%^3D",
    "msToken": "hqHuakzzEH3MjrSmZf92R292nWWi4M-F_b3FWjxErZNr5ZYq_BM4dEd96E0c-dXDpNgjizUVKWWpSCJjczXzILa77Sf54h-5pm-XL_eRVDZZOectYo6S0cq24EON",
    "odin_tt": "a1f1713a410f2877561ebc442592fb22e5278878afb223da8d0f5366f3acc4c050c61004c82cecc4abbd7fd33b3b37d5",
    "live_can_add_dy_2_desktop": "^%^221^%^22",
    "passport_fe_beating_status": "false",
    "IsDouyinActive": "true",
    "stream_recommend_feed_params": "^%^22^%^7B^%^5C^%^22cookie_enabled^%^5C^%^22^%^3Atrue^%^2C^%^5C^%^22screen_width^%^5C^%^22^%^3A1536^%^2C^%^5C^%^22screen_height^%^5C^%^22^%^3A864^%^2C^%^5C^%^22browser_online^%^5C^%^22^%^3Atrue^%^2C^%^5C^%^22cpu_core_num^%^5C^%^22^%^3A12^%^2C^%^5C^%^22device_memory^%^5C^%^22^%^3A8^%^2C^%^5C^%^22downlink^%^5C^%^22^%^3A1.25^%^2C^%^5C^%^22effective_type^%^5C^%^22^%^3A^%^5C^%^223g^%^5C^%^22^%^2C^%^5C^%^22round_trip_time^%^5C^%^22^%^3A450^%^7D^%^22"
}
url = "https://www.douyin.com/webcast/web/feed/follow/"
params = {
    "device_platform": "webapp",
    "aid": "6383",
    "channel": "channel_pc_web",
    "scene": "aweme_pc_follow_top",
    "pc_client_type": "1",
    "version_code": "170400",
    "version_name": "17.4.0",
    "cookie_enabled": "true",
    "screen_width": "1536",
    "screen_height": "864",
    "browser_language": "zh-CN",
    "browser_platform": "Win32",
    "browser_name": "Chrome",
    "browser_version": "98.0.4758.139",
    "browser_online": "true",
    "engine_name": "Blink",
    "engine_version": "98.0.4758.139",
    "os_name": "Windows",
    "os_version": "10",
    "cpu_core_num": "12",
    "device_memory": "8",
    "platform": "PC",
    "downlink": "1.25",
    "effective_type": "3g",
    "round_trip_time": "450",
    "webid": "7287126164497139200",
    "msToken": "qj6GodBzybs7zNbpwlhdA6IZyMaNNgWi8WgaJDwGUweWTCmfl4tEvq2zgjEdJtDzw3MK4XDFYsE0iVOvQy_m6rKJPXk-yNS7uoWYXH9qLGdfN3H8MHF286gxV8f7",
    "X-Bogus": "DFSzswVY5XiANjSZtbkASe9WX7jo"
}
response = requests.get(url, headers=headers, cookies=cookies, params=params)

import json

data = json.loads(response.text)
listData = []
for item in data['data']['data']:
    rid = item['web_rid']
    room = item['room']
    title = room['title']
    owner = room['owner']
    avatar_thumb = owner['avatar_thumb']['url_list']
    nickname = owner['nickname']
    stream_url = room['stream_url']['flv_pull_url']['FULL_HD1']
    listData.append({
        'rid': rid,
        'title': title.replace('#',''),
        'avatar_thumb': avatar_thumb,
        'nickname': nickname,
        'stream_url': stream_url
    })

# print(listData)

# 保存数据到txt
with open('douyin0.txt', 'w', encoding='utf-8') as f:
    f.write("💘斗音,#genre#\n")
    for item in listData:
        f.write(f"{item['title']},https://api.buxiangyao.link/douyin/{item['rid']}\n")
print("保存成功")