'use strict';

const Controller = require('egg').Controller;


/**
 * @Controller 用户收藏文章相关
 */
class UserFavController extends Controller {
    /**
    * @Summary 获取当前用户的收藏文章信息
    * @Description 获取当前用户的收藏文章信息
    * @Router get /api/index/userfav/self
    * @Request header string authorization 识别用户的token
    * @Response 401 StrResponse auth_token验错误
    * @Response 500 ErrResponse 获取失败，服务器错误
    * @Response 200 MsgResponse 获取成功
    */
    async get_userFav() {
        const { ctx } = this;
        const user_id = ctx.user._id;
        const result = await ctx.service.userFav.get_userFav(user_id);
        ctx.body = result
    }

    /**
    * @Summary 当前用户取消某条收藏
    * @Description 当前用户取消某条收藏
    * @Router get /api/index/userFav/:id
    * @Request header string authorization 识别用户的token
    * @Request path string id 收藏id
    * @Response 401 StrResponse auth_token验错误
    * @Response 500 ErrResponse 取消失败，服务器错误
    * @Response 200 MsgResponse 取消成功
    */
    async delete_userFav() {
        const { ctx } = this;
        const user_id = ctx.user._id;
        const userFav_id = ctx.resource_id;
        const isValid = await ctx.service.userFav.check_userFav(user_id, userFav_id);
        if (isValid) {
            const result = await ctx.service.userFav.delete_userFav(userFav_id);
            await ctx.service.article.un_fav_article(result.article);
            ctx.body = result;
        } else {
            ctx.body = '您无权取消收藏'
        }
    }
}

module.exports = UserFavController;
