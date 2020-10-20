const resource = require("../middleware/resource");

module.exports = app => {
    const { router, controller } = app;

    // 引入中间件
    const getId = app.middleware.getId();         // 解析出数据Id
    const response = app.middleware.response();     // 捕捉执行过程的错误
    const auth = app.middleware.auth();           // 验证登录

}