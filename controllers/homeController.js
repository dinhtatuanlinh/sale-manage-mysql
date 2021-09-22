const systemConfig = require(__pathConfig + 'localVariable');
const check_login = require(__pathServices + 'check_login');
const database = require(__pathModels + "database");
const axios = require(__pathServices + 'axios');
const logging = require(__pathServices + 'winston_logging');
let homePage = async(req, res, next) => {
    await check_login(req, res);
    let users;
    await database.User.findAll().then(results => {
        // console.log(results);
        users = results;
    });

    // ########################################
    // get data from novaon
    // ########################################
    let date = new Date();
    let to_date = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
    date.setDate(date.getDate() - 1);
    let from_date = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
    // logging.info(from_date);
    // logging.info('to');
    // logging.info(to_date);
    let datas = await axios(from_date, to_date);
    datas = datas.data.Data;
    // for(i=0; i<datas.length; i++){
    //     await database.
    // }



    res.setHeader("Content-Type", "text/html");
    res.render(`${systemConfig.pathInc}home`, {
        users,

    });
};

module.exports = {
    homePage: homePage,

};