module.exports = {
    basicProject: {
        _id: {
            type: 'string',
            description: 'project的id'
        },
        name: {
            type: 'string',
            description: 'project的名字'
        }
    },
    ProjectDetail: {
        _id: {
            type: 'string',
            description: 'project的id'
        },
        name: {
            type: 'string',
            required: true,
            description: 'project的名称'
        },
        description: {
            type: 'string',
            required: true,
            description: 'project的描述'
        },
        leader: {
            type: 'string',
        },
        members: {
            type: 'array',
            itemType: 'string',
            description: 'members的id'
        },
        file: {
            type: 'string',
            description: '附属文件的url'
        }
    },
    projectOverview: {
        _id: {
            type: 'number',
            description: '年份'
        },
        count: {
            type: 'number',
            description: 'project总数'
        },
        list: {
            type: 'array',
            itemType: 'projectMemberDetail',
            description: '按年份分好的project列表'
        }
    },
    projectMemberDetail: {
        _id: {
            type: 'string',
            description: 'project的id'
        },
        name: {
            type: 'string',
            description: 'project的名称'
        },
        description: {
            type: 'string',
            description: 'project的描述'
        },
        leader: {
            type: 'array',
            itemType: 'UserGet',
            description: 'leader的具体信息'
        },
        members: {
            type: 'array',
            itemType: 'UserGet',
            description: 'members的具体信息'
        },
        createdAt: {
            type: 'string',
            description: 'project建立的时间'
        }
    },
    AllProjectResponse: {
        body: {
            type: 'array',
            description: '所有project概览',
            itemType: 'projectsDetail'
        }
    },
    projectsDetail: {
        _id: {
            type: 'string',
            description: 'project的id'
        },
        name: {
            type: 'string',
            required: true,
            description: 'project的名称'
        },
        description: {
            type: 'string',
            required: true,
            description: 'project的描述'
        },
        leader: {
            type: 'TeamMemberOverview',
            description: 'leader的基本资料'
        },
        members: {
            type: 'array',
            itemType: 'TeamMemberOverview',
            description: 'members的资料'
        },
    }
}