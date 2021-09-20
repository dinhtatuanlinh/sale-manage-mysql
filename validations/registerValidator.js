// cài đặt package validator
const { check, validationResult } = require("express-validator");
// ## do sử dụng multer để lấy file nên buộc phải đặt validation trong hàm upload của multer
// đối với trường hợp ko có file upload thì validation có thể viết theo kiểu middleware
// database
const database = require(__pathModels + "database");

module.exports = async(req) => {
    await check('username', 'Phải có 8 tới 30 ký tự').isLength({ min: 8, max: 30 }).run(req);
    await check('username').custom(async value => {

        await database.User.findOne({ where: { username: value } }).then((result) => {
            // console.log(result);// trả về null nếu ko tìm thấy
            if (result !== null) {
                throw new Error('Username đã đăng ký');
            }
            return true;
        });
    }).run(req);
    await check('email', 'Email không hợp lệ').isEmail().run(req);
    await check('email').custom(async value => {

        await database.User.findOne({ where: { email: value } }).then((result) => {
            // console.log(result);
            if (result !== null) {
                throw new Error('Email đã đăng ký');
            }
            return true;
        });
    }).run(req);
    await check('password').custom(value => {
        if (value !== req.body.repassword) {
            throw new Error('Password không khớp với repassword');
        }
        return true;
    }).run(req);
    // check lỗi ở middleware sau đó lấy lỗi ra bằng validationResult(req).errors kết quả trả ra là 1 mảng
    //{value: ***, msg: ***, param: ***, location: **}
    return validationResult(req).errors;
};