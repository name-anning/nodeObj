let express = require('express')
let router = express.Router()
let mgdb = require('../../utils/mgdb')
let fs = require('fs');
let pathLib = require('path');
let bcrypt = require('bcrypt');

router.post('/', (req, res, next) => {
    let { _id, number } = req.body;

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
                let count = result[0].num + number;
                // res.send({ err: 1, msg: '修改数量之前', data: count })
                if (count > 0) {
                    collection.updateOne({
                        _id
                    }, {
                        $set: {
                            'num': count
                        }
                    })
                    res.send({ err: 1, msg: '修改数量' })
                } else {
                    client.close();
                }
            } else {
                res.send({ err: 1, msg: '集合操作失败' })
                client.close();
            }
        })
    })
});

module.exports = router;