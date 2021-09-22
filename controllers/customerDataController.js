const systemConfig = require(__pathConfig + 'localVariable');
const check_login = require(__pathServices + 'check_login');
const database = require(__pathModels + "database");
const logging = require(__pathServices + 'winston_logging');
let customerDataPage = async(req, res, next) => {
    await check_login(req, res);
    // gọi biến local test ra dùng bằng cách req.app.locals.test 
    let userInfo = req.user;
    let clientDatas
    if (userInfo.role === 'admin' || userInfo.role === 'sale_manager') {
        clientDatas = await database.Client_info.findAll({
            order: [
                // Will escape title and validate DESC against a list of valid direction parameters
                ['id', 'DESC']
            ],
        });
    } else {
        clientDatas = await database.Client_info.findAll({
            where: { saler: userInfo.username },
            order: [
                // Will escape title and validate DESC against a list of valid direction parameters
                ['id', 'DESC']
            ],
        });
    }

    let url = req.get('host');
    let customerStatus = await database.Option.findOne({ where: { name: 'customer' } })

    customerStatus = JSON.parse(customerStatus.value);

    res.setHeader("Content-Type", "text/html");
    res.render(`${systemConfig.pathInc}customer_data`, {
        userInfo,
        clientDatas,
        url,
        customerStatus,
    });

};
let singleCustomer = async(req, res, next) => {

    let clientData = await database.Client_info.findOne({ where: { id: req.params.id } });
    clientData = JSON.stringify(clientData);

    res.send(clientData);
}
let editCustomer = async(req, res, next) => {
    await check_login(req, res);
    let clientData = await database.Client_info.findOne({ where: { id: req.params.id } });
    if (clientData.saler === req.user.username) {
        let status = req.body.status;
        let note = req.body.note
        await database.Client_info.update({ status: status, mark: true, note: note }, { where: { id: req.params.id } }).then(result => {
            if (result) {
                req.flash('success', `Bạn vừa xử lý số điện thoại ${clientData.phone}`, false);
            } else {
                req.flash('error', `Xử lý số điện thoại ${clientData.phone} thất bại`, false);
            }
        })
    }
    res.redirect(`/customer-data`);
}
module.exports = {
    customerDataPage: customerDataPage,
    singleCustomer: singleCustomer,
    editCustomer: editCustomer,
};