module.exports = app => {
    const { router, controller } = app;

    // 应用中间件
    const getId = app.middleware.getId();         // 解析出数据Id
    const response = app.middleware.response();     // 捕捉执行过程的错误
    const auth = app.middleware.auth();           // 验证登录

    // 获取当前用户的收藏记录
    router.get('/api/index/userfav/self', auth, response, controller.userFav.get_userFav);

    // 当前用户删除收藏记录
    router.delete('/api/index/userfav/:id', auth, response, getId, controller.userFav.delete_userFav);
}