// 封装通用的响应函数
function response(ctx, status, data = '', message = null) {
    ctx.status = status;
    if (data !== '' && data !== null) {
        ctx.body = { status, data, message };
    } else {
        ctx.body = { status, message };
    }
}

// 导出响应函数
module.exports = response;