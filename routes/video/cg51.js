const Router = require("koa-router");
const cgRouter = new Router();
const axios = require("axios");
const { get, set, del } = require("../../utils/cacheData");

const cheerio = require('cheerio');

const { loadBackgroundImage } = require("../../utils/51cgjm");

// 接口信息
const routerInfo = { name: "51cg", title: "51吃瓜", subtitle: "每日榜", category: "wpac(今日吃瓜) mrdg(每日吃瓜) rdsj(热门吃瓜) bkdg(必看大瓜) whhl(网红黑料) \
xsxy(学生学校) whmx(明星黑料)" };

// 缓存键名
const cacheKey = "51cgData";

// 调用时间
let updateTime = new Date().toISOString();

// 永久导航页（需翻墙）
const cgHost = "https://51cg1.com";

// 数据处理
const getData = (data, host) => {
  if (!data) return [];
  const dataList = [];
  try {
    const $ = cheerio.load(data);
    $('article').each((index, element) => {
        // 标题
        const articleText = $(element).find('.post-card-title').text().trim();
        // 链接
        const articleHref = cgHost + $(element).find('a').attr('href');
        // push日期
        const date = $(element).find('.post-card-info span').text();
        // 背景图
        const regex = /loadBannerDirect\('([^']+)'/;
        const match = regex.exec($(element).text());
        var Img = null;
        if (match && match[1]) {
            const imageUrl = match[1];
            Img = host + imageUrl;
        }
        if(articleText != '' && date !=''){
          dataList.push({
            title: articleText,
            desc: articleText,
            date: date,
            pic: Img,
            hot: Number(0),
            url: articleHref,
            mobileUrl: Img,
          });
        }

    });

    return dataList;
  } catch (error) {
    console.error("数据处理出错" + error);
    return false;
  }
};

// 51吃瓜热搜
cgRouter.get("/51cg", async (ctx) => {
  console.log("获取51吃瓜热搜");
  try {
    // 从缓存中获取数据
    let data = await get(cacheKey);
    const from = data ? "cache" : "server";
    if (!data) {
      // 如果缓存中不存在数据
      console.log("从服务端重新获取51吃瓜热搜");
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

// 51吃瓜热搜 ==> 分类
cgRouter.get("/51cg/:param1/:param2", async (ctx) => {
  const param1 = ctx.params.param1; // 获取param1的值
  const param2 = ctx.params.param2; // 获取param2的值
  console.log(`请求参数=> ${param1} ${param2}`)
  var url = cgHost;
  if(param1 != ''){
    // eslint-disable-next-line no-const-assign
    url = url + '/category/' + param1.toString();
  }
  if(param2 != ''){
    // eslint-disable-next-line no-const-assign
    url = url + '/' + param2.toString();
  }
  console.log("获取51吃瓜热搜");
  try {
    // 从缓存中获取数据
    let data = await get(cacheKey);
    const from = data ? "cache" : "server";
    if (!data) {
      // 如果缓存中不存在数据
      console.log("从服务端重新获取51吃瓜热搜");
      // 从服务器拉取数据
      const response = await axios.get(url);
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

// 51吃瓜热搜 - 获取最新数据
cgRouter.get("/51cg/new", async (ctx) => {
  console.log("获取51吃瓜热搜 - 最新数据");
  try {
    // 从服务器拉取最新数据
    const response = await axios.get(cgHost);
    const newData = getData(response.data,getIpHost(ctx));
    updateTime = new Date().toISOString();
    console.log("从服务端重新获取51吃瓜热搜");

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

// 图片解密
cgRouter.get("/51cg/img", async (ctx) => {
  const paramUrl = ctx.query.url;
  console.log(`请求参数=> ${paramUrl}`);
  // return loadImg(paramUrl);
  try {
    const result = await loadBackgroundImage(paramUrl);
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


function getIpHost(ctx) {
  // 获取当前请求的host
  const host = ctx.request.host;

  const jimiImg = 'http://' + host + '/51cg/img?url=';
  return jimiImg;
}

cgRouter.info = routerInfo;
module.exports = cgRouter;
