const express = require("express");


const check_login = require(__pathServices + 'check_login');
const systemConfig = require(__pathConfig + 'localVariable');
// database
const database = require(__pathModels + "database");
// logging
const logging = require(__pathServices + 'winston_logging');

let adminPage = async(req, res, next) => {

    // kiểm tra xem đã login chưa
    await check_login(req, res);
    let userInfo = req.user;
    if (req.user.username == 'dinhtatuanlinh') { // req.user để lấy thông tin user
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
                url,
                userInfo
            },
        );

    } else {
        req.flash('warning', 'Bạn không có quyền truy cập vào trang này', false);
        res.redirect(`/`);
    }


};
let adminEditSetting = async(req, res, next) => {
    // kiểm tra xem đã login chưa
    await check_login(req, res);
    if (req.user.username == 'dinhtatuanlinh') { // req.user để lấy thông tin user

        await database.Option.findOne({ where: { name: 'avatar' } }).then(async result => {
            let value = JSON.parse(result.value);
            avatarPath = value[0].avatarPath;
            fileSizeMB = value[0].fileSizeMB;
            types = value[0].types;
            if (req.body.avatarPath.length > 0) {
                avatarPath = req.body.avatarPath;
            }
            if (req.body.fileSizeMB.length > 0) {
                fileSizeMB = parseInt(req.body.fileSizeMB);
            }
            if (req.body.types.length > 0) {
                types = req.body.types;
            }
            let avatar = [];
            avatar[0] = {}
            avatar[0].avatarPath = avatarPath;
            avatar[0].fileSizeMB = fileSizeMB;
            avatar[0].types = types;
            avatar = JSON.stringify(avatar);
            await database.Option.update({ value: avatar }, { where: { name: 'avatar' } }).then(updateResult => {
                if (updateResult) {
                    req.flash('success', 'Update row avatar ở bảng option thành công', false);
                } else {
                    req.flash('error', 'Update row avatar ở bảng option thất bại', false);
                }
                result = JSON.stringify(updateResult);
                logging.info(updateResult);

            })
        });

        let user = [];
        user[0] = {};
        user[0].roles = req.body.roles.length === 0 ? [] : req.body.roles.split(',');
        user[0].status = req.body.status.length === 0 ? [] : req.body.status.split(',');
        user = JSON.stringify(user);
        await database.Option.findOne({ where: { name: 'user' } }).then(async result => {

            if (result === null) {
                logging.info('create row user')
                let saveUser = { name: 'user', value: user, status: true }
                await database.Option.create(saveUser).then(saveResult => {
                    if (saveResult) {
                        req.flash('success', 'Thêm mới row user ở bảng option thành công', false);
                    } else {
                        req.flash('error', 'Thêm mới row user ở bảng option thất bại', false);
                    }
                    saveResult = JSON.stringify(saveResult);
                    logging.info(saveResult);
                })
            } else {
                await database.Option.update({ value: user, status: true }, { where: { name: 'user' } }).then(saveResult => {
                    if (saveResult) {
                        req.flash('success', 'Update row user ở bảng option thành công', false);
                    } else {
                        req.flash('error', 'Update row user ở bảng option thất bại', false);
                    }
                    saveResult = JSON.stringify(saveResult);
                    logging.info(saveResult);
                });
            }
        });
        let customer = [];
        customer[0] = {};
        customer[0].status = req.body.customer_status.length === 0 ? [] : req.body.customer_status.split(',');
        customer = JSON.stringify(customer);
        await database.Option.findOne({ where: { name: 'customer' } }).then(async result => {

            if (result === null) {

                let saveCustomer = { name: 'customer', value: customer, status: true }
                await database.Option.create(saveCustomer).then(saveResult => {
                    if (saveResult) {
                        req.flash('success', 'Thêm mới row customer ở bảng option thành công', false);
                    } else {
                        req.flash('error', 'Thêm mới row customer ở bảng option thất bại', false);
                    }
                    saveResult = JSON.stringify(saveResult);
                    logging.info(saveResult);
                })
            } else {
                await database.Option.update({ value: customer, status: true }, { where: { name: 'customer' } }).then(saveResult => {
                    if (saveResult) {
                        req.flash('success', 'Update row customer ở bảng option thành công', false);
                    } else {
                        req.flash('error', 'Update row customer ở bảng option thất bại', false);
                    }
                    saveResult = JSON.stringify(saveResult);
                    logging.info(saveResult);
                });
            }
        });
        // req.flash('success', 'Thông tin thay đổi thành công', false);
        res.redirect(`/admin`);
    }

}
let adminChangeProperties = async(req, res, next) => {

    await check_login(req, res);
    if (req.user.username == 'dinhtatuanlinh') { // req.user để lấy thông tin user
        logging.info(req.params.param);
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


    } else {
        req.flash('warning', 'Bạn không có quyền truy cập vào trang này', false);
        res.redirect(`/`);
    }

}
module.exports = {
    adminPage: adminPage,
    adminEditSetting: adminEditSetting,
    adminChangeProperties: adminChangeProperties
};