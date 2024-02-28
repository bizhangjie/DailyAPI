const Router = require("koa-router");
const aiqiyiRouter = new Router();
const axios = require("axios");
const {get, set, del} = require("../../utils/cacheData");
const response = require('../../utils/response')
const cheerio = require('cheerio');
const {getParams} = require('../../utils/aiqiyijm');
const querystring = require('querystring');

const Host = "https://www.iqiyi.com/v_ckwrt4wwyc.html";
// 接口信息
const routerInfo = {
    name: "aiqiyi", title: "爱曲艺影视", subtitle: "每日榜", category: ""
};

// 缓存键名
const cacheKey = "aiqiyiData";

// 调用时间
let updateTime = new Date().toISOString();

// 永久导航页（需翻墙）
const cgHost = "https://www.aiqiyi.tv";

const host = "https://www.aiqiyi.tv";

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
aiqiyiRouter.get("/aiqiyi/", async (ctx) => {
    const {url} = ctx.query;
    console.log(`请求地址 => ${url}`)
    const res = await axios.get(url)
    try {
        const data = res.data;
        const y = data.match(/"tvid":(\d+),/)[1];
        console.log("y => " + y);

        // Assuming `getParam` returns the value for 'k'
        const k = getParams(y);
        console.log("k => " + JSON.stringify(k));
        // Stringify the JSON object and append it to the URL
        const queryString = querystring.stringify(k);
        // Make another Axios GET request with 'k' as a parameter
        const result = await axios.get(`https://mesh.if.iqiyi.com/tvg/pcw/base_info?${queryString}`)
        response(ctx, 200, result.data, '成功')
    } catch (err) {
        response(ctx, 606, '', '此类数据有毒，但是很好看！');
    }
});

// 爱曲艺影视搜索
aiqiyiRouter.get("/aiqiyi/:wd/:page", async (ctx) => {
    const {wd, page} = ctx.params;
    const url = `https://so.iqiyi.com/so/q_${wd}`;
    console.log(`获取爱曲艺影视 ${url}`);
    try {
        // 从缓存中获取数据
        let data = await get(cacheKey);
        const from = data ? "cache" : "server";
        if (!data) {
            // 如果缓存中不存在数据
            console.log("从服务端重新获取爱曲艺影视");
            // 从服务器拉取数据
            const response = await axios.get(url);
            const htmlString = response.data;
            const $ = cheerio.load(htmlString);
            // console.log(data)

            let ListVideo = []
            $('.qy-search-result-item').each((index, element) => {
                // title
                const title = $(element).find('.orange').text()
                // img
                const img = 'https:' + $(element).find('img').attr('src')
                // url
                const url = 'https:' + $(element).find('.result-right').find('a').attr('href')
                // type
                const type = $(element).find('.item-type').text()
                // count
                const count = $(element).find('.qy-mod-label').text()
                // 打印
                // console.log(title, img, count)
                // 清除无效数据
                if (title != '' && img != '' && type != '') {
                    ListVideo.push({title, img, url, type, count})
                }
            })
            data = ListVideo;
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

// 爱曲艺影视 ==> 分类
// aiqiyiRouter.get("/aiqiyi/:param1/:param2", async (ctx) => {
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
//   console.log("获取爱曲艺影视");
//   try {
//     // 从缓存中获取数据
//     let data = await get(cacheKey);
//     const from = data ? "cache" : "server";
//     if (!data) {
//       // 如果缓存中不存在数据
//       console.log("从服务端重新获取爱曲艺影视");
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

// 爱曲艺影视 - 获取最新数据
// aiqiyiRouter.get("/aiqiyi/new", async (ctx) => {
//   console.log("获取爱曲艺影视 - 最新数据");
//   try {
//     // 从服务器拉取最新数据
//     const response = await axios.get(cgHost);
//     const newData = getData(response.data);
//     updateTime = new Date().toISOString();
//     console.log("从服务端重新获取爱曲艺影视");
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


aiqiyiRouter.info = routerInfo;
module.exports = aiqiyiRouter;
