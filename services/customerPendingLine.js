let custommerPendingLine=()=>{
    let line = [];
    return {
        addCustomer: (customer)=>{
            line.push(customer)
        },
        getLine: ()=>{
            return line;
        }
    };
}
module.exports= {custommerPendingLine}