// video.js 路由模块
// 身份验证中间件
const isAuthenticated = (ctx, next) => {
    // 在这里执行身份验证逻辑
    // 检查请求中的密钥是否有效

    const { key } = ctx.request.query;

    if (key === 'secret_key') {
        // 密钥有效，继续下一个中间件或路由处理程序
        return next();
    } else {
        // 密钥无效，返回未授权的响应
        ctx.status = 401;
        ctx.body = 'Unauthorized';
    }
};



module.exports = isAuthenticated
