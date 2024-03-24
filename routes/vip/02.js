const Router = require("koa-router");
const jiexi01Router = new Router();
const axios = require("axios");
const {get, set, del} = require("../../utils/cacheData");
const parseHtml = require('../../utils/jxUtils');

// 接口信息
const routerInfo = {
    name: "jiexi01", title: "jiexi01解析", subtitle: "每日榜", category: "解析平台"
};

// 缓存键名
const cacheKey = "jiexi01Data";

// 调用时间
const moment = require('moment-timezone');

// 永久导航页（需翻墙）
const Host = "http://119.91.123.253:2345/Api/yun.php?url=";

// 数据处理
const getData = (data) => {
    if (!data) return [];
    try {
        let dat;
        const result = data;
        if (result.msg == '0k') {
            dat = result.data.url
        }
        if (result == '失败') {
            dat = "解析失败，请检查链接是否正确"
        }
        return dat;
    } catch (error) {
        console.error("数据处理出错" + error);
        return false;
    }
};

// jiexi01解析
jiexi01Router.get("/jiexi02", async (ctx) => {
    const {uid} = ctx.query;
    // 使用正则表达式检查uid是否符合网址格式
    const urlPattern = /^(?:https?:\/\/)[^\s]+$/;
    if (!urlPattern.test(uid)) {
        ctx.status = 400; // 返回400错误状态码
        ctx.body = "Invalid URL"; // 返回错误信息
        return;
    }
    console.log(`获取jiexi02解析 ${uid}`);
    try {
        // 从缓存中获取数据
        let data = await get(`${cacheKey}_${uid}`);
        const from = data ? "cache" : "server";
        if (!data) {
            // 如果缓存中不存在数据
            console.log("从服务端重新获取jiexi01解析");
            let playurl = '';
            // 从服务器拉取数据
            await parseHtml(uid)
                .then(playUrl => {
                    console.log("返回的播放地址 => " + playUrl);
                    playurl = playUrl;
                })
                .catch(error => {
                    console.error(error);
                });
            data = playurl;
            if (!data) {
                ctx.body = {
                    code: 500,
                    ...routerInfo,
                    message: "获取失败",
                };
                return false;
            }
            // 将数据写入缓存
            await set(`${cacheKey}_${uid}`, data);
        }
        const updateTime = new Date().toISOString();
        const shanghaiTime = moment(updateTime).tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss');
        ctx.body = {
            code: 200,
            message: "获取成功",
            ...routerInfo,
            from,
            shanghaiTime,
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


jiexi01Router.info = routerInfo;
module.exports = jiexi01Router;
