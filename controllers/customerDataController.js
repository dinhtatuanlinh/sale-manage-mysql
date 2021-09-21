const systemConfig = require(__pathConfig + 'localVariable');
let customerDataPage = async(req, res, next) => {
    if (!req.isAuthenticated()) { // isAuthenticated để xác định đã được login rồi hay chưa rồi sẽ trả về true chưa trả về false
        // tạo biến userInfo để truyền tới view nếu chưa đăng nhập thì đặt là rỗng

        res.locals.userInfo = '';
        let validatorErr = null;
        let registerData = { username: '', email: '' };
        // console.log(req.flash('message'));
        res.render(`${systemConfig.pathInc}login`, {
            validatorErr,
            registerData
        });
        // return false;
    }
    // gọi biến local test ra dùng bằng cách req.app.locals.test 
    res.setHeader("Content-Type", "text/html");
    res.render(`${systemConfig.pathInc}customer_data`);

};

module.exports = {
    customerDataPage: customerDataPage,
};