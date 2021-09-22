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


    res.setHeader("Content-Type", "text/html");
    res.render(`${systemConfig.pathInc}home`, {
        users
    });
};
let novaon = async(req, res, next) => {
    let datas;

    let axiosData = {
        guid: 'FB057E6D-E772-4282-9BA4-F5B6334AA66D',
        from_date: '17/09/2021',
        to_date: '18/09/2021'
    }
    axiosData = JSON.stringify(axiosData);
    let request = () => {
        return new Promise((res, rej) => {
            let result = axios.post('https://betaapi.autoads.asia/PushNotification/api/contact/getcontacts', axiosData, {
                headers: {
                    // Overwrite Axios's automatically set Content-Type
                    'Content-Type': 'application/json'
                }
            });
            res(result);
        })
    }

    request().then(data => {
        datas = data.data.Data;
    });
    let arr = datas.length;
    logging.info('++++++++++++++++');
    logging.info(arr);
    datas = JSON.stringify(datas);
    res.send(datas);
}
module.exports = {
    homePage: homePage,
    novaon: novaon,
};