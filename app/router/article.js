module.exports = app => {
    const { router, controller } = app;

    // 引入中间件
    const getId = app.middleware.getId();         // 解析出数据Id
    const response = app.middleware.response();     // 捕捉执行过程的错误
    const auth = app.middleware.auth();           // 验证登录

    // markdown 上传照片
    router.post('/api/index/article/upload', auth, response, controller.article.uploadImg);

    // 新建文章
    router.post('/api/index/article', auth, response, controller.article.create_article);

    // 更新文章内容
    router.put('/api/index/article/:id', auth, response, getId, controller.article.update_article);

    // 作者设置文章 是否私密        直接通过更新文章即可，修改部分字段

    // 删除文章
    router.delete('/api/index/article/:id', auth, response, getId, controller.article.delete_article);

    // 获取置顶文章
    router.get('/api/index/article/top', response, controller.article.get_article_top);

    // 获取具体文章
    router.get('/api/index/article/:id', response, getId, controller.article.get_article_id);

    // 获取分页文章
    router.get('/api/index/article/pages/:page', response, controller.article.get_article_pages);

    // 根据分类的 _id 返回文章
    router.get('/api/index/article/category/:id', response, getId, controller.article.get_article_category);

    // 文章阅读+1
    router.put('/api/index/article/read/:id', response, getId, controller.article.read_article);

    // 文章被当前用户收藏
    router.put('/api/index/article/fav/:id', auth, response, getId, controller.article.fav_article)
}