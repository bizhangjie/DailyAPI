const Router = require("koa-router");
const yiyanRouter = new Router();
const axios = require("axios");
const { get, set, del } = require("../../utils/cacheData");

// 接口信息
const routerInfo = { name: "每日一言", title: "随机一言", subtitle: "每日一言"};

// 缓存键名
const cacheKey = "51cgData";

// 调用时间
let updateTime = new Date().toISOString();

const Host = "https://v1.hitokoto.cn";

// 每日一言
yiyanRouter.get("/yiyan", async (ctx) => {
  console.log("获取每日一言");
  try {
    // 从缓存中获取数据
    let data = await get(cacheKey);
    const from = data ? "cache" : "server";
    if (!data) {
      // 如果缓存中不存在数据
      console.log("从服务端重新获取每日一言");
      // 从服务器拉取数据
      const response = await axios.get(Host);
      data = response.data;
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
      await set(cacheKey, data);
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

yiyanRouter.info = routerInfo;
module.exports = yiyanRouter;
