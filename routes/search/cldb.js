const Router = require("koa-router");
const CLDBRouter = new Router();
const axios = require("axios");
const {get, set, del} = require("../../utils/cacheData");
const response = require('../../utils/response')
const cheerio = require('cheerio');

// 接口信息
const routerInfo = {
    name: "草榴社区", title: "草榴社区影视", subtitle: "每日榜", category: ""
};

// 缓存键名
const cacheKey = "gdianData";

// 调用时间
let updateTime = new Date().toISOString();

// 永久导航页（需翻墙）
const Host = "https://cldb15.top";

// 数据处理
const getData = (data) => {
    if (!data) return [];
    try {
        var listData = [];
        const htmlString = data;
        const $ = cheerio.load(htmlString);
        $('.frame-block').each((index, element) => {
            // 标题
            const articleText = $(element).find('.title').text();
            // 图片地址
            const articleImg = $(element).find('.thumb').find('img').attr('data-src');
            // 下载链接
            const articleHref = Host + $(element).find('.thumb').find('a').attr('href');
            // push日期 + 作者
            // const date = $(element).find('.text-truncate').text().replace("\n",'').replace("\t",'');
            const time = $(element).find('.duration').first().text();
            // console.log(`Article ${index + 1}: Text: ${articleText}, Href:${articleHref}, Img:${articleImg}, time:${time}`);
            listData.push({
                aid: articleHref.split('/')[3] + '@' + articleHref.split('/')[4],
                title: articleText,
                img: articleImg,
                href: articleHref,
                time: time
            })
            // console.log(`Article ${index + 1}: Text: ${articleText}, Href:${articleHref.split('/')[3]}, Img:${articleImg}, desc:${desc}`);
        });
        return {
            count: $('.last-page').first().text(),
            data: listData,
        };
    } catch (error) {
        console.error("数据处理出错" + error);
        return false;
    }
};

// 播放地址
CLDBRouter.get("/cldb", async (ctx) => {
    const { u } = ctx.query;
    // 验证是否存在 u 参数
    if (!u) {
        ctx.status = 400; // 设置响应状态码为 400，表示请求错误
        ctx.body = "Please provide the 'u' parameter."; // 提示缺少 'u' 参数
        return;
    }
    console.log('url => ' + u)
    const url = Host + `/video.php?tid=${u.split('=')[1]}`;
    // console.log(`获取草榴社区播放地址 => ${url}`);
    const key = `${cacheKey}_${url}`;
    try {
        // 从缓存中获取数据
        let data = await get(key);
        const from = data ? "cache" : "server";
        if (!data) {
            // 如果缓存中不存在数据
            console.log("从服务端重新获取草榴社区影视播放地址 => " + url);
            // 从服务器拉取数据
            const res = await axios.get(url);
            // console.log(res.data)
            ydata = res.data; // 修改此处，将结果赋值给已声明的data变量，而不是重新声明一个新的data变量
            const data = {
                title: ydata.match(/<title>(.+?)</)[1],
                data: ydata.match(/url: '(.+?)',/)[1]
            }
            // 将数据写入缓存
            await set(key, data);
            response(ctx, 200, data, "从远程获取成功");
        } else {
            response(ctx, 200, data, "从缓存获取成功");
        }
    } catch (err) {
        response(ctx, 606, "", "此类数据有毒，但是很好看！");
    }
});

// // 草榴社区影视搜索
// CLDBRouter.get("/cldb/:wd/:page", async (ctx) => {
//     const {wd, page} = ctx.params;
//     const url = `${Host}/thread.php?fid=${wd}&page=${page}`;
//     console.log(`获取草榴社区影视 ${url}`);
//     try {
//         // 从缓存中获取数据
//         let data = await get(`${cacheKey}_${url}`);
//         const from = data ? "cache" : "server";
//         if (!data) {
//             // 如果缓存中不存在数据
//             console.log("从服务端重新获取草榴社区影视");
//             // 从服务器拉取数据
//             const response = await axios.get(url);
//             data = getData(response.data);
//             updateTime = new Date().toISOString();
//             if (!data) {
//                 ctx.body = {
//                     code: 500,
//                     ...routerInfo,
//                     message: "获取失败",
//                 };
//                 return false;
//             }
//             // 将数据写入缓存
//             await set(`${cacheKey}_${url}`, data);
//         }
//         ctx.body = {
//             code: 200,
//             message: "获取成功",
//             ...routerInfo,
//             from,
//             total: data.length,
//             updateTime,
//             data,
//         };
//     } catch (error) {
//         console.error(error);
//         ctx.body = {
//             code: 500,
//             message: "获取失败",
//         };
//     }
// });


CLDBRouter.info = routerInfo;
module.exports = CLDBRouter;
