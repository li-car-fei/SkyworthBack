'use strict';

const Controller = require('egg').Controller;

/**
 * @Controller 公共接口
 */
class MainController extends Controller {
    // async get_resource() {
    //     const { ctx } = this;
    //     const data = await ctx.service.public.get_resource(ctx.Model);
    //     ctx.body = data;
    // }

    // async get_resource_id() {
    //     const { ctx } = this;
    //     const data = await ctx.service.public.get_resource_id(ctx.Model, ctx.resource_id);
    //     ctx.body = data;
    // }

    // async create_resource() {
    //     const { ctx } = this;
    //     const result = await ctx.service.public.create_resource(ctx.Model, ctx.request.body);
    //     if (result) {
    //         ctx.body = {
    //             msg: '添加成功',
    //             result                      // 添加的数据（包括扩展后的）
    //         };
    //     }
    // }

    // async dele_resource() {
    //     const { ctx } = this;
    //     const result = await ctx.service.public.dele_resource(ctx.Model, ctx.resource_id);
    //     if (result) {
    //         ctx.body = {
    //             msg: '删除成功',
    //             result                      // 删除的数据
    //         };
    //     }
    // }

    // async update_resource() {
    //     const { ctx } = this;
    //     const result = await ctx.service.public.update_resource(ctx.Model, ctx.resource_id, ctx.request.body);
    //     if (result) {
    //         ctx.body = {
    //             msg: '更新成功',
    //             result                          // 更新前的数据
    //         };
    //     }
    // }

    // 协会总体信息展示
    /**
     * @Summary 俱乐部总体信息
     * @Description 俱乐部总体信息，主页信息接口
     * @Router get /api/index/overview
     * @Response 200 OverviewResponse 获取成功
     * @Response 500 ErrResponse 获取失败，服务器错误
     */
    async get_overview() {
        const { ctx } = this;
        const members = await ctx.service.user.get_level_users(3);          // level大于等于3的人员
        const teams = await ctx.service.team.get_teams();               // 所有小组的信息
        const projects = await ctx.service.project.get_projects_years();        // 按年份分类归纳好的project
        ctx.body = {
            members,
            teams,
            projects
        }
    }
}

module.exports = MainController;
