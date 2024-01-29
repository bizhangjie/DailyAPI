# DailyAPI
DailyAPI 是一个基于 Node.js 的项目，旨在提供各种日常生活相关的 API 接口。它可以用于构建日历应用、天气应用、健康管理应用等等。DailyApi 提供了多个功能模块，包括天气查询、健康指标计算、随机名言获取等，以帮助开发者快速构建日常生活类应用。

## 示例

> 示例站点

- [今日热榜 - https://rs.buxiangyao.link/](https://rs.buxiangyao.link/)

## 总览

> 🟢 状态正常
> 🟠 可能失效
> ❌ 无法使用

| **站点**     | **类别** | **调用名称**          | **状态** |
| ------------ | -------- | --------------------- | -------- |
| 哔哩哔哩     | 热门榜   | bilibili              | 🟢       |
| 微博         | 热搜榜   | weibo                 | 🟢       |
| 知乎         | 热榜     | zhihu                 | 🟢       |
| 百度         | 热搜榜   | baidu                 | 🟢       |
| 抖音         | 热点榜   | douyin / douyin_new   | 🟢       |
| 抖音         | 热歌榜   | douyin_music          | 🟢       |
| 豆瓣         | 新片榜   | douban_new            | 🟢       |
| 豆瓣讨论小组 | 讨论精选 | douban_group          | 🟢       |
| 百度贴吧     | 热议榜   | tieba                 | 🟢       |
| 少数派       | 热榜     | sspai                 | 🟢       |
| IT 之家      | 热榜     | ithome                | 🟠       |
| 澎湃新闻     | 热榜     | thepaper              | 🟢       |
| 今日头条     | 热榜     | toutiao               | 🟢       |
| 36 氪        | 热榜     | 36kr                  | 🟢       |
| 稀土掘金     | 热榜     | juejin                | 🟢       |
| 腾讯新闻     | 热点榜   | newsqq                | 🟢       |
| 网易新闻     | 热点榜   | netease               | 🟢       |
| 英雄联盟     | 更新公告 | lol                   | 🟢       |
| 原神         | 最新消息 | genshin               | 🟢       |
| 微信读书     | 飙升榜   | weread                | 🟢       |
| 快手         | 热榜     | kuaishou              | 🟢       |
| 网易云音乐   | 排行榜   | netease_music_toplist | 🟢       |
| QQ音乐       | 排行榜   | qq_music_toplist      | 🟢       |
| NGA          | 热帖     | ngabbs                | 🟢       |
| Github       | Trending | github                | 🟢       |
| V2EX         | 热榜     | v2ex                  | 🟠       |
| 历史上的今天 | 指定日期 | calendar              | 🟢       |


### 只需一键安装，目前支持linux系统

> 一键脚本（Alpine Linux）🟢
```shell
bash <(wget -qO- https://raw.githubusercontent.com/bizhangjie/DailyAPI/main/shell/hot_plus.sh)
```

> 其他版本 🟢
```shell
bash <(wget -qO- https://raw.githubusercontent.com/bizhangjie/DailyAPI/main/shell/hotapi_yijian.sh)
```

## 部署

```bash
# 安装依赖
npm install

# 运行
npm start
```
