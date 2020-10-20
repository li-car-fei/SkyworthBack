const resource = require("../middleware/resource");

module.exports = app => {
    const { router, controller } = app;

    // 引入中间件
    const getId = app.middleware.getId();         // 解析出数据Id
    const response = app.middleware.response();     // 捕捉执行过程的错误
    const auth = app.middleware.auth();           // 验证登录

    router.get('/api/index/category', response, controller.category.get_category);

    router.get('/api/index/category/:id', response, getId, controller.category.get_category_id);

    router.put('/api/index/category/:id', response, getId, controller.category.update_category);

    router.delete('/api/index/category/:id', response, getId, controller.category.dele_category);

    router.post('/api/index/category', response, controller.category.create_category);
}