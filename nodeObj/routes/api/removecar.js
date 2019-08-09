let express = require('express')
let router = express.Router()
let mgdb = require('../../utils/mgdb')
let fs = require('fs');
let pathLib = require('path');
let bcrypt = require('bcrypt');

router.post('/', (req, res, next) => {
    let { _id } = req.body;

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
                // deleteOne({ 条件 }, (err, result) => {})
                collection.deleteOne({
                    _id
                }, (err, result) => {
                    if (!err) {
                        res.send({ err: 0, msg: '删除成功', data: result });
                    }
                })
            } else {
                res.send({ err: 1, msg: '集合操作失败' })
                client.close()
            }
        })
    })
});

router.get('/', (req, res, next) => {
    // 兜库校验
    mgdb({
        url: 'mongodb://127.0.0.1:27017',
        dbName: 'newsapp',
        collectionName: 'shopcar'
    }, (collection, client) => {
        collection.remove({

            })
            // .toArray((err) => {
            //     if (!err) {
            //         res.send({ err: 0, msg: '删库成功' });
            //     } else {
            //         res.send({ err: 1, msg: '删库失败' })
            //         client.close()
            //     }
            // })
    })
});

module.exports = router;