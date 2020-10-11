const jwt = require('jsonwebtoken');
const User = require('../models/User');


module.exports = options => {

    return async (ctx, next) => {

        //从请求头中拿出token
        let token = String(ctx.request.headers.authorization || '').split(" ").pop();

        // 从cookies中拿token
        // if (!token) {
        //     token = String(ctx.cookies.get('user_token', {
        //         encrypt: true
        //     }));
        // }


        // 拿到key
        const key = ctx.app.config.keys.split('_')[1];

        // 如果没有设置token，返回
        if (!token) {
            ctx.status = 401;
            ctx.body = 'token 不存在';
            return
        }

        try {
            // 根据token解析出用户id
            const { id } = jwt.verify(token, key);
            // 解析token错误，返回
            if (!id) {
                ctx.status = 401;
                ctx.body = 'token 错误';
                return
            }
            // 根据解析出来的id，获取用户
            const user = await User.findById(id);

            // 找不到用户，返回
            if (!user) {
                ctx.status = 401;
                ctx.body = 'token 错误 , 用户不存在';
                return
            };

            ctx.user = user;

        } catch (e) {            // 出错，返回
            ctx.status = 401;
            ctx.body = 'jwt token error，解析token错误'
        }

        await next()
    }

}