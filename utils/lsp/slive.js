const axios = require("axios");
const CryptoJS = require("crypto-js");
const fs = require('fs');

const Host = 'http://lb.h12345.net'

const url = `${Host}/zb/index.json?time=${new Date().getTime()}`


var key = CryptoJS.enc.Base64.parse("dkVnQGZlNTIhZlkoZGUvZA==");

function AES_Encrypt(word) {
    var srcs = CryptoJS.enc.Utf8.parse(word);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}

function AES_Decrypt(word) {
    var srcs = word;
    var decrypt = CryptoJS.AES.decrypt(srcs, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return decrypt.toString(CryptoJS.enc.Utf8);
}


// 从服务器拉取数据
axios.get(url)
    .then((response) => {
        console.log(response.data)
        console.log("解密：")
        const data = JSON.parse(AES_Decrypt(response.data))
        data.data.forEach(item => {
            // 拼接子url
            const zurl = `${Host}/zb/${item.name}.json?time=${new Date().getTime()}`
            console.log(zurl)

            // 请求子url
            axios.get(zurl)
                .then((zResponse) => {
                    // 将响应数据保存到文件
                    const fileName = `${item.platform}.txt`;
                    if (!fileName.includes('小红帽')) {
                        // 处理数据
                        // 第一步解密
                        const zdata = JSON.parse(AES_Decrypt(zResponse.data))
                        // 重新拼接内容
                        let content = '';
                        zdata.data.forEach(item => {
                            const line = `${item.name},${item.rtmp}`
                            content = content + line + '\n';
                        })
                        fs.writeFileSync("../lsp/txt/" + fileName, content);
                        console.log(`数据已保存到文件：${fileName}`);
                    }else{
                        console.log(`跳过 =》 ${item.platform}`)
                    }
                })
                .catch((zError) => {
                    console.log(`请求子url时发生错误：${zError}`);
                });
        })
    }).catch((error) => {
    console.log(error)
});
