'use strict';

module.exports = {
    up: async(queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Users', [{
            // username: DataTypes.STRING,
            // email: DataTypes.STRING,
            // password: DataTypes.STRING,
            // address: DataTypes.STRING,
            // gender: DataTypes.BOOLEAN,
            // roleid: DataTypes.STRING
            firstName: 'linh',
            lastName: 'linh',
            username: 'admin',
            email: 'admin@example.com',
            password: '123456',
            address: 'abc',
            gender: '1',
            roleid: "admin",
            createdAt: new Date(),
            updatedAt: new Date()
        }]);
    },

    down: async(queryInterface, Sequelize) => {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    }
};