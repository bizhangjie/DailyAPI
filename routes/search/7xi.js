const Router = require("koa-router");
const xi7Router = new Router();
const axios = require("axios");
const { get, set, del } = require("../../utils/cacheData");
const response = require('../../utils/response')
const cheerio = require('cheerio');

// 接口信息
const routerInfo = {
  name: "xi7", title: "7喜影视", subtitle: "每日榜", category: ""
};

// 缓存键名
const cacheKey = "xi7Data";

// 调用时间
let updateTime = new Date().toISOString();

// 永久导航页（需翻墙）
const cgHost = "https://www.7xi.tv";

const host = "https://www.7xi.tv";
const cookieValue = '__dtsu=6D0016967731175432674C46A88857F5; HstCfa4680397=1699855940625; HstCmu4680397=1699855940625; HstCns4680397=6; HstCnv4680397=3; HstCla4680397=1700138361419; HstPn4680397=2; HstPt4680397=12; bt_route=02352491eaf36828b850d3b53d964fdc; ecPopup=1; PHPSESSID=hfmmn1p95vdu87lh1dcd1c55l1; DS_Records=%7Blog%3A%5B%7B%22name%22%3A%22%E7%A9%BA%E5%A7%90%22%2C%22url%22%3A%22%2Fvodsearch.html%22%7D%5D%7D; user_id=24682; user_name=ceji123456; group_id=3; group_name=VIP%E4%BC%9A%E5%91%98; user_check=2734a2688d229d2d8768b715cc79669b; user_portrait=%2Fstatic%2Fimages%2Ftouxiang.png'
const config = {
  headers: {
    Cookie: `${cookieValue}`
  }
};

// 数据处理
const getData = (data) => {
  if (!data) return [];
  const dataList = [];
  try {
    const $ = cheerio.load(data);
    // 总页
    const regex = /html\('(\d+)'\)/;
    const match = data.match(regex);
    var count = 0;
    if (match) {
      count = match[1];
    } else {
      count = "可能数据太大了吧";
    }
    console.log('总页：' + count)
    $('.search-box').each((index, element) => {
      // 标题
      const videoText = $(element).find('.thumb-txt').text().trim();
      // 链接
      const videoHref = cgHost + $(element).find('.thumb-txt').find('a').attr('href');
      // 背景图
      const img = $(element).find('img').attr('data-src');
      // 年份
      const date = $(element).find('.thumb-else').text().trim();
      // 主演
      const actor = $(element).find('.thumb-actor').text().replace('主演：', '').trim();
      // 导演
      const director = $(element).find('.thumb-director').text().replace('导演：', '');
      // 详情
      const desc = $(element).find('.thumb-blurb').text();
      // console.log(`video ${index + 1}: Text: ${videoText}, Href:${videoHref}`);
      // console.log('背景图：' + img)
      // console.log('年份：' + date)
      // console.log('主演：' + actor)
      // console.log('导演：' + director)
      // console.log("============================")

      if (videoText != '') {
        dataList.push({
          title: videoText,
          desc: desc,
          pic: img,
          date: date,
          actor: actor,
          director: director,
          url: videoHref,
          mobileUrl: img,
        });
      }
    });

    return dataList;
  } catch (error) {
    console.error("数据处理出错" + error);
    return false;
  }
};

// 播放地址
xi7Router.get("/7xi/watch", async (ctx) => {
  const { url } = ctx.query;
  console.log(`请求地址 => ${url}`)
  const res = await axios.get(url, config)
  try {
    var m3u8 = '';
    var FosiPlayer = '';
    try {
      // 自建播放源
      const keyss = res.data.match(/},"url":"(.+?)","url_next"/)[1]
      console.log("加密：" + keyss)
      FosiPlayer = `https://www.7xi.tv/FosiPlayer/?url=${keyss}&next=//www.7xi.tv`
    } catch (error) {
      // 第三方播放源
      m3u8 = res.data.match(/"url":"http(.+?).m3u8"/);
    } finally {
      var yuanURL = m3u8;
      if (yuanURL != '') {
        yuanURL = `http${m3u8[1].replace(/\\\/|\/\\/g, "/")}.m3u8`;
      } else {
        yuanURL = FosiPlayer;
      }
    }
    const $ = cheerio.load(res.data);
    const count = $('.badge').text();
    console.log('计数：' + count)
    console.log('m3u8=>' + yuanURL)
    const data = {
      type: "hls",
      m3u8: yuanURL,
      count: count,
      // watchUrlTitle: watchUrlTitle
    }
    response(ctx, 200, data, '成功')
  } catch (err) {
    response(ctx, 606, '', '此类数据有毒，但是很好看！');
  }
});

