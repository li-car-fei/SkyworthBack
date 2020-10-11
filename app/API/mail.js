const nodemailer = require('nodemailer');
const SMTP = 'OXQBIWAMOOAYOHNV';


async function sendMail(sendTo, code) {
    let transporter = nodemailer.createTransport({
        service: '163',
        port: 465,
        secureConnection: true, // 开启加密协议，需要使用 465 端口号
        auth: {
            user: "carfied@163.com", // 自己的邮箱用户名
            pass: SMTP                 // 自己的邮箱授权密码
        }
    });

    let mailOptions = {
        from: '"华工创维俱乐部" <carfied@163.com>',  // 自己的邮箱用户名
        //to: '1073490398@qq.com',
        to: sendTo,                          // 收件人列表
        subject: "验证信息",              // 邮件标题
        html: `您的验证码是：${code}`                                // 设置邮件为 html 内容
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info = {}) => {
            if (error) {
                reject({
                    error,
                    bool: false
                })
                //console.log(error);
                //sendNodeMail(); //再次发送
            } else {
                resolve({
                    info,
                    bool: true
                })
                //console.log("邮件发送成功", info);
            }
        });
    })
};

// 生成0~1000的随机数字符串
function GetRandomNum() {
    var Range = 1000;
    var Rand = Math.random();
    return String(Math.round(Rand * Range));
}

// sendMail('1073490398@qq.com', '232323').then(info => {
//     console.log(info);
// }, error => {
//     console.log(error)
// });

module.exports = {
    sendMail,
    GetRandomNum
}