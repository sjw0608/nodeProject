/* eslint-disable prettier/prettier */
/**
 * @description: 正则校验
 * @author: 宋江伟
 * @time: 2020-08-24
 */

 /**
 * @description: 错误提示
 * @param {reg} reg  正则表达式
 * @param {value} value  校验数据
 * @param {String} text 错误提示简称
 * @param {Function} callback 
 */
const errorMessage = (reg, value, text, callback) => {
    if (!value || !reg.test(value)) {
        return callback && callback('201')
    } else {
        return callback && callback()
    }
}

// 手机号码验证
exports.validMobile = (mobile, callback) => {
    const reg = /^1\d{10}$/
    return errorMessage(reg, mobile, '手机号码', callback)
}
// 身份证号码验证
exports.validIdCard = (id, callback) => {
    const reg = /^\d{15}|\d{18}$/
    return errorMessage(reg, id, '身份证号码', callback)
}
// 密码验证(以字母开头，长度在6~18之间，只能包含字母、数字和下划线)
exports.validPassword = (password, callback) => {
    const reg = /^[a-zA-Z]\w{5,17}$/
    return errorMessage(reg, password, '密码', callback)
}
// 强密码(必须包含大小写字母和数字的组合，不能使用特殊字符，长度在8-10之间)
exports.validStrogePwd = (password, callback) => {
    const reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,10}$/
    return errorMessage(reg, password, '密码', callback)
}
// 邮箱验证
exports.validEmail = (email, callback) => {
    const reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
    return errorMessage(reg, email, '邮箱', callback)
}
// 邮政编码
exports.validZipCode = (zipCode, callback) => {
    const reg = /^[0-9]{6}$/
    return errorMessage(reg, zipCode, '邮政编码', callback)
}
