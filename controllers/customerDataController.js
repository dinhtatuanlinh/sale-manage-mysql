const systemConfig = require(__pathConfig + 'localVariable');
const check_login = require(__pathServices + 'check_login');
let customerDataPage = async(req, res, next) => {
    await check_login(req, res);
    // gọi biến local test ra dùng bằng cách req.app.locals.test 
    let userInfo = req.user;
    res.setHeader("Content-Type", "text/html");
    res.render(`${systemConfig.pathInc}customer_data`, { userInfo });

};

module.exports = {
    customerDataPage: customerDataPage,
};