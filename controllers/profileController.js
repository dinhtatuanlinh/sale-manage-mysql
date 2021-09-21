const express = require("express");
const fs = require('fs');

const email = require(__pathServices + 'sendemail');
const systemConfig = require(__pathConfig + 'localVariable');
const editProfileValidator = require(__pathValidations + 'editProfileValidator');
// database
const database = require(__pathModels + "database");
// logging
const logging = require(__pathServices + 'winston_logging');



let profileDataPage = async(req, res, next) => {
    // kiểm tra xem đã login chưa
    // console.log(req.user);
    // res.setHeader("Content-Type", "text/html");
    res.render(`${systemConfig.pathInc}profile`);

};
let profileEdit = async(req, res, next) => {
    let field = '';
    let avatarPath = '';
    let fileSizeMB;
    let types = '';
    await database.Option.findOne({ where: { name: 'avatar' } }).then(result => {
        field = result.name;
        avatarPath = __pathIMGS + result.value[0].avatarPath;
        fileSizeMB = result.value[0].fileSizeMB;
        types = result.value[0].types;
    })
    let upload = require(__pathServices + "upload")(field, avatarPath, fileSizeMB, types);
    upload(req, res, async(errUpload) => {
        logging.info('edit profile');
        logging.info(`${req.user.id}, ${req.params.id}`);
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

                if (req.body.password !== '') {
                    password = req.body.password;
                } else {
                    password = req.body.password;

                }

                await database.User.update({
                    name: req.body.name,
                    avatar: avatar,
                    password: password,
                    repassword: password,
                    role: req.body.role,
                    phone: req.body.phone,
                    birthday: req.body.birthday,
                    team: req.body.team,
                    modifiedtime: Date.now(),
                    email: req.user.email,
                    manager: req.user.manager,
                    createdtime: req.user.createdtime,
                    achievement: req.user.achievement,
                    active: req.user.active
                }, { where: { id: req.user.id } }).then(result => {
                    // console.log(result);
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
                })

            }
        }
    });


};
module.exports = {
    profileDataPage: profileDataPage,
    profileEdit: profileEdit
};