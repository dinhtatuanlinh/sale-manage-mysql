const express = require("express");


const check_login = require(__pathServices + 'check_login');
const systemConfig = require(__pathConfig + 'localVariable');
// database
const usersModel = require(__pathSchema + "database").usersModel;
// lấy các biến trong optionsModel
const optionsModel = require(__pathSchema + "database").optionsModel;
let adminPage = async(req, res, next) => {
    // kiểm tra xem đã login chưa
    if (check_login(req, res)) {
        if (req.user.username == 'dinhtatuanlinh') { // req.user để lấy thông tin user
            let users;
            let options;
            await usersModel.find().then(results => {
                // console.log(results);
                users = results;
            });
            await optionsModel.find().then(results => {
                    options = results;
                    // console.log(results[1].value);
                })
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
            await optionsModel.updateOne({ name: 'avatar' }, { value: avatar }).then(result => {
                console.log(result);
            })
            let user = [];
            user[0] = {};
            user[0].roles = req.body.roles === '' ? [] : req.body.roles.split(',');
            user[0].status = req.body.status === '' ? [] : req.body.status.split(',');
            // console.log(user);
            await optionsModel.findOne({ name: 'user' }).then(async result => {
                if (result === null) {
                    let saveUser = { name: 'user', value: user }
                    await optionsModel(saveUser).save().then(saveResult => {
                        console.log(saveResult);
                    })
                } else {
                    await optionsModel.updateOne({ name: 'user' }, { value: user }).then(result => {
                        console.log(result);
                    });
                }
            })
            await optionsModel.updateOne({ name: 'user' }, { value: user }).then(result => {
                console.log(result);
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
                await usersModel.updateOne({ _id: req.body.id }, {
                    role: req.body.value
                })
            } else if (req.params.param === 'status') {
                await usersModel.updateOne({ _id: req.body.id }, {
                    status: req.body.value
                })
            } else if (req.params.param === 'manager') {
                await usersModel.updateOne({ _id: req.body.id }, {
                    manager: req.body.value
                })
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