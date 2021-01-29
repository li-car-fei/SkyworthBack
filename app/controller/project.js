'use strict';

const Project = require('../models/Project');
const ProjectFile = require('../models/ProjectFile');
const ProjectRequest = require('../models/ProjectRequest');
const ProjectCatalog = require('../models/ProjectCatalog');
const ProjectPicture = require('../models/ProjectPicture');
const Controller = require('egg').Controller;

const uploadFile = require('../API/uploadFile');
const uploadProjectFile = require('../API/uploadProjectFile');
const deleDir = require('../API/deleDir');

const fs = require('fs');

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
        //let parts = ctx.multipart({ autoFields: true });
        const level = ctx.user.level;
        if (level > 2) {
            let parts = ctx.multipart({ autoFields: true });
            const fileUrl = await uploadFile(parts, '', '/project');
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



    /**
    * @Summary 新建projectFile
    * @Description 新建projectFile
    * @Router post /api/index/projectFile/:id
    * @Request header string authorization 识别用户的token
    * @Request path string id project的id
    * @Request formData   文件及其他字段
    * @Response 500 ErrResponse 新建失败，服务器错误
    * @Response 401 StrResponse auth_token验错误
    * @Response 403 MsgResponse 新建失败，无权新建
    * @Response 200 MsgResponse 新建成功
    */
    async post_projectFile() {
        const { ctx } = this;
        const user_id = ctx.user._id;               // 当前用户id
        const project_id = ctx.resource_id;          // 项目的id
        const ifInProject = await ctx.service.project.check_project_members(user_id, project_id);
        if (ifInProject) {
            let parts = ctx.multipart({ autoFields: true });
            const fileUrl = await uploadProjectFile(parts, '', `/projectFile/${project_id}`);
            const projectFile = {
                project: project_id,
                pushUser: user_id,
                description: parts.field.description || '',
                file: fileUrl || ''
            };
            let result = await ctx.service.public.create_resource(ProjectFile, projectFile);
            ctx.body = {
                msg: '创建成功',
                result
            }
        } else {
            ctx.body = '您还未参与项目，您无权上传项目文件';
            ctx.status = 403;
        }
    }


    /**
    * @Summary 获取projectFile列表
    * @Description 获取projectFile列表
    * @Router get /api/index/projectFile/:id
    * @Request header string authorization 识别用户的token
    * @Request path string id project的id
    * @Response 500 ErrResponse 获取失败，服务器错误
    * @Response 401 StrResponse auth_token验错误
    * @Response 403 MsgResponse 获取失败，无权获取
    * @Response 200 MsgResponse 获取成功
    */
    async get_projectFile() {
        const { ctx } = this;
        const user_id = ctx.user._id;               // 当前用户id
        const project_id = ctx.resource_id;     // 项目id
        const ifInProject = await ctx.service.project.check_project_members(user_id, project_id);
        if (ifInProject) {
            let result = await ctx.service.project.get_projectFile(project_id);
            ctx.body = result
        } else {
            ctx.body = '您还未参与项目，您无权获取项目文件信息';
            ctx.status = 403;
        }
    }


    /**
    * @Summary 获取某条projectFile信息
    * @Description 获取某条projectFile信息
    * @Router get /api/index/projectFile/:id/:projectfileid
    * @Request header string authorization 识别用户的token
    * @Request path string id project的id
    * @Request path string projectfileid projectfile的id
    * @Response 500 ErrResponse 获取失败，服务器错误
    * @Response 401 StrResponse auth_token验错误
    * @Response 403 MsgResponse 获取失败，无权获取
    * @Response 200 MsgResponse 获取成功
    */
    async get_projectFile_id() {
        const { ctx } = this;
        const user_id = ctx.user._id;               // 当前用户id
        const project_id = ctx.resource_id;     // 项目id
        const projectFile_id = ctx.params.projectfileid;        // projectfile信息的id
        if (ifInProject) {
            let result = await ctx.service.project.get_projectFileId(projectFile_id);
            ctx.body = result
        } else {
            ctx.body = '您还未参与项目，您无权获取项目文件信息';
            ctx.status = 403;
        }
    }


    /**
    * @Summary 新建projectRequest
    * @Description 新建projectRequest
    * @Router post /api/index/projectRequest/:id
    * @Request header string authorization 识别用户的token
    * @Request path string id project的id
    * @Request formData   需求信息字段
    * @Response 500 ErrResponse 新建失败，服务器错误
    * @Response 401 StrResponse auth_token验错误
    * @Response 403 MsgResponse 新建失败，无权新建
    * @Response 200 MsgResponse 新建成功
    */
    async post_projectRequest() {
        const { ctx } = this;
        const user_id = ctx.user._id;               // 当前用户id
        const project_id = ctx.resource_id;          // 项目的id
        const ifInProject = await ctx.service.project.check_project_members(user_id, project_id);
        if (ifInProject) {
            let result = await ctx.service.public.create_resource(ProjectRequest, ctx.request.body);
            ctx.body = {
                msg: '创建成功',
                result
            }
        } else {
            ctx.body = '您还未参与项目，您无权提出需求';
            ctx.status = 403;
        }
    }


    /**
        * @Summary 获取projectRequest列表
        * @Description 获取projectRequest列表
        * @Router get /api/index/projectRequest/:id
        * @Request header string authorization 识别用户的token
        * @Request path string id project的id
        * @Request formData   需求信息字段
        * @Response 500 ErrResponse 获取失败，服务器错误
        * @Response 401 StrResponse auth_token验错误
        * @Response 403 MsgResponse 获取失败，无权获取
        * @Response 200 MsgResponse 获取成功
        */
    async get_projectRequest() {
        const { ctx } = this;
        const user_id = ctx.user._id;               // 当前用户id
        const project_id = ctx.resource_id;          // 项目的id
        const ifInProject = await ctx.service.project.check_project_members(user_id, project_id);
        if (ifInProject) {
            let result = await ctx.service.project.get_projectRequest(project_id);
            ctx.body = result
        } else {
            ctx.body = '您还未参与项目，您无权获取需求';
            ctx.status = 403;
        }
    }


    /**
    * @Summary 获取某条projectRequest信息
    * @Description 获取某条projectRequest信息
    * @Router get /api/index/projectRequest/:id/:projectrequestid
    * @Request header string authorization 识别用户的token
    * @Request path string id project的id
    * @Request path string projectrequestid projectrequest的id
    * @Request formData   需求信息字段
    * @Response 500 ErrResponse 获取失败，服务器错误
    * @Response 401 StrResponse auth_token验错误
    * @Response 403 MsgResponse 获取失败，无权获取
    * @Response 200 MsgResponse 获取成功
    */
    async get_projectRequest_id() {
        const { ctx } = this;
        const user_id = ctx.user._id;               // 当前用户id
        const project_id = ctx.resource_id;          // 项目的id
        const projectRequest_id = ctx.params.projectrequestid;
        const ifInProject = await ctx.service.project.check_project_members(user_id, project_id);
        if (ifInProject) {
            let result = await ctx.service.project.get_projectRequestId(projectRequest_id);
            ctx.body = result
        } else {
            ctx.body = '您还未参与项目，您无权获取需求';
            ctx.status = 403;
        }
    }


    /**
    * @Summary 新建项目图床目录
    * @Description 新建项目图床目录
    * @Router post /api/index/projectcatalog/:id
    * @Request header string authorization 识别用户的token
    * @Request path string id project的id
    * @Request formData   信息字段
    * @Response 500 ErrResponse 新建失败，服务器错误
    * @Response 401 StrResponse auth_token验错误
    * @Response 403 MsgResponse 新建失败，无权新建
    * @Response 200 MsgResponse 新建成功
    */
    async post_projectCatalog() {                                               // 新建项目图床目录
        const { ctx } = this;
        const user_id = ctx.user._id;               // 当前用户id
        const project_id = ctx.resource_id;          // 项目的id
        const ifInProject = await ctx.service.project.check_project_members(user_id, project_id);
        if (ifInProject) {
            let { catalogPath } = ctx.request.body;
            let catalogIdPath = '/projectPicture' + `/${project_id}`              // 项目id划分图片存储路径
            let ifCatalog = fs.existsSync('app/public' + catalogIdPath);
            if (!ifCatalog) {
                const mkdir = fs.mkdirSync('app/public' + catalogIdPath);
            };
            catalogPath = '/projectPicture' + `/${project_id}/` + catalogPath;      // 新建目录地址
            console.log(catalogPath);
            ifCatalog = fs.existsSync('app/public' + catalogPath);
            if (!ifCatalog) {
                const mkdir = fs.mkdirSync('app/public' + catalogPath);
            }
            let result = await ctx.service.project.create_projectCatalog(project_id, ctx.request.body.catalogPath);
            ctx.body = result;
            ctx.status = 200;
        } else {
            ctx.body = '您还未参与项目，您无权新建图床目录';
            ctx.status = 403;
        }
    }


    /**
    * @Summary 上传项目图片到指定图床目录
    * @Description 上传项目图片到指定图床目录
    * @Router post /api/index/projectpicture/:id
    * @Request header string authorization 识别用户的token
    * @Request path string id 项目图床目录的id
    * @Request formData   图片文件
    * @Response 500 ErrResponse 上传失败，服务器错误
    * @Response 401 StrResponse auth_token验错误
    * @Response 403 MsgResponse 上传失败，无权新建
    * @Response 200 MsgResponse 上传成功
    */
    async post_projectPicture() {
        const { ctx } = this;
        const user_id = ctx.user._id;               // 当前用户id
        const projectCatalog_id = ctx.resource_id;      // 项目图床目录的id
        const projectCatalog = await ctx.service.public.get_resource_id(ProjectCatalog, projectCatalog_id);
        if (projectCatalog) {
            const catalogPath = projectCatalog.catalogPath;
            const catalogProjectId = String(projectCatalog.project);
            let uploadPath = '/projectPicture' + `/${catalogProjectId}/` + catalogPath;
            let parts = ctx.multipart({ autoFields: true });
            const fileUrl = await uploadProjectFile(parts, '', uploadPath);
            const projectPicture = {
                catalog: projectCatalog_id,
                file: fileUrl
            };
            let result = await ctx.service.public.create_resource(ProjectPicture, projectPicture);
            ctx.body = result;
            ctx.status = 200;
        } else {
            ctx.body = '还未新建目录';
            ctx.status = 403
        }
    }

    /**
        * @Summary 获取projectCatalog列表
        * @Description 获取projectCatalog列表
        * @Router get /api/index/projectcatalog/:id
        * @Request header string authorization 识别用户的token
        * @Request path string id project的id
        * @Response 500 ErrResponse 获取失败，服务器错误
        * @Response 401 StrResponse auth_token验错误
        * @Response 403 MsgResponse 获取失败，无权获取
        * @Response 200 MsgResponse 获取成功
        */
    async get_projectCatalog() {
        const { ctx } = this;
        const user_id = ctx.user._id;               // 当前用户id
        const project_id = ctx.resource_id;          // 项目的id
        const ifInProject = await ctx.service.project.check_project_members(user_id, project_id);
        if (ifInProject) {
            let result = await ctx.service.project.get_projectCatalog(project_id);
            ctx.body = result
        } else {
            ctx.body = '您还未参与项目，您无权获取目录';
            ctx.status = 403;
        }
    }

    /**
    * @Summary 根据catalog目录id获取projectPicture列表
    * @Description 根据catalog目录id获取projectProject列表
    * @Router get /api/index/projectpicture/:id
    * @Request path string id catalog的id
    * @Response 500 ErrResponse 获取失败，服务器错误
    * @Response 403 MsgResponse 获取失败，无权获取
    * @Response 200 MsgResponse 获取成功
    */
    async get_projectPicture() {
        const { ctx } = this;
        const catalog_id = ctx.resource_id;          // 图床目录的id
        const result = await ctx.service.project.get_projectPicture(catalog_id);
        ctx.body = result;
        ctx.status = 200;
    }

    /**
    * @Summary 删除项目图床图片
    * @Description 删除项目图床图片
    * @Router delete /api/index/projectpicture/:id
    * @Request header string authorization 识别用户的token
    * @Request path string id projectpicture的id
    * @Response 401 StrResponse auth_token验错误
    * @Response 500 ErrResponse 删除失败，服务器错误
    * @Response 403 MsgResponse 删除失败，无权删除
    * @Response 200 MsgResponse 删除成功
    */
    async del_projectPicture() {
        const { ctx } = this;
        const picture_id = ctx.resource_id;         // 图床图片的id
        const result = await ctx.service.project.dele_projectPicture(picture_id);
        let filePath = result.file;               // 图片的线上地址
        filePath = filePath.split('//')[1];         // http:// 右边的地址
        let [root, ...fileTargetArr] = filePath.split('/');
        let fileTarget = fileTargetArr.join('/');
        fileTarget = 'app/' + fileTarget;
        fs.unlinkSync(fileTarget);
        ctx.body = '删除成功';
        ctx.status = 200;

    }

    /**
    * @Summary 删除项目图床目录
    * @Description 删除项目图床目录
    * @Router delete /api/index/projectcatalog/:id
    * @Request header string authorization 识别用户的token
    * @Request path string id projectCatalog的id
    * @Response 401 StrResponse auth_token验错误
    * @Response 500 ErrResponse 删除失败，服务器错误
    * @Response 403 MsgResponse 删除失败，无权删除
    * @Response 200 MsgResponse 删除成功
    */
    async del_projectCatalog() {
        const { ctx } = this;
        const catalog_id = ctx.resource_id;         // 图床目录id
        const result = await ctx.service.project.dele_projectCatalog(catalog_id);
        console.log(result);
        const project_id = String(result.project);                  // 对应的project的id
        const catalogName = result.catalogPath;         // 图床目录名
        deleDir(`app/public/projectPicture/${project_id}/${catalogName}`);      // 遍历删除目录及下文件
        ctx.body = '删除成功';
        ctx.status = 200;
    }
}

module.exports = ProjectController;
