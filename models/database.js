const Sequelize = require('sequelize');
// k
const connection = require(__pathConfig + 'connection');
// option table
const Option = connection.define('Option', {
    // định nghĩa các trường dữ liệu trong bảng
    // Name of Column #1 and its properties defined: id
    id: {
        // Integer Datatype
        type: Sequelize.INTEGER,
        // Increment the value automatically
        autoIncrement: true,
        // id can not be null.
        allowNull: false,
        // To uniquely identify user
        primaryKey: true
    },
    // Name of Column #2: name
    name: { type: Sequelize.STRING, allowNull: false },
    // Name of Column #3: value
    value: { type: Sequelize.STRING, allowNull: false },
    // Name of Column #3: status
    status: { type: Sequelize.BOOLEAN, allowNull: false },
    // Column: Timestamps
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
});
// option table
const Role = connection.define('Role', {
    // định nghĩa các trường dữ liệu trong bảng
    // Name of Column #1 and its properties defined: id
    id: {
        // Integer Datatype
        type: Sequelize.INTEGER,
        // Increment the value automatically
        autoIncrement: true,
        // id can not be null.
        allowNull: false,
        // To uniquely identify user
        primaryKey: true
    },
    // Name of Column #2: role
    role: { type: Sequelize.STRING, allowNull: false },
    // Column: Timestamps
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
});
// User table
const User = connection.define('User', {
    // định nghĩa các trường dữ liệu trong bảng
    // Name of Column #1 and its properties defined: id
    id: {
        // Integer Datatype
        type: Sequelize.STRING,
        // Increment the value automatically
        autoIncrement: false,
        // id can not be null.
        allowNull: false,
        // To uniquely identify user
        primaryKey: true
    },
    // Name of Column #2: name
    name: { type: Sequelize.STRING, allowNull: false },
    // Name of Column #3: username
    username: { type: Sequelize.STRING, allowNull: false },
    // Name of Column #3: email
    email: { type: Sequelize.STRING, allowNull: false },
    // Name of Column #3: password
    password: { type: Sequelize.STRING, allowNull: false },
    // Name of Column #3: repassword
    repassword: { type: Sequelize.STRING, allowNull: false },
    // Name of Column #3: avatar
    avatar: { type: Sequelize.STRING, allowNull: false },
    // Name of Column #3: phone
    phone: { type: Sequelize.INTEGER, allowNull: false },
    // Name of Column #3: role
    role: { type: Sequelize.STRING, allowNull: false },
    // Name of Column #3: manager
    manager: { type: Sequelize.STRING, allowNull: false },
    // Name of Column #3: birthday
    birthday: { type: Sequelize.STRING, allowNull: false },
    // Name of Column #3: createdtime
    createdtime: { type: Sequelize.INTEGER, allowNull: false },
    // Name of Column #3: modifiedtime
    modifiedtime: { type: Sequelize.INTEGER, allowNull: false },
    // Name of Column #3: achievement
    achievement: { type: Sequelize.STRING, allowNull: false },
    // Name of Column #3: active
    active: { type: Sequelize.BOOLEAN, allowNull: false },
    // Name of Column #3: team
    team: { type: Sequelize.STRING, allowNull: false },

    // Name of Column #3: status
    status: { type: Sequelize.STRING, allowNull: false },

});
// Show tất cả các tables trong database
let createTable = () => {
    return new Promise((res, rej) => {
        connection.query('SHOW Tables', {
            type: connection.QueryTypes.SHOWTABLES
        }).then(async result => {

            let check = {};
            // kiểm tra có bảng này đã tồn tại chưa
            check.option = result.filter(item => item === 'options'); // có chữ s sau abc là do quá trình tạo bảng tự thêm s vào

            if (check.option.length === 0) {
                // nếu bảng ko tồn tại thì tạo bảng
                // Abc.sync() - This creates the table if it doesn't exist (and does nothing if it already exists)
                // Abc.sync({ force: true }) - This creates the table, dropping it first if it already existed
                // Abc.sync({ alter: true }) - This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model.

                await Option.sync();
            };
            check.user = result.filter(item => item === 'users');
            if (check.user.length === 0) {
                await User.sync();
            };
            check.role = result.filter(item => item === 'roles');
            if (check.user.length === 0) {
                await Role.sync();
            };
            res('success');
        });

    })
}

module.exports = {
    Option,
    User,
    Role,
    createTable: createTable,
}