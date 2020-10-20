'use strict';

const Controller = require('egg').Controller;
const uploadFile = require('../API/uploadFile');
const PresNext = require('../API/presnext');

/**
 * @Controller 博客文章相关
 */
class ArticleController extends Controller {
    /**
    * @Summary markdown上传图片
    * @Description 通过markdown写文章时上传图片
    * @Router post /api/index/article/upload
    * @Request formData   图片文件
    * @Request header string authorization 识别用户的token
    * @Response 401 StrResponse auth_token验错误
    * @Response 500 ErrResponse 修改失败，服务器错误
    * @Response 200 UserImgResponse 上传成功
    */
    async uploadImg() {
        const { ctx } = this;
        const { user } = ctx;
        let parts = ctx.multipart({ autoFields: true });
        const imgUrl = await uploadFile(parts, '', `/article/${user.username}`);
        ctx.body = {
            url: imgUrl
        }
    }

    /**
    * @Summary 新建文章
    * @Description 新建article
    * @Router post /api/index/article
    * @Request header string authorization 识别用户的token
    * @Request body ArticleCreate  article博客的信息
    * @Response 500 ErrResponse 新建失败，服务器错误
    * @Response 401 StrResponse auth_token验错误
    * @Response 200 MsgResponse 新建成功
    */
    async create_article() {
        const { ctx } = this;
        //const { user } = ctx;
        const result = await ctx.service.article.create_article(ctx.request.body);
        ctx.body = {
            msg: '创建成功',
            result
        }
    }

    /**
    * @Summary 修改文章
    * @Description 修改article
    * @Router put /api/index/article/:id
    * @Request header string authorization 识别用户的token
    * @Request path string id 文章id
    * @Request body ArticleCreate  article博客的信息
    * @Response 500 ErrResponse 修改失败，服务器错误
    * @Response 401 StrResponse auth_token验错误
    * @Response 403 MsgResponse 修改失败，无权修改
    * @Response 200 MsgResponse 修改成功
    */
    async update_article() {
        const { ctx } = this;
        const { user } = ctx;
        const article_id = ctx.resource_id;     // 修改的article的id
        const isValid = await ctx.service.article.check_article_author(user._id, article_id);
        if (isValid) {
            const result = await ctx.service.article.update_article(article_id, ctx.request.body);
            ctx.body = {
                msg: '修改成功',
                result
            }
        } else {
            ctx.body = '您无权修改此博客文章';
            ctx.status = 403;
        }
    }

    /**
    * @Summary 删除文章
    * @Description 删除article
    * @Router delete /api/index/article/:id
    * @Request header string authorization 识别用户的token
    * @Request path string id 文章id
    * @Response 500 ErrResponse 修改失败，服务器错误
    * @Response 401 StrResponse auth_token验错误
    * @Response 403 MsgResponse 删除失败，无权删除
    * @Response 200 MsgResponse 删除成功
    */
    async delete_article() {
        const { ctx } = this;
        const { user } = ctx;
        const article_id = ctx.resource_id;
        const isValid = await ctx.service.article.check_article_author(user._id, article_id);
        if (isValid) {
            const result = await ctx.service.article.delete_article(article_id);
            ctx.body = {
                msg: '删除成功',
                result
            }
        } else {
            ctx.body = '您无权删除此博客文章';
            ctx.status = 403;
        }
    }

    //        here 接口数据模型还没写！！！
    /**
    * @Summary 文章详情
    * @Description article详细信息
    * @Router get /api/index/article/:id
    * @Request header string authorization 识别用户的token
    * @Request path string id 文章id
    * @Response 500 ErrResponse 获取失败，服务器错误
    * @Response 200 MsgResponse 获取成功
    */
    async get_article_id() {
        const { ctx } = this;
        const article_id = ctx.resource_id;
        const article = await ctx.service.article.get_article_id(article_id);
        const comments = await ctx.service.comment.get_comments_by_articleId(article_id);
        ctx.body = {
            article,
            comments
        }
    }

    //        here 接口数据模型还没写！！！
    /**
    * @Summary 置顶文章信息
    * @Description 置顶article信息
    * @Router get /api/index/article/top
    * @Response 500 ErrResponse 获取失败，服务器错误
    * @Response 200  获取成功
    */
    async get_article_top() {
        const { ctx } = this;
        const result = await ctx.service.article.get_article_top();
        ctx.body = result;
    }

    //        here 接口数据模型还没写！！！
    /**
    * @Summary 分页文章信息
    * @Description 分页article信息，简略信息首页展示
    * @Router get /api/index/article/pages/:page
    * @Request path string page 页数page
    * @Response 500 ErrResponse 获取失败，服务器错误
    * @Response 200  获取成功
    */
    async get_article_pages() {
        const { ctx } = this;
        const page = ctx.params.page;
        const result = await ctx.service.article.get_article_pages(page);
        const { nextPage, presPage } = PresNext(ctx.URL, result.currentPage, result.totalPage);
        result.nextPage = nextPage;
        result.presPage = presPage;
        ctx.body = result
    }

    //        here 接口数据模型还没写！！！
    /**
    * @Summary 根据分类返回文章信息
    * @Description 分类article信息
    * @Router get /api/index/article/category/:id
    * @Request path string id category的id
    * @Response 500 ErrResponse 获取失败，服务器错误
    * @Response 200  获取成功
    */
    async get_article_category() {
        const { ctx } = this;
        const category_id = ctx.resource_id;
        const result = await ctx.service.article.get_article_category(category_id);
        ctx.body = result;
    }

    //        here 接口数据模型还没写！！！
    /**
    * @Summary 文章阅读+1
    * @Description 文章阅读+1
    * @Router get /api/index/article/read/:id
    * @Request path string id 文章id
    * @Response 500 ErrResponse 修改失败，服务器错误
    * @Response 200  修改成功
    */
    async read_article() {
        const { ctx } = this;
        const article_id = ctx.resource_id;
        const result = await ctx.service.article.read_article(article_id);
        ctx.body = result;
    }

    //        here 接口数据模型还没写！！！
    /**
    * @Summary 文章收藏+1
    * @Description 文章收藏+1
    * @Router get /api/index/article/fav/:id
    * @Request path string id 文章id
    * @Request header string authorization 识别用户的token
    * @Response 500 ErrResponse 修改失败，服务器错误
    * @Response 200  修改成功
    */
    async fav_article() {
        const { ctx } = this;
        const article_id = ctx.resource_id;
        const user_id = ctx.user._id;
        await ctx.service.article.fav_article(article_id);
        const result = await ctx.service.article.user_fav_article(user_id, article_id)
        ctx.body = result;
    }

}

module.exports = ArticleController;
