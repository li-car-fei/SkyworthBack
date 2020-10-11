const Subscription = require('egg').Subscription;

const Team = require('../models/Team');
const User = require('../models/User');

class WatchTeam extends Subscription {
    static get schedule() {
        return {
            type: 'all',
            //interval: '10s',
            cron: '0 0 0 * * *',        //凌晨一点
            //immediate: true,
        }
    }

    // 定时查看用户的team是否存在，若不存在则清除数据
    async subscribe() {
        const users = await User.find();
        var userNow = undefined;
        var userTeamId = undefined;
        var userId = undefined;
        for (let i = 0; i <= users.length; i++) {
            userNow = users[i];
            userTeamId = userNow.team_in || undefined;
            if (userTeamId) {
                userId = userNow._id;
                const isValid = await Team.findById(userTeamId);
                if (!isValid) {
                    await User.findByIdAndUpdate(userId, {
                        $unset: { team_in: null }
                    })
                }
            }
        }
    }
}

module.exports = WatchTeam;