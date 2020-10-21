const resource = require("../middleware/resource");

module.exports = app => {
    const { router, controller } = app;

    // 引入中间件
    const getId = app.middleware.getId();         // 解析出数据Id
    const response = app.middleware.response();     // 捕捉执行过程的错误
    const auth = app.middleware.auth();           // 验证登录

    // 新建根评论
    router.post('/api/index/comment', auth, response, controller.comment.create_comment);

    // 新建回复类型评论
    router.post('/api/index/commentreply', auth, response, controller.comment.create_commentReply);

    // 删除根评论
    router.delete('/api/index/comment/:id', auth, response, getId, controller.comment.delete_comment);

    // 删除回复类型评论
    router.delete('/api/index/commentreply/:id', auth, response, getId, controller.comment.delete_commentReply);
}