module.exports = {
    categoryDetail: {
        _id: {
            type: 'string',
            description: 'category的id'
        },
        title: {
            type: 'string',
            required: true,
            description: '博客文章分类的标题'
        },
        description: {
            type: 'string',
            required: true,
            description: '博客文章分类的描述'
        }
    }
}