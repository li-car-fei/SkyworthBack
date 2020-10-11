'use strict';

const Project = require('../models/Project');
const Controller = require('egg').Controller;

const uploadFile = require('../API/uploadFile');

/**
 * @Controller project相关操作
 */
class ProjectController extends Controller {
    /**
     * @Summary 获取全部project数据
     * @Description 全部project数据，members和leader简易扩展
     * @Router get /api/index/project
     * @Response 500 ErrResponse 获取失败，服务器错误
     * @Response 200 AllProjectResponse 获取成功
     */
    async get_projects() {
        const { ctx } = this;
        const result = await ctx.service.project.get_projects();
        ctx.body = result;
    }

    /**
     * @Summary 获取单个project数据
     * @Description 单个project数据，扩展
     * @Router get /api/index/project/:id
     * @Request path string id project的id
     * @Response 500 ErrResponse 获取失败，服务器错误
     * @Response 200 projectMemberDetail 获取成功
     */
    async get_project_info() {
        const { ctx } = this;
        const id = ctx.resource_id;
        const result = await ctx.service.project.get_project_info(id);
        ctx.body = result;
    }

    /**
     * @Summary 更新单个project数据
     * @Description 更新project数据
     * @Router put /api/index/project/:id
     * @Request path string id project的id
     * @Request header string authorization 识别用户的token
     * @Request formData   文件及其他字段
     * @Response 500 ErrResponse 修改失败，服务器错误
     * @Response 401 StrResponse auth_token验错误
     * @Response 403 MsgResponse 修改失败，无权修改
     * @Response 200 MsgResponse 修改成功
     */
    async update_project_info() {
        const { ctx } = this;
        const project_id = ctx.resource_id;             // 项目的id
        const user = ctx.user;              // 当前用户
        const isValid = await ctx.service.project.check_project_leader(user._id, project_id);       // 检查当前用户是不是leader
        if (isValid) {
            const result = await ctx.service.public.update_resource(Project, project_id, ctx.request.body);
            ctx.body = {
                msg: '修改成功',
                result
            }
        } else {
            ctx.body = '您无权修改此项目信息';
            ctx.status = 403;
        }
    }

    /**
     * @Summary 加入或退出project
     * @Description 当前用户加入或退出一个project
     * @Router put /api/index/project/:id/:choose
     * @Request header string authorization 识别用户的token
     * @Request path string id project的id
     * @Request path string choose 选择的操作，in：加入，out：退出
     * @Response 500 ErrResponse 修改失败，服务器错误
     * @Response 401 StrResponse auth_token验错误
     * @Response 403 MsgResponse 操作无效
     * @Response 200 MsgResponse 操作成功
     */
    async join_project() {
        const { ctx } = this;
        const project_id = ctx.resource_id;             // 项目的id
        const user_id = ctx.user._id;               // 当前用户id
        const user_project_in = ctx.user.project_in;      // 当前用户的project_in，是一个数组
        const isValid = (user_project_in.findIndex(project => project == project_id) > -1);
        if (ctx.params.choose == 'in') {
            if (isValid) {
                ctx.body = '当前用户已在project内';
                ctx.status = 403;
            } else {
                await ctx.service.project.join_project(project_id, user_id);      // 当前用户push到project数据中
                await ctx.service.user.join_project(project_id, user_id);     // 用户的project_in信息更改
                ctx.body = '加入成功'
            }
        } else if (ctx.params.choose == 'out') {
            if (!isValid) {
                ctx.body = '错误，当前用户不在project内';
                ctx.status = 403;
            } else {
                await ctx.service.project.out_project(project_id, user_id);      // 当前用户push到project数据中
                await ctx.service.user.out_project(project_id, user_id);     // 用户的project_in信息更改
                ctx.body = '退出成功'
            }
        } else {
            ctx.body = 'url params 错误';
            ctx.status = 403;
        }
    }

    /**
     * @Summary 删除project
     * @Description 删除某个project
     * @Router delete /api/index/project/:id
     * @Request path string id project的id
     * @Request header string authorization 识别用户的token
     * @Response 500 ErrResponse 删除失败，服务器错误
     * @Response 401 StrResponse auth_token验错误
     * @Response 403 MsgResponse 删除失败，无权删除
     * @Response 200 MsgResponse 删除成功
     */
    async dele_project() {
        const { ctx } = this;
        const project_id = ctx.resource_id;             // 项目的id
        const user = ctx.user;               // 当前用户
        const isValid = await ctx.service.project.check_project_leader(user._id, project_id);       // 检查当前用户是不是leader
        if (isValid) {
            const result = await ctx.service.public.dele_resource(Project, project_id);
            ctx.body = {
                msg: '删除成功',
                result
            }
        } else {
            ctx.status = 403;
            ctx.body = '您无权删除此项目信息';
        }
    }

    /**
    * @Summary 新建project
    * @Description 新建project
    * @Router post /api/index/project
    * @Request header string authorization 识别用户的token
    * @Request formData   文件及其他字段
    * @Response 500 ErrResponse 新建失败，服务器错误
    * @Response 401 StrResponse auth_token验错误
    * @Response 403 MsgResponse 新建失败，无权新建
    * @Response 200 MsgResponse 新建成功
    */
    async create_project() {
        const { ctx } = this;
        const level = ctx.user.level;
        if (level > 2) {
            let parts = ctx.multipart({ autoFields: true });
            const fileUrl = await uploadFile(parts, undefined, '/project');
            const project = {
                ...parts.field,
                members: [
                    ctx.user._id
                ],
                leader: ctx.user._id                // leader为创建的user，当前user
            }
            let result = await ctx.service.public.create_resource(Project, project);            // 创建project资源
            result = await ctx.service.project.upload_file(result._id, fileUrl);        // 给新的project资源增加file的url
            await ctx.service.user.join_project(result._id, ctx.user._id);
            ctx.body = {
                msg: '创建成功',
                result
            }
        } else {
            ctx.body = '您无权创建项目';
            ctx.status = 403;
        }
    }
}

module.exports = ProjectController;
