const check_login = require(__pathServices + 'check_login');
const systemConfig = require(__pathConfig + 'localVariable');
let customerDataPage = async(req, res, next) => {
    // kiểm tra xem đã login chưa
    if (check_login(req, res)) {
        // gọi biến local test ra dùng bằng cách req.app.locals.test 

        res.setHeader("Content-Type", "text/html");
        res.render(`${systemConfig.pathInc}customer_data`);
    }
};

module.exports = {
    customerDataPage: customerDataPage,
};