const crypto = require('crypto');
const CryptoJS = require('crypto-js');
const axios = require('axios');
window = global;
const JSEncrypt = require("jsencrypt");

// 加密key
function m(n) {
    const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2WxnqdfalxP45kvAk+pz
kabw4T9zk5OvbCgPBpb2KEqMV3ZF9xyPeMaxPZnUXzicai1j/1I3vriSSCfvZ9pN
xrAh/P6N3NidzlvWbmvjL3gBzIeQXeWbBMxgUzVYGAE6vxqewmZatxUF0Venh3k8
9hjdU/pP0Vsqxp3mXOKpR5T9UrOQb9eFhndOJ4mVYxsHQMEAs+H8mn3IA9w++HdE
/rZRDdVGsCvUZsgecI0tV4qut1la6oPt6q/27eXUqV/IBdTOaowvU05YtFIRpb66
078HGkkmt/qJLNmveIH5vHRpeEqA3twE9L7OgIZJMG2uruoxprH2ysM5YsZIYkCr
WwIDAQAB
-----END PUBLIC KEY-----`;
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    return encrypt.encrypt(n);
}

// key和iv 以固定
r = "F79D07C1E892A6B3"
o = "E5C7E63E6914A8B0"
c = JSON.stringify({
    key: Buffer.from(r).toString("base64"),
    iv: Buffer.from(o).toString("base64")
})
h = m(c)

// 加密请求参数
function d(n, e, data) {
    n = CryptoJS.enc.Utf8.parse(n);
    e = CryptoJS.enc.Utf8.parse(e);
    const encrypted = CryptoJS.AES.encrypt(data, n, {
        iv: e,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}

// 解密key
function y(n) {
    const privateKey = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDY8WdvLG4ObJyq
3Gme9HD9uVSGjWtf5c66C/eiwNJe2O0mratg0t2BuGzI6hIYrHMe/B8ffbkYH6J5
8Ru8IqIar5eVRSTh5A0rNOzSf/S0PvOlgmPVac8vJijmpTBe1UdJm9wRLfonUZqG
jFXcRNhUFr+Fc2vZ1/wjjFz2P4iPe2wim1g5iTNdfJoUbBLg5QAF35JHGq9o3HFK
pNk/9neOKo7RXETI2nklfrPy/EOEUU8LD0dyta/idBZz5QXisptQmNZUA1l2VWyt
/Q72zdU+KU/yQ2YvAjNmR4nd6NdXPhsKDn6n+JaAzTlWbeYfE0JWh2JcJM8GfD2d
Z0HdZXaDAgMBAAECggEAfzIi/BrnuEtUHBW5U7psWUcFWRKnpwVdjNWhbupxLa0w
dqISvmVD/F++YJpk29SYds1KDjOvh4Zcw/Rq14bS1qSnUpzEwDDuy6tvQwhE2D2k
qyDlGea81B8ikgC+eIvCDVV11RjI966v1D2JxekTkVH5HuyKiqJJMiqFAthDYCPf
5XC7eaAf6dpW9sDTisrb4woaN+4nA+NBgww7sFLs0/0OM4fSrJK5ObxUkSxc+fj9
xWbHeaVMiyqR/OmOMl3uIf5ffLWDdiqYlxkH18WFDrqr2dkKQxjFvJ0y4kcTf8P8
K0xfSXt5SdDiRHpQEe3hfp03zfxoRsRNzRIa3InyuQKBgQDvFv0wPoBxkUupZ8Pi
HXgPNiqPy5iG77d+Jn9/xJ/gv1vfQoW0J0TYUYL8n1m6c9KwzpUrlJhQuAX+Ad9e
/XLtgmG0IcAQ7rLARXsRZSMGRRPYHX9X+vuOfoKLgP/2ZIj0B1rrbZH802rjkqUW
8x8kT71SX/OQuBbOcTYs7VAGNQKBgQDoSWuHmkXwtQ0cgVputlaLRzPiqAKkOBQG
WL8msqNdYQ9BfFfmPwM+sFsonA4NE4T+5AR/5JysnLpsvZpC2QriIBQlgBQt9Lel
6hzSzFVRkPkz3zTZFWRwArL2R0Hjj44897tOYW4oK1PgkLokTtgzBdvGWFS5psSm
A7EqX3dA1wKBgAUSKcCSMss117L6Hm93TIqWDYULPmruPqgQTPf6xaFQrbQohwlx
I8aqw+pzvsVzm25gk01fU3Oy0321sHUlTwC2mTfm11oElgn570hJKtsBMBCPX5oQ
GrHFASPQUp15OGZkmYsQwd3o5gV5oMLB2VE917gdjN7u6JzsTcfaKK5ZAoGBAKsx
URqDTIB2Ls+PVcK6h1XmiArHoAq/eaKjzV0L0vKDEedFaNK8JfwRpV1shb6FYEMq
cVaAeieM6qgxpHsX0rmMwsxQdI7aCG8y90M0bLzMh5z/J8fFyFv04Ug4hAreRgoQ
2e6OR807AXpDr6wKn7Qa4Tpw5yBcFBn2Jp//87fJAoGBAOh0SzrlxvzrZauwVjqd
veTajwPGQlmYjNPW9XIDFcO1YhR3HCnpl47RYrXT0lvuz0U+OcgeWEoDW+okw1f2
uX2xSdwhiNiiOFtOQiGmrEumH2wgHg2rA8u3xOza+OxPpB7bDSFe4DsqlnRVXzDm
3DtD0lwzJVe52++V5NhE+/E8
-----END PRIVATE KEY-----`
    const decrypted = new JSEncrypt();
    decrypted.setPrivateKey(privateKey);
    return decrypted.decrypt(n);
}

