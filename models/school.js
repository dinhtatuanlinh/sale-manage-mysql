const Sequelize = require('sequelize');
// k
const connection = require('../config/connection');
const School = connection.define('School', {
    // định nghĩa các trường dữ liệu trong bảng
    // Name of Column #1 and its properties defined: id
    id: {

        // Integer Datatype
        type: Sequelize.INTEGER,

        // Increment the value automatically
        autoIncrement: true,

        // user_id can not be null.
        allowNull: false,

        // To uniquely identify user
        primaryKey: true
    },

    // Name of Column #2: name
    name: { type: Sequelize.STRING, allowNull: false },

    // Name of Column #3: email
    address: { type: Sequelize.STRING, allowNull: false },

    // Column: Timestamps
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
});
// Show tất cả các tables trong database
connection.query('SHOW Tables', {
    type: connection.QueryTypes.SHOWTABLES
}).then(async result => {
    // kiểm tra có bảng này đã tồn tại chưa
    let check = result.filter(item => item === 'schools'); // có chữ s sau abc là do quá trình tạo bảng tự thêm s vào
    if (check.length === 0) {
        // nếu bảng ko tồn tại thì tạo bảng
        // Abc.sync() - This creates the table if it doesn't exist (and does nothing if it already exists)
        // Abc.sync({ force: true }) - This creates the table, dropping it first if it already existed
        // Abc.sync({ alter: true }) - This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model.

        await School.sync();
    }
});
module.exports = School