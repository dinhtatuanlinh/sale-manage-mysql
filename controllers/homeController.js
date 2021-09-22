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
    for (i = 0; i < datas.length; i++) {
        await database.Client_info.findOne({ where: { phone: datas[i].Phones } }).then(async result => {
            if (result === null) {
                // insert data into table option
                let insertData = {};
                insertData.name = datas[i].Fullnames[0];
                insertData.email = datas[i].Emails[0];
                insertData.phone = datas[i].Phones[0];
                insertData.url = datas[i].LeadUrls[0];
                insertData.device = datas[i].Devices[0];
                insertData.formData = datas[i].FormDatas[0];
                insertData.event = datas[i].LeadChanels[0];
                insertData.location = datas[i].Locations[0];
                insertData.root = 'novaon';
                insertData.mark = false;
                insertData.tags = datas[i].Tags[0];
                insertData.saler = '';
                insertData.status = 'none';
                insertData.note = '';
                insertData.createdtime = datas[i].CreatedDate;
                await database.Client_info.create(insertData).then(saveResult => {
                    logging.info(`${i}-thanh cong`)
                })
            }
        });
    }



    res.setHeader("Content-Type", "text/html");
    res.render(`${systemConfig.pathInc}home`, {
        users,

    });
};

module.exports = {
    homePage: homePage,

};