#!/usr/bin/python3.10
# -------------------------------------------------
# -*- coding: utf-8 -*-
# @Time    : 2024/3/10 15:29
# @Author  : 章杰
# @Email   : zj@buxiangyao.link
# @File    : ss
# @Software: PyCharm
# @ Description：I'm in charge of my Code
# -------------------------------------------------
from requests import Timeout

str = """
 [
    {
      "key": "AList",
      "name": "PY版本AList",
      "type": 3,
      "api": "py_AList",
      "searchable": 1,
      "quickSearch": 1,
      "filterable": 1,
      "ext": "https://agit.ai/138001380000/MHQTV/raw/commit/3447d5d757a0328f9ab5e73e8a6ae0a2b41e4284/py/py_alistcr.py"
    },{
      "key": "哔哩",
      "name": "哔哩",
      "type": 3,
      "api": "csp_Bili",
      "searchable": 1,
      "ext": "https://ghproxy.com/https://raw.githubusercontent.com/FongMi/CatVodSpider/main/json/bili.json"
    },

    {"key":"csp_Upyunso"       ,"name":"🌤UP云搜","type":3,"api":"csp_Upyunso","searchable":1,"quickSearch":1,"filterable":0},
    {"key":"csp_Alist"         ,"name":"🗂Alist合集","type":3,"api":"csp_Alist","searchable":1,"quickSearch":0,"filterable":0,"ext":"http://9xi4o.tk/sub/Alist.json"},
    {
      "key": "泥巴",
      "name": "泥巴",
      "type": 3,
      "api": "csp_Nbys",
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "快播",
      "name": "快播",
      "type": 1,
      "api": "https://www.kuaibozy.com/api.php/provide/vod/",
      "searchable": 1,
      "filterable": 0,
      "categories": [
        "动漫",
        "国产剧",
        "日韩剧",
        "港台剧",
        "欧美剧",
        "泰剧",
        "动作片",
        "喜剧片",
        "爱情片",
        "科幻片",
        "恐怖片",
        "剧情片",
        "战争片",
        "纪录片",
        "综艺"
      ]
    },
    {
      "key": "百度",
      "name": "百度",
      "type": 1,
      "api": "https://api.apibdzy.com/api.php/provide/vod?ac=list",
      "searchable": 1,
      "filterable": 0,
      "categories": [
        "国产动漫",
        "日韩动漫",
        "大陆剧",
        "欧美剧",
        "韩剧",
        "日剧",
        "动作片",
        "喜剧片",
        "爱情片",
        "科幻片",
        "恐怖片",
        "剧情片",
        "战争片"
      ]
    },
    {
      "key": "櫻花",
      "name": "櫻花",
      "type": 3,
      "api": "csp_Ying",
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "巴士",
      "name": "巴士",
      "type": 3,
      "api": "csp_Dm84",
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "異界",
      "name": "異界",
      "type": 3,
      "api": "csp_Ysj",
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "紙條",
      "name": "紙條",
      "type": 3,
      "api": "csp_Paper",
      "searchable": 1,
      "ext": "3865f0ab8f124688ad786a262af9b940"
    },
    {
      "key": "易搜",
      "name": "易搜",
      "type": 3,
      "api": "csp_YiSo",
      "searchable": 1,
      "filterable": 0,
      "ext": "3865f0ab8f124688ad786a262af9b940"
    },
    {
      "key": "盤搜",
      "name": "盤搜",
      "type": 3,
      "api": "csp_PanSou",
      "searchable": 1,
      "filterable": 0,
      "ext": "3865f0ab8f124688ad786a262af9b940"
    },
    {
      "key": "18AV",
      "name": "18AV",
      "type": 3,
      "api": "csp_Eighteen",
      "searchable": 1,
      "filterable": 1
    }, {
      "key": "MissAV",
      "name": "MissAV",
      "type": 3,
      "api": "csp_Miss",
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "朱古力",
      "name": "朱古力",
      "type": 3,
      "api": "csp_Pig",
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "Jable",
      "name": "Jable",
      "type": 3,
      "api": "csp_Jable",
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "J91",
      "name": "J91",
      "type": 3,
      "api": "csp_J91",
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "Cg51",
      "name": "Cg51",
      "type": 3,
      "api": "csp_Cg51",
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "Supjav",
      "name": "Supjav",
      "type": 3,
      "api": "csp_Supjav",
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "Hanime",
      "name": "Hanime",
      "type": 3,
      "api": "csp_Hanime",
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "madouse.la",
      "name": "成人01",
      "type": 1,
      "api": "http://madouse.la/api.php/provide/vod/",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "51smt4.xyz",
      "name": "成人02",
      "type": 1,
      "api": "http://51smt4.xyz/api.php/provide/vod/",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "ggmmzy.com",
      "name": "成人03",
      "type": 0,
      "api": "http://www.ggmmzy.com:9999/inc/xml",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "bttcj.com",
      "name": "成人04",
      "type": 0,
      "api": "http://bttcj.com/inc/sapi.php",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "cjmygzy.com",
      "name": "成人05",
      "type": 0,
      "api": "http://cjmygzy.com/inc/sapi.php?ac=videolist",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "jcspcj8.com",
      "name": "成人06",
      "type": 0,
      "api": "http://jcspcj8.com/api?ac=videolist",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "wmcj8.com",
      "name": "成人07",
      "type": 0,
      "api": "http://wmcj8.com/inc/sapi.php",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "secj8.com",
      "name": "成人08",
      "type": 0,
      "api": "http://secj8.com/inc/sapi.php?ac=videolist",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "dadiapi.com",
      "name": "成人09",
      "type": 0,
      "api": "http://dadiapi.com/api.php",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "api.kudian70.com",
      "name": "成人10",
      "type": 1,
      "api": "http://api.kudian70.com/api.php/provide/vod/",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "apilj.com",
      "name": "成人11",
      "type": 1,
      "api": "http://apilj.com/api.php/provide/vod/at/json/",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "zmcj88.com",
      "name": "成人12",
      "type": 0,
      "api": "http://zmcj88.com/sapi?ac=videolist",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "api.putaozy.net",
      "name": "成人13",
      "type": 1,
      "api": "http://api.putaozy.net/inc/apijson_vod.php",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "mygzycj.com",
      "name": "成人14",
      "type": 0,
      "api": "http://mygzycj.com/api.php?ac=list",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "llzxcj.com",
      "name": "成人15",
      "type": 0,
      "api": "http://llzxcj.com/inc/sck.php?ac=videolist",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "99zywcj.com",
      "name": "成人16",
      "type": 0,
      "api": "http://99zywcj.com/inc/sapi.php?ac=videolist",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "jializyzapi.com",
      "name": "成人17",
      "type": 1,
      "api": "http://www.jializyzapi.com/api.php/provide/vod/",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "f2dcj6.com",
      "name": "成人18",
      "type": 0,
      "api": "http://f2dcj6.com/sapi?ac=videolist",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "91md.me",
      "name": "成人19",
      "type": 1,
      "api": "http://91md.me/api.php/provide/vod/",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "sdszyapi.com",
      "name": "成人20",
      "type": 0,
      "api": "http://sdszyapi.com/home/cjapi/asbb/mc10/vod/xml",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "010aizy.com",
      "name": "成人21",
      "type": 0,
      "api": "http://www.010aizy.com/API/macs.php",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "feifei67.com",
      "name": "成人22",
      "type": 1,
      "api": "http://www.feifei67.com/api.php/provide/vod/",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "api.kdapi.info",
      "name": "成人23",
      "type": 1,
      "api": "http://api.kdapi.info/api.php/provide/vod/",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "xjjzyapi.com",
      "name": "成人24",
      "type": 0,
      "api": "http://xjjzyapi.com/home/cjapi/askl/mc10/vod/xml",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "99zy.pw",
      "name": "成人25",
      "type": 1,
      "api": "http://99zy.pw/api.php/provide/vod/",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "caiji25.com",
      "name": "成人26",
      "type": 0,
      "api": "http://www.caiji25.com/home/cjapi/p0as/mc10/vod/xml",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "caiji21.com",
      "name": "成人27",
      "type": 0,
      "api": "http://www.caiji21.com/home/cjapi/klkl/mc10/vod/xml",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "caiji26.com",
      "name": "成人28",
      "type": 0,
      "api": "http://caiji26.com/home/cjapi/p0g8/mc10/vod/xml",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "caiji24.com",
      "name": "成人29",
      "type": 0,
      "api": "http://www.caiji24.com/home/cjapi/p0d2/mc10/vod/xml",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "api.11bat.com",
      "name": "成人30",
      "type": 0,
      "api": "http://api.11bat.com/api.php/provide/vod/at/xml",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "leyuzyapi.com",
      "name": "成人31",
      "type": 1,
      "api": "https://www.leyuzyapi.com/inc/apijson_vod.php",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "api.maozyapi.com",
      "name": "成人32",
      "type": 1,
      "api": "https://api.maozyapi.com/inc/apijson_vod.php",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "888dav.com",
      "name": "成人33",
      "type": 1,
      "api": "https://www.888dav.com/api.php/provide/vod/",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "987caiji.com",
      "name": "成人34",
      "type": 0,
      "api": "http://www.987caiji.com/api/max.php",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "mgzyz1.com",
      "name": "成人35",
      "type": 1,
      "api": "https://mgzyz1.com/api.php/provide/vod/",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "gdlsp.com",
      "name": "成人36",
      "type": 0,
      "api": "https://www.gdlsp.com/api/xml.php",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "mgav1.cc",
      "name": "成人37",
      "type": 0,
      "api": "https://www.mgav1.cc/api.php/provide/vod/at/xml",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "api.ykapi.net",
      "name": "成人38",
      "type": 1,
      "api": "https://api.ykapi.net/api.php/provide/vod/",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "caiji07.com",
      "name": "成人39",
      "type": 0,
      "api": "https://www.caiji07.com/home/cjapi/cfcf/mc10/vod/xml",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "shayuapi.com",
      "name": "成人40",
      "type": 1,
      "api": "https://shayuapi.com/api.php/provide/vod/",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "caiji02.com",
      "name": "成人41",
      "type": 0,
      "api": "https://www.caiji02.com/home/cjapi/cfas/mc10/vod/xml",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "caiji.huakuiapi.com",
      "name": "成人42",
      "type": 1,
      "api": "https://caiji.huakuiapi.com/inc/apijson_vod.php",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "caiji01.com",
      "name": "成人43",
      "type": 0,
      "api": "https://www.caiji01.com/home/cjapi/cfd2/mc10/vod/xml",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "kxgav.com",
      "name": "成人44",
      "type": 0,
      "api": "https://www.kxgav.com/api/xml.php",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "caiji08.com",
      "name": "成人45",
      "type": 0,
      "api": "https://www.caiji08.com/home/cjapi/cfkl/mc10/vod/xml",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "msnii.com",
      "name": "成人46",
      "type": 0,
      "api": "https://www.msnii.com/api/xml.php",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "apittzy.com",
      "name": "成人47",
      "type": 1,
      "api": "https://apittzy.com/api.php/provide/vod/",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "caiji09.com",
      "name": "成人48",
      "type": 0,
      "api": "https://www.caiji09.com/home/cjapi/cfp0/mc10/vod/xml",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "dmmapi.com",
      "name": "成人49",
      "type": 0,
      "api": "https://www.dmmapi.com/home/cjapi/asd2c7/mc10/vod/xml",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "lbapi9.com",
      "name": "成人50",
      "type": 1,
      "api": "https://lbapi9.com/api.php/provide/vod/",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "kkzy.me",
      "name": "成人51",
      "type": 1,
      "api": "https://kkzy.me/api.php/provide/vod/",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "caiji.caomeiapi.com",
      "name": "成人52",
      "type": 1,
      "api": "https://caiji.caomeiapi.com/inc/apijson_vod.php",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "caiji.naichaapi.com",
      "name": "成人53",
      "type": 1,
      "api": "https://caiji.naichaapi.com/inc/apijson_vod.php",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "caiji05.com",
      "name": "成人54",
      "type": 0,
      "api": "https://www.caiji05.com/home/cjapi/cfda/mc10/vod/xml",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "siwazyw.cc",
      "name": "成人55",
      "type": 1,
      "api": "https://siwazyw.cc/api.php/provide/vod/",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "caiji10.com",
      "name": "成人56",
      "type": 0,
      "api": "https://www.caiji10.com/home/cjapi/cfs6/mc10/vod/xml",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "caiji03.com",
      "name": "成人57",
      "type": 0,
      "api": "https://www.caiji03.com/home/cjapi/cfg8/mc10/vod/xml",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "kudouzy.com",
      "name": "成人58",
      "type": 1,
      "api": "https://kudouzy.com/api.php/provide/vod/",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "xx55zyapi.com",
      "name": "成人59",
      "type": 0,
      "api": "https://xx55zyapi.com/home/cjapi/ascf/mc10/vod/xml",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "caiji.523zyw.com",
      "name": "成人60",
      "type": 1,
      "api": "https://caiji.523zyw.com/inc/apijson_vod.php",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "caiji04.com",
      "name": "成人61",
      "type": 0,
      "api": "https://www.caiji04.com/home/cjapi/cfc7/mc10/vod/xml",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "52zyapi.com",
      "name": "成人62",
      "type": 0,
      "api": "https://52zyapi.com/home/cjapi/asda/mc10/vod/xml",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "caiji22.com",
      "name": "成人63",
      "type": 0,
      "api": "https://www.caiji22.com/home/cjapi/klp0/mc10/vod/xml",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "afasu.com",
      "name": "成人64",
      "type": 0,
      "api": "https://www.afasu.com/api/xml.php",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "api.xiuseapi.com",
      "name": "成人65",
      "type": 1,
      "api": "https://api.xiuseapi.com/api.php/provide/vod/",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "xrbsp.com",
      "name": "成人66",
      "type": 0,
      "api": "https://www.xrbsp.com/api/xml.php",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "caiji23.com",
      "name": "成人67",
      "type": 0,
      "api": "https://www.caiji23.com/home/cjapi/kls6/mc10/vod/xml",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "jgczyapi.com",
      "name": "成人68",
      "type": 0,
      "api": "https://jgczyapi.com/home/cjapi/kld2/mc10/vod/xml",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "api.yinwoapi.com",
      "name": "成人69",
      "type": 1,
      "api": "https://api.yinwoapi.com/api.php/provide/vod/",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "sewozyapi.com",
      "name": "成人70",
      "type": 1,
      "api": "https://sewozyapi.com/api.php/provide/vod/",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "api.apilyzy.com",
      "name": "成人71",
      "type": 1,
      "api": "https://api.apilyzy.com/api.php/provide/vod/",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "cj.apiabzy.com",
      "name": "成人72",
      "type": 1,
      "api": "http://cj.apiabzy.com/api.php/provide/vod/",
      "quickSearch": 1,
      "searchable": 1,
      "filterable": 1
    },
    {
      "key": "push_agent",
      "name": "推送",
      "type": 3,
      "api": "csp_Push",
      "searchable": 1,
      "quickSearch": 1,
      "filterable": 1,
      "ext": "3865f0ab8f124688ad786a262af9b940"
    }
  ]"""

import json
import requests

data = json.loads(str)
listData = []
for item in data:
    api = item['api']
    if 'http' in api:
        print(api)
        try:
            # 设置超时时间为 3 秒
            response = requests.get(api, timeout=3)
            code = response.status_code
            if code == 200:
                print(item)
                listData.append(item)
        except (Timeout, ConnectionError):
            # 处理超时或连接错误
            pass
        except requests.exceptions.HTTPError as errh:
            # 处理 HTTP 错误
            print ("HTTP Error:",errh)
        except requests.exceptions.ConnectionError as errc:
            # 处理连接错误
            print ("Error Connecting:",errc)
        except requests.exceptions.Timeout as errt:
            # 处理超时错误
            print ("Timeout Error:",errt)
        except requests.exceptions.RequestException as err:
            # 处理其他错误
            print ("Something went wrong",err)

print(listData)
print()