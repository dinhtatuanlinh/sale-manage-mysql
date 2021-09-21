const express = require("express");


const check_login = require(__pathServices + 'check_login');
const systemConfig = require(__pathConfig + 'localVariable');
// database
const database = require(__pathSchema + "database");
// logging
const logging = require(__pathServices + 'winston_logging');

let adminPage = async(req, res, next) => {
    logging.info('admin')
    logging.info(req.app.locals.userInfo.username);
    // kiểm tra xem đã login chưa
    if (check_login(req, res)) {

        if (req.app.locals.userInfo.username == 'dinhtatuanlinh') { // req.user để lấy thông tin user
            let users;
            let options;
            await database.User.findAll().then(results => {
                // console.log(results);
                users = results;
            });
            await database.Option.findAll().then(results => {
                options = results;
                // console.log(results[1].value);
            });
            // get url host
            let url = req.get('host');

            res.render(
                `${systemConfig.pathInc}admin`, {
                    users,
                    options,
                    url
                },
            );

        } else {
            req.flash('warning', 'Bạn không có quyền truy cập vào trang này', false);
            res.redirect(`/`);
        }
    }

};
let adminEditSetting = async(req, res, next) => {
    // kiểm tra xem đã login chưa
    if (check_login(req, res)) {
        if (req.user.username == 'dinhtatuanlinh') { // req.user để lấy thông tin user
            // console.log(req.body);
            // console.log(req.body.roles.split(',').length);
            let avatar = [];
            avatar[0] = {}
            avatar[0].avatarPath = req.body.avatarPath;
            avatar[0].fileSizeMB = parseInt(req.body.fileSizeMB);
            avatar[0].types = req.body.types;
            avatar = JSON.stringify(avatar);
            await database.Option.update({ value: avatar }, { where: { name: 'avatar' } }).then(result => {
                result = JSON.stringify(result);
                logging.info(result);

            })
            let user = [];
            user[0] = {};
            user[0].roles = req.body.roles === '' ? [] : req.body.roles.split(',');
            user[0].status = req.body.status === '' ? [] : req.body.status.split(',');
            user = JSON.stringify(user);
            await database.Option.findOne({ where: { name: 'user' } }).then(async result => {
                result = JSON.stringify(result);
                logging.info(`kiểm tra kết quả trả ra khi find giá trị user ở bẳng option là loại gì ${result}`);
                if (result === null) {
                    let saveUser = { name: 'user', value: user }
                    await database.Option.create(avatar).then(saveResult => {
                        saveResult = JSON.stringify(saveResult);
                        logging.info(saveResult);
                    })
                } else {
                    await database.Option.update({ value: user }, { where: { name: 'user' } }).then(saveResult => {
                        saveResult = JSON.stringify(saveResult);
                        logging.info(saveResult);
                    });
                }
            })
            await database.Option.update({ value: user }, { where: { name: 'user' } }).then(result => {
                result = JSON.stringify(result);
                logging.info(result);
            });
            req.flash('success', 'Thông tin thay đổi thành công', false);
            res.redirect(`/admin`);
        }
    }
}
let adminChangeProperties = async(req, res, next) => {
    if (check_login(req, res)) {
        if (req.user.username == 'dinhtatuanlinh') { // req.user để lấy thông tin user
            // console.log(req.params.param);
            if (req.params.param === 'role') {
                await database.User.update({ role: req.body.value }, { where: { id: req.body.id } })
            } else if (req.params.param === 'status') {
                await database.User.update({ status: req.body.value }, { where: { id: req.body.id } })
            } else if (req.params.param === 'manager') {
                await database.User.update({ manager: req.body.value }, { where: { id: req.body.id } })
            }
            // console.log(req.body);
            req.flash('success', 'Thay đổi thành công', false);
            // res.redirect(`/admin`);
            // trả lại data cho ajax
            res.send(true);
            // let users;
            // let options;
            // await usersModel.find().then(results => {
            //     // console.log(results);
            //     users = results;
            // });
            // await optionsModel.find().then(results => {
            //         options = results;
            //         // console.log(results[1].value);
            //     })
            //     // get url host
            // let url = req.get('host');

            // res.render(
            //     `${systemConfig.pathInc}admin`, {
            //         users,
            //         options,
            //         url
            //     },
            // );

        } else {
            req.flash('warning', 'Bạn không có quyền truy cập vào trang này', false);
            res.redirect(`/`);
        }
    }
}
module.exports = {
    adminPage: adminPage,
    adminEditSetting: adminEditSetting,
    adminChangeProperties: adminChangeProperties
};