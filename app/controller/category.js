'use strict';

const Controller = require('egg').Controller;
const Category = require('../models/Category')

/**
 * @Controller 博客文章分类相关
 */
class CategoryController extends Controller {
    /**
    * @Summary 获取全部分类信息
    * @Description 获取全部分类信息
    * @Router get /api/index/category
    * @Response 200 MsgResponse 获取成功
    * @Response 500 ErrResponse 获取失败，服务器错误
    */
    async get_category() {
        this.ctx.body = await this.ctx.service.public.get_resource(Category);
    }

    /**
    * @Summary 获取单个分类信息
    * @Description 获取单个分类信息
    * @Router get /api/index/category/:id
    * @Request path string id 分类id
    * @Response 200 MsgResponse 获取成功
    * @Response 500 ErrResponse 获取失败，服务器错误
    */
    async get_category_id() {
        const { ctx } = this;
        const data = await ctx.service.public.get_resource_id(Category, ctx.resource_id);
        ctx.body = data;
    }

    /**
    * @Summary 新建分类信息
    * @Description 新建分类信息
    * @Router post /api/index/category
    * @Response 200 MsgResponse 新建成功
    * @Response 500 ErrResponse 获取失败，服务器错误
    */
    async create_category() {
        const { ctx } = this;
        const result = await ctx.service.public.create_resource(Category, ctx.request.body);
        if (result) {
            ctx.body = {
                msg: '添加成功',
                result                      // 添加的数据（包括扩展后的）
            };
        }
    }

    /**
    * @Summary 删除单个分类信息
    * @Description 删除单个分类信息
    * @Router delete /api/index/category/:id
    * @Request path string id 分类id
    * @Response 200 MsgResponse 删除成功
    * @Response 500 ErrResponse 删除失败，服务器错误
    */
    async dele_category() {
        const { ctx } = this;
        const result = await ctx.service.public.dele_resource(Category, ctx.resource_id);
        if (result) {
            ctx.body = {
                msg: '删除成功',
                result                      // 删除的数据
            };
        }
    }

    /**
    * @Summary 更新单个分类信息
    * @Description 更新单个分类信息
    * @Router put /api/index/category/:id
    * @Request path string id 分类id
    * @Response 200 MsgResponse 更新成功
    * @Response 500 ErrResponse 更新失败，服务器错误
    */
    async update_category() {
        const { ctx } = this;
        const result = await ctx.service.public.update_resource(Category, ctx.resource_id, ctx.request.body);
        if (result) {
            ctx.body = {
                msg: '更新成功',
                result                          // 更新前的数据
            };
        }
    }
}

module.exports = CategoryController;
