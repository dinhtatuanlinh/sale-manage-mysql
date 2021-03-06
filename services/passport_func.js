const express = require("express");
const passport = require("passport"),
    // cai them package passport-local
    LocalStrategy = require("passport-local").Strategy;
// database
const database = require(__pathModels + "database");
// tạo các phương thức login
// logging
const logging = require(__pathServices + 'winston_logging');


let app = express();
let auth = passport.authenticate(
    "local", {
        // successRedirect: `/`,
        failureRedirect: `/`,
    }
);
let Use = passport.use(
    new LocalStrategy(async(username, password, done) => {
        logging.info('login...')
        logging.info(username);
        await database.User.findOne({ where: { username: username } }).then(result => {

            if (result === null) {
                app.locals.loginErr = "Incorrect username or password.";
                return done(null, false);
            }

            if (password !== result.dataValues.password) {
                app.locals.loginErr = "Incorrect username or password.";
                return done(null, false);
            }
            if (!result.dataValues.active) {
                app.locals.loginErr = "your account is not active";
                return done(null, false);
            }
            // console.log(result.dataValues);
            return done(null, result.dataValues); // truyen vao user toi serializeUser

        });
    }));
let serialize = passport.serializeUser((user, done) => {

    done(null, user.id);
});
let deserialize = passport.deserializeUser(async(id, done) => {
    await database.User.findOne({ where: { id: id } }).then(user => {

        done(null, user.dataValues);
    });
});

module.exports = {
    auth: auth,
    Use: Use,
    serialize: serialize,
    deserialize: deserialize,
}