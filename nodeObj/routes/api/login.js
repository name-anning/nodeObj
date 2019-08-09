let express = require('express')
let router = express.Router()
let mgdb = require('../../utils/mgdb')
let bcrypt = require('bcrypt');

router.post('/', (req, res, next) => {
    // console.log('login', req.body)
    let { username, password } = req.body;
    // console.log(username, password);
    // username/password 是必传参数 不传不兜库
    if (!username || !password) {
        res.send({ err: 1, msg: '用户名和密码为必传参数' })
        return;
    }

    // 兜库校验username/password 
    mgdb({
        collectionName: 'user'
    }, (collection, client) => {
        collection.find({
            username
        }, {
            projection: { username: 0 } //不显示用户名
        }).toArray((err, result) => {
            // console.log('result', result);
            if (!err) {
                // 用户存在
                if (result.length > 0) {
                    let userdata = result[0];
                    console.log(result[0].password);
                    //将数据库中的密码解密，与用户输入的密码进行比对
                    console.log(password, username, 'ssss')
                    let pass = bcrypt.compareSync(password, userdata.password);
                    console.log(pass, 'pass')
                        // 密码正确
                    if (pass) {
                        //种cookie 记录用户已经登陆 留session 返回用户数据
                        req.session['newsapp_user_session'] = userdata._id
                        res.send({ err: 0, msg: '登录成功', data: userdata })
                    } else {
                        // 密码不匹配
                        res.send({ err: 1, msg: '用户名或者密码有误' })
                    }
                } else {
                    // 用户不存在
                    res.send({ err: 1, msg: '用户名不存在' })
                }
                client.close()
            } else {
                // 读取数据库失败
                res.send({ err: 1, msg: 'user集合操作失败' })
                client.close()
            }
        })
    })




})

module.exports = router;