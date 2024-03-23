const CryptoJS = require('crypto-js');

function AES_Decrypt(word) {
    var srcs = word;
    var key = CryptoJS.enc.Utf8.parse('f5d965df75336270');
    var iv = CryptoJS.enc.Utf8.parse('97b60394abc2fbe1');
    var decrypt = CryptoJS.AES.decrypt(srcs, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return decrypt.toString(CryptoJS.enc.Base64);
}
// decrypt['toString'](CryptoJS['enc']['Base64'])

var is_cdnimg = function (path) {
    if (typeof (path) !== "string") {
        return false
    }
    if (path.indexOf("/xiao/") !== -1) {
        return true;
    }
    if (path.indexOf("/upload/upload/") !== -1) {
        return true;
    }
    return false;
}

function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

var ab2b64 = function (t) {
    return new Promise(function (e) {
        const base64str = arrayBufferToBase64(t);
        e(base64str);
    });
};
const axios = require('axios');

async function loadBackgroundImage(bgUrl) {
    if (is_cdnimg(bgUrl)) {
        try {
            const response = await axios.get(bgUrl, {
                responseType: 'arraybuffer',
            });
            const res = response.data;
            const base64str = await ab2b64(res);
            const ary = bgUrl.split('.');
            const decryptStr = AES_Decrypt(base64str);
            console.log(decryptStr)
            const base64st = 'data:image/' + ary.pop() + ';base64,' + decryptStr;
            console.log("===================")
            console.log("===================")
            console.log("===================")
            console.log("===================")
            console.log("===================")
            console.log(base64st)
            return base64st;
        } catch (error) {
            console.error(error);
        }
    } else {
        const base64st = 'url("' + bgUrl + '")';
        return base64st;
    }
}

console.log(loadBackgroundImage('https://pic.jcezlxm.cn/upload/upload/20240311/2024031120484810172.jpg'));