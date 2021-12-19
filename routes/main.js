var express = require('express');
var router = express.Router();


const customerDataController = require(__pathControllers + "customerDataController");
const profileController = require(__pathControllers + "profileController");
const adminController = require(__pathControllers + "adminController");
const homeController = require(__pathControllers + "homeController");
const getIPController = require(__pathControllers + 'getIPController');
const {receiveCustommerData} = require(__pathControllers + 'gameLuckyWheelController')
// kéo socketio
const socketioGetClient = require(__pathServices + 'socketioGetClient');



module.exports = (io, app) => {
    /* GET users listing. */
    router.get('/', (req, res, next) => { homeController.homePage(req, res, next) });

    router.get('/ip/:token', (req, res, next) => { getIPController.getclientIP(req, res, next) });

    router.get('/customer-data', (req, res, next) => { customerDataController.customerDataPage(req, res, next) });
    router.get('/customer-data-realtime', (req, res, next) => { customerDataController.customerDataPage(req, res, next) });
    router.get('/customer-data/single-client/:id', (req, res, next) => { customerDataController.singleCustomer(req, res, next) });
    router.post('/customer-data/edit/:id', (req, res, next) => { customerDataController.editCustomer(req, res, next) });

    router.get('/admin', (req, res, next) => { adminController.adminPage(req, res, next) });
    router.post('/admin/editsetting', (req, res, next) => { adminController.adminEditSetting(req, res, next) });
    router.post('/admin/properties/:param', (req, res, next) => { adminController.adminChangeProperties(req, res, next) });

    router.get('/profile', (req, res, next) => { profileController.profileDataPage(req, res, next) });
    router.post('/profile/edit/:id', (req, res, next) => { profileController.profileEdit(req, res, next) });
    router.post('/gameluckywheel', (req, res, next)=>{receiveCustommerData(req, res, next)})
    socketioGetClient(io, app);
    return router;
}