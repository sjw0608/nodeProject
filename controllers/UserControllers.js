var dbConfig = require('../config/dbConfig');

const findUser = (userId)=>{
    let sql = `select id,username,phone,email,sex,address,creat_time,update_time from t_user where id= ?`
    let sqlArr = [userId]
    return dbConfig.SySqlConnect(sql,sqlArr)
}

module.exports = {
    getUserInfo: async (req, res, next) => { 
        let userId = req.query.id
        let data = await findUser(userId)
        if(data.length){
            res.status(200).json({
                code:200,
                success:true,
                data:{
                    ...data[0]
                },
                message:'ok'
            })
        }else{
            next({status:500})
        }
    }
}