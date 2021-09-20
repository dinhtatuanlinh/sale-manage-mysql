// const { Sequelize } = require('sequelize');
const { Sequelize, DataTypes, Model } = require('sequelize');
// Option 1: Passing a connection URI
// const sequelize = new Sequelize('sqlite::memory:') // Example for sqlite
// const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname') // Example for postgres


// Option 2: Passing parameters separately (other dialects)
// tham số thứ nhất là tên database
// tham số thứ 2 là user truy cập vào db
// tham số thứ 3 là password
const sequelize = new Sequelize('database_development', 'root', null, {
    host: 'localhost',
    dialect: 'mysql',
    logging: false // không hiện câu lệnh sql trong terminal
});
let connectDB = async() => {
    try {
        // test kết nối tới database thành công thì in ra sai thì chạy hàm catch
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        const Abc = sequelize.define('Abc', {
            // Model attributes are defined here
            firstName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            lastName: {
                type: DataTypes.STRING
                    // allowNull defaults to true
            }
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};
module.exports = connectDB;