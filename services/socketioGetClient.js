const database = require(__pathModels + "database");
const { Op } = require("sequelize");
const email = require(__pathServices + 'sendemail');

const telesalersManipulation = require(__pathServices +
    "telesalersManipulation");
const logging = require(__pathServices + "winston_logging");
module.exports = async (io, app) => {
    let telesalersM = new telesalersManipulation();
    // tạo index cho toàn bộ telesalers để gán khách hàng cho telesaler khi không có ai online
    app.locals.saleUserIndex = 0;
    app.locals.jemmiaSingleFormSalerIndex=0
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
                where: { phone: data.phone },
            }).then(async (result) => {
                if (result === null) {
                    // if (onlineUsers.length > 0) {
                    //     // sắp xếp lại mảng theo thứ tự username từ a tới z
                    //     // online_telesalers.sort(function(a, b) {
                    //     //     return a.number_of_cus.localeCompare(b.number_of_cus);
                    //     // });
                    //     // săp xếp số từ lớn tới bé
                    //     onlineUsers.sort(function (a, b) {
                    //         return a.number_of_cus - b.number_of_cus;
                    //     });

                    //     // insert data into table option
                    //     data.saler = onlineUsers[0].username;
                    //     onlineUsers[0].number_of_cus++;
                    //     let saveResult = await database.Client_info.create(
                    //         data
                    //     );
                    //     saveResult = saveResult.dataValues;
                    //     io.to(onlineUsers[0].id).emit(
                    //         "server_send_new_customer",
                    //         saveResult
                    //     );
                    // } else {
                        // nếu saleUserIndex nhỏ hơn số phần tử trong mảng telesalers thì lấy telesale ở vị trí index gán vào data.saler sau đó cộng thêm 1 vào index
                        // nếu index băng với số phần tử trong mảng telesalers thì gán index bằng 0 sau đó lấy phần tử vị tri 0 gán vào data.saler sau đó cộng thêm 1 vào index
                        if(!app.locals.telesalers){
                
                            let result = await database.User.findAll({
                                attributes: ["username", "team"],
                                where: {
                                    role: {
                                        [Op.or]: ["telesaler"],
                                    }
                                },
                            })
                            if(result.length === 0){
                                logging.info("Lỗi không tìm thấy telesaler nào")
                                let from = "Đinh Tạ Tuấn Linh";
                                let to = "dinhtatuanlinh@gmail.com";
                                let subject = "Email thông báo từ trang quản lý telesale của Jemmia";
                                let body = "Lỗi không tìm thấy telesaler nào";
                                await email.sendemail(from, to, subject, body);
                                app.locals.telesalers = [{username: 'dinhtatuanlinh',team: 'silver-game'}]
                            }else{
                                app.locals.telesalers = result;
                            }
            
                        }

                        app.locals.telesalers = app.locals.telesalers.filter((user) => user.team === "silver-game");

                        if (
                            app.locals.saleUserIndex <
                            app.locals.telesalers.length
                        ) {
                            data.saler =
                                app.locals.telesalers[app.locals.saleUserIndex].username;
                            ++app.locals.saleUserIndex;
                        } else {
                            app.locals.saleUserIndex = 0;
                            data.saler =
                                app.locals.telesalers[app.locals.saleUserIndex].username;
                            ++app.locals.saleUserIndex;
                        }
                        await database.Client_info.create(data);
                    // }
                }
            });
        });
        socket.on("send_customer_data_form_single_page_jemmia", async (data) => {
            logging.info(JSON.stringify(data));
            data.status = "none";
            data.note = "";
            await database.Client_info.findOne({
                where: { phone: data.phone },
            }).then(async (result) => {
                if (result === null) {
                        if(!app.locals.telesalers){
                
                            let result = await database.User.findAll({
                                attributes: ["username", "team"],
                                where: {
                                    role: {
                                        [Op.or]: ["telesaler"],
                                    }
                                },
                            })
                            if(result.length === 0){
                                logging.info("Lỗi không tìm thấy telesaler nào")
                                let from = "Đinh Tạ Tuấn Linh";
                                let to = "dinhtatuanlinh@gmail.com";
                                let subject = "Email thông báo từ trang quản lý telesale của Jemmia";
                                let body = "Lỗi không tìm thấy telesaler nào";
                                await email.sendemail(from, to, subject, body);
                                app.locals.telesalers = [{username: 'dinhtatuanlinh',team: 'silver-game'}]
                            }else{
                                app.locals.telesalers = result;
                            }
            
                        }
                        // lấy telesaler phu trang form bài viết
                        app.locals.telesalers = app.locals.telesalers.filter((user) => user.team === "jemmia_single_form");
                        logging.info(JSON.stringify(app.locals.telesalers))
                        if (
                            app.locals.jemmiaSingleFormSalerIndex <
                            app.locals.telesalers.length
                        ) {
                            data.saler =
                                app.locals.telesalers[app.locals.jemmiaSingleFormSalerIndex].username;
                            ++app.locals.jemmiaSingleFormSalerIndex;
                        } else {
                            app.locals.jemmiaSingleFormSalerIndex = 0;
                            data.saler =
                                app.locals.telesalers[app.locals.jemmiaSingleFormSalerIndex].username;
                            ++app.locals.jemmiaSingleFormSalerIndex;
                        }
                        await database.Client_info.create(data);
                }
            });
        });
        // console.log("a user connected");
        // socket.on("client_typing", (data) => {
        //   socket.broadcast.emit('server_send_user_typing', { username: data.username }) // send message tới các user ngoại trừ user gửi tin nhắn
        // });
        // reject invitation
        // socket.on("reject_invitation", async(data) => {
        //     // console.log(data);
        //     // xóa id gửi lời mời trong bảng của user nhận lời mời
        //     await usersModel.updateOne({
        //         _id: data.receiverID,
        //     }, {
        //         $pull: {
        //             friendreqfrom: data.senderID
        //         }
        //     });
        //     // xóa id nhận lời mời trong bảng của user gửi lời mời
        //     await usersModel.updateOne({
        //         _id: data.senderID,
        //     }, {
        //         $pull: {
        //             friendreqto: data.receiverID
        //         }
        //     });
        // });
        // // accept invitation
        // socket.on("accept_invitation", async(data) => {
        //     // xóa id gửi lời mời trong bảng của user nhận lời mời và thêm id gửi lời mời vào friend list
        //     await usersModel.updateOne({
        //         _id: data.receiverID,
        //     }, {
        //         $pull: {
        //             friendreqfrom: data.senderID
        //         },
        //         $push: {
        //             friends: data.senderID
        //         }
        //     });
        //     // xóa id nhận lời mời trong bảng của user gửi lời mời và thêm id nhận lời mời vào friend list
        //     await usersModel.updateOne({
        //         _id: data.senderID,
        //     }, {
        //         $pull: {
        //             friendreqto: data.receiverID
        //         },
        //         $push: {
        //             friends: data.receiverID
        //         }
        //     });
        // });
        // // xử lý addfriend
        // socket.on("send_addfriend", async(data) => {
        //     // console.log(data);
        //     // kiểm tra xem người nhận đã nhận được lời mời trước đó từ user gửi lời mời chưa
        //     await usersModel.find({ _id: data.receiveUserID }).select('friendreqfrom').then(async(result) => { // tìm user người nhận và lấy ra thông số ở friendreqfrom kết quả trả ra dưới dạng mảng cac id đã gửi lời mời
        //         // console.log(result);
        //         var IDExistence = result[0].friendreqfrom.filter((id) => id === data.idSendInvitation); // tìm trong mảng id đã gửi lời mời đã tồn tại id của user hiện tại gửi lời mời chưa
        //         // trả về biên IDExistence một mảng nếu id người gửi chưa tồn tại trả về một mảng rỗng nếu đã tồn tại trả về mang chưa id đó
        //         // console.log(IDExistence);
        //         // console.log(IDExistence.length);
        //         //send invitation when user online
        //         // kiểm tra xem người nhận có online không và người nhận đã có lời mời từ user này hay chưa nếu chưa thì gửi socket tói người nhận lời mời
        //         if (data.receiveUserSocketID !== "" && IDExistence.length === 0) {
        //             // console.log(data.receiveUserSocketID);
        //             await usersModel.find({ _id: data.idSendInvitation }).select('name username _id').then((result) => {
        //                 io.to(data.receiveUserSocketID).emit("server_send_invitation", result)
        //             });
        //         }
        //     });
        //     // update receive user
        //     // update id của người gửi lời mời vào vị trí friendreqfrom trong bảng của người nhận lời mời với điều kiện id đó chưa phải là bạn trong vị trí friend và cũng ko phải là người được người nhận gửi lời mời rồi
        //     await usersModel.updateOne({
        //         _id: data.receiveUserID,
        //         friends: { $ne: data.idSendInvitation }, // bổ xung thêm điều kiện nếu trong friends đã tồn tại user này thì ko thêm vào
        //         friendreqfrom: { $ne: data.idSendInvitation } // bổ xung thêm điều kiện nếu trong danh sách người gửi lời mời tới đã tồn tại user này thì ko thêm vào
        //     }, {
        //         $push: {
        //             friendreqfrom: data.idSendInvitation // $push giúp đấy dữ liệu vào mảng friendreqfrom
        //         }
        //     });
        //     // update send user
        //     // update id của người nhận lời mời vào bảng của người gửi lời mời với điều kiện người nhận lời mời chưa nằm trong list friend
        //     // và người nhận lời mời cũng không nằm trong danh sách những người đã được nhận lời mời của user gửi lời mời
        //     await usersModel.updateOne({
        //         _id: data.idSendInvitation,
        //         friends: { $ne: data.receiveUserID },
        //         friendreqto: { $ne: data.receiveUserID }
        //     }, {
        //         $push: {
        //             friendreqto: data.receiveUserID
        //         }
        //     });

        // });

        // // nhận online user từ client truyền lên
        // socket.on("new_online_user", async(data) => {
        //     var userdata = {};
        //     //add online user
        //     users.addUser(socket.id, data.username, data._id);
        //     userdata.allUsers = [];
        //     userdata.onlineUsers = users.getListUser();
        //     await usersModel.find({}).then((result) => {
        //         userdata.allUsers = result;
        //     });
        //     //send online users to client

        //     io.emit("online_users", userdata);
        // });
        // //disconnect user

        // // end disconnect user
        // // nhận tin nhắn từ user gửi lên cho public
        // socket.on("client_send_public_message", async(data) => {
        //     data.time = Date.now();
        //     // console.log(data);
        //     data.room = "public";
        //     await chatController.savePublicMessage(data)

        //     io.emit("server_return_public_message", data); // trả tin nhắn tới tất cả user

        // });
        // // create room
        // socket.on("create_room", async(data) => {
        //     data.time = Date.now();
        //     // console.log(data);
        //     var result = await chatController.createRoom(data);
        //     console.log(result);
        //     io.emit("server_return_rooms", result);
        // });
        // // end create room
    });
};
