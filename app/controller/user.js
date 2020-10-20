'use strict';

const User = require('../models/User');
const CheckUser = require('../models/CheckUser');
const Controller = require('egg').Controller;
const uploadFile = require('../API/uploadFile')
const { add_description } = require('../API/deal');
const PresNext = require('../API/presnext');
const { sendMail, GetRandomNum } = require('../API/mail');
const { url } = require('inspector');
const user = require('../router/user');

/**
 * @Controller 用户相关
 */

class UserController extends Controller {
    /**
     * @Summary 用户注册
     * @Description 用户注册，上传信息，等待审核
     * @Router post /api/sign
     * @Request body UserSign  注册需上传的信息
     * @Response 200 MsgResponse 注册成功，等待审验
     * @Response 500 ErrResponse 注册失败，post信息错误   
     */
    async sign() {
        const { ctx } = this;
        const result = await ctx.service.public.create_resource(CheckUser, ctx.request.body);
        if (result) {
            ctx.body = {
                msg: '添加成功,等待审核',
                result                      // 添加的数据（包括扩展后的）
            };
        }
    }

    /**
     * @Summary 用户注销
     * @Description 用户注销
     * @Router get /api/logout
     * @Request header string authorization 识别用户的token
     * @Response 401 StrResponse auth_token验错误
     * @Response 200 StrResponse 注销成功
     */
    async logout() {
        this.ctx.cookies.set('user_token', null);
        this.ctx.body = "注销成功";
    }

    /**
    * @Summary 获取需审核的用户
    * @Description 需审核的用户的信息
    * @Router get /api/index/check
    * @Request header string authorization 识别用户的token
    * @Response 403 StrResponse 当前用户等级未达到可以获取信息的等级
    * @Response 401 StrResponse auth_token验错误
    * @Response 200 checkUser 获取成功
    */
    async get_check_user() {
        const { ctx } = this;
        const user = ctx.user;              // 当前用户
        // 由审核人确定新建用户的level,同原注册数据一同post
        if (user.level <= 2) {
            ctx.body = '您无法进行审核操作';
            ctx.status = 403;
            return
        }
        const data = await ctx.service.public.get_resource(CheckUser);
        ctx.body = data;
    }

    /**
     * @Summary 审核注册
     * @Description 审核注册并且添加
     * @Router post /api/index/check/:id
     * @Request header string authorization 识别用户的token
     * @Request body UserGet  注册的信息以及让审核人员选择新建用户的level
     * @Response 403 StrResponse 当前用户等级未达到可以审核的等级
     * @Response 401 StrResponse auth_token验错误
     * @Response 500 ErrResponse 审核错误，信息错误
     * @Response 200 MsgResponse 审核成功
     */
    async check_user_info() {
        const { ctx } = this;
        const id = ctx.resource_id          // 审核的数据的id
        const user = ctx.user;              // 当前用户
        // 由审核人确定新建用户的level,同原注册数据一同post
        if (user.level <= 2) {
            ctx.body = '您无法进行审核操作';
            ctx.status = 403;
            return
        };
        const result = await ctx.service.public.create_resource(User, ctx.request.body);
        await ctx.service.public.dele_resource(CheckUser, id);
        ctx.body = {
            msg: '审核成功',
            result
        }

    }

    /**
     * @Summary 用户登录
     * @Description 登录
     * @Router post /api/login
     * @Request body LoginPost  用户名以及密码
     * @Response 403 StrResponse 输入信息有误
     * @Response 500 StrResponse 用户名或密码错误
     * @Response 200 LoginSuccess 登录成功
     */
    async login() {
        const { ctx } = this;
        const { username, password } = ctx.request.body;

        // 用户名为空
        if (!username) {
            ctx.body = '用户名为空';
            ctx.status = 403;
            return
        };

        // 密码为空
        if (!password) {
            ctx.body = '密码为空';
            ctx.status = 403;
            return
        };

        const result = await ctx.service.user.login(username, password);
        if (result.token) {
            const token = result.token;             // token

            // 设置cookies，cookies和headers里都加上token验证
            ctx.cookies.set('user_token', token, {
                maxAge: 24 * 3600 * 1000,
                httpOnly: true,
                encrypt: true
            });
        } else {
            ctx.status = 500;
        };
        ctx.body = result;

    }

    /**
     * @Summary 获取用户信息，分页
     * @Description 获取用户信息，分页
     * @Router get /api/index/user/pages/:page
     * @Request path string page 页数
     * @Response 500 ErrResponse 获取失败，服务器错误
     * @Response 200 UserListResponse 获取成功
     */

    /**
     * @Summary 获取用户信息，全部不分页
     * @Description 获取用户信息，全部不分页
     * @Router get /api/index/user
     * @Response 500 ErrResponse 获取失败，服务器错误
     * @Response 200 UserListResponse 获取成功
     */
    async get_users_info() {
        const { ctx } = this;
        const page = ctx.params.page || 'all';
        let result = await ctx.service.user.get_users_info(page);
        result.list.forEach(user => {
            user._doc.level_description = add_description(user.level)    // 需要添加不在model中定义的字段，由于schema的检测机制，不能改变level数据类型，故添加一个字段
        });
        if (page !== 'all') {
            const { nextPage, presPage } = PresNext(ctx.URL, result.currentPage, result.totalPage);
            result.nextPage = nextPage;
            result.presPage = presPage;
        }
        ctx.body = result
    }

