module.exports = {
    ArticleCreate: {
        _id: {
            type: 'string',
            description: 'article的id'
        },
        author: {
            type: 'string',
            required: true,
            description: '作者的id'
        },
        title: {
            type: 'string',
            required: true,
            description: '博客文章的标题'
        },
        summary: {
            type: 'string',
            required: false,
            description: '博客文章的概述，可为空'
        },
        isTop: {
            type: 'boolean',
            default: false,
            description: '博客文章是否置顶显示'
        },
        isShow: {
            type: 'boolean',
            default: false,
            description: '博客文章是否显示到公共，是否自已可见'
        },
        body: {
            type: 'string',
            required: true,
            description: '博客文章经markdown编译后的内容，即最终显示在页面上的内容'
        },
        MdContent: {
            type: 'string',
            required: true,
            description: '博客文章markdown编辑器内的内容，未经过编译'
        },
        read: {
            type: 'number',
            default: 1,
            description: '博客阅读量'
        },
        fav: {
            type: 'number',
            default: 0,
            description: '阅读收藏量'
        },
        categories: {
            type: 'array',
            itemType: 'categoryDetail',
            description: '博客文章属于的分类'
        }
    }
}