const database = require(__pathModels + "database");
module.exports = async(userInfo) => {
    let pending_customers
    let total_customers
    if (userInfo.role === 'admin' || userInfo.role === 'sale_manager') {
        pending_customers = await database.Client_info.count({ where: { mark: false } });
        total_customers = await database.Client_info.count();

    } else {

        pending_customers = await database.Client_info.count({ where: { saler: userInfo.username, mark: false } });
        total_customers = await database.Client_info.count({ where: { saler: userInfo.username} });
    }
    return [pending_customers, total_customers];
}