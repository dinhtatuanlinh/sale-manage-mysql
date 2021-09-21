const systemConfig = require(__pathConfig + 'localVariable');
// logging
const logging = require(__pathServices + 'winston_logging');
module.exports = (req, res) => {
    logging.info(`${req.isAuthenticated()}`);
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
    res.locals.userInfo = req.user;
    return true;
}