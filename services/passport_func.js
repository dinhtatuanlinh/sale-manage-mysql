const express = require("express");
const passport = require("passport"),
    // cai them package passport-local
    LocalStrategy = require("passport-local").Strategy;
// database
const database = require(__pathModels + "database")
    // tạo các phương thức login


let app = express();
let auth = passport.authenticate(
    "local", {
        // successRedirect: `/`,
        failureRedirect: `/`,
    }
);
let use = passport.use(
    new LocalStrategy(async(username, password, done) => {
        // console.log(username, password);
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

            // if (!user.active) {
            //     return done(null, false, { message: "your account is not active" });
            // }
            // if (err) {
            //     return done(err);
            // }
            // if (user == undefined || user.length == 0) {
            //     // console.log('user ko dung');
            //     return done(null, false, { message: "Incorrect username or password." });
            // }
            // if (password !== user.password) {
            //     // console.log('pass ko dung');
            //     return done(null, false, { message: "Incorrect username or password." });
            // }
            // if (!user.active) {
            //     return done(null, false, { message: "your account is not active" });
            // }

            // return done(null, user); // truyen vao user toi serializeUser
            // });
        });
    }));
let serialize = passport.serializeUser((user, done) => {
    // console.log(user);
    done(null, user.id);
});
let deserialize = passport.deserializeUser(async(id, done) => {
    await database.User.findOne({ where: { id: id } }).then(user => {
        // console.log('1');
        // console.log(user.dataValues);
        done(null, user.dataValues);
    })
});

module.exports = {
    auth: auth,
    use: use,
    serialize: serialize,
    deserialize: deserialize,
}