var svgCaptcha = require('svg-captcha');
var md5 = require('md5')
let dbConfig = require('../config/dbConfig')
let jwt = require('../utils/token_vertify')
let Regx = require('../utils/validate')

// 检验用户是否存在
const getUser = (username) => {
    let sql = `select * from t_user where phone = ?`
    let sqlArr = [username]
    return dbConfig.SySqlConnect(sql, sqlArr);
}
// 检验验证码
const validateCode = (req, code) => {
    return code.toLowerCase() === req.session.captcha
}
// 创建用户
const creatUser = (username, password) => {
    let sql = `insert into t_user (username,phone,password) values (?,?,?)`
    let sqlArr = [username, username, md5(md5(password))]
    return dbConfig.SySqlConnect(sql, sqlArr);
}
// 查找用户
const findUser = (username, password) => {
    let sql = ''
    let sqlArr = []
    if (password) {
        password = md5(md5(password))
        sql = `select * from t_user where  phone =? and password = ?`
        sqlArr = [username, password]
    } else {
        sql = `select id from t_user where username= ? or phone = ? or password = ?`
        sqlArr = [username, username, username]
    }
    return dbConfig.SySqlConnect(sql, sqlArr);
}
module.exports = {
    //  生成一个图片验证码
    createdCode: (req, res, next) => {
        let codeConfig = {
            size: 5,// 验证码长度
            ignoreChars: '0o1i', // 验证码字符中排除 0o1i
            noise: 2, // 干扰线条的数量
            height: 40
        }
        let captcha = svgCaptcha.create(codeConfig);
        req.session.captcha = captcha.text.toLowerCase();
        console.log(captcha.text.toLowerCase())
        let codeData = {
            code: 200,
            success: true,
            img: String(captcha.data),
            message: 'ok'
        }
        return res.status(200).json(codeData)
    },
    // 注册
    register: async (req, res, next) => {
        const body = req.body
        let mobileValid
        await Regx.validMobile(body.username, (res) => {
            mobileValid = res
        })
        if (mobileValid) {
            return next({
                status: 201,
                message: '用户名错误.'
            })
        }
        let isUser = await getUser(body.username)
        if (isUser.length) {
            return next({
                status: 201,
                message: '用户已存在.'
            })
        }
        if (!validateCode(req, body.code)) {
            return next({
                status: 201,
                message: '验证码错误.'
            })
        }
        let cUser = await creatUser(body.username, body.password)
        if (cUser.affectedRows == 1) {
            let cId = await findUser(body.username)
            let token = await jwt.setToken(body.username, cId.id)
            return res.status(200).json({
                code: 200,
                success: true,
                // token: token,
                message: 'ok'
            })
        } else {
            return next({
                status: 400
            })
        }

    },
    // 登录
    login: async (req, res, next) => {
        const body = req.body
        if (!body.username || !body.password) {
            return next({
                status: 201,
                message: '用户名或密码不正确 .'
            })
        }
        let user = await findUser(body.username, body.password)
        if (user.length) {
            let result = user[0]
            let token = await jwt.setToken(body.username, result.id)
            return res.status(200).json({
                code: 200,
                success: true,
                data:{
                    id:result.id,
                    token: token
                },
                message: 'ok'
            })
        } else {
            return next({
                status: 201,
                message: '暂无注册用户 .'
            })
        }
    }
}