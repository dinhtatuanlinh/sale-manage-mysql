const systemConfig = require(__pathConfig + 'localVariable');
const check_login = require(__pathServices + 'check_login');
const database = require(__pathModels + "database");
const pending_customers = require(__pathServices + 'pending_customers');
const logging = require(__pathServices + 'winston_logging');
const pagination = require(__pathServices + 'pagi_func');
const { Op } = require("sequelize");
let customerDataPage = async(req, res, next) => {
    await check_login(req, res);
    // gọi biến local test ra dùng bằng cách req.app.locals.test 
    let userInfo = req.user;
    let statusquery = req.query.ss
    let sendStatusQuery = req.query.ss
    if(statusquery){
        statusquery = statusquery.split("-");
    }else{
        statusquery = {[Op.ne]: null};
        sendStatusQuery='';
    }
    let web = [];
    let webQuery = req.query.web
    if(webQuery === "all" || webQuery === undefined || webQuery === null || webQuery === ''){
        web = [{root: 'jemmia.vn'},{root: 'jemmiasilver'}]
        webQuery = ``
    }else{
        web = [{root: webQuery}]
    }
    if(req.query.saler === undefined || req.query.saler === null){
        salerQuery = "&saler="
    }else{
        salerQuery = `&saler=${req.query.saler}`
    }
    let dateQuery = req.query.time;
    let period;
    let from;
    let to;

    if(dateQuery){
        period = dateQuery.split("-");
        if(parseInt(period[0])>parseInt(period[1])){
            from = 0
            to = Date.now()
        }else if(parseInt(period[1])>Date.now()){
            from = parseInt(period[0])
            to = Date.now()
        }else{
            from = parseInt(period[0])
            to = parseInt(period[1])
        }
    }else{
        from = 0
        to = Date.now()
        dateQuery = ''
    }
    let clientDatas
    let pagiParams
    let searchKey = req.query.search;
    let search;
    if(searchKey){
        search = {[Op.or]:[
            {name: searchKey},
            {phone: searchKey},
            {location: searchKey},
        ]}
    }else{
        search = {[Op.not]: [
            {name: null},
            {phone: null},
            {location: null},
        ]}
    }

    if (req.query.saler === undefined && userInfo.role === 'admin' || userInfo.role === 'sale_manager' ) {
        let numberOfTable = await database.Client_info.count({ where: { 
            status: statusquery, 
            [Op.or]: web,
            search,
            createdtime: {
                [Op.gt]: from,
                [Op.lt]: to
            }
        } });
        pagiParams = pagination(parseInt(req.query.p), numberOfTable);
        clientDatas = await database.Client_info.findAll({
            where: { 
                status:  statusquery, 
                [Op.or]: web,
                search,
                createdtime: {
                    [Op.gt]: from,
                    [Op.lt]: to
                }
            },
            offset: pagiParams.position,
            limit: pagiParams.itemsPerPage,
            order: [
                // Will escape title and validate DESC against a list of valid direction parameters
                ['id', 'DESC']
            ],
        });
    }else if(req.query.saler && req.query.saler !== "undefined"){
        let numberOfTable = await database.Client_info.count({ 
            where: { 
                saler: req.query.saler, 
                status: statusquery,
                [Op.or]: web,
                search,
                createdtime: {
                    [Op.gt]: from,
                    [Op.lt]: to
                }
            } });
        pagiParams = pagination(parseInt(req.query.p), numberOfTable);
        clientDatas = await database.Client_info.findAll({
            where: { 
                saler: req.query.saler, 
                status: statusquery,
                [Op.or]: web,
                search,
                createdtime: {
                    [Op.gt]: from,
                    [Op.lt]: to
                } 
            },
            offset: pagiParams.position,
            limit: pagiParams.itemsPerPage,
            order: [
                // Will escape title and validate DESC against a list of valid direction parameters
                ['id', 'DESC']
            ],
        });
        logging.info(num)
    } else {
        let numberOfTable = await database.Client_info.count({ 
            where: { 
                saler: userInfo.username, 
                status: statusquery, 
                [Op.or]: web,
                search,
                createdtime: {
                    [Op.gt]: from,
                    [Op.lt]: to
                }  
            } });
        pagiParams = pagination(parseInt(req.query.p), numberOfTable);
        clientDatas = await database.Client_info.findAll({
            where: { 
                saler: userInfo.username, 
                status: statusquery, 
                [Op.or]: web,
                search,
                createdtime: {
                    [Op.gt]: from,
                    [Op.lt]: to
                } 
            },
            offset: pagiParams.position,
            limit: pagiParams.itemsPerPage,
            order: [
                // Will escape title and validate DESC against a list of valid direction parameters
                ['id', 'DESC']
            ],
        });
    }
    // get data cua trang hien tai

    // let datasOfPagi = [];
    // for (i = pagiParams.position; i < (pagiParams.position + pagiParams.itemsPerPage); i++) {
    //     if (clientDatas[i] !== undefined) {
    //         datasOfPagi.push(clientDatas[i]);
    //     }
    // }
    // clientDatas = datasOfPagi;

    let url = req.get('host');
    let customerStatus = await database.Option.findOne({ where: { name: 'customer' } })

    customerStatus = JSON.parse(customerStatus.value);
    res.locals.title = "Customer Data Page";
    let saler = req.query.saler
    let customers = await pending_customers(userInfo)
    res.locals.pending_customers = customers[0];
    res.locals.total_customers = customers[1];

    res.setHeader("Content-Type", "text/html");
    res.render(`${systemConfig.pathInc}customer_data`, {
        userInfo,
        clientDatas,
        url,
        customerStatus,
        pagiParams,
        sendStatusQuery,
        saler,
        webQuery,
        dateQuery
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