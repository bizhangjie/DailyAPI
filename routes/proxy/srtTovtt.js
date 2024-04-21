const Router = require("koa-router");
const proxyRouter = new Router();
const axios = require("axios");
const {get, set} = require("../../utils/cacheData");
const response = require('../../utils/response');

// 缓存键名
const cacheKey = "srtTovttData";

const Host = 'https://api.buxiangyao.link/jp(M3U8)/';

// 播放地址
proxyRouter.get("/srttovtt", async (ctx) => {
    const {url} = ctx.query;
    let zURl = Host + url;
    const key = `${cacheKey}_${zURl}`;
    console.log(url)
    try {
        // 从缓存中获取数据
        let data = await get(key);
        if (!data) {
            // 从服务器拉取数据
            const res = await axios.get(zURl);
            data = res.data;
            // 第一步将 , 换成.
            data01 = data.replace(/,/g, '.');
            // 第二步将 00:00: 换成 00:
            data02 = data01.replace(/00:00:/g, '00:');
            // 第三步开头加上WEBVTT
            data03 = "WEBVTT\n\n" + data02;
            // 将数据写入缓存
            await set(key, data03);
            // 直接将原始数据返回
            ctx.status = 200;
            ctx.body = data03;
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
