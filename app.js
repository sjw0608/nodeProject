var createError = require('http-errors');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var baseCofing = require('./config/config')

var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }))

//设置允许跨域访问该服务.
app.use(baseCofing.CORSConfig);
// 解析用户token获取用户信息
app.use(baseCofing.resolveToken)
// 存储验证码
app.use(baseCofing.setSession())
// 验证token 是否过期
app.use(baseCofing.expressJwt())

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
// 错误处理
app.use(baseCofing.errorHandle);

module.exports = app;
