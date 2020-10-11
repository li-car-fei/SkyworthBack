module.exports = {
    MsgResponse: {
        msg: {
            type: "string",
            description: '描述'
        },
        result: {
            type: 'Object',
            description: "返回结果",
        }
    },
    ErrResponse: {
        msg: {
            type: "string",
            description: '提示'
        },
        result: {
            type: 'string',
            description: "错误信息"
        }
    },
    StrResponse: {
        body: {
            type: "string",
            description: "返回的描述"
        }
    },
    OverviewResponse: {
        members: {
            type: 'array',
            itemType: 'UserGet',
            description: 'level大于2的用户，首页展示'
        },
        teams: {
            type: 'array',
            itemType: 'TeamOverview',
            description: 'team数据的首页展示'
        },
        projects: {
            type: 'array',
            itemType: 'projectOverview',
            description: 'project数据的首页展示'
        }
    }
}