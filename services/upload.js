// package hỗ trợ upload file
const multer = require("multer");
// package hỗ trợ lấy phần mở rộng bằng phương thức path.extname(file.originalname)
var path = require('path');
// multer setting


let uploadFile = (field, avatarPath, fileSizeMB, types) => { //avatarPath = __pathIMGS + "avatars", fileSizeMB = 1, types = 'jpeg|jpg|png|gif', 
    // let avatarPath = __pathIMGS + "avatars";
    // let fileSizeMB = 1;
    // let types = 'jpeg|jpg|png|gif'
    // console.log('abc');
    // optionsModel.findOne({ name: "avatar" }).then(result => {
    //     console.log(result);

    // })

    let storage = multer.diskStorage({
        destination: (req, res, cb) => {
            cb(null, avatarPath);
        },
        filename: (req, file, cb) => {
            // console.log(file);
            cb(null, Date.now() + '-' + file.originalname);
        }
    });
    let upload = multer({
        storage: storage,
        limits: {
            fileSize: fileSizeMB * 1024 * 1024,
        },
        fileFilter: (req, file, cb) => {
            // console.log(file);
            //kéo class kiểm tra phần mở rộng của file
            let fileTypes = new RegExp(types);
            // lấy tên của file sau đó lấy phần mở rộng chuyển qua chữ thường rồi so sáng bằng hàm test của class RegExp
            let extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
            // kiểm tra extname
            if (extname) {
                return cb(null, true);
            } else {
                cb('File không hợp lệ');
            }
        }
    });
    return upload.single(field);
}

// let avatar = multer({
//     storage: storage,
//     limits: {
//         fileSize: 1 * 1024 * 1024,
//     }
// }).single("avatar");
module.exports = uploadFile;