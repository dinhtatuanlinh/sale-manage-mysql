const systemConfig = require(__pathConfig + 'localVariable');
const check_login = require(__pathServices + 'check_login');
const axios = require(__pathServices + 'axios');
const database = require(__pathModels + "database");
const logging = require(__pathServices + 'winston_logging');
let homePage = async(req, res, next) => {
    await check_login(req, res);
    logging.info(JSON.stringify(req.user))
    let userInfo = req.user;
    let users;
    await database.User.findAll().then(results => {
        // console.log(results);
        users = results;
    });

    // ########################################
    // get data from novaon
    // ########################################

    let date = new Date();
    let to_date = `${("0" + (date.getDate())).slice(-2)}/${("0" + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
    date.setDate(date.getDate() - 1);
    let from_date = `${("0" + (date.getDate())).slice(-2)}/${("0" + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
    if (req.app.locals.to_date !== '' || req.app.locals.to_date !== to_date) {
        let datas = await axios(from_date, to_date);
        datas = datas.data.Data;
        for (i = 0; i < datas.length; i++) {
            await database.Client_info.findOne({ where: { phone: datas[i].Phones[0] } }).then(async result => {
                if (result === null) {
                    // insert data into table option
                    let insertData = {};
                    insertData.name = datas[i].Fullnames[0] === null ? '' : datas[i].Fullnames[0];
                    insertData.email = datas[i].Emails[0] === null ? '' : datas[i].Emails[0];
                    insertData.phone = datas[i].Phones[0] === null ? '' : datas[i].Phones[0];
                    insertData.url = datas[i].LeadUrls[0] === null ? '' : datas[i].LeadUrls[0];
                    insertData.device = datas[i].Devices[0] === null ? '' : datas[i].Devices[0];
                    insertData.formData = datas[i].FormDatas[0] === null ? '' : datas[i].FormDatas[0];
                    insertData.event = datas[i].LeadChanels[0] === null ? '' : datas[i].LeadChanels[0];
                    insertData.location = datas[i].Locations[0] === null ? '' : datas[i].Locations[0];
                    insertData.root = 'novaon';
                    insertData.mark = false;
                    insertData.tags = datas[i].Tags[0] === null ? '' : datas[i].Tags[0];
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
        let clientData = await database.Client_info.findAll({ where: { saler: '' } });
        for (i = 0; i < users.length; i++) {
            for (j = i; j < clientData.length; j = j + users.length) {
                await database.Client_info.update({ saler: users[i].username }, { where: { id: clientData[j].id } })
            }
        }
        req.app.locals.to_date = to_date;
    }

    res.setHeader("Content-Type", "text/html");
    res.render(`${systemConfig.pathInc}home`, {
        users,
        userInfo,
    });
};

module.exports = {
    homePage: homePage,

};