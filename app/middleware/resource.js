// 引入inflection
const inflection = require('inflection')

module.exports = options => {
    return async (ctx, next) => {

        const modelName = inflection.classify(ctx.params.resource);
        //console.log(modelName)

        ctx.Model = require(`../models/${modelName}`);

        await next();
    }
}