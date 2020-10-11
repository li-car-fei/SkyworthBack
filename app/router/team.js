module.exports = app => {
    const { router, controller } = app;

    // 引入中间件
    //const resource = app.middleware.resource();     // 解析出数据类型
    const getId = app.middleware.getId();         // 解析出数据Id
    const response = app.middleware.response();     // 捕捉执行过程的错误
    const auth = app.middleware.auth();           // 验证登录

    // 获取所有的team的信息
    router.get('/api/index/team', response, controller.team.get_teams);

    // 单个team的信息
    router.get('/api/index/team/:id', response, getId, controller.team.get_team_info);

    // 当前用户修改team的信息, level>2
    router.put('/api/index/team/:id', auth, response, getId, controller.team.update_team_info);

    // 删除一个team   level>2
    router.delete('/api/index/team/:id', auth, response, getId, controller.team.dele_team);

    // 当前用户加入或者退出一个team
    router.put('/api/index/team/:id/:choose', auth, response, getId, controller.team.join_team);

    // 创建一个team，需要当前用户的level是3或4
    router.post('/api/index/team', auth, response, controller.team.create_team);


}