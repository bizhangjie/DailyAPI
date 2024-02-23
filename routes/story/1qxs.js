const Router = require("koa-router");
const yqxsRouter = new Router();
const axios = require("axios");
const {get, set, del} = require("../../utils/cacheData");
const response = require('../../utils/response')
const cheerio = require('cheerio');
const {spawn} = require("child_process");

// 接口信息
const routerInfo = {
    name: "yqxs", title: "yqxs说说", subtitle: "每日榜", category: ""
};

// 缓存键名
const cacheKey = "yqxsData";

// 调用时间
let updateTime = new Date().toISOString();

// 永久导航页（需翻墙）
const Host = "https://m.1qxs.com";

// 章节
yqxsRouter.get("/yqxs/xs/:uid/:pg", async (ctx) => {
    const {uid, pg} = ctx.params;
    const url = Host + `/xs/${uid}/${pg}`;
    console.log(`获取yqxs播放地址 => ${url}`);
    const key = `${cacheKey}_${uid}`;
    try {
        // 从缓存中获取数据
        let data = await get(key);
        const from = data ? "cache" : "server";
        if (!data) {
            // 如果缓存中不存在数据
            console.log("从服务端重新获取91影视播放地址 => " + url);
            // 从服务器拉取数据
            const res = await axios.get(url);
            const htmlString = res.data;
            const $ = cheerio.load(htmlString);
            // title
            const title = $('h1').text();
            // content
            const content = $('.content').text().split('请退出阅读模式或畅读模式即可正常。')[1];
            // next
            const nextHref = $('.right').find('a').eq(1).attr('href')
            const data = {
                title,
                content,
                nextHref
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

// 目录
yqxsRouter.get("/yqxs/list/:uid/:pg", async (ctx) => {
    const {uid, pg} = ctx.params;
    const url = Host + `/list/${uid}/${pg}`;
    console.log(`获取yqxs播放地址 => ${url}`);
    const key = `${cacheKey}_${uid}`;
    try {
        // 从缓存中获取数据
        let data = await get(key);
        const from = data ? "cache" : "server";
        if (!data) {
            // 如果缓存中不存在数据
            console.log("从服务端重新获取91影视播放地址 => " + url);
            // 从服务器拉取数据
            const res = await axios.get(url);
            const htmlString = res.data;
            const $ = cheerio.load(htmlString);
            // pageCount
            const pageCount = $('.pagelist').find('option').eq(-1).text().split('-')[1].replace('章', '');
            // pageList
            let pageList = [];
            $('li').each((index, element) => {
                // 标题
                const articleText = $(element).find('p').text();
                // 下载链接
                const articleHref = $(element).find('a').attr('href');
                pageList.push({
                    title: articleText,
                    href: articleHref
                })
            });
            data = pageList;
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

// yqxs说说搜索
yqxsRouter.get("/yqxs/search/:wd/:page", async (ctx) => {
    const {wd, page} = ctx.params;
    const regex = /^[\u4e00-\u9fa5]{2,}$/; // 正则表达式匹配至少两个中文字符
    if (!regex.test(wd)) {
        ctx.body = "wd 参数必须包含至少两个以上的中文字符";
        return;
    }
    const url = `${Host}/searchAjax?kw=${wd}&p=${page}`;
    console.log(`获取yqxs说说 ${url}`);
    try {
        // 从缓存中获取数据
        let data = await get(`${cacheKey}_${url}`);
        const from = data ? "cache" : "server";
        if (!data) {
            // 如果缓存中不存在数据
            console.log("从服务端重新获取yqxs说说");
            // 从服务器拉取数据
            const response = await axios.get(url);
            data = response.data;
            updateTime = new Date().toISOString();
            if (!data) {
                ctx.body = {
                    code: 200,
                    ...routerInfo,
                    message: "数据为空",
                    data: {
                        data: []
                    }
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
            code: 200,
            message: "数据为空",
            data: {
                data: []
            }
        };
    }
});


yqxsRouter.info = routerInfo;
module.exports = yqxsRouter;
