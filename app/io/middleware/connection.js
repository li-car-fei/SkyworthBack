module.exports = app => {
    return async (ctx, next) => {
        ctx.socket.emit('res', 'connected!');    // 返回客户端连接成功
        await next();
        // execute when disconnect.
        console.log('disconnection!');      // 断开
    };
};