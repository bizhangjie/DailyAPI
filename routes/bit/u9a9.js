const Router = require("koa-router");
const u9a9Router = new Router();
const axios = require("axios");
const {get, set, del} = require("../../utils/cacheData");
const response = require('../../utils/response')
const cheerio = require('cheerio');

// 接口信息
const routerInfo = {
    name: "u9a9", title: "u9a9种子", subtitle: "每日榜", category: ""
};

// 缓存键名
const cacheKey = "u9a9Data";

// 调用时间
let updateTime = new Date().toISOString();

// 永久导航页（需翻墙）
const Host = "https://u9a9.com";

// 数据处理
const getData = (data) => {
    if (!data) return [];
    try {
        var listData = [];
        const htmlString = data;
        const $ = cheerio.load(htmlString);
        $('.default').each((index, element) => {
            // 提取图片字段
            const image = $(element).find('img').attr('src');

            // 提取标题字段
            const title = $(element).find('a').attr('title');

            // 提取下载链接字段
            const downloadLink = $(element).find('td').eq(2).find('a').eq(0).attr('href');

            // 提取磁力链接字段
            const magnetLink = $(element).find('td').eq(2).find('a').eq(1).attr('href');

            // 提取文件大小字段
            const fileSize = $(element).find('td').eq(3).text();

            // 提取发布时间字段
            const releaseTime = $(element).find('td').eq(4).text();

            // 提取广告字段
            const ad = $(element).find('td').eq(5).find('a').html();
            listData.push({
                aid: downloadLink.split("/2/")[1].split('.')[0],
                title: title,
                downloadLink: downloadLink,
                magnetLink: magnetLink,
                fileSize: fileSize,
                releaseTime: releaseTime,
                image: image
            })
            // console.log(`Article ${index + 1}: Text: ${articleText}, Href:${articleHref.split('/')[3]}, Img:${articleImg}, desc:${desc}`);
        });
        return {
            // count: $('.last-page').first().text(),
            data: listData,
        };
    } catch (error) {
        console.error("数据处理出错" + error);
        return false;
    }
};

// 播放地址
u9a9Router.get("/u9a9/:uid", async (ctx) => {
    const {uid} = ctx.params;
    const url = Host + `/view/2/${uid}`;
    console.log(`获取u9a9播放地址 => ${url}`);
    const key = `${cacheKey}_${uid}`;
    try {
        // 从缓存中获取数据
        let data = await get(key);
        const from = data ? "cache" : "server";
        if (!data) {
            // 如果缓存中不存在数据
            console.log("从服务端重新获取u9a9种子播放地址 => " + url);
            // 从服务器拉取数据
            const res = await axios.get(url);
            const htmlString = res.data;
            const $ = cheerio.load(htmlString);
            let images = []
            $('.panel-body').find('img').each((index, element) => {
                // 提取图片字段
                const image = $(element).attr('src');
                images.push(image);
            });
            data = {
                title: $('.panel-title').text(),
                list: images
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

// u9a9种子搜索
u9a9Router.get("/u9a9/:wd/:page", async (ctx) => {
    const {wd, page} = ctx.params;
    const regex = /^[\u4e00-\u9fa5]{2,}$/; // 正则表达式匹配至少两个中文字符

    if (!regex.test(wd)) {
        ctx.body = "wd 参数必须包含至少两个以上的中文字符";
        return;
    }
    const url = `${Host}/?type=2&search=${wd}&p=${page}`;
    console.log(`获取u9a9种子 ${url}`);
    try {
        // 从缓存中获取数据
        let data = await get(`${cacheKey}_${url}`);
        const from = data ? "cache" : "server";
        if (!data) {
            // 如果缓存中不存在数据
            console.log("从服务端重新获取u9a9种子");
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
            await set(`${cacheKey}_${url}`, data);
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


u9a9Router.info = routerInfo;
module.exports = u9a9Router;
