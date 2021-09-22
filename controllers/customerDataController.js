const systemConfig = require(__pathConfig + 'localVariable');
const check_login = require(__pathServices + 'check_login');
const database = require(__pathModels + "database");
const logging = require(__pathServices + 'winston_logging');
let customerDataPage = async(req, res, next) => {
    await check_login(req, res);
    // gọi biến local test ra dùng bằng cách req.app.locals.test 
    let userInfo = req.user;
    let clientDatas = await database.Client_info.findAll({
        where: { saler: userInfo.username },
        order: [
            // Will escape title and validate DESC against a list of valid direction parameters
            ['id', 'DESC']
        ],
    });
    let url = req.get('host');
    res.setHeader("Content-Type", "text/html");
    res.render(`${systemConfig.pathInc}customer_data`, {
        userInfo,
        clientDatas,
        url
    });

};
let singleCustomer = async(req, res, next) => {

    let clientData = await database.Client_info.findOne({ where: { id: req.params.id } });
    let clientData = JSON.stringify(clientData);

    res.send(clientData);
}
module.exports = {
    customerDataPage: customerDataPage,
    singleCustomer: singleCustomer,
};