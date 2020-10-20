'use strict';

const Service = require('egg').Service;
const mongoose = require('mongoose')
const Comment = require('../models/Comment');
const CommentReply = require('../models/CommentReply');

class CommentService extends Service {
    // 根据文章id返回评论及其回复的信息
    async get_comments_by_articleId(article_id) {
        return await Comment.aggregate([
            {
                $match: {
                    article: mongoose.Types.ObjectId(article_id)            // 根据article字段筛选
                }
            },
            {
                $lookup: {                    // 连表扩展user信息
                    from: 'user',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                },
            },
            {
                $lookup: {                   // 连表扩展评论及其回复完整信息
                    from: 'commentReply',
                    localField: '_id',
                    foreignField: 'comment',
                    as: 'reply'
                }
            }
        ])
    }
}

module.exports = CommentService;
