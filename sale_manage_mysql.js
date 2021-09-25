const express = require("express");
// thư viện giúp lấy biến truyền bằng phương thức get use?id=?
var cors = require('cors')
var http = require('http');

const bodyParser = require("body-parser");
// import thu vien dotenv goi ham config() để lấy ra các biến môi trường
require('dotenv').config();
// cai dat socket.io
const socket_io = require('socket.io');
// package check login passport
const passport = require('passport');
// express-flash-notification hiển thị thông báo phải dùng kèm với cookie-parser và express-session
const flash = require('express-flash-notification');
const cookieParser = require('cookie-parser');
const session = require('express-session');



// gọi hamf connectDb
// const connectDB = require("./config/connectdbMysql");
// Importing the database model
// const connection = require('./config/connection');;
// define constant 
// biến global là những biến set chung cho tất cả nếu thay đổi ở router thì sẽ thay đổi tất cả nến phải gắn giá trị cố định cho nó
global.__base = __dirname + '/';
global.__pathConfig = __base + 'config/';
global.__pathRoutes = __base + 'routes/';
global.__pathControllers = __base + 'controllers/';
global.__pathModels = __base + 'models/';
global.__pathSchema = __base + 'schema/';
global.__pathViews = __base + 'views/';
global.__pathServices = __base + 'services/';
global.__pathValidations = __base + 'validations/';
global.__pathIMGS = __base + 'public/imgs/';
const options = require(__pathConfig + 'options');
const viewEngine = require(__pathConfig + "viewEngine");
const initWebRoutes = require(__pathRoutes + "web");
// tạo module ghi logs ra file bằng winston
const logging = require(__pathServices + 'winston_logging');


let app = express();
//cấp phép truy cập api
app.use(cors())

// set cookiePaser
app.use(cookieParser());
// set session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    // cookie: {
    //     // đặt thời gian tồn tại của cookie
    //     maxAge: 5 * 60 * 1000
    // }
}));
// set passport
app.use(passport.initialize());
app.use(passport.session());
// cài đặt cho flash truyền vào app trong hàm flash() tham số thứ 2 là file lưu giao diện flash
app.use(flash(app, { viewName: 'inc/elements/flash' }));
// cách sử dụng flash
// cách đưa file dao diện vào vị trí hiển thị trong web bằng <%- locals.flash %> nó sẽ giúp kéo file giao diện vào vị trí muốn hiển thị
// cách truyền dữ liệu vào để hiện thị trong flash
// req.flash('success', 'cập nhật status thành công', false);
// với tham số thứ nhất truyền vào là type của flash ở đây là success
// tham số thứ 2 là  nội dung tin nhắn truyền ra
// 2 tham số này sẽ được truyền vào file giao diện của flash băng <%= type %> và <%= message %>
// tham số thứ 3 false nếu ko muốn render ra giao diện


// use midleware bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// set header
// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

// tạo biến locals truyền tới tất cả các file
// gọi ra ở các router bằng các console.log(req.app.locals.test)
// và đồng thời có thể gọi ra ở tất cả các file ejs bằng <%= test %>
// cũng có thể sửa lại dữ liệu bằng cách req.app.locals.test = '123';
// biến lưu ở local cũng là biến giống global khi thay đổi giá trị ở vị trí khác toàn bộ server cũng thay đổi theo
app.locals.to_date = '';

// tạo các tham số mặc định trong options
options();

// truyền app vào cho hàm viewEngine
viewEngine(app);

var server = http.createServer(app);
var io = socket_io(server);
app.io = io;
// io.attach(server);
// truyền app vào route
app.use("/", initWebRoutes(io));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});
// error handler (khi gọi url ko tồn tại trả về trang 404)
app.use(function(err, req, res, next) {
    res.locals.userInfo = '';
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('404'); ///khi không tìm được trang sẽ trả về trang báo lỗi có thông báo lỗi đầy đủ
    // res.render('error', { title: 'errorPage' });
});

// lấy tham số trong file .env môi trường
let port = process.env.PORT || 6969; // ||hoặc
// PORT === undefined thì gán vào 6969

server.listen(port, () => {
    console.log(`app is running at port: http://localhost:${port}`);
    logging.info(`app is running at port: http://localhost:${port}`);
});