'use strict';

const Service = require('egg').Service;
const UserFav = require('../models/UserFav')

class UserFavService extends Service {
    async get_userFav(user_id) {
        return await UserFav.find().where({
            user: user_id
        }).populate({
            path: 'article',
            select: ['author', 'title', 'summary', 'isTop', 'read', 'fav', 'categories'],
            populate: {
                path: 'categories',
                select: 'title'
            }
        }).populate({
            path: 'user',
            select: ['username', 'sex', 'profession', 'avator', 'createdAt']
        }).sort({
            'createdAt': -1         // 按create 时间降序返回
        })
    }

    async check_userFav(user_id, userFav_id) {
        const userFav = await UserFav.findById(userFav_id);
        const userFav_userId = userFav.user;
        return String(userFav_userId) == String(user_id) ? true : false;
    }

    async delete_userFav(userFav_id) {
        return await UserFav.findByIdAndDelete(userFav_id)
    }
}

module.exports = UserFavService;
