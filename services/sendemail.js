const nodemailer = require('nodemailer');
// import thu vien dotenv goi ham config() để lấy ra các biến môi trường
require('dotenv').config();
class XL_GOI_THU_DIEN_TU {
    sendemail(from, to, subject, body) {
        return new Promise((res, rej) => {
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    // type: 'OAuth2',
                    user: process.env.ADMIN_EMAIL, // user gmail
                    pass: process.env.ADMIN_PASSWORD_EMAIL, // pass gmail
                    //accessToken: 'ya29.A0AfH6SMAAtUty8VGNbecxt9xvsISVyvC464brMy3nAG8cPcz13miIkLxL_oKUk2mQ8Fjavnsr0NynACqtRKMd-XtBa7jmehfQj9wkbHD1WligmiFMsY8T0tBQonx6BcrUrbtiIDWZJtHnqP-ltfx2Z32eux_b'
                }
            });

            var mailOptions = {
                from: `Email được gửi từ <${from}>`,
                to: to,
                subject: subject,
                html: body
            };
            // Gọi phương thức sendMail -> Promise
            res(transporter.sendMail(mailOptions));
        })

    }
};
var Goi_thu = new XL_GOI_THU_DIEN_TU();
module.exports = Goi_thu