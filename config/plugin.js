'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }

  // 配置cors ， 解决跨域问题
  cors: {
    enable: true,
    package: 'egg-cors'
  },

  // 开启socket
  // io: {
  //   enable: true,
  //   package: 'egg-socket.io'
  // },

  //swaggerdoc 生成api文档
  swaggerdoc: {
    enable: true,
    package: 'egg-swagger-doc'
  },

  // alinode 服务端配置
  // alinode: {
  //   enable: true,
  //   package: 'egg-alinode'
  // }
};
