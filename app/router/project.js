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

    // 上传一个项目中间过程文件
    router.post('/api/index/projectfile/:id', auth, response, getId, controller.project.post_projectFile);

    // 获取某个项目中间过程文件信息
    router.get('/api/index/projectfile/:id', auth, response, getId, controller.project.get_projectFile);

    // 获取某个项目的某个中间过程文件信息
    router.get('/api/index/projectfile/:id/:projectfileid', auth, response, getId, controller.project.get_projectFile_id)

    // 上传一个项目新需求信息
    router.post('/api/index/projectrequest/:id', auth, response, getId, controller.project.post_projectRequest);

    // 获取某个项目新需求信息列表
    router.get('/api/index/projectrequest/:id', auth, response, getId, controller.project.get_projectRequest);

    // 获取某个项目的某条新需求
    router.get('/api/index/projectrequest/:id/projectrequestid', auth, response, getId, controller.project.get_projectRequest_id);

    // 新建一个项目图床目录
    router.post('/api/index/projectcatalog/:id', auth, response, getId, controller.project.post_projectCatalog);

    // 上传一张项目图床图片
    router.post('/api/index/projectpicture/:id', auth, response, getId, controller.project.post_projectPicture);

    // 获取一个项目的图床目录
    router.get('/api/index/projectcatalog/:id', auth, response, getId, controller.project.get_projectCatalog);

    // 删除图床目录
    router.delete('/api/index/projectcatalog/:id', auth, response, getId, controller.project.del_projectCatalog);

    // 获取一个图床目录下的图片地址
    router.get('/api/index/projectpicture/:id', response, getId, controller.project.get_projectPicture);

    // 删除图床图片
    router.delete('/api/index/projectpicture/:id', auth, response, getId, controller.project.del_projectPicture);

}