const Router = require("koa-router");
const lspRouter = new Router();
const axios = require("axios");
const { get, set } = require("../../utils/cacheData");

// 接口信息
const routerInfo = { name: "梨视频", title: "随机一波", subtitle: "梨视频"};

// 缓存键名
const cacheKey = "lsp";

// 调用时间
let updateTime = new Date().toISOString();

const Host = "http://lb.h12345.net";

// 梨视频
lspRouter.get("/lsp/:uid", async (ctx) => {
  const {uid} = ctx.params;
  console.log("获取梨视频");
  const url = `${Host}/zb/${uid}.json?time=${new Date().getTime()}`
  try {
    // 从缓存中获取数据
    let data = await get(cacheKey + uid);
    const from = data ? "cache" : "server";
    if (!data) {
      // 如果缓存中不存在数据
      console.log("从服务端重新获取梨视频");
      // 从服务器拉取数据
      const response = await axios.get(url);
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
      await set(cacheKey + uid, data);
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

lspRouter.info = routerInfo;
module.exports = lspRouter;
