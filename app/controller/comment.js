'use strict';

const Controller = require('egg').Controller;

/**
 * @Controller 博客评论相关
 */
class CommentController extends Controller {
    /**
   * @Summary 新增根评论
   * @Description 新增comment
   * @Router post /api/index/comment
   * @Request header string authorization 识别用户的token
   * @Response 500 ErrResponse 新增失败，服务器错误
   * @Response 401 StrResponse auth_token验错误
   * @Response 403 MsgResponse 新增失败，无权新增
   * @Response 200 MsgResponse 新增成功
   */
    async create_comment() {
        const { ctx } = this;
        const { user } = ctx;
        if (user._id == ctx.request.body.user) {
            const result = await ctx.service.comment.create_comment(ctx.request.body);
            ctx.body = result;
        } else {
            ctx.body = '您无权发表此评论';
            ctx.status = 403;
        }
    }

    /**
   * @Summary 新增评论回复
   * @Description 新增commentReply
   * @Router post /api/index/commentreply
   * @Request header string authorization 识别用户的token
   * @Response 500 ErrResponse 新增失败，服务器错误
   * @Response 401 StrResponse auth_token验错误
   * @Response 403 MsgResponse 新增失败，无权新增
   * @Response 200 MsgResponse 新增成功
   */
    async create_commentReply() {
        const { ctx } = this;
        const { user } = ctx;
        if (user._id == ctx.request.body.user) {
            const result = await ctx.service.comment.create_commentReply(ctx.request.body);
            ctx.body = result;
        } else {
            ctx.body = '您无权发表此回复';
            ctx.status = 403;
        }
    }

    /**
   * @Summary 删除根评论
   * @Description 删除comment
   * @Router delete /api/index/comment/:id
   * @Request header string authorization 识别用户的token
   * @Request path string id 根评论id
   * @Response 500 ErrResponse 删除失败，服务器错误
   * @Response 401 StrResponse auth_token验错误
   * @Response 403 MsgResponse 删除失败，无权删除
   * @Response 200 MsgResponse 删除成功
   */
    async delete_comment() {
        const { ctx } = this;
        const { user } = ctx;
        const comment_id = ctx.resource_id;
        const isValid = await ctx.service.comment.check_comment_user(user._id, comment_id);
        if (isValid) {
            const result = await ctx.service.comment.delete_comment(comment_id);
            ctx.body = {
                msg: '删除成功',
                result
            }
        } else {
            ctx.body = '您无权删除此评论';
            ctx.status = 403;
        }
    }

    /**
    * @Summary 删除评论回复
    * @Description 删除commentReply
    * @Router delete /api/index//commentreply/:id
    * @Request header string authorization 识别用户的token
    * @Request path string id 评论回复id
    * @Response 500 ErrResponse 删除失败，服务器错误
    * @Response 401 StrResponse auth_token验错误
    * @Response 403 MsgResponse 删除失败，无权删除
    * @Response 200 MsgResponse 删除成功
    */
    async delete_commentReply() {
        const { ctx } = this;
        const { user } = ctx;
        const commentReply_id = ctx.resource_id;
        const isValid = await ctx.service.comment.check_commentReply_user(user._id, commentReply_id);
        if (isValid) {
            const result = await ctx.service.comment.delete_commentReply(commentReply_id);
            ctx.body = {
                msg: '删除成功',
                result
            }
        } else {
            ctx.body = '您无权删除此条回复';
            ctx.status = 403;
        }
    }
}

module.exports = CommentController;
