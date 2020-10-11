'use strict';

const Message = require('../models/Message');
const message = require('../router/message');
const Controller = require('egg').Controller;
const { add_message_description } = require('../API/deal');


/**
 * @Controller 留言相关
 */

class MessageController extends Controller {
    /**
     * @Summary 留言
     * @Description 当前用户给其他用户留言
     * @Router post /api/index/message
     * @Request body MessagePost  需要留言的信息
     * @Request header string authorization 识别用户的token
     * @Response 401 StrResponse auth_token验错误
     * @Response 500 ErrResponse 服务器错误
     * @Response 200 MsgResponse 留言成功
     */
    async post_message() {
        const { ctx } = this;
        const from = ctx.user._id;         // 当前user即发送者的id
        let data = ctx.request.body;            // body中要有: content内容，to要发给的用户id
        data.from = from;
        const result = await ctx.service.public.create_resource(Message, data);
        ctx.body = {
            msg: '留言成功',
            result
        }
    }


    /**
     * @Summary 获取留言
     * @Description 获取当前用户发的留言，或者收到的留言
     * @Router get /api/index/message/:type
     * @Request path string type 查看留言的类型，own或者others
     * @Request header string authorization 识别用户的token
     * @Response 401 StrResponse auth_token验错误
     * @Response 403 StrResponse url params 错误
     * @Response 500 ErrResponse 服务器错误
     * @Response 200 Message 获取成功
     */
    async get_messages() {
        const { ctx } = this;
        const id = ctx.user._id;               // 当前用户的id
        const type = ctx.params.type;           // 自已留言或者他人给自已的留言
        if (type == 'own') {
            // 自已写的留言
            const result = await ctx.service.message.get_own_messages(id);
            result.forEach(message => {
                message._doc.description = add_message_description(message.status)
            });
            ctx.body = result
        } else if (type == 'others') {
            // 他人写给自已的
            const result = await ctx.service.message.get_others_messages(id);
            result.forEach(message => {
                message._doc.description = add_message_description(message.status)
            });
            ctx.body = result
        } else {
            ctx.body = 'url params 错误';
            ctx.status = 403;
        }
    }

    /**
     * @Summary 标记查看留言
     * @Description 当前用户标记查看一条留言
     * @Router put /api/index/message/:id
     * @Request path string id 查看的留言的id
     * @Request header string authorization 识别用户的token
     * @Response 401 StrResponse auth_token验错误
     * @Response 403 StrResponse 无权此操作
     * @Response 500 ErrResponse 服务器错误
     * @Response 200 Message 获取成功
     */
    async read_message() {
        const { ctx } = this;
        const user_id = ctx.user._id;               // 当前用户的id
        const message_id = ctx.resource_id;         // 查看的留言的id
        const result = await ctx.service.message.read_message(user_id, message_id);
        if (result.result) {
            ctx.body = result;
        } else {
            ctx.body = result;
            ctx.status = 403;
        }
    }
}

module.exports = MessageController;
