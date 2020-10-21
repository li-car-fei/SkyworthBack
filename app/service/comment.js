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

    // 根评论新建
    async create_comment(comment) {
        return await Comment.create(comment);
    }

    // 检测是否为发表评论的user
    async check_comment_user(user_id, comment_id) {
        const comment = await Comment.findById(comment_id);
        const comment_user = comment.user;
        return String(comment_user) == String(user_id) ? true : false;
    }

    // 根评论删除          // 需要删除子评论和子回复吗？
    async delete_comment(comment_id) {
        await CommentReply.remove({ comment: comment_id });
        return await Comment.findByIdAndDelete(comment_id)
    }

    // 回复类型评论新建
    async create_commentReply(commentReply) {
        return await CommentReply.create(commentReply)
    }

    // 检测是否为发表回复的user
    async check_commentReply_user(user_id, commentReply_id) {
        const commentReply = await CommentReply.findById(commentReply_id);
        const commentReply_user = commentReply.user;
        return String(commentReply_user) == String(user_id) ? true : false;
    }

    // 回复类型的评论删除
    async delete_commentReply(commentReply_id) {
        return await CommentReply.findByIdAndDelete(commentReply_id)
    }
}

module.exports = CommentService;
