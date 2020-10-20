module.exports = app => {
    const { router, controller } = app;
    // 引入中间件
    const resource = app.middleware.resource();     // 解析出数据类型
    const getId = app.middleware.getId();         // 解析出数据Id
    const response = app.middleware.response();     // 捕捉执行过程的错误

    router.get('/api/index/overview', response, controller.public.get_overview);

    // 获取某项全部资源           用于获取修改数据时的选项
    //router.get('/api/:resource', response, resource, controller.public.get_resource);

    // 获取某项单个资源
    //router.get('/api/:resource/:id', response, resource, getId, controller.public.get_resource_id);

    // 更新资源
    //router.put('/api/:resource/:id', response, resource, getId, controller.public.update_resource);

    // 删除资源
    //router.delete('/api/:resource/:id', response, resource, getId, controller.public.dele_resource);

    // 创建资源
    //router.post('/api/:resource', response, resource, controller.public.create_resource);

    // 协会总体信息展示
    //router.get('/api/index/overview', response, controller.public.get_overview);

}