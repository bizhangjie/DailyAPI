const Router = require("koa-router");
const J1HostRouter = new Router();
const axios = require("axios");
const {get, set, del} = require("../../utils/cacheData");
const response = require('../../utils/response')
const cheerio = require('cheerio');

// 接口信息
const routerInfo = {
    name: "madoutv", title: "madoutv影视", subtitle: "每日榜", category: ""
};

// 缓存键名
const cacheKey = "madoutvData";

// 调用时间
let updateTime = new Date().toISOString();

// 永久导航页（需翻墙）
const Host = "https://www.madou.tv";

// 数据处理
function t(e) {
    for (var t = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"], n = "", r = 0; r < e; r++) {
        var o = Math.ceil(35 * Math.random());
        n += t[o]
    }
    return n
}

// console.log(t(6))

// 加密
function x(e, t) {
    var n = i(JSON.stringify(e), t)
        , r = {
        "post-data": n
    };
    return r
}

const CryptoJS = require("crypto-js");

const r = CryptoJS;
const o = "-p9B[~PnPs";
const a = "Vq234zBeSdGgYXzVTEfnnjjdmaTkk7A4";

// 加密
function i(e, t) {
    const n = r.enc.Utf8.parse(o + t);
    const i = r.enc.Utf8.parse(a);
    const c = r.AES.encrypt(e, i, {
        iv: n,
        mode: r.mode.CBC,
        padding: r.pad.Pkcs7,
        format: r.format.OpenSSL
    });
    const u = c.toString();
    return u;
}

// 解密
function c(e, t) {
    var n = r.enc.Utf8.parse(o + t)
        , i = r.enc.Utf8.parse(a)
        , c = r.AES.decrypt(e, i, {
        iv: n,
        mode: r.mode.CBC,
        padding: r.pad.Pkcs7,
        formatter: r.format.OpenSSL
    });
    return c.toString(r.enc.Utf8)
}

function md5(t) {
    return CryptoJS.MD5(t).toString();
}

b = "m}q%ea6:LDcmS?aK)CeF287bPvd99@E,9Up^"
w = function (e) {
    var t = e.split("&").sort().join("&");
    return t = t + "&" + b,
        md5(t).toString()
}
    , encode_sign = function (e) {
    if ("string" == typeof e)
        return m.paramsStrSort(e);
    if ("object" == typeof e) {
        var t = [];
        for (var n in e)
            (e[n] && "" != e[n] || 0 === e[n]) && t.push(n + "=" + e[n]);
        return w(t.join("&"))
    }
}

d = function () {
    var e = (new Date).getTime();
    return e
}

function dataJSON(wd,pg) {
    const timestamp = d();
    var e = {
        "page": parseInt(pg),
        "list_row": 100,
        "keyword": wd,
        "timestamp": timestamp
    };

    var e2 = {
        "page": parseInt(pg),
        "list_row": 100,
        "keyword": wd,
        "timestamp": timestamp,
        "encode_sign": encode_sign(e)
    }
    return e2;
}

async function search(wd,page) {
    var data = dataJSON(wd,page);

    const axios = require('axios');
    // console.log(data)

    const suffix = t(6);
    jm = x(data, suffix)

    // console.log(jm)
    // console.log(suffix)

    const url = 'https://api.nzp1ve.com/video/list';
    const headers = {
        'sec-ch-ua': 'Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'suffix': suffix,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Referer': '',
        'sec-ch-ua-platform': 'Windows'
    };
    const datajm = jm;
    var result ;
    await axios.post(url, datajm, {headers})
        .then(response => {
            var a = response.data;
            // console.log(a);
            // console.log("开始解密：")
            result = JSON.parse(c(a.data, a.suffix))
        })
        .catch(error => {
            console.error(error);
            result = error.toString();
        });
    return result;
}

// madoutv影视搜索
J1HostRouter.get("/madoutv/:wd/:page", async (ctx) => {
    const {wd, page} = ctx.params;
    console.log(`获取madoutv影视 ${wd}_${page}`);
    try {
        // 从缓存中获取数据
        let data = await get(`${cacheKey}_${wd}_${page}`);
        const from = data ? "cache" : "server";
        if (!data) {
            // 如果缓存中不存在数据
            console.log("从服务端重新获取madoutv影视");
            // 从服务器拉取数据
            data = await search(wd,page);
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
            await set(`${cacheKey}_${wd}_${page}`, data);
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


J1HostRouter.info = routerInfo;
module.exports = J1HostRouter;
