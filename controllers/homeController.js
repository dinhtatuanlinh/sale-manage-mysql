const systemConfig = require(__pathConfig + 'localVariable');
const check_login = require(__pathServices + 'check_login');
// const axios = require(__pathServices + 'axios');
const database = require(__pathModels + "database");
const pending_customers = require(__pathServices + 'pending_customers');
const { Op } = require("sequelize");
const logging = require(__pathServices + 'winston_logging');
let homePage = async(req, res, next) => {
    await check_login(req, res);

    let userInfo = req.user;
    let users;
    await database.User.findAll().then(results => {
        // console.log(results);
        users = results;
    });
    
    let customers = await pending_customers(userInfo)
    res.locals.pending_customers = customers[0];
    res.locals.total_customers = customers[1];
    res.locals.title = "Home Page";
    
    res.setHeader("Content-Type", "text/html");
    res.render(`${systemConfig.pathInc}home`, {
        users,
        userInfo,
    });
};

module.exports = {
    homePage: homePage,

};