const Router = require("koa-router");
const scheduleRouter = new Router();
const response = require('../../utils/response')

const {fetchAndUpdateSLiveContents} = require('../../utils/lsp/lsp')

// 接口信息
const routerInfo = {
    name: "定时任务", title: "定时任务", subtitle: "***", category: ""
};

// 执行脚本
scheduleRouter.get("/schedule/slive", async (ctx) => {
    console.log(`执行直播源更新`);
    try {
        await fetchAndUpdateSLiveContents(); // Wait for the script execution to complete
        response(ctx, 200, "脚本执行成功", "等1分钟");
    } catch (err) {
        response(ctx, 606,"此类数据有毒，但是很好看！", err.message);
    }
});
scheduleRouter.info = routerInfo;
module.exports = scheduleRouter;
