const database = require(__pathModels + "database");
const { Op } = require("sequelize");
const email = require(__pathServices + "sendemail");

const telesalersManipulation = require(__pathServices +
    "telesalersManipulation");
const logging = require(__pathServices + "winston_logging");
module.exports = async (io, app) => {
    let telesalersM = new telesalersManipulation();
    // tạo index cho toàn bộ telesalers để gán khách hàng cho telesaler khi không có ai online
    app.locals.saleUserIndex = 0;
    app.locals.jemmiaSingleFormSalerIndex = 0;
    // tạo index cho online telesalers để gán khách hàng cho online telesaler
    // let on_telesaler_index = 0;
    // socket.io events
    let onlineUsers = [];
    io.on("connection", (socket) => {
        // test connect socketio
        io.emit("server_send_data", socket.id);
        // add user mới connect vào class telesalersManipulation
        socket.on("new_telesaler_connection", (username) => {
            let online_telesalers = telesalersM.getListUser();
            let number_of_cus = 0;
            if (online_telesalers.length !== 0) {
                // sắp xếp lại mảng theo thứ tự username từ a tới z
                online_telesalers.sort(function (a, b) {
                    return a.number_of_cus - b.number_of_cus;
                });
                number_of_cus =
                    online_telesalers[online_telesalers.length - 1]
                        .number_of_cus;
            }
            telesalersM.addUser(socket.id, username, number_of_cus);
            // console.log(online_telesalers);
            socket.broadcast.emit("online_notification", "hello");
            // io.emit("online_notification", "hello")
            onlineUsers = telesalersM.getListUser();
        });
        // remove user mới disconnect khỏi class telesalersManipulation
        socket.on("disconnect", async () => {
            telesalersM.removeUser(socket.id);
            onlineUsers = telesalersM.getListUser();
        });
        socket.on("send_customer_data", async (data) => {
            
            data.status = "none";
            data.note = "";
            await database.Client_info.findOne({
                where: { phone: data.phone, root: data.root },
            }).then(async (result) => {
                if (result === null) {
                    // nếu saleUserIndex nhỏ hơn số phần tử trong mảng telesalers thì lấy telesale ở vị trí index gán vào data.saler sau đó cộng thêm 1 vào index
                    // nếu index băng với số phần tử trong mảng telesalers thì gán index bằng 0 sau đó lấy phần tử vị tri 0 gán vào data.saler sau đó cộng thêm 1 vào index
                    if (!app.locals.telesalers) {
                        let result = await database.User.findAll({
                            attributes: ["username", "team"],
                            where: {
                                role: {
                                    [Op.or]: ["telesaler"],
                                },
                            },
                        });
                        if (result.length === 0) {
                            logging.info("Lỗi không tìm thấy telesaler nào");
                            let from = "Đinh Tạ Tuấn Linh";
                            let to = "dinhtatuanlinh@gmail.com";
                            let subject =
                                "Email thông báo từ trang quản lý telesale của Jemmia";
                            let body = "Lỗi không tìm thấy telesaler nào";
                            await email.sendemail(from, to, subject, body);
                            app.locals.telesalers = [
                                {
                                    username: "dinhtatuanlinh",
                                    team: "silver-game",
                                },
                            ];
                        } else {
                            app.locals.telesalers = result;
                        }
                    }

                    app.locals.telesalers = app.locals.telesalers.filter(
                        (user) => user.team === "silver-game"
                    );

                    if (
                        app.locals.saleUserIndex < app.locals.telesalers.length
                    ) {
                        data.saler =
                            app.locals.telesalers[
                                app.locals.saleUserIndex
                            ].username;
                        ++app.locals.saleUserIndex;
                    } else {
                        app.locals.saleUserIndex = 0;
                        data.saler =
                            app.locals.telesalers[
                                app.locals.saleUserIndex
                            ].username;
                        ++app.locals.saleUserIndex;
                    }
                    await database.Client_info.create(data);
                }
            });
        });
        socket.on("send_customer_data_from_jemmia", async (data) => {

            data.status = "none";
            data.note = "";
            await database.Client_info.findOne({
                where: { phone: data.phone, root: data.root },
            }).then(async (result) => {
                logging.info(JSON.stringify(result))
                if (result === null) {
                    // nếu saleUserIndex nhỏ hơn số phần tử trong mảng telesalers thì lấy telesale ở vị trí index gán vào data.saler sau đó cộng thêm 1 vào index
                    // nếu index băng với số phần tử trong mảng telesalers thì gán index bằng 0 sau đó lấy phần tử vị tri 0 gán vào data.saler sau đó cộng thêm 1 vào index
                    if (!app.locals.telesalers) {
                        logging.info("check1")
                        let result = await database.User.findAll({
                            attributes: ["username", "team"],
                            where: {
                                role: {
                                    [Op.or]: ["telesaler"],
                                },
                            },
                        });
                        if (result.length === 0) {
                            logging.info("Lỗi không tìm thấy telesaler nào");
                            let from = "Đinh Tạ Tuấn Linh";
                            let to = "dinhtatuanlinh@gmail.com";
                            let subject =
                                "Email thông báo từ trang quản lý telesale của Jemmia";
                            let body = "Lỗi không tìm thấy telesaler nào";
                            await email.sendemail(from, to, subject, body);
                            app.locals.telesalers = [
                                {
                                    username: "dinhtatuanlinh",
                                    team: "jemmia_single_form",
                                },
                            ];
                        } else {
                            app.locals.telesalers = result;
                        }
                    }

                    app.locals.telesalers = app.locals.telesalers.filter(
                        (user) => user.team === "jemmia_single_form"
                    );
                    logging.info(JSON.stringify(app.locals.telesalers))
                    if (
                        app.locals.saleUserIndex < app.locals.telesalers.length
                    ) {
                        data.saler =
                            app.locals.telesalers[
                                app.locals.saleUserIndex
                            ].username;
                        ++app.locals.saleUserIndex;
                    } else {
                        app.locals.saleUserIndex = 0;
                        data.saler =
                            app.locals.telesalers[
                                app.locals.saleUserIndex
                            ].username;
                        ++app.locals.saleUserIndex;
                    }
                    let a = await database.Client_info.create(data);
                    logging.info(JSON.stringify(a))
                }
            });
        });
        // socket.on(
        //     "send_customer_data_form_single_page_jemmia",
        //     async (data) => {
        //         data.status = "none";
        //         data.note = "";
        //         await database.Client_info.findOne({
        //             where: { phone: data.phone },
        //         }).then(async (result) => {
        //             if (result === null) {
        //                 if (!app.locals.telesalers) {
        //                     let result = await database.User.findAll({
        //                         attributes: ["username", "team"],
        //                         where: {
        //                             role: {
        //                                 [Op.or]: ["telesaler"],
        //                             },
        //                         },
        //                     });
        //                     if (result.length === 0) {
        //                         logging.info(
        //                             "Lỗi không tìm thấy telesaler nào"
        //                         );
        //                         let from = "Đinh Tạ Tuấn Linh";
        //                         let to = "dinhtatuanlinh@gmail.com";
        //                         let subject =
        //                             "Email thông báo từ trang quản lý telesale của Jemmia";
        //                         let body = "Lỗi không tìm thấy telesaler nào";
        //                         await email.sendemail(from, to, subject, body);
        //                         app.locals.telesalers = [
        //                             {
        //                                 username: "dinhtatuanlinh",
        //                                 team: "silver-game",
        //                             },
        //                         ];
        //                     } else {
        //                         app.locals.telesalers = result;
        //                     }
        //                 }
        //                 // lấy telesaler phu trang form bài viết
        //                 app.locals.telesalers = app.locals.telesalers.filter(
        //                     (user) => user.team === "jemmia_single_form"
        //                 );
        //                 logging.info(JSON.stringify(app.locals.telesalers));
        //                 if (
        //                     app.locals.jemmiaSingleFormSalerIndex <
        //                     app.locals.telesalers.length
        //                 ) {
        //                     data.saler =
        //                         app.locals.telesalers[
        //                             app.locals.jemmiaSingleFormSalerIndex
        //                         ].username;
        //                     ++app.locals.jemmiaSingleFormSalerIndex;
        //                 } else {
        //                     app.locals.jemmiaSingleFormSalerIndex = 0;
        //                     data.saler =
        //                         app.locals.telesalers[
        //                             app.locals.jemmiaSingleFormSalerIndex
        //                         ].username;
        //                     ++app.locals.jemmiaSingleFormSalerIndex;
        //                 }
        //                 await database.Client_info.create(data);
        //             }
        //         });
        //     }
        // );
    });
};
