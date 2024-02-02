const Router = require("koa-router");
const caomeiRouter = new Router();
const axios = require("axios");
const {get, set, del} = require("../../utils/cacheData");
const response = require('../../utils/response')
const cheerio = require('cheerio');

// 接口信息
const routerInfo = {
    name: "草莓", title: "草莓影视", subtitle: "每日榜", category: ""
};

// 缓存键名
const cacheKey = "caomeiData";

// 调用时间
let updateTime = new Date().toISOString();

// 永久导航页（需翻墙）
const cmHost = "https://api.cmapi004.xyz/api";


// 数据处理
const getData = (data) => {
    if (!data) return [];
    try {
        return data;
    } catch (error) {
        console.error("数据处理出错" + error);
        return false;
    }
};

// 播放地址
caomeiRouter.get("/caomei/:uid", async (ctx) => {
    const { uid } = ctx.params;
    const url = cmHost + `/videoplay/${uid}?uuid=1`;
    // console.log(`获取草莓播放地址 => ${url}`);
    const key = `${cacheKey}_${uid}`;
    try {
        // 从缓存中获取数据
        let data = await get(key);
        const from = data ? "cache" : "server";
        if (!data) {
            // 如果缓存中不存在数据
            console.log("从服务端重新获取草莓影视播放地址 => " + url);
            // 从服务器拉取数据
            const res = await axios.get(url);
            data = res.data; // 修改此处，将结果赋值给已声明的data变量，而不是重新声明一个新的data变量
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

// 草莓影视搜索
caomeiRouter.get("/caomei/:wd/:page", async (ctx) => {
    const {wd, page} = ctx.params;
    const url = `${cmHost}/videosort/0?serach=${wd}&page=${page}`;
    console.log(`获取草莓影视 ${url}`);
    try {
        // 从缓存中获取数据
        let data = await get(`${cacheKey}_${url}`);
        const from = data ? "cache" : "server";
        if (!data) {
            // 如果缓存中不存在数据
            console.log("从服务端重新获取草莓影视");
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


caomeiRouter.info = routerInfo;
module.exports = caomeiRouter;
