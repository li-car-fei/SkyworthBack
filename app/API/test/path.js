const path = require('path');
//console.log(path.extname('demo.zip'));              // 格式 
//console.log(path.basename('/src/demo.zip'));                 // 文件地址的文件名
//console.log(path.basename('/src/demo.docx', '.zip'));            // 去除指定格式

//const reg = /.zip|.docx|.pdf/g;
const reg = new RegExp('.zip|.docx|.pdf', 'g');

let pathname = path.basename('/src/demo.pdf');
console.log(String(pathname).replace(reg, ''));

