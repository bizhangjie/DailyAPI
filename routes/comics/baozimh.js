const Router = require("koa-router");
const baoziRouter = new Router();
const axios = require("axios");
const {get, set, del} = require("../../utils/cacheData");
const response = require('../../utils/response')
const cheerio = require('cheerio');

// 接口信息
const routerInfo = {
    name: "baozi", title: "baozi漫画", subtitle: "每日榜", category: ""
};

// 缓存键名
const cacheKey = "baoziData";

// 调用时间
let updateTime = new Date().toISOString();

// 永久导航页（需翻墙）
const Host = "https://www.baozimh.com";

// 数据处理
const getData = (data) => {
    if (!data) return [];
    try {
        var listData = [];
        const htmlString = data;
        const $ = cheerio.load(htmlString);
        $('.comics-card').each((index, element) => {
            // 标题
            const articleText = $(element).find('.comics-card__info').attr('aria-label');
            // 图片地址
            const articleImg = $(element).find('amp-img').eq(0).attr('src');
            // 下载链接
            const articleHref = $(element).find('.comics-card__info').attr('href');
            // push日期 + 作者
            const tags = $(element).find('.tags').text();
            listData.push({
                aid: articleHref.split('/')[2],
                title: articleText,
                img: articleImg,
                href: Host + '/' + articleHref,
                tags: tags
            })
        });
        return listData;
    } catch (error) {
        console.error("数据处理出错" + error);
        return false;
    }
};

// 播放地址
baoziRouter.get("/baozi/:uid", async (ctx) => {
    const {uid} = ctx.params;
    const url = Host + `/user/page_direct?comic_id=${uid}`;
    console.log(`获取baozi播放地址 => ${url}`);
    const key = `${cacheKey}_${uid}`;
    try {
        // 从缓存中获取数据
        let data = await get(key);
        const from = data ? "cache" : "server";
        if (!data) {
            // 如果缓存中不存在数据
            console.log("从服务端重新获取baozi漫画播放地址 => " + url);
            // 从服务器拉取数据
            const res = await axios.get(url);
            const pattern = /Src: '(.+?)'/g;
            const regex = new RegExp(pattern);
            const imageUrls = [];
            let match;
            while ((match = regex.exec(res.data)) !== null) {
                const imageUrl = match[1];
                imageUrls.push(imageUrl);
            }
            data = {
                title: res.data.match(/title>(.+?)</)[1],
                imageUrls: imageUrls
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

// baozi漫画搜索
baoziRouter.get("/baozi/search/:wd", async (ctx) => {
    const {wd} = ctx.params;
    const regex = /^[\u4e00-\u9fa5]{2,}$/; // 正则表达式匹配至少两个中文字符

    if (!regex.test(wd)) {
        ctx.body = "wd 参数必须包含至少两个以上的中文字符";
        return;
    }
    const url = `${Host}/search?q=${wd}`;
    console.log(`获取baozi漫画 ${url}`);
    try {
        // 从缓存中获取数据
        let data = await get(`${cacheKey}_${url}`);
        const from = data ? "cache" : "server";
        if (!data) {
            // 如果缓存中不存在数据
            console.log("从服务端重新获取baozi漫画");
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

// 获取数据
baoziRouter.get("/baozi/list/:uid", async (ctx) => {
    const {uid} = ctx.params;
    const url = Host + `/comic/${uid}_hsvfkb`
    console.log(`请求详细内容：${url}`)
    try {
        // 从缓存中获取数据
        let data = await get(`${cacheKey}_${url}`);
        const from = data ? "cache" : "server";
        if (!data) {
            // 如果缓存中不存在数据
            console.log("从服务端重新获取baozi漫画列表");
            // 从服务器拉取数据
            const response = await axios.get(url);
            const htmlString = response.data;
            const $ = cheerio.load(htmlString);
            let item = [];
            $('.comics-chapters__item').each((index, element) => {
                // 标题
                const articleText = $(element).find('span').text();
                // 下载链接
                const articleHref = $(element).attr('href');
                item.push({
                    aid: articleHref.split('comic_id=')[1],
                    title: articleText,
                    href: Host + articleHref
                })
            });
            data = item;
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
})

baoziRouter.info = routerInfo;
module.exports = baoziRouter;
