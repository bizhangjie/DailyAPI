const Router = require("koa-router");
const bilibiliLiveRouter = new Router();
const axios = require("axios");
const {get, set, del} = require("../../utils/cacheData");
const response = require('../../utils/response')
const cheerio = require('cheerio');
const {spawn} = require('child_process');
// 接口信息
const routerInfo = {
    name: "bilibiliLive", title: "bilibiliLive直播", subtitle: "每日榜", category: "直播源"
};

// 缓存键名
const cacheKey = "bilibiliLiveData";

// 调用时间
let updateTime = new Date().toISOString();

// 永久导航页（需翻墙）
const Host = "https://bilibili.com";

// 数据处理
const getData = (data) => {
    if (!data) return [];
    try {
        var listData = [];
        const htmlString = data;
        const $ = cheerio.load(htmlString);
        $('.thumbnail').each((index, element) => {
            // 标题
            const articleText = $(element).find('.title').text();
            // 图片地址
            const articleImg = $(element).find('.image').attr('style').replace("background-image: url('", "").replace("')", "");
            // 下载链接
            const articleHref = $(element).find('.title').find('a').attr('href');
            // push日期 + 作者
            // const date = $(element).find('.text-truncate').text().replace("\n",'').replace("\t",'');
            const time = $(element).find('.duration').text();
            // console.log(`Article ${index + 1}: Text: ${articleText}, Href:${articleHref}, Img:${articleImg}, time:${time}`);
            listData.push({
                aid: articleHref,
                title: articleText,
                img: articleImg,
                href: Host + '/' + articleHref,
                time: time
            })
            // console.log(`Article ${index + 1}: Text: ${articleText}, Href:${articleHref.split('/')[3]}, Img:${articleImg}, desc:${desc}`);
        });
        return {
            // count: $('.last-page').first().text(),
            data: listData,
        };
    } catch (error) {
        console.error("数据处理出错" + error);
        return false;
    }
};

// 播放地址
bilibiliLiveRouter.get("/bilibiliLive/:uid", async (ctx) => {
    const {uid} = ctx.params;
    // 使用正则表达式验证uid是否是整数字符串
    if (!/^\d+$/.test(uid)) {
        ctx.throw(400, "UID must be a valid integer string");
        return;
    }
    console.log(`获取bilibiliLive播放地址 => ${uid}`);
    const key = `${cacheKey}_${uid}`;
    try {
        // 从缓存中获取数据
        let data = await get(key);
        if (!data) {
            // 如果缓存中不存在数据
            console.log("从服务端重新获取bilibiliLive直播播放地址 => " + uid);
            // 从服务器拉取数据
            // 要执行的Python脚本路径
            const pythonScriptPath = '/opt/DailyAPI/py/bilibili_stream.py';

            // 要传递给Python脚本的参数
            const pythonScriptArgs = [uid];

            // 创建Python子进程
            const pythonProcess = spawn('python', [pythonScriptPath, ...pythonScriptArgs]);

            // 定义一个Promise包装函数，用于封装Python脚本的执行过程
            const runPythonScript = () => {
                return new Promise((resolve, reject) => {
                    let dataBuffer = Buffer.from('');
                    pythonProcess.stdout.on('data', (data) => {
                        dataBuffer = Buffer.concat([dataBuffer, data]);
                    });

                    pythonProcess.on('close', (code) => {
                        if (code === 0) {
                            const decodedData = dataBuffer.toString('utf8'); // 使用UTF-8解码数据
                            resolve(decodedData);
                        } else {
                            reject(new Error(`Python脚本执行失败，退出代码：${code}`));
                        }
                    });
                });
            };

            try {
                console.log("从服务端重新获取bilibiliLive直播播放地址 => " + uid);
                const decodedData = await runPythonScript();

                // 将数据写入缓存
                await set(key, decodedData);

                response(ctx, 200, decodedData, "从远程获取成功");
            } catch (error) {
                console.error("Python脚本执行失败：", error);
                response(ctx, 500, null, "从远程获取失败");
            }
        } else {
            response(ctx, 200, data, "从缓存获取成功");
        }
    } catch (err) {
        response(ctx, 606, "", "此类数据有毒，但是很好看！");
    }
});

// bilibiliLive直播搜索
bilibiliLiveRouter.get("/bilibiliLive/:wd/:page", async (ctx) => {
    const {wd, page} = ctx.params;
    const regex = /^[\u4e00-\u9fa5]{2,}$/; // 正则表达式匹配至少两个中文字符

    if (!regex.test(wd)) {
        ctx.body = "wd 参数必须包含至少两个以上的中文字符";
        return;
    }
    const url = `${Host}/search-${page}.htm?search=${wd}`;
    console.log(`获取bilibiliLive直播 ${url}`);
    try {
        // 从缓存中获取数据
        let data = await get(`${cacheKey}_${url}`);
        const from = data ? "cache" : "server";
        if (!data) {
            // 如果缓存中不存在数据
            console.log("从服务端重新获取bilibiliLive直播");
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
            await set(`${cacheKey}_${url}`, data);
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


bilibiliLiveRouter.info = routerInfo;
module.exports = bilibiliLiveRouter;
