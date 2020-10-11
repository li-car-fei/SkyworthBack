module.exports = {
    basicTeam: {
        _id: {
            type: 'string',
            description: 'team的id'
        },
        name: {
            type: 'string',
            description: 'team的名字'
        }
    },
    TeamDetail: {
        name: {
            type: 'string',
            required: true,
            description: 'team的名字'
        },
        description: {
            type: 'string',
            required: true,
            description: 'team的描述'
        },
        members: {
            type: 'array',
            itemType: 'string',
            description: 'team成员的id'
        }
    },
    teamMemberDetail: {
        _id: {
            type: 'string',
            description: 'team的id'
        },
        name: {
            type: 'string',
            description: 'team的名称'
        },
        description: {
            type: 'string',
            description: 'team的描述'
        },
        members: {
            type: 'array',
            itemType: 'UserGet',
            description: 'members的具体信息'
        },
        createdAt: {
            type: 'string',
            description: 'team建立的时间'
        }
    },
    TeamOverview: {
        _id: {
            type: 'string',
            description: 'team的id'
        },
        name: {
            type: 'string',
            required: true,
            description: 'team的名字'
        },
        description: {
            type: 'string',
            required: true,
            description: 'team的描述'
        },
        members: {
            type: 'array',
            itemType: 'TeamMemberOverview',
            description: 'team成员的简单展示'
        }
    },
    AllTeamResponse: {
        body: {
            type: 'array',
            description: '所有team概览',
            itemType: 'AllTeamsDetail'
        }
    },
    AllTeamsDetail: {
        _id: {
            type: 'string',
            description: 'team的id'
        },
        name: {
            type: 'string',
            required: true,
            description: 'team的名称'
        },
        description: {
            type: 'string',
            required: true,
            description: 'team的描述'
        },
        members: {
            type: 'array',
            itemType: 'TeamMemberOverview',
            description: 'members的资料'
        },
    }
}