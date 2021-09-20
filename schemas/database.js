const mongoose = require("mongoose");

// mongoose.connect('mongodb://tuanlinh:164342816@115.79.35.159:27017/admin');
mongoose.connect('mongodb://localhost:27017/admin');

const connectionDatabase = mongoose.connection;
connectionDatabase.on('error', () => { console.log('connection error') }); // phải dùng function hoặc arrow function ở đây

var itemsSchema = new mongoose.Schema({
    name: String,
    status: String,
    ordering: Number,
    content: String
});
var rolesSchema = new mongoose.Schema({
    role: String,
});
var usersSchema = new mongoose.Schema({
    name: String,
    username: String,
    password: String,
    content: String,
    friends: Array,
    friendreqto: Array,
    friendreqfrom: Array,
});
var chatSchema = new mongoose.Schema({
    content: String,
    username: String,
    time: Date,
    room: String,
});
var roomSchema = new mongoose.Schema({
    room: String,
    roomName: String,
    createdBy: String,
    members: Array,
    time: Date,

});
connectionDatabase.once('open', function() {
    // we're connected! 
    console.log('database connected');
    var collections = Object.keys(connectionDatabase.collections);
    console.log(collections);

});

module.exports = {
    itemsModel: mongoose.model('items', itemsSchema),
    rolesModel: mongoose.model('roles', rolesSchema),
    usersModel: mongoose.model('users', usersSchema),
    chatModel: mongoose.model('chat', chatSchema),
    roomModel: mongoose.model('room', roomSchema),
}