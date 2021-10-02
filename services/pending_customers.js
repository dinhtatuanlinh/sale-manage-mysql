const database = require(__pathModels + "database");
module.exports = async(userInfo) => {
    let pending_customers
    if (userInfo.role === 'admin' || userInfo.role === 'sale_manager') {
        pending_customers = await database.Client_info.count({ where: { mark: false } });

    } else {

        pending_customers = await database.Client_info.count({ where: { saler: userInfo.username, mark: false } });

    }
    return pending_customers;
}