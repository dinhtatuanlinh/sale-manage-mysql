// cài đặt package validator
const { check, validationResult } = require("express-validator");
// ## do sử dụng multer để lấy file nên buộc phải đặt validation trong hàm upload của multer
// đối với trường hợp ko có file upload thì validation có thể viết theo kiểu middleware
// database
const usersModel = require(__pathSchema + "database").usersModel;

module.exports = async(req) => {
    await check('password').custom(value => {
        if (value !== req.body.repassword) {
            throw new Error('Password không khớp với repassword');
        }
        return true;
    }).run(req);
    return validationResult(req).errors;
};