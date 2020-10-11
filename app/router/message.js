module.exports = app => {
    const { router, controller } = app;

    // 引入中间件
    //const resource = app.middleware.resource();     // 解析出数据类型
    const getId = app.middleware.getId();         // 解析出数据Id
    const response = app.middleware.response();     // 捕捉执行过程的错误
    const auth = app.middleware.auth();           // 验证登录

    // 当前用户给其他用户留言
    router.post('/api/index/message', auth, response, controller.message.post_message);

    // 当前用户获取留言   type=own:自已写给他人         type=others:他人写给自已
    router.get('/api/index/message/:type', auth, response, controller.message.get_messages);

    // 当前用户表示已查看一条留言       留言的to必须是当前用户id    status更改
    router.put('/api/index/message/:id', auth, response, getId, controller.message.read_message);

}