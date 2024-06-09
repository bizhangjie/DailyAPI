const Router = require("koa-router");
const proxyRouter = new Router();
const axios = require("axios");
const {get, set} = require("../../utils/cacheData");
const response = require('../../utils/response');
const cheerio = require('cheerio');

// 缓存键名
const cacheKey = "playData";

// 播放地址
proxyRouter.get("/kk", async (ctx) => {
    const {url, pg} = ctx.query;
    let zURl = url + pg;
    const key = `${cacheKey}_${zURl}`;
    try {
        // 从缓存中获取数据
        let data = await get(key);
        if (!data) {
            // 111从服务器拉取数据
            if (url.split("/")[2] !== "rou.video"){
                const sourceHtml = await axios.get(url);
                const source = cheerio.load(sourceHtml.data);
                const htmlContent = source.html().replace(/&amp;/g, "&").replace(/&quot;/g, '"');
                let regex2 = /"video":{"url":"(.*?)"/g;
                if (url.split("/")[2] === "hlj.fun") {
                    regex2 = /"url":"(.*?)"/g;
                }
                let urlList = [];
                let match;
                while ((match = regex2.exec(htmlContent)) !== null) {
                    const url = match[1].replace(/\\\//g, '/');
                    urlList.push(url);
                }
                data = urlList[pg - 1];
            }else {
                const play = await axios.get(url.replace("/v/","/api/v/"));
                data = play.data.video.videoUrl;
            }
            // 将数据写入缓存
            await set(key, data);
        }
        // 重定向到获取的URL
        ctx.redirect(data);
    } catch (err) {
        // 如果出现错误，返回错误信息
        ctx.status = 606;
        ctx.body = "此类数据有毒，但是很好看！";
    }
});



module.exports = proxyRouter;
