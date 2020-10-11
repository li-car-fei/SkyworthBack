'use strict';

const Project = require('../models/Project');
const Service = require('egg').Service;

class ProjectService extends Service {
    async get_projects() {
        return await Project.find().populate({
            path: 'members',
            select: ['name', 'username', 'avator', 'profession']
        }).populate({
            path: 'leader',
            select: ['name', 'username', 'avator', 'profession']
        })
    }

    async get_project_info(id) {
        return await Project.findById(id).populate('members').populate('leader')
    }

    async check_project_leader(user_id, project_id) {
        const project = await Project.findById(project_id);
        const project_leader = project.leader;
        return String(project_leader) == String(user_id) ? true : false
    }

    async join_project(project_id, user_id) {
        await Project.findByIdAndUpdate(project_id, {
            $push: { members: user_id }
        })
    }

    async out_project(project_id, user_id) {
        await Project.findByIdAndUpdate(project_id, {
            $pull: { members: user_id }
        })
    }

    // 按年份分开并且连表聚合查询的project数据
    async get_projects_years() {
        return await Project.aggregate([
            {
                $lookup: {
                    from: 'user',            // 连表user表查询   （populate）
                    localField: 'members',       // 此表关联的字段
                    foreignField: '_id',         // 连表的user表中对应的字段
                    as: 'members'            // 查找输出的字段名
                }
            },
            {
                $lookup: {
                    from: 'user',
                    localField: 'leader',
                    foreignField: '_id',
                    as: 'leaderDetail'
                }
            },
            {
                $group: {               // 将集合中的文档分组      最终的返回的数组中的单个集合
                    _id: {                     // _id  指定为  createdAt 的年份                 使用$group时，_id是必须的，用作分组的依据条件
                        $year: '$createdAt'
                    },
                    count: { $sum: 1 },             // _id 年份总的project数量
                    list: {                     // _id 年份的project列表
                        $push: {            // project列表中每个的具体数据
                            _id: '$_id',           // project的id
                            name: '$name',
                            description: '$description',
                            leader: '$leaderDetail',
                            //file:'$file',
                            members: '$members',
                            createdAt: '$createdAt',
                        }
                    }
                }
            },
            {
                $sort: { _id: -1 }             // 根据_id降序排序
            }
        ])
    }

    // 上传项目说明文件
    async upload_file(id, fileUrl) {
        return await Project.findByIdAndUpdate(id, {
            $set: { file: fileUrl }
        });
    }


}

module.exports = ProjectService;
