const express = require("express");
const fs = require('fs');

const email = require(__pathServices + 'sendemail');
const systemConfig = require(__pathConfig + 'localVariable');
const editProfileValidator = require(__pathValidations + 'editProfileValidator');
const check_login = require(__pathServices + 'check_login');
// database
const database = require(__pathModels + "database");
const pending_customers = require(__pathServices + 'pending_customers');
// logging
const logging = require(__pathServices + 'winston_logging');



let profileDataPage = async(req, res, next) => {
    await check_login(req, res);
    // kiểm tra xem đã login chưa
    // console.log(req.user);
    res.locals.title = "Profile Page";
    let userInfo = req.user;

    res.locals.pending_customers = await pending_customers(userInfo);
    res.setHeader("Content-Type", "text/html");
    res.render(`${systemConfig.pathInc}profile`, { userInfo });

};
let profileEdit = async(req, res, next) => {
    await check_login(req, res);
    let field = '';
    let avatarPath = '';
    let fileSizeMB;
    let types = '';
    await database.Option.findOne({ where: { name: 'avatar' } }).then(result => {
        field = result.name;
        let value = JSON.parse(result.value);

        avatarPath = __pathIMGS + value[0].avatarPath;
        fileSizeMB = value[0].fileSizeMB;
        types = value[0].types;
    })
    let upload = require(__pathServices + "upload")(field, avatarPath, fileSizeMB, types);
    upload(req, res, async(errUpload) => {

        //check id người đang sử dụng và id người truyền lên là cùng 1 người
        if (req.user.id === req.params.id) {

            let avatar;
            let password;

            // registerData = req.user;
            let validatorErr = await editProfileValidator(req);

            if (errUpload) {
                // A Multer error occurred when uploading.
                validatorErr.push({ param: 'avatar', msg: errUpload });
            };

            if (validatorErr.length > 0) {
                if (req.file !== undefined) {
                    fs.unlinkSync(__pathIMGS + "avatars/" + req.file.filename);
                }
                res.locals.title = "Profile Page";
                res.locals.username = userInfo.username;
                res.locals.role = userInfo.role;
                res.render(`${systemConfig.pathInc}profile`, {
                    validatorErr,
                    // registerData
                })
            } else {

                if (req.file !== undefined) {
                    avatar = req.file.filename;
                    fs.unlinkSync(__pathIMGS + "avatars/" + req.user.avatar);
                } else {
                    avatar = req.user.avatar;
                }

                if (req.body.password.length > 0) {
                    password = req.body.password;

                } else {
                    password = req.user.password;

                }
                let updateTime = Date.now();
                let updateData = {
                    name: req.body.name,
                    avatar: avatar,
                    password: password,
                    repassword: password,
                    role: req.user.role,
                    phone: req.body.phone,
                    birthday: req.body.birthday,
                    team: req.body.team,
                    modifiedtime: updateTime,
                    email: req.user.email,
                    manager: req.user.manager,
                    createdtime: req.user.createdtime,
                    achievement: req.user.achievement,
                    active: req.user.active
                };

                await database.User.update(updateData, { where: { id: req.user.id } }).then(async result => {
                    if (result) {
                        updateData.id = req.user.id;
                        req.app.locals.userInfo = updateData;
                        let time = new Date();
                        time = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`
                        let from = "Đinh Tạ Tuấn Linh";
                        let to = req.user.email;
                        let subject = "Email thông báo từ trang quản lý telesale của Jemmia";
                        let body = `Bạn vừa thay đổi profile lúc ${time}`;
                        await email.sendemail(from, to, subject, body);
                        // tham số thứ nhất là info là biến title truyền ra ngoài view, tham số thứ 2 là câu thông báo truyền ra ngoài view, nếu ko render ra giao diện thì phải thêm tham số thứ 3 là false
                        req.flash('success', 'Bạn đã thay đổi profile thành công. Một email thông báo vừa được gửi vào email của bạn', false);

                        res.redirect(`/profile`);
                    } else {
                        req.flash('error', 'Bạn đã thay đổi profile thất bại', false);

                        res.redirect(`/profile`);
                    }

                })

            }
        }
    });


};
module.exports = {
    profileDataPage: profileDataPage,
    profileEdit: profileEdit
};