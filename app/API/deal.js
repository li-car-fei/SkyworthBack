const level_description = {
    1: '组员',
    2: '组长',
    3: '常委',
    4: '公司对接'
}

const message_description = {
    0: '已留言，未查看',
    1: '已查看',
    2: '已收藏'
}

function add_description(level) {
    return level_description[level]
};

function add_message_description(status) {
    return message_description[status]
};

module.exports = {
    add_description,
    add_message_description
}