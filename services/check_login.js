const systemConfig = require(__pathConfig + 'localVariable');
// logging
const logging = require(__pathServices + 'winston_logging');
let check_login = (req, res) => {
    return new Promise((respond, rej) => {
        if (!req.isAuthenticated()) { // isAuthenticated để xác định đã được login rồi hay chưa rồi sẽ trả về true chưa trả về false
            // tạo biến userInfo để truyền tới view nếu chưa đăng nhập thì đặt là rỗng

            let validatorErr = null;
            let registerData = { username: '', email: '' };
            // console.log(req.flash('message'));
            res.locals.title = "Login page";
            res.render(`${systemConfig.pathInc}login`, {
                validatorErr,
                registerData
            });
            // return false;
        }
        // logging.info("#####################");
        // logging.info(JSON.stringify(req.user));
        res.locals.username = req.user.username;
        res.locals.role = req.user.role;
        respond(true);
    })
}
module.exports = check_login;