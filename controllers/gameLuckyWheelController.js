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
function telesalerList(){
    let telesalers =[];
    let index = 0;
    return {
        addTelesalerList: (salers)=>{
            telesalers = [...salers]
        },
        getTelesalers: ()=>{
            logging.info(JSON.stringify(telesalers))
            return telesalers
        },
        plusIndex: ()=>{
            index++
        },
        getIndex: ()=>{
            return index;
        },
        zeroIndex: ()=>{
            index = 0;
        }
    }
}
let jemmiaPendingLine = customerPendingLine();
let silverPendingLine = customerPendingLine();
let jemmiaTelesaler= telesalerList()
let addPendingLineToDB = (pendingLine, team)=>{

    return database.User.findAll({
        attributes: ["username", "team"],
        where: {
            role: {
                [Op.or]: ["telesaler"],
            },
        },
    }).then(async salers=>{

        if (salers.length === 0) {
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
                pendingLine[i].status = 'none';
                pendingLine[i].note = "";
                logging.info(i)
                let customer = await database.Client_info.findOne({
                    where: { phone: pendingLine[i].phone, root: pendingLine[i].root },
                })
                if(customer === null){
                    await database.Client_info.create(pendingLine[i]);
                }
                
            }
        }else{
            // add to telesaler
            salers = salers.filter((user) => user.team == team );
            jemmiaTelesaler.addTelesalerList(salers)
            logging.info(team)
            let a = jemmiaTelesaler.getTelesalers()
            logging.info(JSON.stringify(a))
            logging.info('have salers')
            logging.info(jemmiaTelesaler.getIndex())
            for(let i= 0; i<pendingLine.length; i++ ){
                if(jemmiaTelesaler.getIndex() > jemmiaTelesaler.getTelesalers().length){
                    jemmiaTelesaler.zeroIndex();
                }
                pendingLine[i].saler = jemmiaTelesaler.getTelesalers()[jemmiaTelesaler.getIndex()].username;
                pendingLine[i].status = 'none';
                pendingLine[i].note = "";
                logging.info(i)
                let customer = await database.Client_info.findOne({
                    where: { phone: pendingLine[i].phone, root: pendingLine[i].root },
                })
                if(customer === null){
                    await database.Client_info.create(pendingLine[i]);
                }
                jemmiaTelesaler.plusIndex();
            }
        }
    }).catch(err=>{
        logging.info(JSON.stringify(err))
    })
}
let receiveCustommerData = async (req, res, next) => {
    if(req.body.root === 'jemmia.vn'){
        logging.info(req.body.root)
        jemmiaPendingLine.addCustomer(req.body);
        let jemmiaPendingLineReturn = jemmiaPendingLine.getLine()
        if(jemmiaPendingLineReturn.length >= 4){
            logging.info('check3')
            req.app.locals.pendingLine = [...jemmiaPendingLineReturn]
            jemmiaPendingLine.delLine()
            await addPendingLineToDB(req.app.locals.pendingLine, "jemmia_single_form")
        }
    }
    if(req.body.root === 'jemmiasilver'){
        silverPendingLine.addCustomer(req.body);
    
        let silverPendingLineReturn = silverPendingLine.getLine()
        
        if(silverPendingLineReturn.length >= 4){
            logging.info('check3')
            req.app.locals.pendingLine = [...silverPendingLineReturn]
            silverPendingLine.delLine()
            await addPendingLineToDB(req.app.locals.pendingLine, "silver-game")
        }
    }

    res.send(true)
};

module.exports = {
    receiveCustommerData
};