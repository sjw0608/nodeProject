let jwt = require('../utils/token_vertify')
let { routerPath } = require('./whiteListRouter')
var expressJwt = require('express-jwt')
var session = require('express-session')

module.exports = {
    // 设置允许跨域访问该服务.
    CORSConfig: (req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Content-Type");
        res.header("Access-Control-Allow-Methods", "*");
        res.header("Content-Type", "application/json;charset=utf-8");
        if (req.method.toLowerCase() == 'options') {
            return res.send(200);  // 让options尝试请求快速结束
        }
        next();
    },
    // 解析用户token获取用户信息
    resolveToken: (req, res, next) => {
        let token = req.headers['token']
        if (token == undefined) {
            next()
        } else {
            jwt.varToken(token).then(data => {
                req.data = data
                return next()
            }).catch(err => {
                return next()
            })
        }
    },
    // 验证token 是否过期
    expressJwt: () => {
        return expressJwt({
            secret: jwt.secret,
            algorithms: ['HS256'],
            getToken: (req) => {
                return req.headers.token
            }
        }).unless({
            path: routerPath
        })
    },
    // 设置express-session会话
    setSession: () => {
        return session({
            secret: jwt.secret,
            reasve: false,
            saveUninitialized: false
        })
    },
    // 错误处理
    errorHandle: (err, req, res, next) => {
        res.status(err.status || 500)
        switch (err.status) {
            case 400:
                return res.json({
                    code: err.status,
                    success: false,
                    message: err.message
                })
            case 401:
                return res.json({
                    code: err.status,
                    success: false,
                    message: 'token失效，请重新登录'
                })
            case 404:
                return res.json({
                    code: err.status,
                    success: false,
                    message: '404 Not Found .'
                })
            case 201:
                return res.json({
                    code: err.status,
                    success: true,
                    message: err.message
                })
            default:
                return res.json({
                    code: err.status,
                    success: false,
                    message: 'token失效，请重新登录'
                })
        }
    }
}