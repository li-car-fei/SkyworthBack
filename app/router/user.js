module.exports = app => {
    const { router, controller } = app;

    // 引入中间件
    //const resource = app.middleware.resource();     // 解析出数据类型
    const getId = app.middleware.getId();         // 解析出数据Id
    const response = app.middleware.response();     // 捕捉执行过程的错误
    const auth = app.middleware.auth();           // 验证登录

    // 登录
    router.post('/api/login', controller.user.login);

    // 注销当前用户
    router.get('/api/logout', auth, controller.user.logout);

    // 注册，先备份数据，等高level的用户确认才create一个user
    router.post('/api/sign', response, controller.user.sign);

    // 获取需审核的用户数据
    router.get('/api/index/check', auth, response, controller.user.get_check_user);

    // 审核，对注册备份数据进行审核通过
    router.post('/api/index/check/:id', auth, response, getId, controller.user.check_user_info);

    // 获取全部user列表信息   分页
    router.get('/api/index/user/pages/:page', response, controller.user.get_users_info);

    // 获取全部user列表信息   不分页
    router.get('/api/index/user', response, controller.user.get_users_info);

    // 获取当前user的具体信息
    router.get('/api/index/user/self', auth, response, controller.user.get_user_info);

    // 获取一个user的具体信息,进行了连表查询
    router.get('/api/index/user/:id', response, getId, controller.user.get_user_info);

    // 当前用户修改信息   自已的
    router.put('/api/index/user/self', auth, response, controller.user.update_user_info);

    // 当前用户修改信息   别人的
    router.put('/api/index/user/:id', auth, response, getId, controller.user.update_user_info);

    // 当前用户上传头像
    router.post('/api/index/user/upload', auth, response, controller.user.upload_img);

    // 邮箱验证                 choose：   send:发送验证码  verify:验证
    router.post('/api/index/user/mail/:choose', auth, response, controller.user.mailSet);

}