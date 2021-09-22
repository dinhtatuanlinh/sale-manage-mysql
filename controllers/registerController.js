const fs = require('fs');

// kéo hàm để check validation
const registerValidator = require(__pathValidations + 'registerValidator');
// lib send email
const email = require(__pathServices + 'sendemail');
const MD5 = require(__pathServices + 'md5');
const systemConfig = require(__pathConfig + 'localVariable');
// database
const database = require(__pathModels + "database");
// logging
const logging = require(__pathServices + 'winston_logging');


let getLoginPage = async(req, res, next) => {

    let validatorErr = null;
    let registerData = { username: '', email: '' };
    // console.log(req.flash('message'));
    req.flash('success', req.app.locals.loginErr, false);
    res.render(`${systemConfig.pathInc}login`, {
        validatorErr,
        registerData
    });

};
let postLogin = (req, res, next) => {
    // nếu người dùng tick vào ô lưu đăng nhập remember

    if (req.body.remember) {
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // Cookie expires after 30 days
    } else {
        req.session.cookie.expires = false; // Cookie expires at end of session
    }
    // khi đăng nhập thành công thì truyền giá trị vào userInfo biến này 

    res.redirect('/');
}
let postRegister = async(req, res, next) => {
    logging.info(JSON.stringify(req.file));
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
    });

    let upload = require(__pathServices + "upload")(field, avatarPath, fileSizeMB, types);
    await upload(req, res, async(errUpload) => {

        let registerData = {};
        registerData = req.body;
        let validatorErr = await registerValidator(req);


        if (errUpload) {
            // A Multer error occurred when uploading.
            validatorErr.push({ param: 'avatar', msg: errUpload });
        };

        if (req.file === undefined) {
            // console.log('123');
            validatorErr.push({ param: "avatar", msg: 'Bạn chưa chọn hình avatar' })
        }

        if (validatorErr.length > 0) {
            if (req.file !== undefined) {
                fs.unlinkSync(__pathIMGS + "avatars/" + req.file.filename);
            }
            res.locals.userInfo = '';
            res.render(`${systemConfig.pathInc}login`, {
                validatorErr,
                registerData
            })
        } else {
            let id = Date.now();

            registerData.name = '';
            registerData.avatar = req.file.filename;
            registerData.id = MD5(`${id}`);
            registerData.role = 'basic';
            registerData.active = 0;
            registerData.createdtime = id;
            registerData.status = 'none';
            registerData.manager = 'none';
            registerData.phone = 0;
            registerData.birthday = '';
            registerData.modifiedtime = 0;
            registerData.achievement = '';
            registerData.team = '';
            logging.info(JSON.stringify(registerData));
            database.User.create(registerData).then(async(result) => {

                let from = "Đinh Tạ Tuấn Linh";
                let to = result.email;
                let subject = "Email kích hoạt tài khoản từ salemanage";
                let body = `Nhấn vào đường link để kích hoạt ${req.get('host')}/confirm/` + result.id;
                await email.sendemail(from, to, subject, body);
                // tham số thứ nhất là info là biến title truyền ra ngoài view, tham số thứ 2 là câu thông báo truyền ra ngoài view, nếu ko render ra giao diện thì phải thêm tham số thứ 3 là false
                req.flash('success', 'Bạn đã đăng ký tài khoản thành công. Một đường link kích hoạt đã được gửi vào email của bạn', false);
                res.redirect(`/`);
            });
        }
    });
};
let confirm = async(req, res, next) => {
    await database.User.update({ active: true }, { where: { id: req.params.id } }).then(result => {
        req.flash('success', 'Tài khoản của bạn đã được kích hoạt thành công', false);
        res.redirect(`/`);
    });

};
let del = async(req, res, next) => {
    logging.info(req.params.username);

    await database.User.destroy({ where: { username: req.params.username } }).then((result) => {

        if (result) {
            logging.info(JSON.stringify(result));
            req.flash('success', 'xóa thành công', false);
            res.redirect(`/`);
        } else {
            req.flash('success', 'xóa thất bại', false);
            res.redirect(`/`);
        }

    });
};
let getLogout = (req, res, next) => {
    req.logOut(); // để logout tài khoản
    res.redirect(`/`);
};




module.exports = {
    getLoginPage: getLoginPage,
    postRegister: postRegister,
    getLogout: getLogout,
    confirm: confirm,
    postLogin: postLogin,
    del: del,
};