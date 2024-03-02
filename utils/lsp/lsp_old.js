const axios = require("axios");
const CryptoJS = require("crypto-js");
const fs = require('fs');
const path = require('path');

const Host = 'http://lb.h12345.net';

const url = `${Host}/zb/index.json?time=${new Date().getTime()}`;

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

async function fetchAndUpdateSLiveContents() {
    // 存储所有文件内容的数组
    const fileContents = [];

    // 添加一个更新时间
    fileContents.push(`💘更新时间: ${new Date().toLocaleString()},#genre#\n`)

    // 默认添加斗鱼源
    const filePath = path.join(__dirname, '斗鱼.txt');
    const content = fs.readFileSync(filePath, 'utf-8');

    // 使用文件名前缀替换分隔符中的“中央”
    const prefix = '斗鱼';
    const separator = `\n💘${prefix},#genre#\n`;

    fileContents.push(separator + content);


    // 从服务器拉取数据
    axios.get(url)
        .then((response) => {
            const data = JSON.parse(AES_Decrypt(response.data));
            const requests = [];

            data.data.forEach(item => {
                // 拼接子url
                const zurl = `${Host}/zb/${item.name}.json?time=${new Date().getTime()}`;

                // 请求子url
                requests.push(
                    axios.get(zurl)
                        .then((zResponse) => {
                            // 将响应数据保存到文件
                            const fileName = `${item.platform}.txt`;
                            if (!fileName.includes('小红帽') || !fileName.includes('收费')) {
                                // 处理数据
                                // 第一步解密
                                const zdata = JSON.parse(AES_Decrypt(zResponse.data));
                                // 重新拼接内容
                                let content = '';
                                zdata.data.forEach(item => {
                                    const line = `${item.name},${item.rtmp}`;
                                    content = content + line + '\n';
                                });
                                // 使用文件名前缀替换分隔符中的“中央”
                                const prefix = item.platform;
                                const separator = `\n💘${prefix},#genre#\n`;
                                fileContents.push(separator + content);
                            } else {
                                console.log(`跳过 =》 ${item.platform}`);
                            }
                        })
                        .catch((zError) => {
                            console.log(`请求子url时发生错误：${zError}`);
                        })
                );
            });

            // 等待所有子url请求完成
            Promise.all(requests)
                .then(() => {
                    // 合并内容
                    const mergedContent = fileContents.join('');

                    // 写入合并后的内容到新文件
                    const outputPath = '../../public/tvbox/live.txt';
                    // 检查文件是否存在
                    if (fs.existsSync(outputPath)) {
                        // 如果文件存在，删除文件
                        fs.unlinkSync(outputPath);
                    }
                    fs.writeFileSync(outputPath, mergedContent);

                    console.log(`合并完成，结果已保存到文件：${outputPath}`);
                })
                .catch((error) => {
                    console.log(`请求子url时发生错误：${error}`);
                });
        })
        .catch((error) => {
            console.log(error);
        });
}
module.exports = {
    fetchAndUpdateSLiveContents
};
// fetchAndUpdateFileContents();

