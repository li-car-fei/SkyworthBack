'use strict';

const Message = require('../models/Message');
const Service = require('egg').Service;

class MessageService extends Service {
    async get_own_messages(id) {
        return await Message.find({ from: id }).populate({
            path: 'from',
            select: ['name', 'username', 'team_in', 'avator', 'profession']
        }).populate({
            path: 'to',
            select: ['name', 'username', 'team_in', 'avator', 'profession']
        }).sort({
            'createAt': -1               // 根据产生时间降序返回
        })
    }

    async get_others_messages(id) {
        return await Message.find({ to: id }).populate({
            path: 'from',
            select: ['name', 'username', 'team_in', 'avator', 'profession']
        }).populate({
            path: 'to',
            select: ['name', 'username', 'team_in', 'avator', 'profession']
        }).sort({
            'status': 1,                  // 按status状态升序返回，先返回未查看的
            'createAt': -1               // 根据产生时间降序返回
        })
    }

    async read_message(user_id, message_id) {
        const message = await Message.findById(message_id);
        //console.log(String(message.to) == String(user_id));
        if (String(message.to) == String(user_id)) {
            const result = await Message.findByIdAndUpdate(message_id, {
                $set: { status: 1 }
            });
            return {
                msg: '标记查看成功',
                result
            }
        };
        return '您无权标记查看此条留言'
    }
}

module.exports = MessageService;
