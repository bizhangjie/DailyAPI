require("dotenv").config();
const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const cors = require("koa2-cors");
const serve = require("koa-static");
const views = require("koa-views");

const app = new Koa();
const net = require("net");
const router = require("./routes");

// 配置信息
let domain = process.env.ALLOWED_DOMAIN || "*";
let port = process.env.PORT || 6688;

// 解析请求体
app.use(bodyParser());

// 静态文件目录
app.use(serve(__dirname + "/public"));
app.use(views(__dirname + "/public"));

// 跨域
app.use(
    cors({
        origin: domain,
    }),
);

// CORS
app.use(async (ctx, next) => {
    ctx.set("Access-Control-Allow-Origin", domain);
    ctx.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    ctx.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    ctx.set("Access-Control-Allow-Credentials", "true");
    // 处理预检请求
    if (ctx.method === "OPTIONS") {
        ctx.status = 200;
    } else {
        if (domain === "*") {
            await next();
        } else {
            if (ctx.headers.origin === domain || ctx.headers.referer === domain) {
                await next();
            } else {
                ctx.status = 403;
                ctx.body = {
                    code: 403,
                    message: "请通过正确的域名访问",
                };
            }
        }
    }
});

const fs = require("fs");

// vercel是只读，无法使用
// // 访问统计函数
// const accessStatistics = async (ctx, next) => {
//     const ip = ctx.request.ip; // 获取访问者的 IP 地址
//     const userAgent = ctx.headers["user-agent"]; // 获取访问者的浏览器信息
//     const url = ctx.request.url; // 获取访问的 URL
//     // 执行下一个中间件或路由处理程序，并捕获响应结果
//     await next();
//
//     // 获取响应的状态码
//     const statusCode = ctx.response.status;
//
//     // 记录访问日志
//     const log = `IP: ${ip}, User Agent: ${userAgent}, URL: ${url}, Status Code: ${statusCode}\n`;
//     fs.appendFileSync("access.log", log, "utf8");
// };
//
// // 使用访问统计中间件
// app.use(accessStatistics);

// 使用路由中间件
app.use(router.routes());
app.use(router.allowedMethods());

// 启动应用程序并监听端口
const startApp = (port) => {
    app.listen(port, () => {
        console.info(`成功在 ${port} 端口上运行`);
        console.info(`地址：http://127.0.0.1:${port}`)
    });
};

// 检测端口是否被占用
const checkPort = (port) => {
    return new Promise((resolve, reject) => {
        const server = net
            .createServer()
            .once("error", (err) => {
                if (err.code === "EADDRINUSE") {
                    console.info(`端口 ${port} 已被占用, 正在尝试其他端口...`);
                    server.close();
                    resolve(false);
                } else {
                    reject(err);
                }
            })
            .once("listening", () => {
                server.close();
                resolve(true);
            })
            .listen(port);
    });
};

// 设置404页面的路由处理程序
app.use(async (ctx) => {
  await ctx.render("404"); // 渲染404页面
});

// 尝试启动应用程序
const tryStartApp = async (port) => {
    let isPortAvailable = await checkPort(port);
    while (!isPortAvailable) {
        port++;
        isPortAvailable = await checkPort(port);
    }
    startApp(port);
};



tryStartApp(port);
