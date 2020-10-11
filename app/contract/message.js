module.exports = {
    MessagePost: {
        content: {
            type: 'string',
            required: true,
            description: '留言的内容'
        },
        to: {
            type: 'string',
            required: true,
            description: '收到留言的人的id'
        },
    },
    Message: {
        content: {
            type: 'string',
            required: true,
            description: '留言的内容'
        },
        from: {
            type: 'UserGet',
            required: true,
            description: '留言的人'
        },
        to: {
            type: 'UserGet',
            required: true,
            description: '收到留言的人'
        },
        status: {
            type: 'number',
            default: 0,
            description: '留言信息的状态',
            enum: [0, 1, 2]
        },
        message_description: {
            type: 'string',
            description: '留言状态描述'
        }
    }
}