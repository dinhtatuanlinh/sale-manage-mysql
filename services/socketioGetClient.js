// const chatController = require(__pathControllers + "chatController");
// const onlineUserManipulation = require(__pathHelps + "onlineUserManipulation");
// const usersModel = require(__pathSchemas + "database").usersModel;
const logging = require(__pathServices + 'winston_logging');
module.exports = (io) => {
    // let users = new onlineUserManipulation();
    // socket.io events
    io.on("connection", (socket) => {
        console.log(socket.id);
        socket.on("connect_notif", (data) => {
            // logging.info(data);
            console.log(data);
        });
        socket.emit("server_send_data", socket.id); //trả tin nhắn tới 1 user hiện tại
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
        // socket.on("disconnect", async() => {
        //     var data = {};
        //     let user = users.removeUser(socket.id);
        //     data.allUsers = [];
        //     data.onlineUsers = users.getListUser();
        //     await usersModel.find({}).then((result) => {
        //         data.allUsers = result;
        //     });
        //     io.emit("online_users", data);
        // });
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