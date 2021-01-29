const path = require('path');
const fs = require('fs');
const pump = require('mz-modules/pump');
//const baseUrl = 'http://120.78.195.215:7001/public';     // 基址
const baseUrl = 'http://127.0.0.1:7001/public'
const reg = new RegExp('.zip|.pdf|.docx|.jpg', 'g');         // 格式的正则匹配

module.exports = async function uploadFile(parts, file_first, catalog) {
    let stream, fileUrl;            // 流，最终的文件链接
    // 不是文件就跳出stream获取
    while ((stream = await parts()) != null) {

        // 如果不是文件，跳出循环
        if (!stream.filename) {
            break;
        };
        const ifCatalog = fs.existsSync('app/public' + catalog);
        if (!ifCatalog) {
            fs.mkdirSync('app/public' + catalog);
        }
        let inner_file_first = file_first || String(path.basename(stream.filename)).replace(reg, '');
        // 文件名为：定义的文件名头 + 随机字符串 +.文件后缀                     path.extname识别出filename中的 / 只要后面的.zip等格式名
        let filename = inner_file_first + '_' + Math.random().toString(36).substr(2) + path.extname(stream.filename).toLocaleLowerCase();
        let target = 'app/public' + catalog + '/' + filename;      // 存放地址
        fileUrl = baseUrl + catalog + '/' + filename;           // 访问地址
        let writeStream = fs.createWriteStream(target);         // 创建写入流
        await pump(stream, writeStream);                    // 加载文件
    };

    return fileUrl
}