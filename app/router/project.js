module.exports = app => {
    const { router, controller } = app;

    // 引入中间件
    //const resource = app.middleware.resource();     // 解析出数据类型
    const getId = app.middleware.getId();         // 解析出数据Id
    const response = app.middleware.response();     // 捕捉执行过程的错误
    const auth = app.middleware.auth();           // 验证登录

    // 获取所有project的信息
    router.get('/api/index/project', response, controller.project.get_projects);

    // 获取单个project的信息
    router.get('/api/index/project/:id', response, getId, controller.project.get_project_info);

    // 当前用户修改project的信息，  需要是该project的leader
    router.put('/api/index/project/:id', auth, response, getId, controller.project.update_project_info);

    // 当前用户加入或者退出一个project
    router.put('/api/index/project/:id/:choose', auth, response, getId, controller.project.join_project);

    // 创建一个project，需要当前用户的level是3或4
    router.post('/api/index/project', auth, response, controller.project.create_project);

    // 删除一个project   level>2
    router.delete('/api/index/project/:id', auth, response, getId, controller.project.dele_project);

}