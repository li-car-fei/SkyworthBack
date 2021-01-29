// const path = require('path');
// //console.log(path.extname('demo.zip'));              // 格式 
// //console.log(path.basename('/src/demo.zip'));                 // 文件地址的文件名
// //console.log(path.basename('/src/demo.docx', '.zip'));            // 去除指定格式

// //const reg = /.zip|.docx|.pdf/g;
// const reg = new RegExp('.zip|.docx|.pdf', 'g');

// let pathname = path.basename('/src/demo.pdf');
// console.log(String(pathname).replace(reg, ''));

var category = '/project/aadg11ye1y9812391';
console.log(category.split('/'))                    // [ '', 'project', 'aadg11ye1y9812391' ]

const fs = require('fs')
fs.exists('app/public/projectFile/asdjasdkashdkasdkad', exist => {
    console.log(exist)
})

fs.mkdir('app/public/projectPicture/asdjasdkashdkasdkad', (err) => {
    if (err) {
        console.log(err);
        return;
    } else {
        console.log("success");
    }
});



