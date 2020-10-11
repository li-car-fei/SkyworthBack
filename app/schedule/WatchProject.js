const Subscription = require('egg').Subscription;

const Project = require('../models/Project');
const User = require('../models/User');

class WatchProject extends Subscription {
    static get schedule() {
        return {
            type: 'all',
            //interval: '10s',
            cron: '0 0 0 * * *',        //凌晨一点
            //immediate: true,
        }
    }

    // 定时查看用户的project_in是否存在，若不存在则清除数据
    async subscribe() {
        const users = await User.find();
        var userNow = undefined;
        var projectNowId = undefined;
        var userProjectArr = [];
        var userProjectId = undefined;
        var userId = undefined;
        for (let i = 0; i <= users.length; i++) {
            userNow = users[i];
            userProjectArr = userNow.project_in || [];
            if (userProjectArr.length) {
                userId = userNow._id;
                for (let j = 0; j <= userProjectArr.length; j++) {
                    projectNowId = userProjectArr[j];
                    const isValid = await Project.findById(projectNowId);
                    if (!isValid) {
                        await User.findByIdAndUpdate(userId, {
                            $pull: { project_in: projectNowId }
                        })
                    }
                }
            }
        }
    }
}

module.exports = WatchProject;