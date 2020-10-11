'use strict';

const Team = require('../models/Team')
const Controller = require('egg').Controller;

/**
 * @Controller team相关操作
 */
class TeamController extends Controller {
    /**
     * @Summary 获取全部team数据
     * @Description 全部team数据，members简易扩展
     * @Router get /api/index/team
     * @Response 500 ErrResponse 获取失败，服务器错误
     * @Response 200 AllTeamResponse 获取成功
     */
    async get_teams() {
        const { ctx } = this;
        const result = await ctx.service.team.get_teams();
        ctx.body = result;
    }

    /**
     * @Summary 获取单个team数据
     * @Description 单个team数据，扩展
     * @Router get /api/index/team/:id
     * @Request path string id team的id
     * @Response 500 ErrResponse 获取失败，服务器错误
     * @Response 200 teamMemberDetail 获取成功
     */
    async get_team_info() {
        const { ctx } = this;
        const id = ctx.resource_id;
        const result = await ctx.service.team.get_team_info(id);
        ctx.body = result;
    }

    /**
    * @Summary 新建team
    * @Description 新建team
    * @Router post /api/index/team
    * @Request header string authorization 识别用户的token
    * @Request body TeamDetail  team的信息
    * @Response 500 ErrResponse 新建失败，服务器错误
    * @Response 401 StrResponse auth_token验错误
    * @Response 403 MsgResponse 新建失败，无权新建
    * @Response 200 MsgResponse 新建成功
    */
    async create_team() {
        const { ctx } = this;
        const level = ctx.user.level;
        if (level > 2) {
            const result = await ctx.service.public.create_resource(Team, ctx.request.body);
            ctx.body = {
                msg: '创建成功',
                result
            }
        } else {
            ctx.body = '您不能创建小组队伍';
            ctx.status = 403;
        }
    }

    /**
     * @Summary 加入或退出team
     * @Description 当前用户加入或退出一个team
     * @Router put /api/index/team/:id/:choose
     * @Request header string authorization 识别用户的token
     * @Request path string id team的id
     * @Request path string choose 选择的操作，in：加入，out：退出
     * @Response 500 ErrResponse 修改失败，服务器错误
     * @Response 401 StrResponse auth_token验错误
     * @Response 403 MsgResponse 操作无效
     * @Response 200 MsgResponse 操作成功
     */
    async join_team() {
        const { ctx } = this;
        const team_id = ctx.resource_id;             // 小组的id
        const user_id = ctx.user._id;               // 当前用户id
        const user_team_in = ctx.user.team_in;      // 当前用户的team_in
        if (ctx.params.choose == 'in') {
            if (user_team_in == team_id) {
                ctx.body = '当前用户已在此team内';
                ctx.status = 403;
            } else {
                await ctx.service.team.join_team(team_id, user_id);      // 当前用户push到team数据中
                await ctx.service.user.join_team(team_id, user_id);     // 用户的team_in信息更改
                ctx.body = '加入成功'
            }
        } else if (ctx.params.choose == 'out') {
            if (user_team_in == team_id) {
                await ctx.service.team.out_team(team_id, user_id);      // 当前用户在team中删除
                await ctx.service.user.out_team(team_id, user_id);     // 用户的team_in信息更改
                ctx.body = '退出成功'
            } else {
                ctx.body = '错误，当前用户不在此team内';
                ctx.status = 403;
            }
        } else {
            ctx.body = 'url params 错误';
            ctx.status = 403;
        }
    }

    /**
     * @Summary 更新单个team数据
     * @Description 更新team数据
     * @Router put /api/index/team/:id
     * @Request path string id team的id
     * @Request header string authorization 识别用户的token
     * @Request body TeamDetail  team的信息
     * @Response 500 ErrResponse 修改失败，服务器错误
     * @Response 401 StrResponse auth_token验错误
     * @Response 403 MsgResponse 修改失败，无权修改
     * @Response 200 MsgResponse 修改成功
     */
    async update_team_info() {
        const { ctx } = this;
        const team_id = ctx.resource_id;             // 小组的id
        const user = ctx.user;              // 当前用户
        const isValid = (user.level > 2);
        if (isValid) {
            const result = await ctx.service.public.update_resource(Team, team_id, ctx.request.body);
            ctx.body = {
                msg: '修改成功',
                result
            }
        } else {
            ctx.body = '您无权修改此小组信息';
            ctx.status = 403;
        }
    }

    /**
     * @Summary 删除team
     * @Description 删除某个team
     * @Router delete /api/index/team/:id
     * @Request path string id team的id
     * @Request header string authorization 识别用户的token
     * @Response 500 ErrResponse 删除失败，服务器错误
     * @Response 401 StrResponse auth_token验错误
     * @Response 403 MsgResponse 删除失败，无权删除
     * @Response 200 MsgResponse 删除成功
     */
    async dele_team() {
        const { ctx } = this;
        const team_id = ctx.resource_id;             // 小组的id
        const user = ctx.user;               // 当前用户
        const isValid = (user.level > 2);
        if (isValid) {
            const result = await ctx.service.public.dele_resource(Team, team_id);
            ctx.body = {
                msg: '删除成功',
                result
            }
        } else {
            ctx.body = '您无权删除此小组信息';
            ctx.status = 403;
        }
    }
}

module.exports = TeamController;
