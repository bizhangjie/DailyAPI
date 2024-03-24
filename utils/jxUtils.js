// 开始请求
const CryptoJS = require('crypto-js');
const axios = require('axios');
const FormData = require('form-data');
const https = require('https');

function AES_Decrypt(word,key,iv) {
    var key = CryptoJS.enc.Utf8.parse(key);
    var iv = CryptoJS.enc.Utf8.parse(iv);
    var srcs = word;
    var decrypt = CryptoJS.AES.decrypt(srcs, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return decrypt.toString(CryptoJS.enc.Utf8);
}

var sign = function (a) {
    var b = CryptoJS.MD5(a);
    var c = CryptoJS.enc.Utf8.parse(b);
    var d = CryptoJS.enc.Utf8.parse('3cccf88181408f19');
    var e = CryptoJS.AES.encrypt(a, c, {
        iv: d,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
    });
    return e.toString()
}

function hex_md5(s) {
    return CryptoJS.MD5(s).toString();
}

function parseHtml(url) {
    const date = new Date().getTime();
    // console.log("时间戳 => " + date)
    var encodedUrl = encodeURIComponent(url);
    // console.log("Url => " + encodedUrl);
    // console.log("md5 => " + hex_md5(date + encodedUrl));
    const Key = sign(hex_md5(date + encodedUrl));
    // console.log("解密key => " + Key);

    // POST请求的URL和数据
    const host = 'https://122.228.8.29:4433/xmflv.js';
    // 创建一个FormData对象并添加数据
    const formData = new FormData();
    formData.append('wap', 1);
    formData.append('url', encodedUrl);
    formData.append('time', date);
    formData.append('key', Key);

    // 创建自定义的https代理
    const httpsAgent = new https.Agent({
        rejectUnauthorized: false
    });

    // 发送包含FormData的POST请求
    return axios.post(host, formData, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Origin': 'https://jx.xmflv.com'
        },
        httpsAgent // 设置https代理
    })
        .then(response => {
            const data = response.data;
            const url = data.url;
            const aesKey = data.aes_key;
            const aesIV = data.aes_iv;
            const playUrl = AES_Decrypt(url, aesKey, aesIV);

            // console.log('URL:', url);
            // console.log('AES Key:', aesKey);
            // console.log('AES IV:', aesIV);
            // console.log("播放地址 => " + playUrl);

            return playUrl; // 返回playUrl
        })
        .catch(error => {
            console.error(error);
        });
}

// var url = 'https://v.youku.com/v_show/id_XNjE5ODQ3MTcxNg==.html?s=badbb5792f934ddb82fd';
// parseHtml(url)
//     .then(playUrl => {
//         console.log("返回的播放地址 => " + playUrl);
//     })
//     .catch(error => {
//         console.error(error);
//     });

module.exports = parseHtml;