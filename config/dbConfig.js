const mysql = require('mysql')

module.exports = {
    config: {
        host: '127.0.0.1',
        user: 'root',
        password: '123456789',
        database: 'node_sql'
    },
    // 连接数据库，使用连接池方式
    sqlConnect: function (sql, sqlArr, callBack) {
        let pool = mysql.createPool(this.config)
        pool.getConnection((err, conn) => {
            if (err) {
                return console.log('err')
            }
            conn.query(sql, sqlArr, callBack)
            // 释放连接
            conn.release()
        })
    },
    //promise 回调
    SySqlConnect: function (sySql, sqlArr) {
        return new Promise((resolve, reject) => {
            var pool = mysql.createPool(this.config);
            pool.getConnection(function (err, conn) {
                if (err) {
                    reject(err);
                } else {
                    conn.query(sySql, sqlArr, (err, data) => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(data);
                        }
                        conn.release();
                    });
                }
            })
        })
    }
}