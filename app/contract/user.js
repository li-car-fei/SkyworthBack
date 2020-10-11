module.exports = {
    LoginPost: {
        username: {
            type: "string",
            description: '用户名'
        },
        password: {
            type: "string",
            description: '密码'
        }
    },
    LoginSuccess: {
        message: {
            type: 'string',
            description: '描述信息'
        },
        username: {
            type: 'string',
            description: '用户名'
        },
        token: {
            type: 'string',
            description: 'token，私密请求需要放在header中'
        }
    },
    UserSign: {
        username: {
            type: "string",
            description: '自设定用户名',
            required: true
        },
        name: {
            type: "string",
            description: '真实姓名',
            require: true
        },
        password: {
            type: "string",
            description: '密码',
            required: true,
        },
        sex: {
            type: "string",
            required: true,
            description: '性别',
            example: '男',
            enum: ['男', '女']
        },
        number: {
            type: "string",
            description: '学号',
            required: true,
            example: '201827382930',
            match: /^201[89]\d{8}$/
        },
        profession: {
            type: "string",
            required: true,
            description: '专业班级',
        },
        phone: {
            type: "string",
            required: true,
            description: "手机号",
            example: "135****8723",
            format: /^1[3456789]\d{9}$/
        },
    },
    UserGet: {
        _id: {
            type: 'string',
            description: 'user的id'
        },
        username: {
            type: "string",
            description: '用户名',
        },
        name: {
            type: "string",
            description: '真实姓名'
        },
        sex: {
            type: "string",
            description: '性别',
            example: '男',
            enum: ['男', '女']
        },
        number: {
            type: 'string',
            description: '学号',
            example: '201827382930',
            match: /^201[89]\d{8}$/
        },
        profession: {
            type: 'string',
            description: '专业班级',
        },
        level: {
            type: 'number',
            required: true,
            description: '用户等级'
        },
        level_description: {
            type: 'string',
            description: '对应level的描述'
        },
        phone: {
            type: 'string',
            description: '手机号',
            example: "135****8723",
            format: /^1[3456789]\d{9}$/
        },
        avator: {
            type: 'string',
            description: '头像链接'
        },
        team_in: {
            type: 'string',
            description: '所在team的id'
        },
        project_in: {
            type: 'array',
            itemType: 'string',
            description: '所在所有项目组的id'
        }
    },
    UserListResponse: {
        list: {
            type: 'array',
            itemType: 'UserGet',
            description: '用户数据列表'
        },
        count: {
            type: 'number',
            description: '用户数量总数',
        },
        totalPage: {
            type: 'number',
            description: '分页总的页数'
        },
        currentPage: {
            type: 'string',
            description: '当前页数'
        },
        nextPage: {
            type: 'string',
            description: '获取下一页的url'
        },
        presPage: {
            type: 'string',
            description: '获取上一页的url'
        }
    },
    UserDetailResponse: {
        _id: {
            type: 'string',
            description: 'user的id'
        },
        username: {
            type: "string",
            description: '用户名',
        },
        name: {
            type: "string",
            description: '真实姓名'
        },
        sex: {
            type: "string",
            description: '性别',
            example: '男',
            enum: ['男', '女']
        },
        number: {
            type: 'string',
            description: '学号',
            example: '201827382930',
            match: /^201[89]\d{8}$/
        },
        profession: {
            type: 'string',
            description: '专业班级',
        },
        level: {
            type: 'number',
            required: true,
            description: '用户等级'
        },
        level_description: {
            type: 'string',
            description: '对应level的描述'
        },
        phone: {
            type: 'string',
            description: '手机号',
            example: "135****8723",
            format: /^1[3456789]\d{9}$/
        },
        avator: {
            type: 'string',
            description: '头像链接'
        },
        team_in: {
            type: 'basicTeam',
            description: 'team的id与名字'
        },
        project_in: {
            type: 'array',
            itemType: 'basicProject',
            description: 'project的id与名字'
        }
    },
    UserImgResponse: {
        url: {
            type: 'string',
            description: '上传后，获取头像的url'
        },
    },
    TeamMemberOverview: {
        _id: {
            type: 'string',
            description: 'user的id'
        },
        username: {
            type: "string",
            description: '用户名',
        },
        name: {
            type: "string",
            description: '真实姓名'
        },
        avator: {
            type: 'string',
            description: '头像链接'
        },
        profession: {
            type: 'string',
            description: '专业班级',
        },
    }
}