const Router = require("koa-router");
const mjxRouter = new Router();
const axios = require("axios");
const {get, set, del} = require("../../utils/cacheData");
const response = require('../../utils/response')
const cheerio = require('cheerio');

// 接口信息
const routerInfo = {
    name: "mjx", title: "mjx图片", subtitle: "每日榜", category: "图片: 奇葩 qipa | 福利 fuli | 热门 hot | "
};

// 缓存键名
const cacheKey = "mjxData";

// 调用时间
let updateTime = new Date().toISOString();

// 永久导航页（需翻墙）
const Host = "http://www.qipamaijia.com";

// 数据处理
const getData = (data) => {
    if (!data) return [];
    try {
        var listData = [];
        const htmlString = data;
        const $ = cheerio.load(htmlString);
        $('.block').each((index, element) => {
            // 标题
            const articleText = $(element).find('.thumb').find('a').text();
            // 下载链接
            const articleHref = $(element).find('.thumb').find('a').attr('href');
            // 图片
            const Img = $(element).find('.thumb').find('img').attr('src')
            // 内容
            const content = $(element).find('.content').text();
            listData.push({
                title: articleText,
                img: Host + Img,
                href: Host + articleHref,
                content: content
            })
            // console.log(`Article ${index + 1}: Text: ${articleText}, Href:${articleHref.split('/')[3]}, Img:${articleImg}, desc:${desc}`);
        });
        return {
            count: $('.pagebar').find('a').eq(-2).text(),
            data: listData,
        };
    } catch (error) {
        console.error("数据处理出错" + error);
        return false;
    }
};

// mjx图片
mjxRouter.get("/mjx/:wd/:page", async (ctx) => {
    const {wd, page} = ctx.params;
    const url = `${Host}/${wd}/${page}`;
    console.log(`获取mjx图片 ${url}`);
    try {
        // 从缓存中获取数据
        let data = await get(`${cacheKey}_${url}`);
        const from = data ? "cache" : "server";
        if (!data) {
            // 如果缓存中不存在数据
            console.log("从服务端重新获取mjx图片");
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


mjxRouter.info = routerInfo;
module.exports = mjxRouter;
