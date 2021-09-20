// kéo thư viện sequelize vào
const Sequelize = require('sequelize');
// tạo kết nối tới database
require('dotenv').config();
// logging
const logging = require(__pathServices + 'winston_logging');
const connection = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USERNAME,
    process.env.DATABASE_PASSWORD, {
        dialect: 'mysql',
        host: 'localhost',
        logging: false // không hiện câu lệnh sql trong terminal
    }
);
let connectDB = async() => {
    try {
        // test kết nối tới database thành công thì in ra sai thì chạy hàm catch
        await connection.authenticate();
        logging.info(`Connection has been established successfully.`)

    } catch (error) {
        logging.info(`Unable to connect to the database:${error}`)
    }
};
connectDB();
module.exports = connection;