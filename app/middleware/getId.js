module.exports = options => {
    return async (ctx, next) => {
        const id = ctx.params.id;
        ctx.resource_id = id;
        await next()
    }
}