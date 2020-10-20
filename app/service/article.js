'use strict';

const Service = require('egg').Service;
const Article = require('../models/Article');
const UserFav = require('../models/UserFav');

class ArticleService extends Service {
    async create_article(data) {
        const result = await Article.create(data);
        return result
    }

    async check_article_author(user_id, article_id) {
        const article = await Article.findById(article_id);
        const article_author = article.author;
        return String(article_author) == String(user_id) ? true : false;
    }

    async update_article(article_id, data) {
        return await Article.findByIdAndUpdate(article_id, {
            $set: data
        }, {
            runValidators: true
        })
    }

    async delete_article(article_id) {
        return await Article.findByIdAndDelete(article_id)
    }

    async get_article_id(article_id) {
        return await Article.findById(article_id).populate({
            path: 'author',
            select: ['username', 'sex', 'profession', 'avator']
        }).populate({
            path: 'categories',
            select: 'title'
        });
    }

    async get_article_top() {
        return await Article.find().where({
            isTop: true,
            isShow: true
        }).select('author', 'title', 'summary', 'isTop', 'read', 'fav', 'categories')
            .populate({
                path: 'categories',
                select: 'title'
            }).populate({
                path: 'author',
                select: ['username', 'sex', 'profession', 'avator']
            }).sort({
                'createdAt': -1         // 按create 时间降序返回
            })
    }

    async get_article_pages(page) {
        const list = await Article.find().sort({
            'createdAt': -1
        }).skip((page - 1) * 8).limit(8).select('author', 'title', 'summary', 'isTop', 'read', 'fav', 'categories')
            .populate({
                path: 'categories',
                select: 'title'
            }).populate({
                path: 'author',
                select: ['username', 'sex', 'profession', 'avator']
            });
        const count = await Article.find().lean().count();
        const totalPage = Math.ceil(count / 8);
        return {
            list,
            totalArticles: count,
            totalPage,
            currentPage: page
        }
    }

    async get_article_category(category_id) {
        return await Article.find({ categories: category_id })
            .select('author', 'title', 'summary', 'isTop', 'read', 'fav')
            .populate({
                path: 'author',
                select: ['username', 'sex', 'profession', 'avator']
            })
    }

    async read_article(article_id) {
        return await Article.findByIdAndUpdate(article_id, {
            $inc: { "read": 1 }
        });
    }

    async fav_article(article_id) {
        return await Article.findByIdAndUpdate(article_id, {
            $inc: { "fav": 1 }
        });
    }

    async un_fav_article(article_id) {
        return await Article.findByIdAndUpdate(article_id, {
            $inc: { "fav": -1 }
        });
    }

    async user_fav_article(user_id, article_id) {
        return await UserFav.create({
            user: user_id,
            article: article_id
        });
    }

}

module.exports = ArticleService;
