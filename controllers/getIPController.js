var getIP = require('ipware')().get_ip;
var geoip = require('geoip-lite');

const logging = require(__pathServices + 'winston_logging');
let getclientIP = (req, res, next) => {
    // logging.info(res.body.token);
    logging.info(JSON.stringify(res.body));
    if (res.body.token === 'dinh ta tuan linh') {
        var ipInfo = getIP(req);
        console.log(ipInfo);
        logging.info(JSON.stringify(ipInfo));
        var geo = geoip.lookup(ipInfo.clientIp);
        // {
        //     range: [ 247162880, 247164927 ],
        //     country: 'VN',
        //     region: 'SG',
        //     eu: '0',
        //     timezone: 'Asia/Ho_Chi_Minh',
        //     city: 'Ho Chi Minh City',
        //     ll: [ 10.8142, 106.6438 ],
        //     metro: 0,
        //     area: 1000
        //   }
        logging.info(geo.country);
        let clientInfo = JSON.stringify(geo);

        res.send(clientInfo);
    }
    res.send("hello");

}
module.exports = {
    getclientIP: getclientIP,
}