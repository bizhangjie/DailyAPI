const Router = require("koa-router");
const weimiQRouter = new Router();
const axios = require("axios");
const {get, set, del} = require("../../utils/cacheData");
const response = require('../../utils/response')
const cheerio = require('cheerio');
const {spawn} = require("child_process");

// 接口信息
const routerInfo = {
    name: "weimiQ", title: "weimiQ图图", subtitle: "每日榜", category: ""
};

// 缓存键名
const cacheKey = "weimiQData";

// 调用时间
let updateTime = new Date().toISOString();

// 永久导航页（需翻墙）
const Host = "https://weme5.com";

// 数据处理
const getData = (data, ctx) => {
    if (!data) return [];
    try {
        var listData = [];
        const htmlString = data;
        const $ = cheerio.load(htmlString);
        $('.grid').each((index, element) => {
            // 标题
            const articleText = $(element).find('h3').text();
            // 背景
            const articleImage = $(element).find('.img').find('a').find('img').attr('data-src');
            // 链接
            const articleHref = $(element).find('.img').find('a').attr('href');
            // push日期
            const date = $(element).find('.time').text();
            listData.push({
                aid: articleHref.split('/')[3],
                title: articleText,
                img: 'http://' + ctx.request.host + '/weimiQ/?img=' + articleImage + '.jpg',
                href: Host + articleHref.replace('./', ''),
                date: date
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
weimiQRouter.get("/weimiQ/:uid", async (ctx) => {
    const {uid} = ctx.params;
    const url = Host + `/archives/${uid}`;
    console.log(`获取weimiQ播放地址 => ${url}`);
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

            let ImageList = []
            $('.wp-block-image').each((index, element) => {
                const img = $(element).find('img').attr('src');
                if (img.includes('cloudfront.net')) {
                    ImageList.push('http://' + ctx.request.host + '/weimiQ/?img=' + img + '.jpg');
                }
            });
            let urlPlay;
            try {
                urlPlay = htmlString.match(/url: "(.+?)"/)[1];
            } catch (e) {
                urlPlay = '';
            }
            const data = {
                title: $('.article-title').text(),
                ImageList: ImageList,
                date: $('.article-meta').text().replace(/\t/g, '').replace(/\n /g, ''),
                url: urlPlay
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

// weimiQ图图搜索
weimiQRouter.get("/weimiQ/:wd/:page", async (ctx) => {
    const {wd, page} = ctx.params;
    const regex = /^[\u4e00-\u9fa5]{2,}$/; // 正则表达式匹配至少两个中文字符

    // if (!regex.test(wd)) {
    //     ctx.body = "wd 参数必须包含至少两个以上的中文字符";
    //     return;
    // }
    const url = `${Host}/page/${page}?s=${wd}`;
    console.log(`获取weimiQ图图 ${url}`);
    try {
        // 从缓存中获取数据
        let data = await get(`${cacheKey}_${url}`);
        const from = data ? "cache" : "server";
        if (!data) {
            // 如果缓存中不存在数据
            console.log("从服务端重新获取weimiQ图图");
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

// 图片转码
weimiQRouter.get("/weimiQ/", async (ctx) => {
    const {img} = ctx.query;
    // 使用正则表达式检查uid是否符合网址格式
    const urlPattern = /^(?:https?:\/\/)[^\s]+$/;
    if (!urlPattern.test(img)) {
        ctx.status = 400; // 返回400错误状态码
        ctx.body = "Invalid URL"; // 返回错误信息
        return;
    }

    // 根据uid的图片，保存图片数据，然后返回给用户
    const response = await axios.get(img.replace('.jpg', ''), {
        responseType: "arraybuffer"
    });
    const ImageByte = 'data:image/png;base64,' + btoa(new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))
    ctx.type = 'image/png';
    ctx.body = Buffer.from(ImageByte.split(',')[1], 'base64');

})

// 图片转码
weimiQRouter.get("/img", async (ctx) => {
    const {img} = ctx.query;
    // 使用正则表达式检查uid是否符合网址格式
    const urlPattern = /^(?:https?:\/\/)[^\s]+$/;
    if (!urlPattern.test(img)) {
        ctx.status = 400; // 返回400错误状态码
        ctx.body = "Invalid URL"; // 返回错误信息
        return;
    }

    // 根据uid的图片，保存图片数据，然后返回给用户
    const response = await axios.get(img, {
        responseType: "arraybuffer"
    });
    const ImageByte = 'data:image/png;base64,' + btoa(new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))
    ctx.type = 'image/png';
    ctx.body = Buffer.from(ImageByte.split(',')[1], 'base64');

})


weimiQRouter.info = routerInfo;
module.exports = weimiQRouter;
