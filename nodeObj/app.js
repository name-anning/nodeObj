var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let multer = require('multer')
let cookieSession = require('cookie-session')
let cors = require('cors')

//服务器搭建
var app = express();

//资源托管
app.use(express.static(path.join(__dirname, 'public', 'template')));
app.use('/admin', express.static(path.join(__dirname, 'public', 'admin')));
app.use(express.static(path.join(__dirname, 'public')));

//中间件配置
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cookieSession({
    name: '1905_session',
    keys: ['aa', 'bb'], //sha1加密一种轮询方式
    maxAge: 1000 * 60 * 60 * 24 * 15
}))


var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        if (req.url.indexOf('user') !== -1 || req.url.indexOf('reg') !== -1) {
            cb(null, path.join(__dirname, 'public', 'upload', 'user'))
        } else if (req.url.indexOf('banner') !== -1) {
            cb(null, path.join(__dirname, 'public', 'upload', 'banner'))
        } else {
            cb(null, path.join(__dirname, 'public/upload/product'))
        }
    }
})
let multerObj = multer({ storage });
// let multerObj = multer({dest:'字符路径'}); //存储方式dest指定死了，storage分目录

app.use(multerObj.any())

app.use(cors({
    "origin": ['http://127.0.0.1:8054'],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ['Content-Type', 'Authorization']
}));


//响应
//ADMIN
app.use('/admin/banner', require('./routes/admin/banner')); //交给前端渲染
// app.use('/admin/banner', require('./routes/admin/bannerr'));//交给后的渲染  挂了?

//API  

app.all('/api/*', require('./routes/api/params'))

app.use('/api/login', require('./routes/api/login'));
app.use('/api/reg', require('./routes/api/reg'));
app.use('/api/user', require('./routes/api/user'));
app.use('/api/logout', require('./routes/api/logout'));
app.use('/api/:product', require('./routes/api/product'));
app.use('/api/banner', require('./routes/api/banner'));
app.use('/api/navigation', require('./routes/api/navigation'));
app.use('/api/imglist', require('./routes/api/imglist'));
app.use('/api/list', require('./routes/api/list'));
app.use('/api/care', require('./routes/api/care'));
app.use('/api/makeup', require('./routes/api/makeup'));
app.use('/api/perfume', require('./routes/api/perfume'));
app.use('/api/tool', require('./routes/api/tool'));
app.use('/api/man', require('./routes/api/man'));
app.use('/api/bath', require('./routes/api/bath'));
app.use('/api/hair', require('./routes/api/hair'));
app.use('/api/gift', require('./routes/api/gift'));
app.use('/api/image', require('./routes/api/image'));
app.use('/api/shopcar', require('./routes/api/shopcar'));
app.use('/api/removecar', require('./routes/api/removecar'));
app.use('/api/changecar', require('./routes/api/changecar'));

//PROXY
app.use('/proxy/douban', require('./routes/proxy/douban'))


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    // res.render('error');
    res.send({ err: 1, msg: '错误的接口' })
});

module.exports = app;