/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1594645915424_8922';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  // 生产环境基地址
  config.production_baseUrl = 'http://127.0.0.1:7001';

  // 配置环境基地址
  config.promotion_baseUrl = 'http://120.78.195.215:7001';

  // 先将csrf取消
  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true,
    },
    //domainWhiteList: [ 'http://localhost:8080' ],
  };

  // 配置cors 解决跨域问题
  // config.cors = {
  //   origin: '*', // 匹配规则  域名+端口  *则为全匹配
  //   allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  //   credentials: true,                 // 跨域共享cookies
  // };

  // 配置session，用于email验证
  config.session = {
    maxAge: 5 * 1000 * 60,   // 过期时间5分钟
    key: 'SESSION_ID',      // cookies中的key
    httpOnly: true,          // 只有后端有权访问
    encrypt: true
  }

  // 配置multipart
  config.multipart = {
    fileSize: '20mb',
    whitelist: [
      // images
      '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.wbmp', '.webp', '.tif', '.psd',
      // text
      '.svg', '.js', '.jsx', '.json', '.css', '.less', '.html', '.htm', '.xml', '.pdf', '.docx',
      // tar
      '.zip', '.gz', '.tgz', '.gzip', '.rar',
      // video
      '.mp3', '.mp4', '.avi',
    ]
  };

  // 配置socket
  // config.io = {
  //   init: {},
  //   namespace: {
  //     '/': {
  //       connectionMiddleware: [],
  //       packetMiddleware: [],
  //     },
  //   }
  // };

  // 扫描 app/controller和app/contract下的文件    contract下的文件为定义好的请求体和响应体
  config.swaggerdoc = {
    dirScanner: './app/controller',       //插件扫描的文档路径
    //basePath: 'http://127.0.0.1:7001',       // 前置路由
    basePath: 'http://120.78.195.215:7001',
    apiInfo: {
      title: 'egg-swagger',
      description: 'swagger-ui for egg',
      version: '1.0.0',
    },
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    securityDefinitions: {
      // apikey: {
      //   type: 'apiKey',
      //   name: 'clientkey',
      //   in: 'header',
      // },
      // oauth2: {
      //   type: 'oauth2',
      //   tokenUrl: 'http://petstore.swagger.io/oauth/dialog',
      //   flow: 'password',
      //   scopes: {
      //     'write:access_token': 'write access_token',
      //     'read:access_token': 'read access_token',
      //   },
      // },
    },
    enableSecurity: false,            //是否使用安全验证
    // enableValidate: true,
    routerMap: false,                 //是否自动生成route
    enable: true,                 //swagger-ui是否可以访问
  };

  // 配置alinode相关配置
  //   config.alinode = {
  //     server: 'wss://agentserver.node.aliyun.com:8080',
  //     appid: '86330',
  //     secret: '7d92c48d12d8144afa079e91ab7d7e2596a9adfa',
  //     logdir: '/tmp/',
  //     error_log: [
  //     ],
  //   agentidMode: 'IP' '可选，如果设置，则在实例ID中添加部分IP信息，用于多个实例 hostname 相同的场景（以容器为主）'
  // };

  // config.cluster = {
  //   listen: {
  //     path: '',
  //     port: 7001,
  //     hostname: '120.78.195.215',
  //   }
  // };

  return {
    ...config,
    ...userConfig,
    //io,
  };
};
