const Router = require("koa-router");
const proxyRouter = new Router();
const axios = require("axios");
const { get, set } = require("../../utils/cacheData");
const response = require('../../utils/response');

// 缓存键名
const cacheKey = "proxyData";

// 播放地址
proxyRouter.get("/proxy", async (ctx) => {
    const { url,wd,pg } = ctx.query;
    let zURl = url;
    if (wd != '' || pg != ''){
        zURl = `${url}?ac=videolist&wd=${wd}&pg=${pg}`;
    }
    const key = `${cacheKey}_${zURl}`;
    try {
        // 从缓存中获取数据
        let data = await get(key);
        if (!data) {
            // 从服务器拉取数据
            const res = await axios.get(zURl, { responseType: 'arraybuffer' });
            // Check if the content type is an image
            const contentType = res.headers['content-type'];
            if (contentType && contentType.startsWith('image/')) {
                // Serve the image directly
                ctx.status = res.status;
                ctx.type = contentType;
                ctx.body = res.data;
            } else {
                // For non-image content, cache and return the data
                data = res.data;
                // 将数据写入缓存
                await set(key, data);
                // 直接将原始数据返回
                ctx.status = 200;
                ctx.body = data;
            }
        } else {
            // 直接将原始数据返回
            ctx.status = 200;
            ctx.body = data;
        }
    } catch (err) {
        response(ctx, 606, "", "此类数据有毒，但是很好看！");
    }
});


module.exports = proxyRouter;