// 7喜影视搜索
xi7Router.get("/7xi/:wd/:page", async (ctx) => {
  const { wd, page } = ctx.params;
  const url = `${host}/vodsearch/page/${page}/wd/${wd}.html`;
  console.log(`获取7喜影视 ${url}`);
  try {
    // 从缓存中获取数据
    let data = await get(cacheKey);
    const from = data ? "cache" : "server";
    if (!data) {
      // 如果缓存中不存在数据
      console.log("从服务端重新获取7喜影视");
      // 从服务器拉取数据
      const response = await axios.get(url);
      data = getData(response.data);
      updateTime = new Date().toISOString();
      if (!data) {
        ctx.body = {
          code: 500,
          ...routerInfo,
          message: "获取失败",
        };
        return false;
      }
      // 将数据写入缓存
      await set(cacheKey, data);
    }
    ctx.body = {
      code: 200,
      message: "获取成功",
      ...routerInfo,
      from,
      total: data.length,
      updateTime,
      data,
    };
  } catch (error) {
    console.error(error);
    ctx.body = {
      code: 500,
      message: "获取失败",
    };
  }
});

// 7喜影视 ==> 分类
// xi7Router.get("/xi7/:param1/:param2", async (ctx) => {
//   const param1 = ctx.params.param1; // 获取param1的值
//   const param2 = ctx.params.param2; // 获取param2的值
//   console.log(`请求参数=> ${param1} ${param2}`)
//   var url = cgHost;
//   if (param1 != '') {
//     // eslint-disable-next-line no-const-assign
//     url = url + '/category/' + param1.toString();
//   }
//   if (param2 != '') {
//     // eslint-disable-next-line no-const-assign
//     url = url + '/' + param2.toString();
//   }
//   console.log("获取7喜影视");
//   try {
//     // 从缓存中获取数据
//     let data = await get(cacheKey);
//     const from = data ? "cache" : "server";
//     if (!data) {
//       // 如果缓存中不存在数据
//       console.log("从服务端重新获取7喜影视");
//       // 从服务器拉取数据
//       const response = await axios.get(url);
//       data = getData(response.data, getIpHost(ctx));
//       updateTime = new Date().toISOString();
//       if (!data) {
//         ctx.body = {
//           code: 500,
//           ...routerInfo,
//           message: "获取失败",
//         };
//         return false;
//       }
//       // 将数据写入缓存
//       await set(cacheKey, data);
//     }
//     ctx.body = {
//       code: 200,
//       message: "获取成功",
//       ...routerInfo,
//       from,
//       total: data.length,
//       updateTime,
//       data,
//     };
//   } catch (error) {
//     console.error(error);
//     ctx.body = {
//       code: 500,
//       message: "获取失败",
//     };
//   }
// });

// 7喜影视 - 获取最新数据
// xi7Router.get("/7xi/new", async (ctx) => {
//   console.log("获取7喜影视 - 最新数据");
//   try {
//     // 从服务器拉取最新数据
//     const response = await axios.get(cgHost);
//     const newData = getData(response.data);
//     updateTime = new Date().toISOString();
//     console.log("从服务端重新获取7喜影视");
//
//     // 返回最新数据
//     ctx.body = {
//       code: 200,
//       message: "获取成功",
//       ...routerInfo,
//       total: newData.length,
//       updateTime,
//       data: newData,
//     };
//
//     // 删除旧数据
//     await del(cacheKey);
//     // 将最新数据写入缓存
//     await set(cacheKey, newData);
//   } catch (error) {
//     // 如果拉取最新数据失败，尝试从缓存中获取数据
//     console.error(error);
//     const cachedData = await get(cacheKey);
//     if (cachedData) {
//       ctx.body = {
//         code: 200,
//         message: "获取成功",
//         ...routerInfo,
//         total: cachedData.length,
//         updateTime,
//         data: cachedData,
//       };
//     } else {
//       // 如果缓存中也没有数据，则返回错误信息
//       ctx.body = {
//         code: 500,
//         ...routerInfo,
//         message: "获取失败",
//       };
//     }
//   }
// });


xi7Router.info = routerInfo;
module.exports = xi7Router;
