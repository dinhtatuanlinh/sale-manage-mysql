const systemConfig = require(__pathConfig + 'localVariable');
const check_login = require(__pathServices + 'check_login');
const database = require(__pathModels + "database");
const logging = require(__pathServices + 'winston_logging');
let homePage = async(req, res, next) => {
    check_login(req, res);
    let users;
    await database.User.findAll().then(results => {
        // console.log(results);
        users = results;
    });
    res.setHeader("Content-Type", "text/html");
    res.render(`${systemConfig.pathInc}home`, {
        users
    });
};

module.exports = {
    homePage: homePage,
};