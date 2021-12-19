const database = require(__pathModels + "database");

const { Op } = require("sequelize");
const logging = require(__pathServices + 'winston_logging')
function customerPendingLine(){
    let line = [];
    return {
        addCustomer: (customer)=>{
            line.push(customer)
        },
        getLine: ()=>{
            return line;
        },
        delLine: ()=>{
            line = [];
        }
    };
}
let pendingLine = customerPendingLine();
let addPendingLineToDB = (pendingLine)=>{
    let index = 0;
    return database.User.findAll({
        attributes: ["username", "team"],
        where: {
            role: {
                [Op.or]: ["telesaler"],
            },
        },
    }).then(async salers=>{
        logging.info('check 4')
        logging.info(JSON.stringify(result))
        if (result.length === 0) {
            // check telesaler if non-exist add to dinhtatuanlinh
            logging.info("Lỗi không tìm thấy telesaler nào");
            let from = "Đinh Tạ Tuấn Linh";
            let to = "dinhtatuanlinh@gmail.com";
            let subject =
                "Email thông báo từ trang quản lý telesale của Jemmia";
            let body = "Lỗi không tìm thấy telesaler nào";
            await email.sendemail(from, to, subject, body);

            for(let i= 0; i<pendingLine.length; i++ ){
                pendingLine[i].saler = "dinhtatuanlinh";
                logging.info(JSON.stringify(pendingLine[i]))
                
                let customer =await database.Client_info.findOne({
                    where: { phone: pendingLine[i].phone, root: pendingLine[i].root },
                })
                if(customer === null){
                    await database.Client_info.create(pendingLine[i]);
                }
                
            }
        }else{
            // add to telesaler
            result.filter(
                (user) => user.team === "jemmia_single_form"
            );
            
            for(let i= 0; i<pendingLine.length; i++ ){
                if(index> result.length){
                    index = 0;
                }
                pendingLine[i].saler = result[index].username;
                logging.info('check 5')
                logging.info(JSON.stringify(pendingLine[i]))
                let customer =await database.Client_info.findOne({
                    where: { phone: pendingLine[i].phone, root: pendingLine[i].root },
                })
                if(customer === null){
                    logging.info('check 6')
                    await database.Client_info.create(pendingLine[i]);
                }
                index++
            }
        }
    }).catch(err=>{
        logging.info(JSON.stringify(err))
    })
}
let receiveCustommerData = async (req, res, next) => {

    logging.info('check1')
    logging.info(JSON.stringify(req.body));
    logging.info('check2')

    let pendingLineReturn = pendingLine.getLine()
    logging.info(pendingLineReturn.length)
    if(pendingLineReturn.length >= 2){
        logging.info('check3')
        req.app.locals.pendingLine = [...pendingLineReturn]
        pendingLine.delLine()
        await addPendingLineToDB(req.app.locals.pendingLine)
        
    }else{
        pendingLine.addCustomer(req.body);
    }
    logging.info(JSON.stringify(pendingLine.getLine()));
    res.send(true)
};

module.exports = {
    receiveCustommerData
};