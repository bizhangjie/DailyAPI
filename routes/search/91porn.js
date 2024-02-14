const Router = require("koa-router");
const J1HostRouter = new Router();
const axios = require("axios");
const {get, set, del} = require("../../utils/cacheData");
const response = require('../../utils/response')
const cheerio = require('cheerio');

// 接口信息
const routerInfo = {
    name: "91", title: "91影视", subtitle: "每日榜", category: ""
};

// 缓存键名
const cacheKey = "gdianData";

// 调用时间
let updateTime = new Date().toISOString();

// 永久导航页（需翻墙）
const Host = "https://8l8791c.jiuse9927.xyz";

// 数据处理
const getData = (data) => {
    if (!data) return [];
    try {
        var listData = [];
        const htmlString = data;
        const $ = cheerio.load(htmlString);
        $('.colVideoList').each((index, element) => {
            // 标题
            const articleText = $(element).find('.title').text();
            // 图片地址
            const articleImg = $(element).find('.img').attr('style').replace('background-image: url(\'', '').replace("')", '');
            // 下载链接
            const articleHref = Host + $(element).find('.title').attr('href');
            // push日期 + 作者
            const desc = $(element).find('.text-truncate').text().replace("\\n", '').replace("\t", '');
            // 时长
            const time = $(element).find('.layer').text();
            // console.log(`Article ${index + 1}: Text: ${articleText}, Href:${articleHref}, Img:${articleImg}, desc:${desc}`);
            listData.push({
                aid: articleHref.split('/')[5],
                title: articleText,
                img: articleImg,
                href: articleHref,
                desc: desc,
                time: time
            })
            // console.log(`Article ${index + 1}: Text: ${articleText}, Href:${articleHref.split('/')[3]}, Img:${articleImg}, desc:${desc}`);
        });
        return {
            count: $('.container-title').text(),
            data: listData,
        };
    } catch (error) {
        console.error("数据处理出错" + error);
        return false;
    }
};

// 播放地址
J1HostRouter.get("/91/:uid", async (ctx) => {
    const {uid} = ctx.params;
    const url = Host + `/video/view/${uid}`;
    // console.log(`获取91播放地址 => ${url}`);
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
            // console.log(res.data)
            ydata = res.data; // 修改此处，将结果赋值给已声明的data变量，而不是重新声明一个新的data变量
            const data = ydata.match(/data-src="(.+?)">/)[1].replace('&amp;m=','&m=')
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

// 91影视搜索
J1HostRouter.get("/91/:wd/:page", async (ctx) => {
    const {wd, page} = ctx.params;
    const url = `${Host}/search?keywords=${wd}&page=${page}`;
    console.log(`获取91影视 ${url}`);
    try {
        // 从缓存中获取数据
        let data = await get(`${cacheKey}_${url}`);
        const from = data ? "cache" : "server";
        if (!data) {
            // 如果缓存中不存在数据
            console.log("从服务端重新获取91影视");
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


J1HostRouter.info = routerInfo;
module.exports = J1HostRouter;