    /**
     * @Summary 获取单个用户的具体信息
     * @Description 获取单个用户的具体信息，当前用户或者其他用户，扩展了team与project等
     * @Router get /api/index/user/:id
     * @Request path string id 用户id
     * @Response 401 StrResponse auth_token验错误
     * @Response 500 ErrResponse 获取失败，服务器错误
     * @Response 200 UserDetailResponse 获取成功
     */

    /**
     * @Summary 获取当前用户的具体信息
     * @Description 获取单个用户的具体信息，当前用户，扩展了team与project等
     * @Router get /api/index/user/self
     * @Request header string authorization 识别用户的token
     * @Response 401 StrResponse auth_token验错误
     * @Response 500 ErrResponse 获取失败，服务器错误
     * @Response 200 UserDetailResponse 获取成功
     */
    async get_user_info() {
        const { ctx } = this;
        const { user } = ctx;
        const id = ctx.resource_id || user._id;

        const result = await ctx.service.user.get_user_info(id);
        result._doc.level_description = add_description(result.level)
        ctx.body = result;
    }

    /**
     * @Summary 更新用户信息
     * @Description 更新信息，自已的或他人的
     * @Router put /api/index/user/:id
     * @Request header string authorization 识别用户的token
     * @Request path string id 用户id
     * @Response 401 StrResponse auth_token验错误
     * @Response 500 ErrResponse 修改失败，服务器错误
     * @Response 403 MsgResponse 修改失败，等级不够
     * @Response 200 MsgResponse 修改成功
     */

    /**
    * @Summary 更新当前用户信息
    * @Description 更新信息，自已
    * @Router put /api/index/user/self
    * @Request header string authorization 识别用户的token
    * @Response 401 StrResponse auth_token验错误
    * @Response 500 ErrResponse 修改失败，服务器错误
    * @Response 200 MsgResponse 修改成功
    */
    async update_user_info() {
        const { ctx } = this;
        const { user } = ctx;
        const check_id = ctx.resource_id || 'self';
        var result;
        // user 是当前登录用户      ctx.resource_id 是要update的数据的id
        if (check_id == 'self') {
            // 自已更改自已的信息
            result = await ctx.service.public.update_resource(User, user._id, ctx.request.body);
            ctx.body = {
                msg: '更新成功',
                result                      // 更新前的信息
            };
            return
        };

        // 尝试更改比自已level低的成员的信息
        result = await ctx.service.user.update_resource(user, ctx.resource_id, ctx.request.body);
        if (result.result) {
            ctx.body = result;
        } else {
            ctx.body = result;
            ctx.status = 403;
        }

    }

    /**
     * @Summary 上传头像
     * @Description 用户上传头像图片
     * @Router post /api/index/user/upload
     * @Request formData   图片文件
     * @Request header string authorization 识别用户的token
     * @Response 401 StrResponse auth_token验错误
     * @Response 500 ErrResponse 修改失败，服务器错误
     * @Response 200 UserImgResponse 上传成功
     */
    async upload_img() {
        const { ctx } = this;
        const { user } = ctx;

        let parts = ctx.multipart({ autoFields: true });                    // 加载表单数据
        const fileUrl = await uploadFile(parts, user.username, '/avator');          // 加载文件并返回访问该文件的地址

        //console.log(parts.field) // 表单其他数据

        // 把地址存入mongodb
        await ctx.service.user.upload_img(user._id, fileUrl);

        ctx.body = {
            url: fileUrl,
        };

    }

    /**
     * @Summary 邮箱验证
     * @Description 用户进行邮箱验证
     * @Router post /api/index/user/mail/:choose
     * @Request path string choose 选择发送或者验证
     */
    async mailSet() {
        const { ctx } = this;
        const { user } = ctx;
        const user_id = ctx.user._id;               // 当前用户id

        if (ctx.params.choose == 'send') {
            const RandNum = GetRandomNum();         // 随机数
            ctx.session.mailCode = RandNum;
            const result = await sendMail(ctx.request.body.email, RandNum);
            console.log(result);
            if (result.bool) {
                ctx.body = result.info;
                return
            }
            ctx.body = result.error;
        } else if (ctx.params.choose == 'verify') {
            const RandNum = ctx.session.mailCode;
            const UserCode = ctx.request.body.code;
            if (RandNum == UserCode) {
                // 修改数据库
                const result = await ctx.service.public.update_resource(User, user_id, {
                    email: ctx.request.body.email
                });
                ctx.body = result
            } else {
                ctx.body = '验证码错误'
            }
        } else {
            ctx.body = 'URL params 错误'
        }

    }
}

module.exports = UserController;
