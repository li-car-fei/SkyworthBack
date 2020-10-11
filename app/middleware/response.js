// 捕捉执行过程中的错误

module.exports = options => {
    return async (ctx, next) => {

        try {
            await next()
        } catch (e) {
            // 捕捉到错误，返回
            ctx.body = {
                msg: '服务器错误',
                tips: e
            };
            ctx.status = 500;
            return
        }

        //console.log(ctx.body, ctx.status)

        if (ctx.body) {
            return
        }

        ctx.body = '服务器无报错，但找不到资源'
        ctx.status = 404;


    }
}