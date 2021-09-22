const axios = require('axios');

const systemConfig = require(__pathConfig + 'localVariable');
const check_login = require(__pathServices + 'check_login');
const database = require(__pathModels + "database");
const logging = require(__pathServices + 'winston_logging');
let homePage = async(req, res, next) => {
    check_login(req, res);
    let users;
    await database.User.findAll().then(results => {
        // console.log(results);
        users = results;
    });
    let datas;
    axios.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
    let axiosData = {
        guid: 'FB057E6D-E772-4282-9BA4-F5B6334AA66D',
        from_date: '17/09/2021',
        to_date: '18/09/2021'
    }
    axiosData = JSON.stringify(axiosData);
    await axios({
        method: 'POST',
        url: 'https://betaapi.autoads.asia/PushNotification/api/contact/getcontacts',
        data: axiosData
    }).then(function(response) {
        datas = response;
        logging.info("---novaon----");
        logging.info(JSON.stringify(datas));
    }).catch(function(error) {
        console.log(error);
        logging.info(JSON.stringify(error));
    });

    res.setHeader("Content-Type", "text/html");
    res.render(`${systemConfig.pathInc}home`, {
        users,
        datas
    });
};

module.exports = {
    homePage: homePage,
};