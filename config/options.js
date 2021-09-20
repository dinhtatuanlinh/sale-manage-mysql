// database
// const optionsModel = require(__pathSchema + "database").optionsModel;

const database = require(__pathModels + "database");

module.exports = async() => {

    // tạo các biên setting cho avatar
    let value = JSON.stringify([{
        avatarPath: "avatars",
        fileSizeMB: 1,
        types: 'jpeg|jpg|png|gif',
    }]);
    let avatar = {
        name: 'avatar',
        value: value,
        status: true
    };
    // create table
    await database.createTable();

    // kiểm tra option avatar đã tồn tại chưa nếu chwua thì tạo ra
    await database.Option.findOne({ where: { name: 'avatar' } }).then(async result => {
        if (result !== null) {
            console.log('bản ghi avatar đã tồn tại');

        } else {

            // insert data into table option
            await database.Option.create(avatar).then(saveResult => {
                console.log(saveResult);
            })
            console.log('bản ghi avatar đã được tạo thành công');
        }
    });



}