'use strict';

/**
 * @param {Egg.Application} app - egg application
 */

const db = require('./db/db');

module.exports = app => {

  db(app);        // 初始化连接数据库

  require('./router/user')(app);
  require('./router/team')(app);
  require('./router/project')(app);
  require('./router/message')(app);
  require('./router/public')(app);
  require('./router/article')(app);
  require('./router/userFav')(app);
  require('./router/category')(app);

  // socket io
  //require('./router/io')(app);
};