// 解密data
function f(e, t, data) {
    const r = Buffer.from(e, "base64");
    const o = Buffer.from(t, "base64");
    const decipher = crypto.createDecipheriv("aes-128-cbc", r, o);
    let decryptedData = decipher.update(data, "base64", "utf8");
    decryptedData += decipher.final("utf8");
    return decryptedData;
}

// header
const headers = {
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Content-Type": "application/json;charset=UTF-8",
    "Origin": "https://fpie2.com",
    "Pragma": "no-cache",
    "Referer": "https://fpie2.com/",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "cross-site",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    "hm": "008-api",
    "sec-ch-ua": "\"Not A(Brand\";v=\"99\", \"Google Chrome\";v=\"121\", \"Chromium\";v=\"121\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\""
};

// 封装参数
function sendData(ltype, page, index) {
    let ys = '';
    if (index == 'homePage'){
        // https://api.cbbee0.com/v1_2/homePage
        ys = '{"ltype":' + ltype + ',"page":' + page + ',"length":10,"last_page":0,"totalPage":0,"userToken":"","device_id":""}'
    }
    if (index == 'filmInfo'){
        // https://api.cbbee0.com/v1_2/filmInfo
        ys = '{"film_id":"' + page + '","userToken":"","device_id":""}';
    }
    if (index == 'movieInfo'){
        // https://api.cbbee0.com/v1_2/movieInfo
        ys = '{"sort":2,"type":"1","type_id":"' + page + '","page":1,"length":20,"userToken":"","device_id":""}';
    }
    // 请求data
    const data = {
        encrypt_key: h,
        encrypt_data: d(r, o, ys)
    }
    return data;
}

// 解密result
function parseData(ndata) {
    ndata.encrypt_key = JSON.parse(y(ndata.encrypt_key))
    const key = ndata.encrypt_key.key;
    const iv = ndata.encrypt_key.iv;
    const encrypt_data = ndata.encrypt_data;
    ndata.encrypt_data = f(key, iv, encrypt_data);
    return JSON.parse(ndata.encrypt_data);
}

module.exports = {
    headers,
    sendData,
    parseData
}
// // 获取数据
// axios.post('https://api.cbbee0.com/v1_2/homePage', data, {headers})
//     .then(response => {
//         // console.log(response.data);
//         ndata = response.data
//         ndata.encrypt_key = JSON.parse(y(ndata.encrypt_key))
//         const key = ndata.encrypt_key.key;
//         console.log("key => " + key);
//         const iv = ndata.encrypt_key.iv;
//         console.log("iv => " + iv);
//         const encrypt_data = ndata.encrypt_data;
//         ndata.encrypt_data = f(key, iv, encrypt_data);
//         console.log(JSON.parse(ndata.encrypt_data))
//     })
//     .catch(error => {
//         console.error(error);
//     });
