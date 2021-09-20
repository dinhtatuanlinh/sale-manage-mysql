const express = require("express");
const fs = require('fs');

const check_login = require(__pathServices + 'check_login');
const systemConfig = require(__pathConfig + 'localVariable');
const editProfileValidator = require(__pathValidations + 'editProfileValidator');
// database
const usersModel = require(__pathSchema + "database").usersModel;
// lấy các biến trong optionsModel
const optionsModel = require(__pathSchema + "database").optionsModel;



let profileDataPage = async(req, res, next) => {
    // kiểm tra xem đã login chưa
    if (check_login(req, res)) {

        // console.log(req.user);
        // res.setHeader("Content-Type", "text/html");
        res.render(`${systemConfig.pathInc}profile`);
    }
};
let profileEdit = async(req, res, next) => {
    let field = '';
    let avatarPath = '';
    let fileSizeMB;
    let types = '';
    await optionsModel.findOne({ name: 'avatar' }).then(result => {
        field = result.name;
        avatarPath = __pathIMGS + result.value[0].avatarPath;
        fileSizeMB = result.value[0].fileSizeMB;
        types = result.value[0].types;
    })
    let upload = require(__pathServices + "upload")(field, avatarPath, fileSizeMB, types);
    upload(req, res, async(errUpload) => {
        // console.log(req.user._id, req.params.id);
        if (check_login(req, res) && req.user._id.toString() === req.params.id) {

            let avatar;
            let password;
            // registerData = req.user;
            let validatorErr = await editProfileValidator(req);

            if (errUpload) {
                // A Multer error occurred when uploading.
                validatorErr.push({ param: 'avatart', msg: errUpload });
            };
            // console.log(req.body);
            if (req.body.password !== req.body.repassword) {
                validatorErr.push({ param: 'password', msg: 'Password và repassword không khớp' });
            }
            // console.log(validatorErr);
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
                    password = req.user.password;
                }
                // console.log(req.body.birthday);
                await usersModel.updateOne({ _id: req.user._id.toString() }, {
                    name: req.body.name,
                    avatar: avatar,
                    password: password,
                    repassword: password,
                    phone: req.body.phone,
                    birthday: req.body.birthday,
                    team: req.body.team,
                    modifiedtime: Date.now()
                }).then(result => {
                    // console.log(result);
                    res.redirect(`/profile`);
                })

            }
        }
    })
}
module.exports = {
    profileDataPage: profileDataPage,
    profileEdit: profileEdit
};