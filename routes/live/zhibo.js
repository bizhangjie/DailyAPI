const Router = require("koa-router");
const zhiboRouter = new Router();
const axios = require("axios");
const {get, set, del} = require("../../utils/cacheData");
const response = require('../../utils/response')
const cheerio = require('cheerio');
const {spawn} = require("child_process");

// 接口信息
const routerInfo = {
    name: "zhibo", title: "zhibo直播", subtitle: "每日榜", category: ""
};

// 缓存键名
const cacheKey = "zhiboData";

// 调用时间
let updateTime = new Date().toISOString();

// 永久导航页（需翻墙）
const Host = "https://junlong.plus/ztool";

// 数据处理
const getData = (data, ctx) => {
    if (!data) return [];
    try {
        const htmlString = data;
        const $ = cheerio.load(htmlString);
        // 播放地址
        const regex = /url: '(.+?)'/;
        const match = data.match(regex);
        let urlPlay;
        if (match) {
            urlPlay = match[1];
        } else {
            urlPlay = '';
        }
        // title
        const title = $('h6').text();
        // icon
        const icon = $('.mdui-img-rounded').eq(0).attr('src');
        const ArthurAndCategory = $('.mdui-container').eq(0).find('span');
        // Arthur
        const ArthurName = ArthurAndCategory.eq(0).text();
        // category
        const Category = ArthurAndCategory.eq(1).text();
        return {
            title: title,
            img: icon,
            ArthurName: ArthurName,
            Category: Category,
            url: urlPlay
        }
    } catch (error) {
        console.error("数据处理出错" + error);
        return false;
    }
};

const getDataY = (data, ctx) => {
    if (!data) return [];
    try {
        const htmlString = data;
        const $ = cheerio.load(htmlString);
        // 播放地址
        const regex = /url: '(.+?)'/;
        const match = data.match(regex);
        let urlPlay;
        if (match) {
            urlPlay = match[1];
        } else {
            urlPlay = '';
        }
        // title
        const title = $('h6').text();
        // icon
        const icon = $('.mdui-img-rounded').eq(0).attr('src');
        const ArthurAndCategory = $('.mdui-container').eq(0).find('span');
        // Arthur
        const ArthurName = ArthurAndCategory.eq(0).text();
        // category
        const Category = ArthurAndCategory.eq(1).text();
        return urlPlay;
    } catch (error) {
        console.error("数据处理出错" + error);
        return false;
    }
};

// zhibo直播搜索
zhiboRouter.get("/zhibo/:lty/:uid", async (ctx) => {
    const {lty, uid} = ctx.params;
    let url = '';
    if (lty == 'lucky'){
        url = `${Host}/live/${lty}`
    }else{
        url = `${Host}/live/${lty}/${uid}`;
    }
    console.log(`获取zhibo直播 ${url}`);
    try {
        // 从缓存中获取数据
        let data = await get(`${cacheKey}_${url}`);
        const from = data ? "cache" : "server";
        if (!data) {
            // 如果缓存中不存在数据
            console.log("从服务端重新获取zhibo直播");
            // 从服务器拉取数据
            const response = await axios.get(url);
            data = getData(response.data, ctx);
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
            if (lty != 'lucky'){
                await set(`${cacheKey}_${url}`, data);
            }
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

// zhibo直播搜索
zhiboRouter.get("/zhiboy/:lty/:uid", async (ctx) => {
    const {lty, uid} = ctx.params;
    let url = '';
    if (lty == 'lucky'){
        url = `${Host}/live/${lty}`
    }else{
        url = `${Host}/live/${lty}/${uid}`;
    }
    console.log(`获取zhibo直播 ${url}`);
    try {
        // 从缓存中获取数据
        let data = await get(`${cacheKey}_${url}`);
        const from = data ? "cache" : "server";
        if (!data) {
            // 如果缓存中不存在数据
            console.log("从服务端重新获取zhibo直播");
            // 从服务器拉取数据
            const response = await axios.get(url);
            data = getDataY(response.data, ctx);
            updateTime = new Date().toISOString();
            if (!data) {
                ctx.redirect(data);
                return false;
            }
            // 将数据写入缓存
            if (lty != 'lucky'){
                await set(`${cacheKey}_${url}`, data);
            }
        }
        ctx.redirect(data);

    } catch (error) {
        console.error(error);
        ctx.redirect('https://www.example.com');

    }
});

zhiboRouter.info = routerInfo;
module.exports = zhiboRouter;
