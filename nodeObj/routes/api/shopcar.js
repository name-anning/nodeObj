let express = require('express')
let router = express.Router()
let mgdb = require('../../utils/mgdb')
let fs = require('fs');
let pathLib = require('path');
let bcrypt = require('bcrypt');

router.post('/', (req, res, next) => {
    let { _id, sort, src, title, produce, price } = req.body;

    // 兜库校验
    mgdb({
        url: 'mongodb://127.0.0.1:27017',
        dbName: 'newsapp',
        collectionName: 'shopcar'
    }, (collection, client) => {
        collection.find({
            _id
        }, {

        }).toArray((err, result) => {
            if (!err) {
                if (result.length > 0) {
                    //不通过 返回错误信息
                    let number = ++result[0].num;
                    res.send({ err: 0, msg: '修改数据', data: number });
                    collection.updateOne({
                        _id
                    }, {
                        $set: {
                            'num': number
                        }
                    })
                } else {
                    //通过   返回用户数据  插入库 返回插入后的数据
                    let num = 1;
                    collection.insertOne({
                        _id,
                        sort,
                        src,
                        title,
                        produce,
                        price,
                        num
                    }, (err, result) => {
                        if (!err) {
                            res.send({ err: 0, msg: '存储成功', data: result.ops[0] })
                        } else {
                            res.send({ err: 1, msg: 'user集合操作失败' })
                            client.close()
                        }
                    })
                }
            } else {
                res.send({ err: 1, msg: '集合操作失败' })
                client.close()
            }
        })
    })
});
router.get('/', (req, res, next) => {
    mgdb({
        url: 'mongodb://127.0.0.1:27017',
        dbName: 'newsapp',
        collectionName: 'shopcar'
    }, (collection) => {
        collection.find({

        }).toArray((err, result) => {
            if (!err) {
                res.send({ err: 0, msg: '成功', data: result })
            }
        })
    });
});

module.exports = router;