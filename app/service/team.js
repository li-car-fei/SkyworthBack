'use strict';

const Team = require('../models/Team');
const Service = require('egg').Service;

class TeamService extends Service {
    async get_teams() {
        return await Team.find().populate({
            path: 'members',
            select: ['name', 'username', 'avator', 'profession']
        });
    }

    async get_team_info(id) {
        return await Team.findById(id).populate('members')
    }

    // 一个用户加入到team中
    async join_team(team_id, user_id) {
        await Team.findByIdAndUpdate(team_id, {
            $push: { members: user_id }
        })
    }

    // 一个用户退出team
    async out_team(team_id, user_id) {
        await Team.findByIdAndUpdate(team_id, {
            $pull: { members: user_id }
        })
    }
}

module.exports = TeamService;
