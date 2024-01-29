const Router = require("koa-router");
const zztt15Router = new Router();
const axios = require("axios");
const { get, set, del } = require("../../utils/cacheData");
const { loadImg } = require("../../utils/zztt15Util");
const cheerio = require('cheerio');

// 接口信息
const routerInfo = {
  name: "zztt15", title: "黑料网", subtitle: "每日榜", category: "6 1.html(今日黑料) 7(热点吃瓜) 8(金典吃瓜) 9(黑料历史) 10(每日top10) \
1(网红乱象) 4(反差女友) 13(原创社区) 2(校园春宫) 9(独家爆料) 12(性爱讲堂) 3(中外奇闻) 14(禁播影视) 15(社会新闻) 16(明星新闻)" };

// 缓存键名
const cacheKey = "zztt15Data";

// 调用时间
let updateTime = new Date().toISOString();

// 永久导航页（需翻墙）
const cgHost = "https://zztt15.com";

// 数据处理
const getData = (data, host) => {
  if (!data) return [];
  const dataList = [];
  try {
    const $ = cheerio.load(data);

    $('.video-item').each((index, element) => {
      // 标题
      const articleText = $(element).find('.title').text().trim();
      // 链接
      const articleHref = cgHost + $(element).find('a').attr('href');
      // 背景图
      const img = host + $(element).find('img').attr('onload').replace("loadImg(this,'", "").replace("')", "");
      // console.log(`Article ${index + 1}: Text: ${articleText}, Href:${articleHref}`);
      // console.log(img)
      // console.log("============================")
      if (articleText != '') {
        dataList.push({
          title: articleText,
          desc: articleText,
          pic: img,
          hot: Number(0),
          url: articleHref,
          mobileUrl: img,
        });
      }
    });

    return dataList;
  } catch (error) {
    console.error("数据处理出错" + error);
    return false;
  }
};

// 图片解密
zztt15Router.get("/zztt15/img", async (ctx) => {
  const paramUrl = ctx.query.url;
  console.log(`请求参数=> ${paramUrl}`);
  // return loadImg(paramUrl);
  try {
    const result = await loadImg(paramUrl);
    // 处理返回值
    // console.log(result);
    // 在这里进行进一步操作，例如将返回的图像数据发送给客户端
    // ctx.body = result;
    // 将图像数据作为响应发送给浏览器
    ctx.type = 'image/jpeg'; // 设置响应类型为图像/jpeg
    ctx.body = Buffer.from(result.split(',')[1], 'base64'); // 将Base64字符串转换为Buffer并发送
  } catch (error) {
    // 处理错误
    console.error(error);
    // 在这里进行错误处理，例如发送错误响应给客户端
    ctx.body = 'Error';
  }
});


// 黑料网热搜
zztt15Router.get("/zztt15", async (ctx) => {
  console.log("获取黑料网热搜");
  try {
    // 从缓存中获取数据
    let data = await get(cacheKey);
    const from = data ? "cache" : "server";
    if (!data) {
      // 如果缓存中不存在数据
      console.log("从服务端重新获取黑料网热搜");
      // 从服务器拉取数据
      const response = await axios.get(cgHost);
      data = getData(response.data, getIpHost(ctx));
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

// 黑料网热搜 ==> 分类
zztt15Router.get("/zztt15/:param1/:param2", async (ctx) => {
  const param1 = ctx.params.param1; // 获取param1的值
  const param2 = ctx.params.param2; // 获取param2的值
  console.log(`请求参数=> ${param1} ${param2}`)
  var url = cgHost;
  if (param1 != '') {
    // eslint-disable-next-line no-const-assign
    url = url + '/category/' + param1.toString();
  }
  if (param2 != '') {
    // eslint-disable-next-line no-const-assign
    url = url + '/' + param2.toString();
  }
  console.log("获取黑料网热搜");
  try {
    // 从缓存中获取数据
    let data = await get(cacheKey);
    const from = data ? "cache" : "server";
    if (!data) {
      // 如果缓存中不存在数据
      console.log("从服务端重新获取黑料网热搜");
      // 从服务器拉取数据
      const response = await axios.get(url);
      data = getData(response.data,getIpHost(ctx));
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

// 黑料网热搜 - 获取最新数据
zztt15Router.get("/zztt15/new", async (ctx) => {
  console.log("获取黑料网热搜 - 最新数据");
  try {
    // 从服务器拉取最新数据
    const response = await axios.get(cgHost);
    const newData = getData(response.data,getIpHost(ctx));
    updateTime = new Date().toISOString();
    console.log("从服务端重新获取黑料网热搜");

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

function getIpHost(ctx) {
  // 获取当前请求的host
  const host = ctx.request.host;

  const jimiImg = 'http://' + host + '/zztt15/img?url=';
  return jimiImg;
}



zztt15Router.info = routerInfo;
module.exports = zztt15Router;
