const crypto = require('crypto');

function getParams(entity_id) {
    var timestamp = (new Date).getTime();
    var data = {
        "entity_id": entity_id,
        "timestamp": timestamp,
        "src": "pcw_tvg",
        "vip_status": 0,
        "vip_type": "",
        "auth_cookie": "",
        "device_id": "b4785714e2ef137a56cc6778890bc7f4",
        "user_id": "",
        "app_version": "7.0.0",
        "scale": 200
    }
    var _ = [
        "app_version=7.0.0",
        "auth_cookie=",
        "device_id=b4785714e2ef137a56cc6778890bc7f4",
        "entity_id=" + entity_id.toString(),
        "scale=200",
        "src=pcw_tvg",
        "timestamp=" + timestamp.toString(),
        "user_id=",
        "vip_status=0",
        "vip_type="
    ]
    // 添加字段
    _.push("".concat("secret_key", "=").concat("howcuteitis"))
    const md5Hash = crypto.createHash('md5').update(_.join("&")).digest('hex');
    // console.log(md5Hash.toUpperCase())
    data.sign = md5Hash.toUpperCase();
    return data
}

module.exports = {
    getParams
}