const Router = require("koa-router");
const qtingsRouter = new Router();
const axios = require("axios");
const { get, set, del } = require("../../utils/cacheData");
const response = require('../../utils/response')
const cheerio = require('cheerio');

// 接口信息
const routerInfo = {
  name: "qtings", title: "倾听", subtitle: "搜索"
};

// 缓存键名
const cacheKey = "qtingsData";

// 调用时间
let updateTime = new Date().toISOString();

// 永久导航页（需翻墙）
const host = "https://www.qtings.com/search/filter/tracks/";

// 数据处理
const getData = (data) => {
  if (!data) return [];
  const dataList = [];
  try {
    const $ = cheerio.load(data);
    $('.song-container').each((index, element) => {
      // 标题
      const articleText = $(element).find('.song-title').text().replace(/[\n\t]/g, '');;
      // 图片地址
      const articleImg = $(element).find('.song-art').find('img').attr('src');
      // 下载链接
      const articleHref = $(element).find('.track-buttons-container').find('a').attr('href');
      // push日期
      const date = $(element).find('.timeago').text().replace(/[\n\t]/g, '');;

      if (articleText != '') {
        dataList.push({
          title: articleText,
          desc: articleText,
          pic: articleImg,
          date: date,
          url: articleHref,
          mobileUrl: articleImg,
        });
      }
    });
    return dataList;
  } catch (error) {
    console.error("数据处理出错" + error);
    return false;
  }
};

// 倾听搜索
qtingsRouter.get("/qtings/:wd", async (ctx) => {
  const { wd } = ctx.params;
  const url = `${host}${wd}`;
  console.log(`获取倾听 ${url}`);
  try {
    // 从缓存中获取数据
    let data = await get(cacheKey + wd);
    const from = data ? "cache" : "server";
    if (!data) {
      // 如果缓存中不存在数据
      console.log("从服务端重新获取倾听");
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
      await set(cacheKey + wd, data);
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



qtingsRouter.info = routerInfo;
module.exports = qtingsRouter;
