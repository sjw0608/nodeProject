let jwt = require('jsonwebtoken')

let signKey = 'private_project_web_sjw'

module.exports = {
    secret : signKey,
    setToken: function (username, userId) {
        return new Promise((resolve, reject) => {
            const token = jwt.sign({
                name: username,
                _id: userId
            }, signKey, { expiresIn: '1d' })
            resolve(token)
        })
    },
    varToken: function(token){
        return new Promise((resolve,reject)=>{
            let info = jwt.verify(token,signKey,(error,res)=>{
                var data = {}
                if(error){
                    data.code = '01',
                    data.obj = error
                }else{
                    data.code = '00',
                    data.obj = res
                }
                return data
            })
            // console.log(info)
            resolve(info)
        })
    }
}