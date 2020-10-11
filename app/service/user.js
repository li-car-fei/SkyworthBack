'use strict';

// 加密用的bcrypt
const bcrypt = require('bcryptjs');
// jwt token 
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const Service = require('egg').Service;

class UserService extends Service {
    // 登录
    async login(username, password) {
        // 查询user， 带上password返回
        const user = await User.findOne({ username }).select('+password');

        if (!user) {
            return '用户名错误'
        };

        // 验证密码是否正确
        const isValid = bcrypt.compareSync(password, user.password);

        if (!isValid) {
            return '密码错误'
        };

        // 根据用户的 _id 生成jwt token并返回

        // 拿到key                    config.keys.split('_')[1];
        const key = this.app.config.keys.split('_')[1];
        // 加密
        const token = jwt.sign({ id: user._id }, key);
        return {
            message: '登录成功',
            username: user.username,
            token: token
        }

    }

    async get_users_info(page) {
        if (page == 'all') {
            const list = await User.find().sort({
                'level': -1                      // 按level降序返回
            });
            return {
                list
            }
        };

        const list = await User.find().sort({
            'level': -1                                 // 当前页码的user列表
        }).skip((page - 1) * 6).limit(6);
        const count = await User.find().lean().count()            // 总的user数量
        const totalPage = Math.ceil(count / 6);
        return {
            list,
            count,
            totalPage,
            currentPage: page
        }
    }

    // 获取指定user的信息
    async get_user_info(id) {
        return await User.findById(id).populate({
            path: 'team_in',
            select: 'name',
        }).populate({
            path: 'project_in',
            select: 'name',
        });
    }

    // 尝试修改比自已level低的用户信息
    async update_resource(user, update_id, data) {
        const update = await User.findById(update_id).select('level');
        const update_level = update.level
        var result;
        if (user.level > update_level) {
            result = await User.findByIdAndUpdate(update_id, { $set: data }, { runValidators: true });
            return {
                msg: '更新成功',
                result              // 更新前信息
            }
        };

        return {
            msg: '您无权修改此用户信息'
        }
    }

    // 当前用户上传头像
    async upload_img(id, fileUrl) {
        const result = await User.findByIdAndUpdate(id, {
            $set: { avator: fileUrl }
        });

        return '上传头像成功'
    }

    // 当前用户加入一个team
    async join_team(team_id, user_id) {
        return await User.findByIdAndUpdate(user_id, {
            $set: { team_in: team_id }
        });
    }

    // 当前用户退出team
    async out_team(team_id, user_id) {
        return await User.findByIdAndUpdate(user_id, {
            $set: { team_in: undefined }
        });
    }

    // 当前用户加入一个project
    async join_project(project_id, user_id) {
        return await User.findByIdAndUpdate(user_id, {
            $push: { project_in: project_id }
        });
    }

    // 当前用户退出一个project
    async out_project(project_id, user_id) {
        return await User.findByIdAndUpdate(user_id, {
            $pull: { project_in: project_id }
        });
    }

    // 返回大于等于指定level的用户信息
    async get_level_users(level) {
        return await User.find({ level: { $gte: level } }).sort({
            'level': -1,
            'createdAt': 1
        });
    }
}

module.exports = UserService;
