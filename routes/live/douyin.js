const Router = require("koa-router");
const douyinLiveRouter = new Router();
const axios = require("axios");
const {get, set, del} = require("../../utils/cacheData");
const response = require('../../utils/response')
const cheerio = require('cheerio');
const {spawn} = require('child_process');
const {douYinRid} = require("../../utils/live/douyin");
// 接口信息
const routerInfo = {
    name: "douyinLive", title: "douyinLive直播", subtitle: "每日榜", category: "直播源"
};

// 缓存键名
const cacheKey = "douyinLiveData";

// 调用时间
let updateTime = new Date().toISOString();

// 播放地址
douyinLiveRouter.get("/douyinLive/:uid", async (ctx) => {
    const {uid} = ctx.params;
    // 使用正则表达式验证uid是否是整数字符串
    if (!/^\d+$/.test(uid)) {
        ctx.throw(400, "UID must be a valid integer string");
        return;
    }
    console.log(`获取douyinLive播放地址 => ${uid}`);
    const key = `${cacheKey}_${uid}`;
    try {
        // 从缓存中获取数据
        let data = await get(key);
        if (!data) {
            // 如果缓存中不存在数据
            console.log("从服务端重新获取douyinLive直播播放地址 => " + uid);
            const decodedData = await douYinRid(uid);
            // 将数据写入缓存
            await set(key, decodedData);
            response(ctx, 200, decodedData, "从远程获取成功");
        } else {
            response(ctx, 200, data, "从缓存获取成功");
        }
    } catch (err) {
        response(ctx, 606, "", "此类数据有毒，但是很好看！");
    }
});

douyinLiveRouter.get("/douyin/:uid", async (ctx) => {
    const {uid} = ctx.params;
    // 使用正则表达式验证uid是否是整数字符串
    if (!/^\d+$/.test(uid)) {
        ctx.throw(400, "UID must be a valid integer string");
        return;
    }
    console.log(`获取douyinLive播放地址 => ${uid}`);
    const key = `${cacheKey}_${uid}`;
    try {
        // 从缓存中获取数据
        let data = await get(key);
        if (!data) {
            // 如果缓存中不存在数据
            console.log("从服务端重新获取douyinLive直播播放地址 => " + uid);
            const LiveUrl = await douYinRid(uid);
            // 将数据写入缓存
            await set(key, LiveUrl);
            // 重定向到 LiveUrl
            ctx.redirect(LiveUrl);
        } else {
            ctx.redirect(data);
        }
    } catch (err) {
        response(ctx, 606, "", "此类数据有毒，但是很好看！");
    }
});

douyinLiveRouter.info = routerInfo;
module.exports = douyinLiveRouter;
