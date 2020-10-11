module.exports = app => {
    return async (ctx, next) => {
        ctx.socket.emit('res', 'packet received!');     // 返回客户端，接收信息成功
        console.log('packet:', ctx.packet);
        await next();
    };
};