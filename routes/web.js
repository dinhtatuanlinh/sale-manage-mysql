const express = require("express");
// const { check, oneOf, validationResult } = require("express-validator");

// goi controller xu ly router homepage
const registerController = require(__pathControllers + "registerController");

const passport_func = require(__pathServices + "passport_func");
// logging
const logging = require(__pathServices + 'winston_logging');
let router = express.Router();




module.exports = (io, app) => {
    // cau hình router trang chủ
    // ##################
    router.use('/', require('./main')(io, app));
    // ##################


    // login and register

    router.get(
        '/logout',
        (req, res, next) => { registerController.getLogout(req, res, next) }
    );
    router.post(
        '/login',
        passport_func.auth,
        (req, res, next) => { registerController.postLogin(req, res, next) }
    );
    router.post(
        '/register',
        (req, res, next) => { registerController.postRegister(req, res, next) }
    );
    router.get(
        '/confirm/:id',
        (req, res, next) => { registerController.confirm(req, res, next) }
    );
    // router.get(
    //     '/del/:username',
    //     (req, res, next) => { registerController.del(req, res, next) }
    // );
    // END login and register

    // đang viết theo chuẩn rest api
    // lấy thông tin dùng action get
    // tạo thông tin dùng action post
    // xóa thông tin dùng action delete
    // update thông tin dùng action push


    passport_func.Use;
    passport_func.serialize;
    passport_func.deserialize;
    return router;
}