const Router = require("koa-router");
const sgpRouter = new Router();
const axios = require("axios");
const { get, set, del } = require("../../utils/cacheData");

const cheerio = require('cheerio');

const { headers,sendData,parseData } = require("../../utils/shuiguopaijm");

// 接口信息
const routerInfo = { name: "shuiguopai", title: "水果派", subtitle: "每日榜", category: "解说" };

// 缓存键名
const cacheKey = "shuiguopaiData";

// 调用时间
let updateTime = new Date().toISOString();

// 永久导航页（需翻墙）
const Host = "https://fpie2.com";

// 水果派热搜 ==> 分类
sgpRouter.get("/shuiguopai/list/:ltype/:page", async (ctx) => {
  const ltype = ctx.params.ltype; // 获取类型
  const page = ctx.params.page; // 获取页码
  const url = `https://api.cbbee0.com/v1_2/homePage`
  console.log("获取水果派热搜");
  try {
    // 从缓存中获取数据
    let data = await get(cacheKey + `_${ltype}_${page}`);
    const from = data ? "cache" : "server";
    if (!data) {
      // 如果缓存中不存在数据
      console.log("从服务端重新获取水果派热搜");
      // 从服务器拉取数据
      const response = await axios.post(url, sendData(ltype, page, 'homePage'), { headers });
      data = parseData(response.data);
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
      await set(cacheKey + `_${ltype}_${page}`, data);
    }
    ctx.body = {
      code: 200,
      message: "获取成功",
      ...routerInfo,
      from,
      updateTime,
      mubiao: Host,
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

// 水果派热搜 - 获取详细信息
sgpRouter.get("/shuiguopai/movie/:uid", async (ctx) => {
  const { uid } = ctx.params;
  console.log("获取水果派热搜 - uid => " + uid);
  const url = 'https://api.cbbee0.com/v1_2/filmInfo';
  try {
    // 从服务器拉取最新数据
    const response = await axios.post(url,sendData(1,uid,'filmInfo'),{ headers });
    const newData = parseData(response.data);
    updateTime = new Date().toISOString();
    console.log("从服务端重新获取水果派热搜");

    // 返回最新数据
    ctx.body = {
      code: 200,
      message: "获取成功",
      ...routerInfo,
      total: newData.length,
      updateTime,
      data: newData,
    };

    // 删除旧数据
    await del(cacheKey);
    // 将最新数据写入缓存
    await set(cacheKey, newData);
  } catch (error) {
    // 如果拉取最新数据失败，尝试从缓存中获取数据
    console.error(error);
    const cachedData = await get(cacheKey);
    if (cachedData) {
      ctx.body = {
        code: 200,
        message: "获取成功",
        ...routerInfo,
        total: cachedData.length,
        updateTime,
        data: cachedData,
      };
    } else {
      // 如果缓存中也没有数据，则返回错误信息
      ctx.body = {
        code: 500,
        ...routerInfo,
        message: "获取失败",
      };
    }
  }
});

// 水果派热搜 - 获取详细信息
sgpRouter.get("/shuiguopai/detail/:uid", async (ctx) => {
  const { uid } = ctx.params;
  console.log("获取水果派热搜 - uid => " + uid);
  const url = `${Host}/play-details/1/${uid}`;
  try {
    // 从服务器拉取最新数据
    const response = await axios.get(url);
    const ydata = response.data;
    const filmId = ydata.match(/,film_id:"(.+?)"/)[1];
    const playUrl = ydata.match(/,url:"(.+?)"/)[1];
    updateTime = new Date().toISOString();
    console.log("从服务端重新获取水果派热搜");
    const newData = {
        filmId: filmId.split(',')[0],
        link: getIpHost(ctx) + filmId.split(',')[0],
        url: playUrl.replace(/\\u002F/g, "/")
      };
    // 返回最新数据
    ctx.body = {
      code: 200,
      message: "获取成功",
      ...routerInfo,
      updateTime,
      data: newData
    };

    // 删除旧数据
    await del(cacheKey);
    // 将最新数据写入缓存
    await set(cacheKey, newData);
  } catch (error) {
    // 如果拉取最新数据失败，尝试从缓存中获取数据
    console.error(error);
    const cachedData = await get(cacheKey);
    if (cachedData) {
      ctx.body = {
        code: 200,
        message: "获取成功",
        ...routerInfo,
        total: cachedData.length,
        updateTime,
        data: cachedData,
      };
    } else {
      // 如果缓存中也没有数据，则返回错误信息
      ctx.body = {
        code: 500,
        ...routerInfo,
        message: "获取失败",
      };
    }
  }
});


function getIpHost(ctx) {
  // 获取当前请求的host
  const host = ctx.request.host;

  const jimiImg = host + '/shuiguopai/movie/';
  return jimiImg;
}

sgpRouter.info = routerInfo;
module.exports = sgpRouter;
