module.exports = class telesalersManipulation {
    constructor() {
        this.users = [];
    }
    addUser(id, username, number_of_cus) {

        let user = this.getUserByUsername(username);
        if (user.length === 0) {
            let user = { id, username, number_of_cus };
            this.users.push(user);
        }

        return this.users;
    }
    removeUser(id) {
        let user = this.getUser(id);
        if (user) {
            // lọc những user có id không giống với user có id vừa thoát
            this.users = this.users.filter((user) => user.id !== id);
        }
        return user;
    }
    getUserByUsername(username) {
        return this.users.filter((user) => user.username === username);
    }
    getUserByUserID(_id) {
        return this.users.filter((user) => user._id === _id)[0];
    }
    getUser(id) {
        return this.users.filter((user) => user.id === id)[0];
    }
    getListUser() {
        return this.users;
    }

}